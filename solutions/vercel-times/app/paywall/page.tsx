import Link from 'next/link'
import Image from 'next/image'
import Logo from '../components/Logo'
import peopleImage from '../../public/pw-people.svg'

const Page = () => (
  <div>
    <div className="h-12 border-b flex items-center justify-center text-sm border-black select-none">
      <p>
        Looking for <Link href="/">verceltimes.com?</Link>{' '}
        <span className="underline font-semibold">
          <Link href="/">Continue here.</Link>
        </span>
      </p>
    </div>
    <section className="bg-orange-100 min-h-[calc(100vh_-_50px)]">
      <div className="max-w-7xl mx-auto grid grid-cols-12 px-4 relative">
        <div className="py-14 col-span-7">
          <h3 className="mb-10 font-extrabold font-serif text-3xl h-[48px]">
            <Logo />
          </h3>
          <h4 className="font-extrabold uppercase text-lg">SPECIAL OFFER</h4>
          <h2 className="pt-4 pb-10 font-extrabold font-serif text-5xl leading-snug">
            Unlimited access to all the journalism we offer.
          </h2>
          <p className="text-3xl">
            <span className="line-through text-gray-600 mr-2">$2</span>$2
            $0.50/week
          </p>
          <p className="pt-6 pb-8">
            Billed as €8 €2 every 4 weeks for the first year.
          </p>
          <button className="bg-neutral-700 text-white uppercase font-semibold rounded-sm py-3 px-20">
            Subscribe Now
          </button>
          <p className="text-xs pt-12 lg:pr-10 max-w-[450px]">
            Offer for a Basic Digital Access subscription is not open to current
            digital news subscribers. Your payment method will automatically be
            charged in advance the introductory offer rate every 4 weeks for 1
            year, and after 1 year the standard rate every 4 weeks. Your
            subscription will continue until you cancel. Cancellation takes
            effect at the end of your current billing period. The print edition
            of The New York Times, Games, Cooking or Wirecutter are not
            included. Taxes may apply. Offer terms are subject to change.
          </p>
        </div>
        <div className="col-span-5 flex flex-col justify-end absolute bottom-0 right-0 pb-12">
          <Image src={peopleImage} alt="Drawing of people talking" />
        </div>
      </div>
    </section>
    <section className="py-10 text-neutral-800">
      <div className="max-w-7xl mx-auto grid grid-cols-12 ">
        <div className="col-span-9 lg:pr-20">
          <h3 className="font-extrabold uppercase text-xl block">
            INTERESTED IN PRINT?
          </h3>

          <h2 className="max-w-[1000px] py-4 font-extrabold font-serif text-4xl leading-snug">
            Get the New York Times International paper delivered, plus the full
            digital experience.
          </h2>
          <p className="font-medium text-xl">
            Subscribers receive free All Access Digital with a Home Delivery
            subscription.
          </p>
        </div>
        <div className="col-span-3 flex justify-end flex-col">
          <p className="font-medium text-xl mb-10">
            Save 66% for 3 months. <br /> You can cancel anytime.
          </p>
          <button className="bg-neutral-700 text-white uppercase font-semibold rounded-md py-2.5 px-12 w-full">
            Find Offers
          </button>
        </div>
      </div>
    </section>
    <section className="py-8 text-neutral-200 bg-neutral-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 border-b pt-10 pb-20 border-neutral-500">
          <div className="col-span-6">
            <h3 className="pb-10 font-extrabold font-serif text-4xl text-white h-[40px] mb-10">
              <Logo />
            </h3>
            <p className="max-w-[500px] font-serif font-medium text-2xl text-white leading-snug">
              We believe that great journalism has the power to make each
              reader’s life richer and more fulfilling, and all of society
              stronger and more just.
            </p>
          </div>
          <div className="col-span-6 grid grid-cols-2 pt-20">
            <div>
              <ul className="space-y-3">
                <li className="font-bold">About</li>
                <li>The New York Times Company</li>
                <li>Privacy Policy</li>
                <li>Terms of Sale</li>
                <li>Group Subscriptions</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                <li className="font-bold">About</li>
                <li>The New York Times Company</li>
                <li>Privacy Policy</li>
                <li>Terms of Sale</li>
                <li>Group Subscriptions</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-row justify-end text-sm">
          ©2022 The New York Times Company
        </div>
      </div>
    </section>
  </div>
)

export default Page
