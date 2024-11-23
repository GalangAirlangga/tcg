import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pokemon TCG Market</h1>
        <div className="relative w-64">
          <Input 
            type="search" 
            placeholder="Search cards..." 
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
    </header>
  )
}

