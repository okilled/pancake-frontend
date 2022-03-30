import Balance from 'components/Balance'
import React from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, Text, useMatchBreakpoints } from '@pancakeswap/uikit'

import BaseCell from './BaseCell'

interface CellProps {
  value: number
  title: string
  loading: boolean
  account: string
  unit?: string
}

const StyledCell = styled(BaseCell)`
  flex: 1;
  padding: 8px 0;

  ${({ theme }) => theme.mediaQueries.md} {
    flex: 2 0 100px;
    padding: 24px 8px;
  }
`

const CellContent = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-height: 40px;
  ${Text} {
    line-height: 1;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
`

const Cell: React.FC<CellProps> = ({ value, title, loading, account, unit }) => {
  const { isXs, isSm, isMd } = useMatchBreakpoints()

  if (!account) {
    return (
      <StyledCell role="cell">
        <CellContent>
          <Text fontSize={isXs || isSm || isMd ? '16px' : '14px'} color="textSubtle" textAlign="left">
            {title}
          </Text>
          <Flex height="20px" alignItems="center">
            <Balance fontSize="16px" value={0} decimals={4} color="primary" unit={unit} />
          </Flex>
        </CellContent>
      </StyledCell>
    )
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize={isXs || isSm || isMd ? '16px' : '14px'} color="textSubtle" textAlign="left">
          {title}
        </Text>
        {loading ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <Flex height="20px" alignItems="center">
            <Balance fontSize="16px" value={value ?? 0} decimals={4} color="primary" unit={unit} />
          </Flex>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default Cell
