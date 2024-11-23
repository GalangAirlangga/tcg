'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export type Filters = {
  supertypes: string[]
  cardTypes: string[]
  subtypes: string[]
  rarities: string[]
}

type FilterSidebarProps = {
  onFilterChange: (filters: Filters) => void
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {

  const [types, setTypes] = useState<string[]>([])
  const [allSubtypes, setAllSubtypes] = useState<string[]>([])
  const [allSupertypes, setAllSupertypes] = useState<string[]>([])
  const [allRarities, setAllRarities] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedSubtypes, setSelectedSubtypes] = useState<string[]>([])
  const [selectedSupertypes, setSelectedSupertypes] = useState<string[]>([])
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [typesResponse, subtypesResponse, supertypesResponse, raritiesResponse] = await Promise.all([
        fetch('https://api.pokemontcg.io/v2/types'),
        fetch('https://api.pokemontcg.io/v2/subtypes'),
        fetch('https://api.pokemontcg.io/v2/supertypes'),
        fetch('https://api.pokemontcg.io/v2/rarities')
      ])
      const typesData = await typesResponse.json()
      const subtypesData = await subtypesResponse.json()
      const supertypesData = await supertypesResponse.json()
      const raritiesData = await raritiesResponse.json()
      setTypes(typesData.data)
      setAllSubtypes(subtypesData.data)
      setAllSupertypes(supertypesData.data)
      setAllRarities(raritiesData.data)
    }
    fetchData()
  }, [])



  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleSubtypeChange = (subtype: string) => {
    setSelectedSubtypes(prev => 
      prev.includes(subtype) ? prev.filter(s => s !== subtype) : [...prev, subtype]
    )
  }

  const handleSupertypeChange = (supertype: string) => {
    setSelectedSupertypes(prev => 
      prev.includes(supertype) ? prev.filter(s => s !== supertype) : [...prev, supertype]
    )
  }

  const handleRarityChange = (rarity: string) => {
    setSelectedRarities(prev => 
      prev.includes(rarity) ? prev.filter(r => r !== rarity) : [...prev, rarity]
    )
  }

  const applyFilters = () => {
    onFilterChange({ 
      supertypes: selectedSupertypes,
      cardTypes: selectedTypes, 
      subtypes: selectedSubtypes, 
      rarities: selectedRarities
    })
  }

  return (
    <aside className="w-full md:w-64 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      <div className="space-y-6">
        

        <div>
          <h3 className="font-medium mb-2">Supertypes</h3>
          <div className="space-y-2">
            {allSupertypes.map((supertype) => (
              <div key={supertype} className="flex items-center">
                <Checkbox 
                  id={`supertype-${supertype}`}
                  checked={selectedSupertypes.includes(supertype)}
                  onCheckedChange={() => handleSupertypeChange(supertype)}
                />
                <Label htmlFor={`supertype-${supertype}`} className="ml-2">{supertype}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Pokemon Type</h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {types.map((type) => (
                <div key={type} className="flex items-center">
                  <Checkbox 
                    id={`type-${type}`}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => handleTypeChange(type)}
                  />
                  <Label htmlFor={`type-${type}`} className="ml-2">{type}</Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div>
          <h3 className="font-medium mb-2">Subtypes</h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {allSubtypes.map((subtype) => (
                <div key={subtype} className="flex items-center">
                  <Checkbox 
                    id={`subtype-${subtype}`}
                    checked={selectedSubtypes.includes(subtype)}
                    onCheckedChange={() => handleSubtypeChange(subtype)}
                  />
                  <Label htmlFor={`subtype-${subtype}`} className="ml-2">{subtype}</Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div>
          <h3 className="font-medium mb-2">Rarity</h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {allRarities.map((rarity) => (
                <div key={rarity} className="flex items-center">
                  <Checkbox 
                    id={`rarity-${rarity}`}
                    checked={selectedRarities.includes(rarity)}
                    onCheckedChange={() => handleRarityChange(rarity)}
                  />
                  <Label htmlFor={`rarity-${rarity}`} className="ml-2">{rarity}</Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Button onClick={applyFilters} className="w-full">Apply Filters</Button>
      </div>
    </aside>
  )
}

