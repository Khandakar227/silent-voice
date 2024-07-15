import Navbar from "@/components/Navbar";
import { Poppins } from "next/font/google";
import Head from "next/head";

const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })

export default function Dictionary() {
    return (
        <>
            <Head>
                <title>ASL Dictionary - Silent Voice</title>
            </Head>
            <div className={`${poppins.className} min-h-screen bg-box`}>
                <Navbar />
            </div>
        </>
    )
}
