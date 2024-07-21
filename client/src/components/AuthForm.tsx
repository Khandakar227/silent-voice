import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

type LoginModalProps = {
}

export default function AuthForm(props: LoginModalProps) {
    const router = useRouter();
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [loading, setLoading] = useState(false);

    const changeForm = () => {
        setIsLoginForm(!isLoginForm);
    }

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
        if (!isLoginForm && data.confim_password != data.password) {
            alert("Password and Confirm password did not match");
        }
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        setLoading(true);

        fetch(isLoginForm ? '/api/login' : '/api/signup', options)
            .then(response => response.json())
            .then(response => {
                setLoading(false);
                console.log(response)
                if(response.error) {
                    alert(response.error)
                    return;
                }
                router.push("/");
            })
            .catch(err => {
                console.error(err)
                alert(err.message)
                setLoading(false);
            });
    }
    return (
        <div className="mx-auto max-w-xl rounded shadow bg-white p-4 my-24">
            <h1 className="pb-12 text-2xl font-semibold"> {isLoginForm ? "Login" : "Create an Account"} </h1>
            <form onSubmit={onSubmit}>
                {!isLoginForm && (
                    <Input type="text" name="name" placeholder="Name" className="my-2" required />
                )}
                <Input type="email" name="email" placeholder="Email" className="my-2" required />
                <Input type="password" name="password" placeholder="Password" className="my-2" required />
                {
                    !isLoginForm && (
                        <Input type="password" name="confim_password" placeholder="Confim Password" className="my-2" required />
                    )
                }
                <Button disabled={loading} className="hover:text-white bg-primary text-black"> {loading ? "Please Wait..." : isLoginForm ? "Login" : "Create"} </Button>
            </form>
            <p className="py-12">{isLoginForm ? "Don't have an account" : "Already have an account"}? <button onClick={changeForm} className="font-semibold underline underline-offset-2">{isLoginForm ? "Create an Account" : "Login"}</button></p>
        </div>

    )
}
