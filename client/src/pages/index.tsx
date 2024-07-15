import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className='text-4xl text-center p-10 max-w-7xl mx-auto'>
      <h1 className='text-rose-600'>Goodbye App Router</h1>
      <div>
        <Button variant='outline' size='sm'>
          F Off
        </Button>
      </div>
    </div>
  )
}
