-- Add admin-managed separated portrait assets for speaker detail pages

ALTER TABLE cfp_speakers
ADD COLUMN portrait_foreground_url TEXT,
ADD COLUMN portrait_background_url TEXT;

COMMENT ON COLUMN cfp_speakers.portrait_foreground_url IS 'Admin-managed transparent/cutout speaker portrait for composited layouts.';
COMMENT ON COLUMN cfp_speakers.portrait_background_url IS 'Admin-managed speaker portrait background image for composited layouts.';
