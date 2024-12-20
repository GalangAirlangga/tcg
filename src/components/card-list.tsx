'use client'

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import {ScrollArea} from '@/components/ui/scroll-area'
import {Separator} from "@/components/ui/separator"
import {Skeleton} from "@/components/ui/skeleton"
import {useMediaQuery} from "@/hooks/use-media-query"
import {useEffect, useState} from 'react'
import {Filters} from './filter-sidebar'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {PokemonCard} from "@/types/PokemonCard";


type CardListProps = {
    filters: Filters
    page: number
    pageSize: number
    onTotalCountChange: (count: number) => void
}

interface CardSkeletonProps {
    key?: number
}

export default function CardList({filters, page, pageSize, onTotalCountChange}: CardListProps) {
    const [cards, setCards] = useState<PokemonCard[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [, setTotalCount] = useState(0)

    useEffect(() => {
        const fetchCards = async () => {
            setIsLoading(true)
            const queryParams = new URLSearchParams({
                page: page.toString(),
                orderBy: "-set.releaseDate",
                pageSize: pageSize.toString(),
                q: buildQueryString(filters),
            })

            const apiKey = process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY ?? "";
            const response = await fetch(
                `/api/pokemonCard?${queryParams}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Api-Key': apiKey,
                    },
                })
            const data = await response.json()

            setCards(data.data)
            setTotalCount(data.totalCount)
            onTotalCountChange(data.totalCount)
            setIsLoading(false)
        }

        fetchCards().then(() => {})
    }, [filters, page, pageSize, onTotalCountChange])

    const buildQueryString = (filters: Filters) => {
        const queryParts = []

        if (filters.supertypes && filters.supertypes.length > 0) {
            const supertypesQuery = filters.supertypes
                .map(supertype => `supertype:"${supertype}"`)
                .join(' OR ');
            queryParts.push(`(${supertypesQuery})`);
        }

        if (filters.cardTypes && filters.cardTypes.length > 0) {
            const cardTypesQuery = filters.cardTypes
                .map(type => `types:"${type}"`)
                .join(' OR ');
            queryParts.push(`(${cardTypesQuery})`);
        }

        if (filters.subtypes && filters.subtypes.length > 0) {
            const subtypesQuery = filters.subtypes
                .map(subtype => `subtypes:"${subtype}"`)
                .join(' OR ');
            queryParts.push(`(${subtypesQuery})`);
        }

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

    const getTypeColor = (type: string) => {
        const colors: { [key: string]: string } = {
            Colorless: "bg-gray-400",
            Darkness: "bg-purple-900",
            Dragon: "bg-yellow-600",
            Fairy: "bg-pink-400",
            Fighting: "bg-red-800",
            Fire: "bg-red-500",
            Grass: "bg-green-500",
            Lightning: "bg-yellow-400",
            Metal: "bg-gray-500",
            Psychic: "bg-purple-500",
            Water: "bg-blue-500",
        }
        return colors[type] || "bg-gray-500"
    }

    const CardSkeleton = ({}: CardSkeletonProps) => (
        <Card className="w-full max-w-sm mx-auto overflow-hidden">
            <CardHeader className="p-0 relative">
                <Skeleton className="w-full h-64"/>
            </CardHeader>
            <CardContent className="p-4">
                <Skeleton className="h-8 w-3/4 mb-2"/>
                <Skeleton className="h-4 w-1/2 mb-4"/>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                </div>
            </CardContent>
            <CardFooter className="bg-muted p-4">
                <div className="flex justify-between items-center w-full">
                    <Skeleton className="h-4 w-1/4"/>
                    <Skeleton className="h-4 w-1/4"/>
                </div>
            </CardFooter>
        </Card>
    )
    const isDesktop = useMediaQuery("(min-width: 768px)")

    return (
        <div className="flex-1">
            <div key="grid-main" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {isLoading
                    ? Array.from({length: pageSize}).map((_, index) => (
                        <CardSkeleton key={index}/>
                    ))
                    : cards.length > 0
                        ? cards.map((card) => (
                            <div key={card.id}>
                                {isDesktop ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            {CardPokemon(card, getTypeColor, getCardPrice)}
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[825px]">
                                            <DialogHeader>
                                                <DialogTitle>{card.name}</DialogTitle>
                                                <DialogDescription>{card.flavorText}</DialogDescription>
                                            </DialogHeader>
                                            {cardPokemonDetail(card)}
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <Drawer fadeFromIndex={} snapPoints={}>
                                        <DrawerTrigger asChild>
                                            {CardPokemon(card, getTypeColor, getCardPrice)}
                                        </DrawerTrigger>
                                        <DrawerContent className=" h-[700px]">
                                            <DrawerHeader className="text-left">
                                                <DrawerTitle>{card.name}</DrawerTitle>
                                                <DrawerDescription>{card.flavorText}</DrawerDescription>
                                            </DrawerHeader>
                                            {cardPokemonDetail(card)}
                                            <DrawerFooter className="pt-2">
                                                <DrawerClose asChild>
                                                    <Button variant="outline">Close</Button>
                                                </DrawerClose>
                                            </DrawerFooter>
                                        </DrawerContent>
                                    </Drawer>
                                )}

                            </div>

                        ))
                        : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-gray-500 text-lg">No cards found.</p>
                            </div>
                        )}
            </div>
        </div>
    )
}

function cardPokemonDetail(card: PokemonCard) {
    return <ScrollArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Avatar className="w-full p-4 h-fit object-center rounded-none">
                <AvatarImage
                    src={card.images.large}
                    alt={card.name}
                    className="object-constain  h-fit "
                    onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg?height=356&width=256'
                    }}/>
                <AvatarFallback>
                    <Skeleton className="w-full h-full"/>
                </AvatarFallback>
            </Avatar>
            <div className="space-y-4">
                <div>
                    <Separator/>
                    <h3 className="text-lg font-semibold">Details</h3>
                    <Separator/>
                    <p><strong>Supertype:</strong> {card.supertype}</p>
                    <p><strong>Subtypes:</strong> {card.subtypes?.join(', ')}</p>
                    <p><strong>HP:</strong> {card.hp}</p>
                    <p><strong>Types:</strong> {card.types?.join(', ') || 'N/A'}</p>
                    <p><strong>Rarity:</strong> {card.rarity}</p>
                    <p><strong>Set:</strong> {card.set.name} ({card.set.series})</p>
                    <p><strong>Number:</strong> {card.number}/{card.set.printedTotal}</p>
                    {card.artist && <p><strong>Artist:</strong> {card.artist}</p>}
                </div>
                {card.abilities && (
                    <div>
                        <h3 className="text-lg font-semibold">Abilities</h3>
                        {card.abilities.map((ability, index) => (
                            <div key={index}>
                                <p><strong>{ability.name}</strong> ({ability.type})</p>
                                <p>{ability.text}</p>
                            </div>
                        ))}
                    </div>
                )}
                {card.attacks && (
                    <div>
                        <h3 className="text-lg font-semibold">Attacks</h3>
                        {card.attacks.map((attack, index) => (
                            <div key={index}>
                                <p><strong>{attack.name}</strong> - Cost: {attack.cost.join(', ')}</p>
                                <p>Damage: {attack.damage}, Energy: {attack.convertedEnergyCost}</p>
                                <p>{attack.text}</p>
                            </div>
                        ))}
                    </div>
                )}{card.rules && (
                <div>
                    <h3 className="text-lg font-semibold">Rules</h3>
                    {card.rules.map((rule, index) => (
                        <div key={index}>
                            <p>{rule}</p>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </div>

        <div>
            <Separator/>
            <h3 className="text-lg font-semibold">Market Prices</h3>
            <Separator/>
            <div className="grid grid-cols-2 gap-2">
                {card.tcgplayer?.prices.holofoil && (
                    <div>
                        <p><strong>Holofoil:</strong></p>
                        <p>Low: ${card.tcgplayer.prices.holofoil.low.toFixed(2)}</p>
                        <p>Market: ${card.tcgplayer.prices.holofoil.market.toFixed(2)}</p>
                    </div>
                )}
                {card.tcgplayer?.prices.reverseHolofoil && (
                    <div>
                        <p><strong>Reverse Holofoil:</strong></p>
                        <p>Low: ${card.tcgplayer.prices.reverseHolofoil.low.toFixed(2)}</p>
                        <p>Market: ${card.tcgplayer.prices.reverseHolofoil.market.toFixed(2)}</p>
                    </div>
                )}
                {card.tcgplayer?.prices.normal && (
                    <div>
                        <p><strong>Normal:</strong></p>
                        <p>Low: ${card.tcgplayer.prices.normal.low.toFixed(2)}</p>
                        <p>Market: ${card.tcgplayer.prices.normal.market.toFixed(2)}</p>
                    </div>
                )}
            </div>
        </div>
    </ScrollArea>
}

function CardPokemon(card: PokemonCard, getTypeColor: (type: string | undefined) => string, getCardPrice: (card: PokemonCard) => number) {
    return <Card
        className="w-full max-w-sm mx-auto overflow-hidden transition-all duration-300 transform hover:scale-105 cursor-pointer">
        <CardHeader className="p-0 relative">
            <div className="absolute top-2 left-2 z-10 flex items-center space-x-2">
                {card.types && card.types.map((type, index) => (
                    <Badge key={`${type}-${index}`} variant="outline" className={`${getTypeColor(type)} text-white`}>
                        {type}
                    </Badge>
                ))}
                {card.supertype === "Pokémon" && (
                    <span className="text-sm font-bold text-white bg-gray-800 bg-opacity-50 px-2 py-1 rounded-full">
                    HP {card.hp}
                </span>)}
            </div>
            <Avatar className="w-full h-96 object-center rounded-none">
                <AvatarImage
                    src={card.images.small}
                    alt={card.name}
                    className="object-constain w-full h-96"
                    onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg?height=356&width=256'
                    }}/>
                <AvatarFallback>
                    <Skeleton className="w-full h-full"/>
                </AvatarFallback>
            </Avatar>
        </CardHeader>
        <CardContent className="p-4">
            <h2 className="text-2xl font-bold mb-2">{card.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{card.supertype} - {card.subtypes.join(', ')}</p>
            <div className="space-y-2">
                {card.supertype === "Pokémon" && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">HP</span>
                        <span>{card.hp}</span>
                    </div>
                )}
            </div>
        </CardContent>
        <CardFooter className={`${getTypeColor(card.types?.[0])} text-white p-4`}>
            <div className="flex justify-between items-center w-full">
                <span className="text-sm font-medium">{card.rarity}</span>
                <span className="font-semibold">${getCardPrice(card).toFixed(2)}</span>
            </div>
        </CardFooter>
    </Card>
}
