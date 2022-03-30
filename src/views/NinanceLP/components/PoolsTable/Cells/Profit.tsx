import useRequest from '@ahooksjs/use-request'
import axios from 'axios'
import Balance from 'components/Balance'
import React from 'react'
import styled from 'styled-components'
import { Box, Text, useMatchBreakpoints } from '@pancakeswap/uikit'

import BaseCell, { CellContent } from './BaseCell'

interface ProfitProps {
  account: string
}

const StyledCell = styled(BaseCell)`
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 100px;
  }
`

const Profit: React.FC<ProfitProps> = ({ account }) => {
  const baseUrl = process.env.REACT_APP_NINANCE_BASEURL

  const { isMobile } = useMatchBreakpoints()

  const { data: totalData } = useRequest(() => axios.get(`${baseUrl}/v1/farm/seven/total?address=${account}`), {
    pollingInterval: 5000,
    formatResult: (res) => {
      return res?.data?.data?.total
    },
  })

  if (!account) {
    return (
      <StyledCell role="cell">
        <CellContent>
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            最近的 ERA/USDT-LP 利润
          </Text>
          <Box mr="8px" height="32px">
            <Balance
              mt="4px"
              bold={!isMobile}
              fontSize={isMobile ? '14px' : '16px'}
              color="textDisabled"
              decimals={1}
              value={0}
              unit="USDT"
            />
          </Box>
        </CellContent>
      </StyledCell>
    )
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          最近的 ERA/USDT-LP 利润
        </Text>
        <Box mr="8px" height="32px">
          <Balance
            mt="4px"
            bold={!isMobile}
            fontSize={isMobile ? '14px' : '16px'}
            color="textDisabled"
            decimals={1}
            value={totalData ?? 0}
            unit="USDT"
          />
        </Box>
      </CellContent>
    </StyledCell>
  )
}

export default Profit
