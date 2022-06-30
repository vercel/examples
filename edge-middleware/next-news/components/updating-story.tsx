import { useEffect, useState } from 'react'
import { observe } from '../lib/get-item'
import Story from './story'

const UpdatingStory = (props) => {
  const [state, setState] = useState(props)

  useEffect(() => {
    return observe(props.id, (data) => setState(data))
  }, [props.id])

  return <Story {...state} />
}

export default UpdatingStory
