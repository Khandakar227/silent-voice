import Navbar from "@/components/Navbar"
import { modelServerUrl } from "@/utils/const";
import { Poppins } from "next/font/google"
import Head from "next/head"
import { useEffect, useRef, useState } from "react";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { io, Socket } from "socket.io-client";


const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })

function SignDetection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [mediaStream, setMediaStream] = useState(null as MediaStream | null);
    const [interval, _setInterval] = useState(null as NodeJS.Timeout | null);
    const [enableCam, setEnableCam] = useState(false);
    const [socket, setSocket] = useState({} as Socket);


    useEffect(() => {
        const s = io(modelServerUrl, {
            autoConnect: false
        });
        s.on('connect', onSocketConnect);
        s.on('word', onWordRecieved);
        s.on('disconnect', onSocketDisconnect);
        s.on('keypoints', onFrameRecieved);

        setSocket(s);

        return () => {
            s.off('connect', onSocketConnect)
            s.off('disconnect', onSocketDisconnect);
            s.off('word', onWordRecieved);
            s.off('keypoints', onFrameRecieved);
            s.disconnect();
            if (interval != null) clearInterval(interval);
        }
    }, [])

    useEffect(() => {
        if (!enableCam && interval != null) {
            clearInterval(interval);
        }
    }, [enableCam])


    useEffect(() => {
        if (enableCam && videoRef.current) {
            videoRef.current.srcObject = mediaStream;
        }
        if (!enableCam && mediaStream != null) {
            videoRef.current?.pause();
            if (videoRef.current) videoRef.current.src = "";
            mediaStream.getTracks().forEach(track => {
                track.stop();
            });

        }
        return () => {
            mediaStream?.getTracks().forEach(track => {
                track.stop();
            });
        }
    }, [enableCam, mediaStream])

    function startCam() {
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(stream => {
            setEnableCam(true);
            setMediaStream(stream);
            const video = videoRef.current;
            if (!video) return;

            video.srcObject = stream;
            processVideo();
        }).catch(err => {
            console.log(err);
        })
    }
    function stopCam() {
        setEnableCam(false);
        // const video = videoRef.current;
        // if(!video) return;

    }

    function processVideo() {
        const frameRate = 20;
        const captureFrame = () => {
            const video = videoRef.current;
            if (!video) return;
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext('2d');
                if(!context) return;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL('image/jpeg');
                const base64Data = dataURL.split(',')[1];
                console.log("Captured frame:", base64Data.substring(0, 30) + "...");
                socket.emit('frame', base64Data);
            }
            _setInterval(setInterval(captureFrame, 1000 / frameRate));
        };
        captureFrame();
    }


    function onSocketConnect() {
        console.log('Socket Connected');
    }
    function onSocketDisconnect() {
        console.log('Socket Disconnected');
    }

    function onWordRecieved(word: string) {
        console.log('Word Recieved:', word);
    }

    function onFrameRecieved(data: string) {
        const img = imgRef.current;
        if (!img) return;
        img.src = 'data:image/jpeg;base64,' + data;
    }
    return (
        <>
            <Head>
                <title>Detect Signs - Silent Voice</title>
            </Head>
            <div className={`${poppins.className} min-h-screen bg-box`}>
                <Navbar />
                <div className="p-4 pt-12">
                    <h1 className="text-3xl text-center font-bold">Realtime ASL(American Sign Language) Detection</h1>
                    <p className="pt-6 text-lg text-center">Detect signs from camera feed realtime. Use the power of our custom tailored AI to recognize sign language gestures and convert them into text.</p>
                </div>
                <div className="p-4 py-12 grid md:grid-cols-2 gap-4">
                    <div className="relative">
                        <video ref={videoRef} width={640} height={480} autoPlay className="aspect-[1.6] bg-black rounded-lg w-full"></video>
                        {
                            enableCam ?
                                <button onClick={stopCam} className="bg-blue-500 shadow text-white absolute bottom-1 left-1/2 p-2 rounded-full"><FaVideoSlash size={25} /></button>
                                :
                                <button onClick={startCam} className="bg-blue-500 shadow text-white absolute bottom-1 left-1/2 p-2 rounded-full"><FaVideo size={25} /></button>
                        }
                    </div>
                    {
                        enableCam && (
                            <img ref={imgRef} width={640} height={480} className="aspect-[1.6] bg-black rounded-lg w-full" />
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default SignDetection