import type { FC } from 'react'
import Image from 'next/image'

type ProductCardProps = { src: string; href: string; name: string }

const ProductCard: FC<ProductCardProps> = ({ src, href, name }) => (
  <li className="min-w-[120px]">
    <a className="flex flex-col" href={href}>
      <Image width={120} height={78} alt={name} src={src} />
      <p className="pt-3 whitespace-no-wrap text-sm font-semibold text-center no-underline hover:underline">
        {name}
      </p>
    </a>
  </li>
)

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <section className="flex flex-col w-full mx-auto py-7 justify-center bg-white">
        <p className="text-center">
          Save on Mac or iPad for college with education pricing. And get
          AirPods. Shop now →
        </p>
      </section>
      <div className="flex flex-col w-full mx-auto justify-center pt-20 pb-16 font-semibold leading-6 tracking-tight max-w-[900px]">
        <h1 className="text-5xl max-w-3xl">
          Store.
          <span className="ml-4 text-gray-500">
            The best way to buy the products you love.
          </span>
        </h1>
      </div>
      <section className="flex flex-col w-full mx-auto py-8  max-w-[900px]">
        <ul className="inline-flex gap-8 overflow-x-scroll">
          <ProductCard
            src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-mac-nav-202108?wid=400&hei=260&fmt=png-alpha&.v=1625783380000"
            name="Mac"
            href="https://apple.com/shop/buy-mac"
          />
          <ProductCard
            src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-iphone-nav-202108_GEO_US?wid=400&hei=260&fmt=png-alpha&.v=1628817965000"
            name="iPhone"
            href="https://apple.com/shop/buy-mac"
          />
          <ProductCard
            src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-ipad-nav-202108?wid=400&hei=260&fmt=png-alpha&.v=1625783381000"
            name="iPad"
            href="https://apple.com/shop/buy-mac"
          />

          <ProductCard
            src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-watch-nav-202108?wid=400&hei=260&fmt=png-alpha&.v=1625783378000"
            name="Apple Watch"
            href="https://apple.com/shop/buy-mac"
          />
          <ProductCard
            src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-airpods-nav-202108?wid=400&hei=260&fmt=png-alpha&.v=1627410283000"
            name="AirPods"
            href="https://apple.com/shop/buy-mac"
          />
          <ProductCard
            src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-airtags-nav-202108?wid=400&hei=260&fmt=png-alpha&.v=1625783380000"
            name="AirTag"
            href="https://apple.com/shop/buy-mac"
          />
          <ProductCard
            src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-appletv-nav-202108?wid=400&hei=260&fmt=png-alpha&.v=1625783378000"
            name="Apple TV"
            href="https://apple.com/shop/buy-mac"
          />
          <ProductCard
            src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-homepod-mini-nav-202108?wid=400&hei=260&fmt=png-alpha&.v=1625783386000"
            name="HomePod mini"
            href="https://apple.com/shop/buy-mac"
          />
        </ul>
      </section>
    </div>
  )
}
