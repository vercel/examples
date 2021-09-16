import { ButtonHTMLAttributes, FC } from 'react'
import styles from './styles.module.css'

export const Page: FC = (p) => (
  <div className={styles.container}>
    <div className={styles.card} {...p} />
  </div>
)

export const Code: FC = (p) => <code className={styles.inlineCode} {...p} />

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (p) => (
  <button className={styles.button} {...p} />
)
