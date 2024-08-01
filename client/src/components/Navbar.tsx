import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { FaBars } from 'react-icons/fa'
import MobileSidebar from "./MobileSidebar"
import { userUserLoaded, useUser } from "@/hooks/user"
import Spinner from "./Spinner"
import Avatar from "./Avatar"


export default function Navbar() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [user, _] = useUser();
  const [loaded, __] = userUserLoaded();

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

        <div className='gap-8 font-semibold items-center justify-center  hidden md:flex'>
          <Link href={"/sign-detection"} className='hover:underline'>
            Sign Detection
          </Link>
          <Link href={"/dictionary"} className='hover:underline'>
            Dictionary
          </Link>
          <Link href={"/quiz"} className='hover:underline'>
            Quiz
          </Link>
          {
            !loaded ? <Spinner size={1}/> : user ? <Avatar/> :
          <Link href={"/login"} className='hover:underline'>
            Login
          </Link>
          }
          
        </div>
        <div className="flex gap-3 items-center justify-center md:hidden">
          {user && (
            <Avatar/>
          )}
          <button onClick={() => setShowMobileNav(!showMobileNav)}><FaBars size={22}/></button>
        </div>
      </div>
      <MobileSidebar show={showMobileNav} setShow={() => setShowMobileNav(!showMobileNav)} />
    </div>
  )
}
