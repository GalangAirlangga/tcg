// pages/api/pokemonCards.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page, pageSize, filters } = req.query;

  // Membuat query parameters berdasarkan filter yang diberikan
  const queryParams = new URLSearchParams({
    page: page?.toString() || '1',
    pageSize: pageSize?.toString() || '12',
    q: buildQueryString(filters),  // Gunakan fungsi buildQueryString untuk menyusun query string
  });

  const apiUrl = `https://api.pokemontcg.io/v2/cards?${queryParams}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',  // Sesuaikan dengan metode yang benar, misalnya 'GET'
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.API_KEY || '',  // Ambil API Key dari env
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch data from external API' });
    }

    const data = await response.json();
      
    res.status(200).json(data);  // Kirimkan data ke frontend
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

// Fungsi untuk membangun query string berdasarkan filter
function buildQueryString(filters: any) {
  const queryParts: string[] = [];

  // Filter berdasarkan supertypes
  if (filters?.supertypes?.length > 0) {
    const supertypesQuery = filters.supertypes.map((supertype: string) => `supertype:"${supertype}"`).join(' OR ');
    queryParts.push(`(${supertypesQuery})`);
  }

  // Filter berdasarkan card types
  if (filters?.cardTypes?.length > 0) {
    const cardTypesQuery = filters.cardTypes.map((type: string) => `types:"${type}"`).join(' OR ');
    queryParts.push(`(${cardTypesQuery})`);
  }

  // Filter berdasarkan subtypes
  if (filters?.subtypes?.length > 0) {
    const subtypesQuery = filters.subtypes.map((subtype: string) => `subtypes:"${subtype}"`).join(' OR ');
    queryParts.push(`(${subtypesQuery})`);
  }

  // Filter berdasarkan rarities
  if (filters?.rarities?.length > 0) {
    const raritiesQuery = filters.rarities.map((rarity: string) => `rarity:"${rarity}"`).join(' OR ');
    queryParts.push(`(${raritiesQuery})`);
  }

  return queryParts.join(' ');
}
