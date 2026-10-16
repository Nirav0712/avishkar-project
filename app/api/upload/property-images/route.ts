import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// In-memory rate limiting map for uploads (IP -> timestamps)
const uploadRateLimit = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 25; // max 25 upload calls per 10 min

  const timestamps = uploadRateLimit.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false;
  }

  validTimestamps.push(now);
  uploadRateLimit.set(ip, validTimestamps);
  return true;
}

// Magic bytes validation for true image content
function validateImageMagicBytes(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 12) return false;

  const hex = buffer.subarray(0, 4).toString('hex').toLowerCase();

  // JPEG / JPG
  if (['.jpg', '.jpeg'].includes(ext)) {
    return hex.startsWith('ffd8ff');
  }

  // PNG
  if (ext === '.png') {
    return hex === '89504e47';
  }

  // WEBP (RIFF .... WEBP)
  if (ext === '.webp') {
    const isRiff = buffer.subarray(0, 4).toString('ascii') === 'RIFF';
    const isWebp = buffer.subarray(8, 12).toString('ascii') === 'WEBP';
    return isRiff && isWebp;
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    // 1. IP rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Upload rate limit exceeded. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    // 2. Parse FormData
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No image files provided' },
        { status: 400 }
      );
    }

    if (files.length > 8) {
      return NextResponse.json(
        { error: 'You can upload a maximum of 8 images per submission' },
        { status: 400 }
      );
    }

    // 3. Ensure target directory exists in public folder
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'submissions');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per file
    const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

    for (const file of files) {
      if (typeof file === 'string' || !file.name) {
        continue;
      }

      // Check size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the maximum allowed size of 5MB.` },
          { status: 400 }
        );
      }

      // Check extension
      const originalExt = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTS.includes(originalExt)) {
        return NextResponse.json(
          { error: `File "${file.name}" has an unsupported format. Allowed: JPG, PNG, WEBP.` },
          { status: 400 }
        );
      }

      // Read buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Validate magic bytes
      if (!validateImageMagicBytes(buffer, originalExt)) {
        return NextResponse.json(
          { error: `File "${file.name}" is corrupted or contains an invalid image signature.` },
          { status: 400 }
        );
      }

      // Generate cryptographically secure filename
      const safeRandomName = `${crypto.randomBytes(16).toString('hex')}${originalExt}`;
      const filePath = path.join(uploadDir, safeRandomName);

      // Write file to disk
      fs.writeFileSync(filePath, buffer);

      // Save public URL path
      uploadedUrls.push(`/uploads/submissions/${safeRandomName}`);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error: any) {
    console.error('Error in /api/upload/property-images:', error);
    return NextResponse.json(
      { error: 'Server error while processing image upload. Please try again.' },
      { status: 500 }
    );
  }
}
