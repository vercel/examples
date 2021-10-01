import type { GetStaticPaths, GetStaticProps } from 'next'
import type {ParsedUrlQuery} from "querystring";
import type { Country } from '../types';

import Head from 'next/head'
import Image from 'next/image'
import { useMemo, useState } from 'react'

import shirt from "../public/shirt.png"
import map from "../public/map.svg"
import api from '../api';
import { PRODUCT_PRICE } from '../constants';
import { getParityPrice } from '../utils';

interface Params extends ParsedUrlQuery {
  country: Country;
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get the list of countries
  const countries = await api.parity.list();

  return {
    paths: countries.map(country => ({
      params: {
        country
      }
    })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<unknown, Params> = async ({params}) => {
  // Get parity for country
  const parity = await api.parity.fetch(params.country);

  return {
    props: {
      country: params.country,
      parity
    },
  };
};

export default function CountryPage({
  country,
  parity
}) {
  const [isParityEnabled, toggleParity] = useState<boolean>(false);
  const parityPrice = useMemo(() => getParityPrice(PRODUCT_PRICE, parity), [parity])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <Head>
        <title>Power parity pricing Example – Vercel</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="fixed h-screen w-screen overflow-hidden opacity-75 max-h-[900px]">
        <Image
          alt="World Map"
          src={map}
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center z-10 pt-8 sm:pt-0">
        <h1 className="text-3xl sm:text-5xl font-bold">Power parity pricing</h1>
        <p className="mt-4 sm:text-xl text-lg text-gray-700">
          Show localized pricing based on location headers
        </p>
        <a
          className="flex items-center mt-4 text-md sm:text-lg text-blue-500 hover:underline"
          href="https://vercel.com/docs/edge-network/headers#request-headers?utm_source=geo-ip-demo&utm_campaign=geo-ip-demo"
          target="_blank"
          rel="noopener noreferrer"
        >
          View headers documentation
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            stroke="currentColor"
            className="ml-1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            shapeRendering="geometricPrecision"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </a>
        <div className="lg:h-[512px] lg:w-[512px] h-[320px] w-[320px] -mb-40 lg:-mb-56">
          <Image
            alt={`Black shirt with white logo`}
            src={shirt}
            layout="responsive"
          />
        </div>
        <section className="border border-gray-300 bg-white rounded-lg shadow-lg mt-16 w-full max-w-[480px] hover:shadow-2xl transition pt-16 lg:pt-24">
          <div className="p-4 flex flex-col justify-center items-center border-b">
            <div className="flex justify-between w-full items-baseline">
              <div className="ml-4 mr-auto text-left flex flex-col">
                <h4 className="font-semibold text-xl">Alpha Black shirt</h4>
                <h5 className="text-gray-700">Limited edition</h5>
              </div>
              {isParityEnabled ? (
                <div className="flex flex-col items-start font-bold text-lg leading-none">
                  <span className="text-gray-500 text-sm line-through">USD {PRODUCT_PRICE}</span>
                  <span className="text-green-500">USD {parityPrice}</span>
                </div>
              ) : (
                <h4 className="font-bold text-lg">USD {PRODUCT_PRICE}</h4>
              )}
            </div>
          </div>
          <div className="p-4 gap-4 flex flex-col justify-center items-center border-b">
            <div className="bg-gray-50 text-gray-500 text-left py-2 px-4 rounded-md border-gray-200 border text-sm flex flex-col gap-4">
              <p>
                We noticed that you're from <b><Image width={16} height={12} src={`https://lipis.github.io/flag-icon-css/flags/4x3/${country.toLowerCase()}.svg`} /></b>. We are offering purchasing power parity pricing. If that is something that you need:
              </p>
              <div className="flex">
                <label className="inline-flex items-center font-semibold">
                  <input onChange={(event) => toggleParity(event.target.checked)} className="text-black-500 w-4 h-4 mr-2 focus:ring-black-400 focus:ring-opacity-25 border border-gray-300 rounded" type="checkbox" />
                  Activate {parity}% off with regional pricing
                </label>
              </div>
            </div>
            <button className="py-4 px-6 text-lg w-full bg-black text-white rounded-md hover:bg-gray-900" onClick={() => alert(`its yours for USD ${isParityEnabled ? parityPrice : 500}`)}>
              Buy now
            </button>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center w-full h-24 z-10">
        <a
          className="flex items-center justify-center text-gray-700"
          href="https://vercel.com?utm_source=geo-ip-demo&utm_campaign=geo-ip-demo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 283 64"
            aria-label="Vercel"
            className="h-4 ml-2"
          >
            <path
              fill="#000"
              d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0 73.9 64H0L36.95 0zm92.38 5-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
            />
          </svg>
        </a>
      </footer>
    </div>
  )
}
