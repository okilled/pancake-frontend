import React from 'react'
import styled from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

import APY from '../Cells/APY'
import IndividualProportion from '../Cells/IndividualProportion'
import TotalCommunityStaking from '../Cells/TotalCommunityStaking'
import TotalPersonalStaking from '../Cells/TotalPersonalStaking'
import DividendInfo from './DividendInfo'
import Harvest from './Harvest'
import Stake from './Stake'

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: flex-start;
    flex-grow: 1;
    flex-basis: 0;
  }
`

type MediaBreakpoints = {
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  isXxl: boolean
}

interface ActionPanelProps {
  account: string
  expanded: boolean
  breakpoints: MediaBreakpoints
}

const InfoSection = styled(Box)`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  padding: 8px 8px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
    flex-basis: 200px;
  }
`

const ActionPanel: React.FC<ActionPanelProps> = ({ account, expanded, breakpoints }) => {
  const { t } = useTranslation()
  const { isXs, isSm, isMd } = breakpoints
  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        <DividendInfo />
        {(isXs || isSm || isMd) && <APY account={account} />}
        {(isXs || isSm || isMd) && <TotalPersonalStaking account={account} />}
        {(isXs || isSm || isMd) && <IndividualProportion account={account} />}

        {(isXs || isSm || isMd) && <TotalCommunityStaking account={account} />}
      </InfoSection>
      <ActionContainer>
        <Harvest />
        <Stake />
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
