import { useUser } from "@auth0/nextjs-auth0/client"
import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
  return (
    <div className='px-4 py-1 bg-primary shadow'>
      <div className='mx-auto max-w-7xl flex gap-4 justify-between items-center'>
        <Link href='/'>
          <Image
            height={500}
            width={500}
            className='w-12 h-12'
            src='/logo.jpg'
            alt='logo'
          />
        </Link>
        <div className='flex gap-8 font-semibold items-center justify-center'>
          <Link href={"/sign-detection"} className='hover:underline'>
            Sign Detection
          </Link>
          <Link href={"/dictionary"} className='hover:underline'>
            Dictionary
          </Link>
          <Link href={"/admin"} className='hover:underline'>
            Admin
          </Link>
        </div>
      </div>
    </div>
  )
}
