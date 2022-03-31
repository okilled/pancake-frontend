import tokens from 'config/constants/tokens'
import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { TokenImage } from 'components/TokenImage'

import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 2;
  flex-direction: row;
  padding-left: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
    flex: 1 0 150px;
  }
`

const NameCell: React.FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledCell role="cell">
      <TokenImage token={tokens.era} mr="8px" width={40} height={40} />

      <CellContent>
        <Text bold={!isMobile} small={isMobile} color="primary">
          ERA/USDT-LP
        </Text>
        {!isMobile && (
          <Text fontSize="12px" color="textSubtle">
            {t('Stake ERA/USDT-LP to get rewards')}
          </Text>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
