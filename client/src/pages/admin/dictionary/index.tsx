import AdminSearchbar from "@/components/admin/admin-searchbar"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client"
import { Poppins } from "next/font/google"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"
import {} from "react-icons/fa"
import ReactPaginate from "react-paginate"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FiPlusCircle } from "react-icons/fi"
import { FiMinusCircle } from "react-icons/fi"
import toast from "react-hot-toast"

const poppins = Poppins({ weight: ["400", "600", "800"], subsets: ["latin"] })

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const Dictionary = () => {
  const [words, setWords] = useState([] as { word: string; _id: string }[])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [alphabet, setAlphabet] = useState("")

  const [showWordModal, setShowWordModal] = useState(false)
  const [word, setWord] = useState("")
  const [images, setImages] = useState([""])
  const [videos, setVideos] = useState([""])

  useEffect(() => {
    fetch(`/api/signs?prefix=${alphabet}&page=${page + 1}`)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        setWords(response.contents || [])
        setTotalPages(response.totalPages)
      })
      .catch((err) => console.error(err))
  }, [page, alphabet])

  function onPageChange(selectedItem: { selected: number }) {
    console.log("selectedItem ", selectedItem)
    setPage(selectedItem.selected)
  }

  function changeAlphabet(alphabet: string) {
    setAlphabet(alphabet)
    setPage(0)
  }

  const handleAddWordModal = () => {
    setShowWordModal(true)
  }

  const handleModalClose = () => {
    setShowWordModal(false)
  }

  const addImageField = () => setImages([...images, ""])
  const removeImageField = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
  }

  const addVideoField = () => setVideos([...videos, ""])
  const removeVideoField = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index)
    setVideos(newVideos)
  }

  const handleAddWord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/signs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word,
          videos: videos.filter((v) => v.trim() !== ""),
          images: images.filter((i) => i.trim() !== ""),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add word")
      }

      const data = await response.json()

      toast.success(`Word "${data.word}" has been added successfully`, {
        icon: "✅",
      })
      console.log("Word added successfully:", data)

      setWord("")
      setVideos([""])
      setImages([""])
      setShowWordModal(false)
    } catch (error) {
      toast.error(`Failed to add word`, {
        icon: "❌",
      })
      console.error("Error adding word:", error)
    }
  }

  return (
    <>
      <Head>
        <title>ASL Dictionary - Silent Voice</title>
      </Head>

      <div className={`${poppins.className} min-h-screen bg-box`}>
        <Navbar />
        <div className='px-4'>
          <div className='glass-primary my-12 p-4 rounded border mx-auto max-w-7xl'>
            <div className='flex justify-between'>
              <h1 className='text-2xl font-bold'>
                American Sign Language Dictionary
              </h1>
              <Button
                onClick={handleAddWordModal}
                variant='default'
                className='hover:bg-[#4fb7da] hover:text-white font-bold'
              >
                Add Word
              </Button>
            </div>
            <AdminSearchbar />
          </div>

          <div className='glass-primary my-4 p-e rounded border mx-auto max-w-7xl flex flex-wrap justify-center items-center'>
            <button
              onClick={() => changeAlphabet("")}
              className='px-2 text-sm py-1 bg-primary rounded shadow-sm m-2'
            >
              All
            </button>
            {alphabets.map((alphabet, index) => (
              <button
                onClick={() => changeAlphabet(alphabet)}
                key={index + alphabet}
                className='px-2 text-sm py-1 bg-primary rounded shadow-sm m-2'
              >
                {alphabet}
              </button>
            ))}
          </div>

          <div className='pt-8'>
            <div className='grid justify-between items-center gap-4 lg:grid-cols-3 md:grid-cols-2 text-center'>
              {words.map((word, i) => (
                <div key={word._id + i}>
                  <Link
                    href={`/admin/dictionary/word/${word.word}`}
                    className={`p-2 m-2 text-sm`}
                  >
                    {word.word?.split(",")[0]}
                  </Link>
                </div>
              ))}
            </div>
            <ReactPaginate
              className='flex justify-center items-center gap-4 flex-wrap py-12'
              pageLinkClassName={
                "px-4 py-2 rounded-md shadow outline-none bg-primary text-white text-sm hover:bg-blue-500 hover:text-white"
              }
              pageCount={totalPages}
              breakLabel='...'
              nextLabel='>'
              previousLinkClassName='px-4 py-2 rounded-md outline-none hover:bg-blue-500 hover:text-white'
              nextLinkClassName='px-4 py-2 rounded-md outline-none hover:bg-blue-500 hover:text-white'
              pageRangeDisplayed={5}
              previousLabel='<'
              renderOnZeroPageCount={null}
              activeLinkClassName='!bg-blue-700 !text-white'
              initialPage={page}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>

      {showWordModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto'>
          <div className='bg-white rounded-md p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-auto'>
            <form
              className='bg-white p-4 m-4 rounded space-y-6'
              onSubmit={handleAddWord}
            >
              <h1 className='text-2xl font-bold text-center'>Add Word</h1>

              <div className='flex flex-col items-start justify-center gap-3'>
                <Label htmlFor='word' className='font-semibold'>
                  Word
                </Label>
                <Input
                  type='text'
                  id='word'
                  placeholder='Word'
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                />
              </div>

              <div className='flex flex-col items-start justify-center gap-3'>
                <Label className='font-semibold'>Image URLs</Label>
                {images.map((image, index) => (
                  <div key={index} className='flex items-center gap-2 w-full'>
                    <Input
                      type='text'
                      placeholder='Image URL'
                      value={image}
                      onChange={(e) => {
                        const newImages = [...images]
                        newImages[index] = e.target.value
                        setImages(newImages)
                      }}
                    />
                    <Button
                      type='button'
                      onClick={() => removeImageField(index)}
                      size='icon'
                      variant='outline'
                      className='hover:bg-rose-600 hover:text-white border border-rose-500'
                    >
                      <FiMinusCircle className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
                <Button type='button' onClick={addImageField} size='sm'>
                  <FiPlusCircle className='h-4 w-4 mr-2' /> Add Image URL
                </Button>
              </div>

              <div className='flex flex-col items-start justify-center gap-3'>
                <Label className='font-semibold'>Video URLs</Label>
                {videos.map((video, index) => (
                  <div key={index} className='flex items-center gap-2 w-full'>
                    <Input
                      type='text'
                      placeholder='Video URL'
                      value={video}
                      onChange={(e) => {
                        const newVideos = [...videos]
                        newVideos[index] = e.target.value
                        setVideos(newVideos)
                      }}
                    />
                    <Button
                      type='button'
                      onClick={() => removeVideoField(index)}
                      size='icon'
                      variant='outline'
                      className='hover:bg-rose-600 hover:text-white border border-rose-500'
                    >
                      <FiMinusCircle className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
                <Button type='button' onClick={addVideoField} size='sm'>
                  <FiPlusCircle className='h-4 w-4 mr-2' /> Add Video URL
                </Button>
              </div>

              <div className='flex justify-between'>
                <Button
                  type='submit'
                  size='sm'
                  className='bg-lime-600 hover:bg-lime-700'
                >
                  Add Word
                </Button>

                <Button
                  onClick={handleModalClose}
                  className='hover:bg-rose-600 hover:text-white border border-rose-500'
                  size='sm'
                  variant='outline'
                >
                  Close
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default withPageAuthRequired(Dictionary)
