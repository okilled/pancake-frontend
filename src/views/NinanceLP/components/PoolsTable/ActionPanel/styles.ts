import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'

export const ActionContainer = styled.div`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    margin-right: 12px;
    height: auto;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 32px;
    margin-right: 0;
  }
`

export const ActionTitles = styled.div`
  font-weight: 600;
  font-size: 12px;
`

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 16px 0;
`

export const List = styled.div<{ visible: boolean }>`
  max-height: 130px;
  overflow-y: auto;
  margin-top: 16px;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
`

export const ListItem = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  padding: 6px 16px 6px 0;
  border-radius: 20px;
  margin-bottom: 8px;
`

export const StakeContent = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  margin-top: 12px;
  border-radius: 10px;
  padding: 16px;
`

export const StakeListBox = styled.div`
  max-height: 350px;
  overflow-y: auto;
  margin-top: 12px;
`

export const StakeListItem = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  margin-bottom: 8px;
  border-radius: 10px;
  padding: 6px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const StyledFlex = styled(Flex)<{ visible: boolean }>`
  background: linear-gradient(90deg, #4269bb 0%, #8214fe 100%);
  border-radius: 32px;
  cursor: pointer;
`
export const StyledDiv = styled.div<{ active: boolean }>`
  padding: 0 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  border-radius: 32px;
  border: ${({ active }) => (active ? '1px solid #7645D9' : 'none')};
  color: ${({ active }) => (active ? '#7645D9' : '#fff')};
  background: ${({ active }) => (active ? '#fff' : 'transparent')};
`
