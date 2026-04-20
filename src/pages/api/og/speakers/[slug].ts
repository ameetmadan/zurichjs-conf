import type { NextApiRequest, NextApiResponse } from 'next';
import { renderSpeakerDetailOg, sendOgImage } from '@/lib/og/program-images';
import { fetchPublicSpeakers } from '@/lib/queries/speakers';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const slug = typeof req.query.slug === 'string' ? req.query.slug : '';

  try {
    const { speakers } = await fetchPublicSpeakers();
    const speaker = speakers.find((entry) => entry.slug === slug);

    if (!speaker) {
      res.status(404).json({ error: 'Speaker not found' });
      return;
    }

    await sendOgImage(res, renderSpeakerDetailOg({ speaker }));
  } catch (error) {
    console.error('[OG] Failed to render speaker detail image:', error);
    res.status(500).json({ error: 'Failed to render OG image' });
  }
}
