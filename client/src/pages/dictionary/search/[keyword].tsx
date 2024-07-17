import Navbar from "@/components/Navbar";
import Searchbar from "@/components/Searchbar";
import { Poppins } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })

export default function Search() {
  const router = useRouter();
  const [words, setWords] = useState([] as { word: string, _id: string }[]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!router.query.keyword) return;
    fetch(`/api/signs/search?keyword=${router.query.keyword}&page=${page+1}`)
    .then(response => response.json())
    .then(response => {
      console.log(response)
      setWords(response.contents);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    })
    .catch(err => console.error(err));
  }, [router.query.keyword, page])

  function onPageChange(selectedItem: { selected: number; }) {
    console.log("selectedItem ", selectedItem)
    setPage(selectedItem.selected);
  }
  return (
    <>
        <Head>
            <title>Search - Silent Voice</title>
        </Head>
        <div className={`${poppins.className} min-h-screen bg-box`}>
            <Navbar />
            <div className="flex gap-4 w-full py-12 mx-auto max-w-7xl px-4">
              <Searchbar />
            </div>

            <div className="p-4 rounded shadow m-4 mx-auto max-w-7xl">
              <h1 className="text-2xl font-semibold pt-4">Search Results for "{router.query.keyword}"</h1>
              <p className="pb-12">Total {totalItems} words found</p>

              <div className="grid items-center gap-4">
                {
                  words.map((word, index) => (
                    <div key={index} className="shadow p-4 rounded border flex gap-4 justify-between items-center">
                      <h2 className="text-lg font-semibold">{word.word}</h2>
                      <Link href={`/dictionary/word/${word.word}`}>
                        <span className="bg-primary px-2 py-1 rounded text-sm">View</span>
                      </Link>
                    </div>
                  ))
                }
                <ReactPaginate
                    className="flex justify-center items-center gap-4 flex-wrap py-12"
                    pageLinkClassName={'px-4 py-2 rounded-md shadow outline-none bg-primary text-white text-sm hover:bg-blue-500 hover:text-white'}
                    pageCount={totalPages}
                    breakLabel="..."
                    nextLabel=">"
                    previousLinkClassName="px-4 py-2 rounded-md outline-none hover:bg-blue-500 hover:text-white"
                    nextLinkClassName="px-4 py-2 rounded-md outline-none hover:bg-blue-500 hover:text-white"
                    pageRangeDisplayed={5}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    activeLinkClassName="!bg-blue-700 !text-white"
                    initialPage={page}
                    onPageChange={onPageChange}
                    />
              </div>
            </div>
        </div>
    </>
  )
}
