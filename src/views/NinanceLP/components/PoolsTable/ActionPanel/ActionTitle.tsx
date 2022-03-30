import React from 'react'
import { Text } from '@pancakeswap/uikit'
import { ActionTitles } from './styles'

const ActionTitle: React.FC = ({ children }) => {
  return (
    <ActionTitles>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {children}
      </Text>
    </ActionTitles>
  )
}

export default ActionTitle
