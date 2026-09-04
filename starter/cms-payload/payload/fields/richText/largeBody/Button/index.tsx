'use client'

import React from 'react'
import { ElementButton } from 'payload/components/rich-text'
import Icon from '../Icon'

const baseClass = 'rich-text-large-body-button'

const ToolbarButton: React.FC<{ path: string }> = () => (
  <ElementButton className={baseClass} format="large-body">
    <Icon />
  </ElementButton>
)

export default ToolbarButton
