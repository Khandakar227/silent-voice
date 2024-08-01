import "@/styles/globals.css"
import type { AppProps } from "next/app"

import { Toaster } from "react-hot-toast"
import { UserProvider } from "@auth0/nextjs-auth0/client"
import { userUserLoaded, useUser } from "@/hooks/user";
import { useEffect } from "react";
import { getLoggedInUser } from "@/lib/utils";

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useUser();
  const [loaded, setLoaded] = userUserLoaded();
  // Get logged in user data from token
  useEffect(() => {
    getLoggedInUser()
      .then((res) => {
        setUser(res.user);
      }).catch((err) => {
        console.log(err);
      }).finally(() => setLoaded(true));
  }, [])
  
  return (
    <UserProvider>
      <Component {...pageProps} />
      <Toaster />
    </UserProvider>
  )
}
