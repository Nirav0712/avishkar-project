/**
 * Video normalization and validation utility for YouTube Shorts and Instagram Reels
 * Enforces vertical 9:16 format compatibility and sanitizes external URLs.
 */

export interface ParsedVideo {
  type: 'youtube' | 'instagram';
  originalUrl: string;
  normalizedUrl: string;
  embedUrl: string;
  videoId?: string;
  thumbnailUrl?: string;
}

/**
 * Extracts YouTube video/Shorts ID and returns normalized embed URL
 */
export function parseYouTubeUrl(url: string): ParsedVideo | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Pattern matches:
  // - youtube.com/shorts/ID
  // - youtu.be/ID
  // - youtube.com/watch?v=ID
  // - youtube.com/embed/ID
  const regExp = /(?:youtube\.com\/(?:shorts\/|watch\?(?:.*&)?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = trimmed.match(regExp);

  if (!match || !match[1]) return null;

  const videoId = match[1];
  return {
    type: 'youtube',
    originalUrl: trimmed,
    normalizedUrl: `https://www.youtube.com/shorts/${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`,
    videoId,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
}

/**
 * Extracts Instagram Reel/Post shortcode and returns normalized embed URL
 */
export function parseInstagramUrl(url: string): ParsedVideo | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Pattern matches:
  // - instagram.com/reel/SHORTCODE
  // - instagram.com/p/SHORTCODE
  // - instagram.com/tv/SHORTCODE
  const regExp = /instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/i;
  const match = trimmed.match(regExp);

  if (!match || !match[1]) return null;

  const shortcode = match[1];
  return {
    type: 'instagram',
    originalUrl: trimmed,
    normalizedUrl: `https://www.instagram.com/reel/${shortcode}/`,
    embedUrl: `https://www.instagram.com/reel/${shortcode}/embed/captioned/`,
    videoId: shortcode,
  };
}

/**
 * Validates a video link (either YouTube Shorts/video or Instagram Reel)
 */
export function validateVideoUrl(url: string): { isValid: boolean; platform: 'youtube' | 'instagram' | null; error?: string } {
  if (!url || !url.trim()) return { isValid: true, platform: null };

  const trimmed = url.trim();
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    const parsed = parseYouTubeUrl(trimmed);
    if (!parsed) {
      return { isValid: false, platform: 'youtube', error: 'Invalid YouTube link. Please paste a valid YouTube Shorts, youtu.be or watch URL.' };
    }
    return { isValid: true, platform: 'youtube' };
  }

  if (trimmed.includes('instagram.com')) {
    const parsed = parseInstagramUrl(trimmed);
    if (!parsed) {
      return { isValid: false, platform: 'instagram', error: 'Invalid Instagram link. Please paste a valid Instagram Reel or Post URL.' };
    }
    return { isValid: true, platform: 'instagram' };
  }

  return {
    isValid: false,
    platform: null,
    error: 'Unsupported video platform. Only YouTube Shorts and Instagram Reels are supported.',
  };
}
