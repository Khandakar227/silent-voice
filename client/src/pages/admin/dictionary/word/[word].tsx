import Navbar from "@/components/Navbar"
import { Poppins } from "next/font/google"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client"
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

const poppins = Poppins({ weight: ["400", "600", "800"], subsets: ["latin"] })

function Word() {
  const router = useRouter()
  const [word, setWord] = useState(
    {} as { word: string; videos: string[]; images: string[] }
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

  const handleEdit = () => {
    router.push(`/admin/dictionary/word/edit/${router.query.word}`)
  }

  const handleDelete = () => {
    console.log("delete")

    // fetch(`/api/signs/word?word=${router.query.word}`, {
    //   method: "DELETE",
    // })
    //   .then((response) => response.json())
    //   .then((response) => {
    //     console.log(response)
    //     router.push("/admin/dictionary")
    //   })
    //   .catch((err) => console.error(err))
  }

  return (
    <>
      <Head>
        <title>{word.word ? word.word : ""} - Silent Voice</title>
      </Head>

      <div className={`${poppins.className} min-h-screen bg-box`}>
        <Navbar />
        <div className='max-w-7xl mx-auto grid py-5 md:grid-cols-1 items-center'>
          {!word.word ? (
            <div className='flex justify-center items-center h-screen'>
              loading...
            </div>
          ) : (
            <div className='bg-white p-4 m-4 rounded'>
              <div className='flex justify-between items-center'>
                <div>
                  <h2 className='text-2xl font-bold'>
                    {word.word.toUpperCase()}
                  </h2>
                  <p className='pb-12'>in ASL (American Sign Language)</p>
                </div>

                <div className='flex justify-center gap-5'>
                  <Button
                    type='button'
                    size='icon'
                    onClick={handleEdit}
                    className='bg-yellow-500 p-2 rounded-md shadow-md hover:bg-yellow-600'
                  >
                    <Pencil2Icon />
                  </Button>
                  <Button
                    size='icon'
                    type='button'
                    onClick={handleDelete}
                    className='bg-rose-600 p-2 rounded-md shadow-md hover:bg-rose-700'
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </div>

              {word.videos.length > 0 && (
                <div className='grid justify-center items-center gap-4'>
                  {word.videos.map((video, i) => (
                    <div key={video + i}>
                      <video
                        src={`/api/proxy-video?url=${video}`}
                        width='640px'
                        height='480px'
                        controls
                        controlsList='nodownload'
                        onContextMenu={() => false}
                      ></video>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default withPageAuthRequired(Word)
