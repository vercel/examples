import type { FC } from 'react'
import s from './loading-dots.module.css'

const LoadingDots: FC = () => {
  return (
    <span className={s.root}>
      <span className={s.dot} key={`dot_1`} />
      <span className={s.dot} key={`dot_2`} />
      <span className={s.dot} key={`dot_3`} />
    </span>
  )
}

export default LoadingDots
