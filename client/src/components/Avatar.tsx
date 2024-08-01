import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUser } from "@/hooks/user"
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog"
import Link from "next/link";

export default function Avatar() {
    const [user, setUser] = useUser();

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    }
    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger className="bg-blue-950 rounded-full shadow h-7 w-7"></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Logged in as {user?.name}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Email: {user?.email}
                        </AlertDialogDescription>
                            <ul className="py-4">
                                <li>
                                    <Link href={"/profile"} className="block text-left text-black hover:bg-primary font-semibold w-full p-2 shadow-sm">Profile</Link>
                                </li>
                                <li>
                                    <button onClick={logout} className="text-left text-black hover:bg-primary font-semibold w-full p-2 shadow-sm">Log Out</button>
                                </li>
                            </ul>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
