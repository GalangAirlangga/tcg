// pages/api/pokemonCards.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page, pageSize, q } = req.query;

  // Membuat query parameters berdasarkan filter yang diberikan
  const queryParams = new URLSearchParams({
    page: page?.toString() || '1',
    pageSize: pageSize?.toString() || '12',
    q: q?.toString() || '',  // Gunakan fungsi buildQueryString untuk menyusun query string
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
    console.error('Error fetching data:', error);  // Log error message
    res.status(500).json({ error: 'Server error' });
  }
}
