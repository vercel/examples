'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import layers from 'protomaps-themes-base'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function Map() {
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map>()

  useEffect(() => {
    let protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)

    if (container.current) {
      map.current = new maplibregl.Map({
        container: container.current,
        zoom: 1,
        maxZoom: 14,
        style: {
          version: 8,
          glyphs: 'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
          sources: {
            protomaps: {
              type: 'vector',
              tiles: [
                `https://api.protomaps.com/tiles/v2/{z}/{x}/{y}.pbf?key=${process.env.NEXT_PUBLIC_PROTOMAPS_API_KEY}`,
              ],
            },
          },
          layers: layers('protomaps', 'light'),
        },
      })

      map.current.addControl(
        new maplibregl.NavigationControl({
          showCompass: true,
          showZoom: true,
        }),
        'top-left'
      )
    }

    return () => {
      map.current?.remove()
      maplibregl.removeProtocol('pmtiles')
    }
  }, [])

  return <div ref={container} className="h-[30rem]"></div>
}
