import { userUserLoaded, useUser } from "@/hooks/user";
import Link from "next/link";
import { useRouter } from "next/router";
import Spinner from "./Spinner";

type MobileSidebarProps = {
    show: boolean;
    setShow:() => void;
}

const navsmenu = [
    {label: 'Sign Detection', href: '/sign-detection'},
    {label: 'Dictionary', href: '/dictionary'},
    {label: 'Quiz', href: '/quiz'},
]
const MobileSidebar = ({ show, setShow }:MobileSidebarProps) => {
    const router = useRouter();
    const [user, _] = useUser();
    const [loaded, __] = userUserLoaded();

    return (
        <div className={`fixed top-0 left-0 h-screen right-0 bottom-0 ${show ? "z-[1]" : "-z-10 invisible"}`}>
            <div className="absolute bg-black bg-opacity-50 top-0 left-0 right-0 bottom-0 z-0" onClick={setShow}/>
            <div className="bg-white relative z-10 h-screen overflow-auto max-w-60">
                <div className="grid gap-4">
                    {
                        navsmenu.map(n => <Link href={n.href}
                            className={`px-6 py-2 block hover:bg-primary hover:text-white ${router.pathname == n.href ? "bg-blue-700 text-white" : ""}`}
                            key={n.href}>{n.label}</Link>)
                    }
                    {
                        !loaded ? <Spinner size={1}/>
                        :
                        !user && (
                            <Link href={'/login'}
                                className={`px-6 py-2 block hover:bg-primary hover:text-white ${router.pathname == '/login' ? "bg-blue-700 text-white" : ""}`}
                            >Login</Link>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default MobileSidebar;