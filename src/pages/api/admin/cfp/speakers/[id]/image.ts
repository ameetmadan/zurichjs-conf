/**
 * Admin Speaker Image Upload API
 * POST /api/admin/cfp/speakers/[id]/image
 *
 * Allows admin to upload profile and admin-managed portrait images for any speaker
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminAccess } from '@/lib/admin/auth';
import { uploadSpeakerImage, type SpeakerImageField } from '@/lib/cfp/speakers';
import formidable from 'formidable';
import fs from 'fs';
import { logger } from '@/lib/logger';

const log = logger.scope('Admin Speaker Image Upload');

// Disable default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const IMAGE_FIELD_FILE_NAMES: Record<SpeakerImageField, string> = {
  profile_image_url: 'profile',
  header_image_url: 'header',
  portrait_foreground_url: 'portrait-foreground',
  portrait_background_url: 'portrait-background',
};

function getImageField(value: string | string[] | undefined): SpeakerImageField | null {
  const field = Array.isArray(value) ? value[0] : value;

  if (!field) {
    return 'profile_image_url';
  }

  if (field in IMAGE_FIELD_FILE_NAMES) {
    return field as SpeakerImageField;
  }

  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin authentication
  const { authorized } = verifyAdminAccess(req);
  if (!authorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Speaker ID is required' });
  }

  try {
    // Parse the form data
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      filter: (part) => {
        return ALLOWED_MIME_TYPES.includes(part.mimetype || '');
      },
    });

    const [fields, files] = await form.parse(req);
    const uploadedFile = files.image?.[0] || files.file?.[0];
    const imageField = getImageField(fields.imageField);

    if (!imageField) {
      if (uploadedFile?.filepath) {
        await fs.promises.unlink(uploadedFile.filepath).catch(() => {});
      }
      return res.status(400).json({
        error: 'Invalid image field. Accepted fields: profile_image_url, header_image_url, portrait_foreground_url, portrait_background_url',
      });
    }

    if (!uploadedFile) {
      return res.status(400).json({
        error: 'No image file provided. Accepted formats: JPG, PNG, WebP, GIF (max 5MB)',
      });
    }

    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(uploadedFile.mimetype || '')) {
      return res.status(400).json({
        error: 'Invalid file type. Accepted formats: JPG, PNG, WebP, GIF',
      });
    }

    // Read the file
    const fileBuffer = await fs.promises.readFile(uploadedFile.filepath);

    // Generate filename with extension
    const extension = uploadedFile.mimetype?.split('/')[1] || 'jpg';
    const fileName = `${IMAGE_FIELD_FILE_NAMES[imageField]}.${extension}`;

    // Upload to storage
    const { url, error } = await uploadSpeakerImage(
      id,
      fileBuffer,
      fileName,
      uploadedFile.mimetype || 'image/jpeg',
      imageField
    );

    // Clean up temp file
    await fs.promises.unlink(uploadedFile.filepath).catch(() => {});

    if (error || !url) {
      return res.status(500).json({ error: error || 'Failed to upload image' });
    }

    log.info('Speaker image uploaded', { speakerId: id, imageField });
    return res.status(200).json({
      success: true,
      imageUrl: url,
    });
  } catch (error) {
    log.error('Error uploading speaker image', error, { speakerId: id });
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to upload image',
    });
  }
}
