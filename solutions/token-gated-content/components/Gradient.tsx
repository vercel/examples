import cn from 'clsx'
import styles from '../animation.module.css'

type GradientData = Record<string, string>

type GradientType = 'dark' | 'light'

const gradientData: Record<
  GradientType,
  [GradientData, GradientData, GradientData]
> = {
  light: [
    {
      '--color': 'var(--geist-cyan)',
      '--light-opacity': '0.4',
      '--dark-opacity': '0.5',
    },
    {
      '--color': 'var(--geist-violet)',
      '--light-opacity': '0.2',
      '--dark-opacity': '0.5',
    },
    {
      '--color': 'var(--geist-cyan)',
      '--light-opacity': '0.4',
      '--dark-opacity': '0.5',
    },
  ],
  dark: [
    {
      '--color': 'var(--geist-violet)',
      '--light-opacity': '0.1',
      '--dark-opacity': '0.5',
    },
    {
      '--color': 'var(--geist-highlight-pink)',
      '--light-opacity': '0.3',
      '--dark-opacity': '0.5',
    },
    {
      '--color': 'var(--geist-success)',
      '--light-opacity': '0.2',
      '--dark-opacity': '0.5',
    },
  ],
}

export const Gradient = ({ type }: { type: GradientType }) => {
  return (
    <div className={cn(styles['gradient-wrapper'])} role="region">
      <div
        className={cn(styles['gradient'], styles['gradient-1'])}
        style={gradientData[type][0]}
      />
      <div
        className={cn(styles['gradient'], styles['gradient-2'])}
        style={gradientData[type][1]}
      />
      <div
        className={cn(styles['gradient'], styles['gradient-3'])}
        style={gradientData[type][2]}
      />
    </div>
  )
}
