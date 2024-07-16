import Navbar from "@/components/Navbar";
import { Poppins } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ReactPaginate from "react-paginate";

const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export default function Dictionary() {
    const [words, setWords] = useState([] as {word:string, _id: string}[]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [alphabet, setAlphabet] = useState('');

    useEffect(() => {
        fetch(`/api/signs?prefix=${alphabet}&page=${page+1}`)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            setWords(response.contents || []);
            setTotalPages(response.totalPages);    
        })
        .catch(err => console.error(err));
            }, [page, alphabet])

    function onPageChange(selectedItem: { selected: number; }) {
        console.log("selectedItem ", selectedItem)
        setPage(selectedItem.selected);
    }

    function changeAlphabet(alphabet: string) {
        setAlphabet(alphabet);
        setPage(0);
    }
    
    return (
        <>
            <Head>
                <title>ASL Dictionary - Silent Voice</title>
            </Head>

            <div className={`${poppins.className} min-h-screen bg-box`}>
                <Navbar />
                <div className="px-4">
                    <div className="glass-primary my-12 p-4 rounded border mx-auto max-w-7xl">
                        <h1 className="text-2xl font-bold">Explore, discover, and learn sign language</h1>
                        <div className="flex gap-4 w-full py-12">
                            <input type="search" name="search" id="search" className="px-4 py-2 rounded shadow border flex-1 outline-none" placeholder="Search a word..." />
                            <button className="px-3 shadow-sm rounded bg-primary"><FaSearch/></button>
                        </div>
                    </div>

                    <div className="glass-primary my-4 p-e rounded border mx-auto max-w-7xl flex flex-wrap justify-center items-center">
                        <button onClick={() => changeAlphabet('')} className="px-2 text-sm py-1 bg-primary rounded shadow-sm m-2">All</button>
                        {
                            alphabets.map((alphabet, index) => (
                                <button onClick={() => changeAlphabet(alphabet)} key={index + alphabet} className="px-2 text-sm py-1 bg-primary rounded shadow-sm m-2">{alphabet}</button>
                            ))
                        }
                    </div>

                    <div className="pt-8">
                <div className="grid justify-between items-center gap-4 lg:grid-cols-3 md:grid-cols-2 text-center">
                            {
                                words.map((word, i) => (
                                    <div key={word._id + i}>
                                        <Link href={`/dictionary/word/${word.word}`} className={`p-2 m-2 text-sm`}>{word.word?.split(',')[0]}</Link>
                                    </div>
                                ))
                            }
                        </div>
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
