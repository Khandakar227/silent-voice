import Navbar from "@/components/Navbar"
import { modelServerUrl } from "@/utils/const";
import { Poppins } from "next/font/google"
import Head from "next/head"
import { useEffect, useRef, useState } from "react";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { io, Socket } from "socket.io-client";
import { HiMiniSpeakerWave,HiMiniSpeakerXMark } from "react-icons/hi2";


const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })

function SignDetection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [mediaStream, setMediaStream] = useState(null as MediaStream | null);
    const [interval, _setInterval] = useState(null as NodeJS.Timeout | null);
    const [enableCam, setEnableCam] = useState(false);
    const [words, setWords] = useState([] as string[]);
    const [socket, setSocket] = useState({} as Socket);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);

    useEffect(() => {
        if(!isAudioEnabled || !words.length) return;
        const utterance = new SpeechSynthesisUtterance(words[words.length-1]);
        // Select a voice
        const voices = speechSynthesis.getVoices();
        utterance.voice = voices[0]; // Choose a specific voice
        // Speak the text
        speechSynthesis.speak(utterance);
    }, [isAudioEnabled, words])

    useEffect(() => {
        const s = io(modelServerUrl);
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

    }

    function processVideo() {
        const frameRate = 2;
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
                socket.emit('frame', base64Data);
            }
        };
        _setInterval(setInterval(captureFrame, 1000 / frameRate));
    }


    function onSocketConnect() {
        console.log('Socket Connected');
    }
    function onSocketDisconnect() {
        console.log('Socket Disconnected');
    }

    function onWordRecieved(data: {word:string}) {
        console.log('Word Recieved:', data.word);
        setWords(w => {
            if(!data.word || w[w.length-1] == data.word) return w
            else return [...w, data.word];
        });
    }

    function onFrameRecieved(data: string) {
        const img = imgRef.current;
        if (!img) return;
        img.src = 'data:image/jpeg;base64,' + data;
    }
    function clearWords() {
        setWords([]);
    }
    function toggleAudio() {
        setIsAudioEnabled(!isAudioEnabled);
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
                {
                    enableCam && (
                    <div className="py-2 max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-4 justify-between">
                            <div className="p-1 rounded shadow border px-4 min-h-8 w-full">
                            {
                                words.length == 0 && <span className="text-gray-400">No signs detected</span>
                            }
                            {
                                words.map((word, i) => (
                                    <span key={`${word} ${i}`} className="rounded-full m-2"> {word} </span>
                                ))
                            }
                            </div>
                            <button onClick={toggleAudio} className="px-2 py-1 bg-primary text-sm my-4 rounded">
                                {isAudioEnabled ? <HiMiniSpeakerWave size={22} /> : <HiMiniSpeakerXMark size={22} />}
                            </button>
                        </div>
                        {
                            words.length ?
                            <div className="flex items-center gap-4">
                                <button onClick={clearWords} className="px-2 py-1 bg-primary text-sm my-4 rounded">Clear</button>
                            </div>
                            : ""
                        }
                    </div>
                    )
                }
                <div className={`p-4 py-6 ${enableCam ? 'grid md:grid-cols-2' : ''} gap-4 justify-center items-center`}>
                    <div className="relative max-w-xl mx-auto">
                        <video ref={videoRef} width={640} height={480} autoPlay className="aspect-[1.6] max-w-xl mx-auto bg-black rounded-lg w-full"></video>
                        {
                            enableCam ?
                                <button onClick={stopCam} className="bg-blue-500 shadow text-white absolute bottom-2 left-1/2 p-2 rounded-full"><FaVideoSlash size={22} /></button>
                                :
                                <button onClick={startCam} className="bg-blue-500 shadow text-white absolute bottom-2 left-1/2 p-2 rounded-full"><FaVideo size={22} /></button>
                        }
                    </div>
                    {
                        enableCam && (
                            <img ref={imgRef} width={640} height={480} className="aspect-[1.6] max-w-xl mx-auto bg-black rounded-lg w-full" />
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default SignDetection