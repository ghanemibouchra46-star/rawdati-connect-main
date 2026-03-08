-- Add kindergarten_gallery column to store activity and program images
ALTER TABLE public.kindergartens 
ADD COLUMN IF NOT EXISTS kindergarten_gallery JSONB NOT NULL DEFAULT '[]';

-- Add comment to explain the structure
COMMENT ON COLUMN public.kindergartens.kindergarten_gallery IS 'Array of activity/program images with titles and descriptions in both Arabic and French';
لا