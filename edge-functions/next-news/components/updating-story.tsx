import React from 'react'
import Story from './story'
import { observe } from '../lib/get-item'

export default class UpdatingStory extends React.Component<any, any> {
  unsubscribe: VoidFunction

  constructor(props) {
    super(props)
    this.state = props
  }

  componentDidMount() {
    this.unsubscribe = observe(this.props.id, (data) => this.setState(data))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    return <Story {...this.state} />
  }
}
