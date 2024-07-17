import Navbar from "@/components/Navbar"
import Head from "next/head"
import { Poppins } from "next/font/google"

import { useUser } from "@auth0/nextjs-auth0/client"
import Link from "next/link"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"

const poppins = Poppins({ weight: ["400", "600", "800"], subsets: ["latin"] })

const AdminPage = () => {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  console.log(user)

  return (
    <>
      <Head>
        <title>Admin Panel</title>
      </Head>
      <div className={`${poppins.className} min-h-screen bg-box`}>
        <Navbar />
        <div className='max-w-7xl mx-auto px-4 py-24'>
          <h1 className='text-3xl text-center'>Admin Dashboard</h1>
          <div>
            <h2 className='text-xl mt-8'>User Information</h2>
            <div className='mt-4'>
              <p>
                <strong>Name:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Picture:</strong>{" "}
                <img src={user?.picture} alt='User Picture' />
              </p>
            </div>
          </div>
          <Link className='hover:underline text-sm' href='/api/auth/logout'>
            Logout
          </Link>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default AdminPage
