import Navbar from "@/components/Navbar"
import { Poppins } from "next/font/google"
import Head from "next/head"

const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })

function SignDetection() {
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
            </div>
        </>
    )
}

export default SignDetection