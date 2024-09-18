import Navbar from "@/components/Navbar"
import { Poppins } from "next/font/google"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import Spinner from "@/components/Spinner"

const poppins = Poppins({ weight: ["400", "600", "800"], subsets: ["latin"] })

function EditWord() {
  const router = useRouter()
  const [word, setWord] = useState(
    {} as { _id: string; word: string; videos: string[]; images: string[] }
  )

  useEffect(() => {
    fetch(`/api/signs/word?word=${router.query.word}`)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        setWord(response)
      })
      .catch((err) => console.error(err))
  }, [router.query.word])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
      const response = await fetch(`/api/signs/word?word=${word.word}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          videos: (data.videos as string).split(",").map((video) => video.trim()),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update word")
      }

      const updatedWord = await response.json()

      toast.success(
        `Word "${updatedWord.word}" has been updated successfully`,
        {
          icon: "✅",
        }
      )
      console.log("Word updated successfully:", updatedWord)

      router.push(`/admin/dictionary/word/${updatedWord.word}`)
    } catch (error) {
      toast.error(`Failed to update word "${word.word}"`, {
        icon: "❌",
      })
      console.error("Error updating word:", error)
    }
  }

  return (
    <>
      <Head>
        <title>{word && word?.word ? word.word : ""} - Silent Voice</title>
      </Head>

      {
        !word || !word.word ? (
        <Spinner/>
        )
        :
      <div className={`${poppins.className} min-h-screen bg-box`}>
        <Navbar />
        <div className='max-w-7xl mx-auto py-5 grid md:grid-cols-1 items-center'>
          {!word.word ? (
            <div className='flex justify-center items-center h-screen'>
              loading...
            </div>
          ) : (
            <form
              className='bg-white p-4 m-4 rounded space-y-6'
              onSubmit={handleSubmit}
            >
              <h1 className='text-2xl font-bold text-center'>Edit Word</h1>

              <div className='flex flex-col items-start justify-center gap-3'>
                <Label htmlFor='word' className='font-semibold'>
                  Word
                </Label>
                <Input
                  type='text'
                  id='word'
                  placeholder='Word'
                  name="word"
                  defaultValue={word.word}
                />
              </div>
              <textarea name="videos" id="videos" className="w-full min-h-10 rounded-md border border-slate-200 bg-transparent px-3 py-1 shadow-sm">
                {word.videos.join(",")}
              </textarea>

              <Button
                type='submit'
                size='sm'
                className='bg-lime-600 hover:bg-lime-700'
              >
                Update
              </Button>
            </form>
          )}
        </div>
      </div>
      }

    </>
  )
}

export default EditWord
