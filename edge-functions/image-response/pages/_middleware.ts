import type { NextFetchEvent } from 'next/server'

export function middleware(ev: NextFetchEvent) {
  ev.respondWith(fetch('https://pbs.twimg.com/profile_images/1252531684353998848/6R0-p1Vf_200x200.jpg'))
}