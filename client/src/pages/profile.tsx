import AuthForm from "@/components/AuthForm"
import Navbar from "@/components/Navbar"
import { useUser } from "@/hooks/user"
import { Poppins } from "next/font/google"
import Head from "next/head"
import { FormEvent, useEffect, useState } from "react"

const poppins = Poppins({ weight: ["400", "600", "800"], subsets: ["latin"] })

export default function Profile() {
    const [user, setUser] = useUser();
    const [name, setName] = useState('');

    const save = (e:FormEvent) => {
        e.preventDefault();

    }

    return (
        <>
            <Head>
                <title>Profile - Silent Voice</title>
            </Head>
            <div className={`${poppins.className} min-h-screen bg-box`}>
                <Navbar />
                
                <div className="p-4 shadow rounded bg-white my-12 mx-auto max-w-2xl">
                    <h1 className="text-3xl font-semibold pb-8">Profile</h1>
                    {
                        !user ? <span>You are not logged in</span>
                        :
                        <>
                            <form onSubmit={save}>
                                <div className="py-2">
                                    <p className="text-xs pb-1">Name:</p>
                                    <input onChange={(e)=> setName(e.target.value)} type="text" name="name" id="name" defaultValue={user.name} className="w-full shadow p-2 rounded" />
                                </div>
                                <div className="py-2">
                                    <p className="text-xs pb-1">Email:</p>
                                    <p className="w-full shadow p-2 rounded" >{user.email}</p>
                                </div>
                                <div>
                                <p className="text-xs pb-1">Status:</p>
                                    <p>{user.isVerified ? "Verified" : "Not Verified"}</p>
                                </div>
                                {
                                    name && (
                                        <div className="flex justify-end items-center">
                                            <button className="bg-blue-950 text-white px-4 py-2 rounded my-4">Save</button>
                                        </div>
                                    )
                                }
                            </form>
                        </>
                    }
                </div>
            </div>
        </>
    )
}
