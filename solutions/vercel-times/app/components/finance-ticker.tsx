'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function* getMarketIndex() {
  const marketIndexNames = ['Dow', 'Nasdaq', 'S&P 500']
  let idx = 0
  while (true) {
    yield {
      name: marketIndexNames[idx],
      value: Math.random().toFixed(2),
      trend: Math.random() < 0.5,
    }
    idx = idx + 1
    if (idx > marketIndexNames.length - 1) {
      idx = 0
    }
  }
}

const genGetMarketIndex = getMarketIndex()

export const FinanceTicker = () => {
  const [index, setIndex] = useState({
    name: 'Nasdaq',
    value: '0,56',
    trend: true,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(genGetMarketIndex.next().value!)
    }, 4000)

    return () => clearInterval(timer)
  }, [index])

  return (
    <motion.div
      className="flex"
      key={index.value}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <span className="flex-1">{index.name}</span>
      <span className={index.trend ? 'text-[#3F893B]' : 'text-[#A61B1E]'}>
        {!index.trend && '-'}
        {index.value}%
        {index.trend ? <span>&#8593;</span> : <span>&#x2193;</span>}
      </span>
    </motion.div>
  )
}
