import blue from '@/public/images/product/shirt-blue.avif'
import black from '@/public/images/product/shirt-black.avif'
import white from '@/public/images/product/shirt-white.avif'
import type { StaticImageData } from 'next/image'

export const images = [black, white, blue]

export const colorToImage: Record<string, StaticImageData> = {
  Black: black,
  White: white,
  Blue: blue,
}
