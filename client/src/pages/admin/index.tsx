import Navbar from "@/components/Navbar"
import Head from "next/head"
import { Poppins } from "next/font/google"

import { useUser } from "@auth0/nextjs-auth0/client"
import Link from "next/link"
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client"
import AdminMenu from "@/components/admin/admin-menu"

const poppins = Poppins({ weight: ["400", "600", "800"], subsets: ["latin"] })

const AdminPage = () => {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <>
      <Head>
        <title>Admin Panel</title>
      </Head>
      <div className={`${poppins.className} min-h-screen bg-box`}>
        <Navbar />
        <AdminMenu />
        <div className='max-w-7xl mx-auto px-4 py-24'>
          <div className='relative flex flex-col items-center rounded-[20px] w-[490px] mx-auto p-4 bg-white bg-clip-border shadow-xl mb-6 mt-12'>
            <div className='relative flex h-32 w-full justify-center rounded-xl bg-cover'>
              <div
                className={
                  "bg-gradient-to-bl from-[#5BCBF1] to-[#b3e2f1] h-32 w-[27rem] rounded-lg flex items-center justify-center"
                }
              >
                <img
                  src={user?.picture || ""}
                  alt='User Picture'
                  className={
                    "absolute -bottom-11 flex rounded-full items-end justify-end border-[4px]"
                  }
                />
              </div>
            </div>
            <div className='mt-16 flex flex-col items-center'>
              <h4 className='text-xl font-bold text-navy-700 dark:text-white'>
                {user?.name}
              </h4>
              <p className='text-base font-normal text-gray-600'>
                {user?.email}
              </p>
            </div>
            <div className='mt-6 mb-3 flex gap-14 md:!gap-14'>
              <div className='flex flex-col items-center justify-center'>
                <p className='text-lg font-bold text-navy-700 dark:text-white'>
                  {user?.email_verified ? "Verified" : "Not Verified"}
                </p>

                <Link
                  className='hover:underline text-sm text-rose-700'
                  href='/api/auth/logout'
                >
                  Logout &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default withPageAuthRequired(AdminPage)
