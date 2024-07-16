import Navbar from "@/components/Navbar"
import Head from "next/head"
import { Poppins } from "next/font/google"
import Link from "next/link"
import Image from "next/image"

const poppins = Poppins({ weight: ["400", "600", "800"], subsets: ["latin"] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Silent Voice</title>
      </Head>
      <div className={`${poppins.className} min-h-screen bg-box`}>
        <Navbar />
        <div className='max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-12 justify-between items-center'>
          <div>
            <h1 className='text-4xl font-bold'>Silent Voice</h1>
            <h2 className='text-2xl pt-2'>
              Learn to Communicate with Your Hands
            </h2>
            <p className='pt-6 text-lg'>
              Empowering the hearing impaired to connect effortlessly. Dive into
              the vibrant world of American Sign Language (ASL) and let your
              hands become the voice.
            </p>
            <div className='pt-12'>
              <Link
                href={"/sign-detection"}
                className='bg-primary font-semibold px-6 py-3 rounded-md shadow'
              >
                START DETECTION
              </Link>
            </div>
          </div>

          <div>
            <Image
              height={1000}
              width={1000}
              className='max-w-md mx-auto rounded-xl shadow shadow-primary'
              src='/gesture.jpg'
              alt='sign language alphabets'
            />
          </div>
        </div>
      </div>
    </>
  )
}
