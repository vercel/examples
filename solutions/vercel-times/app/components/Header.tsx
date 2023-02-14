import dayjs from 'dayjs'
import { FinanceTicker } from './finance-ticker'
import { Logo } from './logo'

export const Header = () => (
  <header>
    <div className="flex flex-row px-1.5 text-sm py-2">
      <div className="flex flex-row flex-1">
        <ul className="flex flex-0 flex-row space-x-4 items-center">
          <li className="h-6 w-6 rounded-md flex items-center justify-center hover:bg-neutral-200 pointer">
            <svg viewBox="0 0 16 16" width={16} height={16}>
              <rect x="1" y="3" fill="#333" width="14" height="2"></rect>
              <rect x="1" y="7" fill="#333" width="14" height="2"></rect>
              <rect x="1" y="11" fill="#333" width="14" height="2"></rect>
            </svg>
          </li>
          <li className="h-6 w-6 rounded-md flex items-center justify-center hover:bg-neutral-200 pointer">
            <svg viewBox="0 0 16 16" width={16} height={16}>
              <path
                fill="#333"
                d="M11.3,9.2C11.7,8.4,12,7.5,12,6.5C12,3.5,9.5,1,6.5,1S1,3.5,1,6.5S3.5,12,6.5,12c1,0,1.9-0.3,2.7-0.7l3.3,3.3c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L11.3,9.2zM6.5,10.3c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C10.3,8.6,8.6,10.3,6.5,10.3z"
              ></path>
            </svg>
          </li>
        </ul>
      </div>
      <nav className="flex flex-1 items-center justify-center space-x-4 text-2xs font-medium uppercase">
        <a href="/" className="font-bold">
          U.S.
        </a>
        <a href="/">International</a>
        <a href="/">Canada</a>
        <a href="/">Español</a>
        <a href="/">中文</a>
      </nav>
      <div className="flex flex-row flex-1 justify-end items-center">
        <ul className="flex flex-0 flex-row space-x-4 h-[29px]">
          <li className="py-1.5 px-4 rounded-md bg-slate-500 hover:bg-slate-400 text-white uppercase font-extrabold text-[0.6875rem] flex items-center">
            Subscribe for $0.50/Week
          </li>
          <li className="py-1.5 px-4 rounded-md bg-slate-500 text-white uppercase font-extrabold text-[0.6875rem] flex items-center hover:bg-slate-400">
            Log In
          </li>
        </ul>
      </div>
    </div>
    <div className="relative py-2 border-gray-200 border-b grid items-center grid-cols-12">
      <div className="col-span-2 text-xs">
        <span className="block font-semibold">
          {dayjs().format('dddd, MMMM D, YYYY')}
        </span>
        <span className="block">Today’s Paper</span>
      </div>
      <div className="col-span-8 text-center flex items-center justify-center h-full pb-1 -m-1">
        <Logo height={48} />
      </div>
      <div className="col-span-2 text-xs flex flex-col items-end">
        <div>
          <div className="flex flex-row space-x-2">
            <div>
              <svg width="18" height="18" viewBox="0 0 32 33">
                <title>Today&apos;s weather: 30°C with Partly sunny</title>
                <g fill="none" fillRule="evenodd">
                  <path
                    d="M19.001 10.401c0 4.949-4.051 9-9 9s-9-4.051-9-9 4.051-9 9-9 9 4.051 9 9"
                    fill="#F4D864"
                  ></path>

                  <path
                    d="M19.001 10.401c0 4.949-4.051 9-9 9s-9-4.051-9-9 4.051-9 9-9 9 4.051 9 9z"
                    stroke="#F4D864"
                    strokeWidth="2"
                  ></path>
                  <path
                    d="M6.608 31.349c-2.893 0-5.246-2.328-5.246-5.189 0-2.863 2.353-5.193 5.246-5.193h1.033l.408-1.002c.723-3.771 4.066-6.51 7.951-6.51 3.881 0 7.223 2.738 7.945 6.51l.207 1.07 1.109-.059c3.033 0 5.377 2.328 5.377 5.184 0 2.861-2.353 5.189-5.248 5.189H6.608z"
                    fill="#fff"
                  ></path>
                  <path
                    d="M16.001 14.704c3.281 0 6.107 2.309 6.717 5.494l.402 2.092 2.131-.064.09-.006.051-.004c2.203 0 3.996 1.768 3.996 3.941 0 2.174-1.793 3.941-3.996 3.941H6.606c-2.201 0-3.994-1.767-3.994-3.941s1.793-3.941 3.959-3.941l.109.008h.029l2.16.096.406-2.121c.613-3.186 3.439-5.495 6.726-5.495m0-2.5c-4.566 0-8.357 3.236-9.178 7.523-.072-.004-.142-.012-.217-.012-3.588 0-6.494 2.883-6.494 6.441 0 3.561 2.906 6.441 6.494 6.441h18.785c3.59 0 6.496-2.881 6.496-6.441 0-3.559-2.906-6.441-6.496-6.441-.072 0-.145.008-.217.012-.821-4.287-4.614-7.523-9.173-7.523"
                    fill="#ccc"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="font-bold">30°C</div>
            <div> 30°</div>
            <div className="text-gray-600"> 22°</div>
          </div>
          <div className="mt-1">
            <FinanceTicker />
          </div>
        </div>
      </div>
    </div>
    <nav className="border-b border-black pb-0.5">
      <ul className="py-2 flex flex-row text-xs font-medium space-x-3 items-center justify-center border-b border-black">
        <li>World</li>
        <li>U.S.</li>
        <li>Politics</li>
        <li>N.Y.</li>
        <li>Business</li>
        <li>Opinion</li>
        <li>Science</li>
        <li>Health</li>
        <li>Sports</li>
        <li>Arts</li>
        <li>Books</li>
        <li>Style</li>
        <li>Food</li>
        <li>Travel</li>
        <li>Magazine</li>
        <li>Real Estate</li>
        <li className="text-gray-400 w-0">|</li>
        <li>Cooking</li>
        <li>The Athletic</li>
        <li>Wirecutter</li>
        <li>Games</li>
      </ul>
    </nav>
    <div className="flex text-xs items-center justify-center font-semibold py-4">
      <ul className="flex flex-row space-x-4 items-center">
        <li className="text-red-500 text-xs font-bold">LIVE</li>
        <li>
          World Cup Updates{' '}
          <span className="text-red-600 text-2xs ml-1">5m ago</span>
        </li>
        <li>
          Russia-Ukraine War{' '}
          <span className="text-red-600 text-2xs ml-1">37m ago</span>
        </li>
        <li>
          U.S. Midterms{' '}
          <span className="text-red-600 text-2xs ml-1">37m ago</span>
        </li>
      </ul>
    </div>
  </header>
)
