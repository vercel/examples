import Image from 'next/image'

export interface Product {
  id: string
  title: string
  description: string
  image: string
  price: string
  stock: number
}

interface Props {
  product: Product
  blur: boolean
}

export function ProductCard({ product, blur }: Props) {
  return (
    <div className={`w-full max-w-xl mx-auto ${blur && 'blur'}`}>
      <div className="ml-14 lg:ml-24 -mb-40 lg:-mb-56">
        <Image
          className="pointer-events-none"
          alt={product.title}
          src={product.image}
          width="440"
          height="440"
          layout="responsive"
        />
      </div>
      <section className="border border-gray-300 bg-white rounded-lg shadow-lg mt-16 w-full hover:shadow-2xl transition pt-16 lg:pt-24">
        <div className="p-4 flex flex-col justify-center items-center border-b">
          <div className="flex justify-between w-full items-baseline">
            <div className="ml-4 mr-auto text-left flex flex-col">
              <h4 className="font-semibold text-xl">{product.title}</h4>
              <h5 className="text-gray-700">{product.description}</h5>
            </div>
            <h4 className="font-bold text-lg">USD {product.price}</h4>
          </div>
        </div>
      </section>
    </div>
  )
}
