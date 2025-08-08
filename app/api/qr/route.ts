import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  data:   z.string().min(1),
  size:   z.coerce.number().int().min(50).max(1000).default(200),
  color:  z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#000000'),
  bgColor:z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#FFFFFF'),
})

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const parse = schema.safeParse({
    data:   searchParams.get('data'),
    size:   searchParams.get('size'),
    color:  searchParams.get('color'),
    bgColor:searchParams.get('bgColor'),
  })

  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 })
  }

  const { data, size, color, bgColor } = parse.data

  // Redirect to the public GoQR endpoint (works like an image CDN)
  const url =
    `https://api.qrserver.com/v1/create-qr-code/` +
    `?data=${encodeURIComponent(data)}&size=${size}x${size}` +
    `&color=${color.slice(1)}&bgcolor=${bgColor.slice(1)}&format=png`

  return NextResponse.redirect(url)
}