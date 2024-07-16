"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const LoginForm: React.FC = () => {
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    console.log(email, password)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "An error occurred")
      }

      console.log("Login successful:", data)
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <Card className='shadow-lg rounded-sm'>
        <CardHeader>
          <CardTitle>Silent Voice</CardTitle>
          <CardDescription>Login to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col space-y-4'>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              name='email'
              id='email'
              placeholder='Enter your email'
            />

            <Label htmlFor='password'>Password</Label>
            <Input
              type='password'
              name='password'
              id='password'
              placeholder='Enter your password'
            />
          </div>
        </CardContent>
        <CardFooter className='flex flex-col justify-center items-end'>
          <Button
            type='submit'
            variant='outline'
            className='hover:bg-[#5BCBF1] hover:text-white'
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default LoginForm
