import Navbar from "@/components/Navbar"
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client"
import { Poppins } from "next/font/google"
import Head from "next/head"

const poppins = Poppins({ weight: ["400", "600", "800"], subsets: ["latin"] })

const AdminQuizPage = () => {
  return (
    <>
      <Head>
        <title>QUIZ - Silent Voice</title>
      </Head>

      <div className={`${poppins.className} min-h-screen bg-box`}>
        <Navbar />
        Admin Quiz Page
      </div>
    </>
  )
}

export default withPageAuthRequired(AdminQuizPage)
