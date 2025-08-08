import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { z } from 'zod';

const schema = z.object({
  data: z.string().min(1),
  size: z.coerce.number().int().min(50).max(1000).default(200),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#000000'),
  bgColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#FFFFFF'),
});

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const data = form.get('data') as string;
  const size = Number(form.get('size'));
  const color = form.get('color') as string;
  const bgColor = form.get('bgColor') as string;
  const overlayImage = form.get('overlayImage') as File;

  // basic validation
  if (!data || !overlayImage) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // 1️⃣ fetch transparent QR code
  const qrRes = await fetch(
    `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      data
    )}&size=${size}x${size}&color=${color.slice(
      1
    )}&bgcolor=transparent&format=png`
  );
  const qrBuffer = Buffer.from(await qrRes.arrayBuffer());

  // 2️⃣ background image
  const bgBuffer = Buffer.from(await overlayImage.arrayBuffer());

  // 3️⃣ composite
  const composite = await sharp(bgBuffer)
    .composite([{ input: qrBuffer, top: 50, left: 50 }])
    .png()
    .toBuffer();

  return new NextResponse(composite, {
  headers: { 'Content-Type': 'image/png' },
});
}