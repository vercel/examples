import React from 'react'
import { useSession } from '@clerk/nextjs'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TokenCard } from './TokenCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'

function useInterval(callback, delay) {
  const savedCallback = React.useRef(callback)

  React.useLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    if (!delay) {
      return
    }
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

export const JWTDemo = () => {
  const session = useSession()
  const [swiperRef, setSwiperRef] = React.useState(null)
  const [tokens, setTokens] = React.useState([])

  const prependAndSlideToStart = React.useCallback(() => {
    if (!swiperRef) {
      return
    }
    swiperRef.slideTo(1, 0)
    swiperRef.update()
    swiperRef.slideTo(0)
  }, [swiperRef])

  const getToken = React.useCallback(async () => {
    try {
      const token = await session.getToken()
      if (tokens[0] !== token) {
        setTokens([token, ...tokens])
        prependAndSlideToStart()
      }
    } catch (e) {
      console.log('JWTDemo::getToken error', e)
    }
  }, [session, tokens, prependAndSlideToStart])

  React.useEffect(() => {
    getToken()
  }, [getToken])

  useInterval(async () => {
    void getToken()
  }, 1000)

  const tokenCount = tokens.length
  const generatedTokensText = `${tokenCount} ${
    tokenCount === 1 ? 'JWT' : 'JWTs'
  } generated since page load`

  return (
    <>
      <div className="-mx-2 relative">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{
            dynamicBullets: true,
            horizontalClass: 'swiper-pagination',
            clickable: true,
          }}
          navigation={{
            nextEl: '.next',
            prevEl: '.prev',
            hiddenClass: 'hidden',
            disabledClass: 'hidden',
          }}
          onSwiper={setSwiperRef}
          slidesPerView={1}
        >
          {tokens.map((token, index) => (
            <SwiperSlide key={token}>
              <TokenCard token={token} index={index} total={tokenCount} />
            </SwiperSlide>
          ))}
          <button
            id="newer_token"
            className="prev absolute z-10 bg-opacity-5 hover:bg-opacity-20 bg-gray-900 top-0 bottom-8 rounded-l-xl left-0 w-8"
          >
            <ChevronLeftIcon className="text-white filter drop-shadow" />
          </button>
          <button
            id="older_token"
            className="next absolute z-10 bg-opacity-5 hover:bg-opacity-20 bg-gray-900 top-0 bottom-8 rounded-r-xl right-0 w-8 "
          >
            <ChevronRightIcon className="text-white filter drop-shadow" />
          </button>
        </Swiper>
      </div>
      <div className="text-right text-gray-500 -mt-7">
        {generatedTokensText}
      </div>
    </>
  )
}
