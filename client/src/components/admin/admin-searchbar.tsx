import { useRouter } from "next/router"
import { FormEvent } from "react"
import { FaSearch } from "react-icons/fa"

export default function AdminSearchbar() {
  const router = useRouter()

  function onSearch(e: FormEvent) {
    e.preventDefault()
    const search = new FormData(e.target as HTMLFormElement).get(
      "search"
    ) as string
    router.push(`/admin/dictionary/search/${search}`)
  }
  return (
    <form onSubmit={onSearch} className='flex gap-4 w-full py-12'>
      <input
        type='search'
        name='search'
        id='search'
        className='px-4 py-2 rounded shadow border flex-1 outline-none'
        placeholder='Search a word...'
      />
      <button type='submit' className='px-3 shadow-sm rounded bg-primary'>
        <FaSearch />
      </button>
    </form>
  )
}
