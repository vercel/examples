// import dynamic from 'next/dynamic'
// The usage of dynamic like this is temporal
import dynamic from 'next/dist/client/components/shared/dynamic'

const components = {
  A: dynamic(() => import('./a.server')),
}

export default components
