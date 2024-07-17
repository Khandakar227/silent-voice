import Navbar from "@/components/Navbar"
import { Poppins } from "next/font/google"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...word.images]
    newImages[index] = value
    setWord({ ...word, images: newImages })
  }

  const handleVideoChange = (index: number, value: string) => {
    const newVideos = [...word.videos]
    newVideos[index] = value
    setWord({ ...word, videos: newVideos })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/signs/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldWord: router.query.word,
          newWord: word.word,
          images: word.images,
          videos: word.videos,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update word")
      }

      const updatedWord = await response.json()
      console.log("Word updated successfully:", updatedWord)

      router.push(`/admin/dictionary/word/${updatedWord.word}`)
    } catch (error) {
      console.error("Error updating word:", error)
    }
  }

  return (
    <>
      <Head>
        <title>{word.word ? word.word : ""} - Silent Voice</title>
      </Head>

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
                  value={word.word}
                  onChange={(e) => setWord({ ...word, word: e.target.value })}
                />
              </div>

              <div className='flex flex-col items-start justify-center gap-3'>
                <Label htmlFor='images' className='font-semibold'>
                  Image URLs
                </Label>
                {word.images.map((image, index) => {
                  return (
                    <Input
                      key={index}
                      type='text'
                      id={`image-${index}`}
                      placeholder='Image URL'
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                    />
                  )
                })}
              </div>

              <div className='flex flex-col items-start justify-center gap-3'>
                <Label htmlFor='videos' className='font-semibold'>
                  Video URLs
                </Label>
                {word.videos.map((video, index) => {
                  return (
                    <Input
                      key={index}
                      type='text'
                      id={`video-${index}`}
                      placeholder='Video URL'
                      value={video}
                      onChange={(e) => handleVideoChange(index, e.target.value)}
                    />
                  )
                })}
              </div>

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
    </>
  )
}

export default withPageAuthRequired(EditWord)
