import styled from 'styled-components'
import React, { useState } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'

import ActionPanel from './ActionPanel/ActionPanel'
import APY from './Cells/APY'
import IndividualProportion from './Cells/IndividualProportion'
import NameCell from './Cells/NameCell'
import Profit from './Cells/Profit'
import TotalCommunityStaking from './Cells/TotalCommunityStaking'
import TotalPersonalStaking from './Cells/TotalPersonalStaking'

interface PoolRowProps {
  account: string
}

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: space-between;
  }
`

const PoolRow: React.FC<PoolRowProps> = ({ account }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(true)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <>
      <StyledRow role="row">
        <NameCell />
        <Profit account={account} />
        {isLargerScreen && <APY account={account} />}
        {isLargerScreen && <TotalPersonalStaking account={account} />}
        {isLargerScreen && <IndividualProportion account={account} />}
        {isLargerScreen && <TotalCommunityStaking account={account} />}
      </StyledRow>
      <ActionPanel account={account} expanded={expanded} breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
    </>
  )
}

export default PoolRow
