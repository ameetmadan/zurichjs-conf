import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchPublicSpeakers } from '@/lib/queries/speakers';
import { renderCollectionOg, sendOgImage } from '@/lib/og/program-images';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { speakers } = await fetchPublicSpeakers();
    await sendOgImage(res, renderCollectionOg({ kind: 'speakers', speakers }));
  } catch (error) {
    console.error('[OG] Failed to render speakers image:', error);
    res.status(500).json({ error: 'Failed to render OG image' });
  }
}
