import Link from "next/link";

export default function Navbar() {
  return (
    <div className="px-4 py-1 bg-primary shadow">
        <div className="mx-auto max-w-7xl flex gap-4 justify-between items-center">
            <Link href="/">
                <img className="w-12 h-12" src="logo.jpg" alt="logo"/>
            </Link>
            <div className="flex gap-8 font-semibold items-center justify-center">
                <Link href={"/sign-detection"}>Sign Detection</Link>
                <Link href={"/dictionary"}>Dictionary</Link>
            </div>
        </div>
    </div>
  )
}
