'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'
import { Filters } from './filter-sidebar'

type PokemonCard = {
  id: string
  name: string
  supertype: string
  subtypes: string[]
  hp: string
  types: string[]
  rarity: string
  flavorText: string
  images: {
    small: string
    large: string
  }
  tcgplayer: {
    prices: {
      holofoil?: {
        market: number
      }
      normal?: {
        market: number
      }
    }
  }
}

type CardListProps = {
  filters: Filters
  page: number
  pageSize: number
  onTotalCountChange: (count: number) => void
}

export default function CardList({ filters, page, pageSize, onTotalCountChange }: CardListProps) {
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [, setTotalCount] = useState(0)

  useEffect(() => {
      const fetchCards = async () => {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          q: buildQueryString(filters),
        })

        const apiKey = process.env.API_KEY ?? "";
        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('Content-Type', 'application/json');
        requestHeaders.set('Access-Control-Allow-Origin', '*');   
        requestHeaders.set('X-Api-Key', apiKey);
        const response = (await fetch(
          `https://api.pokemontcg.io/v2/cards?${queryParams}`,
          {
            method: 'POST',
            headers: requestHeaders,
          }))
        const data = await response.json()

        setCards(data.data)
        setTotalCount(data.totalCount)
        onTotalCountChange(data.totalCount)
      
      }

      fetchCards()
    }, [filters, page, pageSize, onTotalCountChange])

  const buildQueryString = (filters: Filters) => {
    const queryParts = []

     // Filter berdasarkan supertypes dengan OR dan kutip dua
  if (filters.supertypes && filters.supertypes.length > 0) {
    const supertypesQuery = filters.supertypes
      .map(supertype => `supertype:"${supertype}"`)
      .join(' OR ');
    queryParts.push(`(${supertypesQuery})`);
  }

  // Filter berdasarkan types dengan OR dan kutip dua
  if (filters.cardTypes && filters.cardTypes.length > 0) {
    const cardTypesQuery = filters.cardTypes
      .map(type => `types:"${type}"`)
      .join(' OR ');
    queryParts.push(`(${cardTypesQuery})`);
  }

  // Filter berdasarkan subtypes dengan OR dan kutip dua
  if (filters.subtypes && filters.subtypes.length > 0) {
    const subtypesQuery = filters.subtypes
      .map(subtype => `subtypes:"${subtype}"`)
      .join(' OR ');
    queryParts.push(`(${subtypesQuery})`);
  }

  // Filter berdasarkan rarities dengan OR dan kutip dua
  if (filters.rarities && filters.rarities.length > 0) {
    const raritiesQuery = filters.rarities
      .map(rarity => `rarity:"${rarity}"`)
      .join(' OR ');
    queryParts.push(`(${raritiesQuery})`);
  }

    return queryParts.join(' ')
  }

  const getCardPrice = (card: PokemonCard) => {
    const prices = card.tcgplayer?.prices
    return prices?.holofoil?.market || prices?.normal?.market || 0
  }


  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.length > 0 ? (cards.map((card) => (
          <Dialog key={card.id}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
               
                <CardContent>
                  <Image src={card.images.small} 
                  alt={card.name} 
                  width={200} 
                  height={300} 
                  priority={false}
                  className="rounded-lg mt-1" />
                </CardContent>
                <CardFooter className='grid'>
                  <span className="text-bold">{card.name}</span>
                  <p className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{card.rarity?? '-'}</span>
                  <span className="font-semibold">${getCardPrice(card).toFixed(2)}</span>
                  </p>
                  
                </CardFooter>
              </Card>
            </DialogTrigger>  
            <DialogContent aria-description={card.name}>
             
              <DialogHeader>
                <DialogTitle>{card.name}</DialogTitle>
              </DialogHeader>
               <DialogDescription>{card.flavorText}</DialogDescription>
              <div className="grid grid-cols-2 gap-4">
                <Image src={card.images.large} 
                       alt={card.name}
                       priority={false}
                       width={300}
                       height={400} className="rounded-lg" />
                <div>
                  <p><strong>Supertype:</strong> {card.supertype}</p>
                  <p><strong>Subtypes:</strong> {card.subtypes?.join(', ')}</p>
                  <p><strong>HP:</strong> {card.hp}</p>
                  <p><strong>Types:</strong> {card.types?.join(', ') || 'N/A'}</p>
                  <p><strong>Rarity:</strong> {card.rarity}</p>
                  <p><strong>Market Price:</strong> ${getCardPrice(card).toFixed(2)}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">Card not found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

