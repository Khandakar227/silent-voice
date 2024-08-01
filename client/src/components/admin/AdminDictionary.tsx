import { FormEvent, useEffect, useState } from "react";
import AdminSearchbar from "./admin-searchbar";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { Input } from "../ui/input";

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AdminDictionary() {
  const [words, setWords] = useState([] as { word: string; _id: string }[]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [alphabet, setAlphabet] = useState("");

  useEffect(() => {
    fetch(`/api/signs?prefix=${alphabet}&page=${page + 1}`)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setWords(response.contents || []);
        setTotalPages(response.totalPages);
      })
      .catch((err) => console.error(err));
  }, [page, alphabet]);

  function onPageChange(selectedItem: { selected: number }) {
    console.log("selectedItem ", selectedItem);
    setPage(selectedItem.selected);
  }

  function changeAlphabet(alphabet: string) {
    setAlphabet(alphabet);
    setPage(0);
  }

  return (
    <>
      <div className="pt-12 w-full flex justify-between gap-4 items-center px-4">
        <h1 className="text-xl font-semibold">ASL (American Sign Language)</h1>
        <ADDSignModal />
      </div>
      <AdminSearchbar />
      <div className="glass-primary my-4 p-e rounded border mx-auto max-w-7xl flex flex-wrap justify-center items-center">
        <button
          onClick={() => changeAlphabet("")}
          className="px-2 text-sm py-1 bg-primary rounded shadow-sm m-2"
        >
          All
        </button>
        {alphabets.map((alphabet, index) => (
          <button
            onClick={() => changeAlphabet(alphabet)}
            key={index + alphabet}
            className="px-2 text-sm py-1 bg-primary rounded shadow-sm m-2"
          >
            {alphabet}
          </button>
        ))}
      </div>

      <div className="pt-8 w-full">
        <div className="grid justify-between items-center gap-4 lg:grid-cols-3 grid-cols-2 text-center">
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
          className="flex justify-center items-center gap-4 flex-wrap py-12"
          pageLinkClassName={
            "px-4 py-2 rounded-md shadow outline-none bg-primary text-white text-sm hover:bg-blue-500 hover:text-white"
          }
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
    </>
  );
}

function ADDSignModal() {
  const [loading, setLoading] = useState(false);

  function add(e: FormEvent) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
    setLoading(true);
      const token = localStorage.getItem("token");
      fetch("/api/signs", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        videos: (data.videos as string).split(",").map((video) => video.trim()),
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        (e.target as HTMLFormElement).reset();
        toast.success("Word added successfully");
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-primary px-4 py-1 rounded flex justify-center gap-4 items-center">
        <span>ADD</span> <PlusCircledIcon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Word</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
          <form onSubmit={add}>
            <Input type="text" placeholder="Enter word" name="word" required />
            <textarea
              className="min-h-32 my-4 flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              name="videos"
              id="videos"
              placeholder="Add video URLs seperated by comma"
            ></textarea>
            <button
              disabled={loading}
              type="submit"
              className="my-4 py-2 px-4 bg-primary rounded text-black"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </form>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
