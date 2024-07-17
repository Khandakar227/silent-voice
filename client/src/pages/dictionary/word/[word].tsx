import Navbar from "@/components/Navbar"
import { Poppins } from "next/font/google"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

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

  return (
    <>
      <Head>
        <title>{word.word ? word.word : ""} Silent Voice</title>
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
              <h2 className='text-2xl font-bold'>{word.word.toUpperCase()}</h2>
              <p className='pb-12'>in ASL (American Sign Language)</p>

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

export default Word
