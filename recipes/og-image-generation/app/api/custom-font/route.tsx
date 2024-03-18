import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  const fontData = await fetch(
    new URL('../../../assets/TYPEWR__.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: 'white',
          height: '100%',
          width: '100%',
          fontSize: 100,
          fontFamily: 'Typewriter',
          paddingTop: '100px',
          paddingLeft: '50px',
        }}
      >
        Hello world!
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Typewriter',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  )
}
