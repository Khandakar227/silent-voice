import Navbar from "@/components/Navbar"
import Head from "next/head"
import { Poppins } from "next/font/google"
import LoginForm from "@/components/auth/login-form"

const poppins = Poppins({ weight: ["400", "600", "800"], subsets: ["latin"] })

const AdminPage = () => {
  return (
    <>
      <Head>
        <title>Admin Panel</title>
      </Head>
      <div className={`${poppins.className} min-h-screen bg-box`}>
        <Navbar />
        <div className='max-w-7xl mx-auto px-4 py-24'>
          <LoginForm />
        </div>
      </div>
    </>
  )
}

export default AdminPage
