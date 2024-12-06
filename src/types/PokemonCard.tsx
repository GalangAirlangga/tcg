export type PokemonCard = {
    id: string
    name: string
    supertype: string
    subtypes: string[]
    rules: string[]
    hp: string
    types: string[]
    evolvesFrom?: string
    abilities?: Array<{
        name: string
        text: string
        type: string
    }>
    attacks?: Array<{
        name: string
        cost: string[]
        convertedEnergyCost: number
        damage: string
        text: string
    }>
    weaknesses?: Array<{
        type: string
        value: string
    }>
    resistances?: Array<{
        type: string
        value: string
    }>
    retreatCost?: string[]
    convertedRetreatCost?: number
    set: {
        name: string
        series: string
        printedTotal: number
        total: number
        legalities: {
            unlimited: string
            standard?: string
            expanded?: string
        }
        ptcgoCode?: string
        releaseDate: string
        updatedAt: string
    }
    number: string
    artist?: string
    rarity: string
    flavorText?: string
    nationalPokedexNumbers?: number[]
    legalities: {
        unlimited: string
        standard?: string
        expanded?: string
    }
    images: {
        small: string
        large: string
    }
    tcgplayer: {
        url: string
        updatedAt: string
        prices: {
            holofoil?: {
                low: number
                mid: number
                high: number
                market: number
                directLow: number
            }
            reverseHolofoil?: {
                low: number
                mid: number
                high: number
                market: number
                directLow: number
            }
            normal?: {
                low: number
                mid: number
                high: number
                market: number
                directLow: number
            }
        }
    }
}