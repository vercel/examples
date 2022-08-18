import dynamic from 'next/dynamic'

const components = {
  A: dynamic(() => import('./a.server'), {
    suspense: true,
  }),
}

export default components
