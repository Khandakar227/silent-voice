import AuthForm from "@/components/AuthForm"
import Navbar from "@/components/Navbar"
import { Poppins } from "next/font/google"
import Head from "next/head"

const poppins = Poppins({ weight: ["400", "600", "800"], subsets: ["latin"] })

export default function Login() {
    return (
        <>
            <Head>
                <title>Login - Silent Voice</title>
            </Head>
            <div className={`${poppins.className} min-h-screen bg-box`}>
                <Navbar />
                <AuthForm/>
            </div>
        </>
    )
}
