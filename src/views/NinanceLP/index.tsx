import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import {
  useFetchPublicPoolsData,
  usePools,
  useFetchUserPools,
  useFetchCakeVault,
  useFetchIfoPool,
  useVaultPools,
} from 'state/pools/hooks'
import { usePollFarmsPublicData } from 'state/farms/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { DeserializedPool } from 'state/types'
import { useUserPoolStakedOnly, useUserPoolsViewMode } from 'state/user/hooks'
import { usePoolsWithVault } from 'views/Home/hooks/useGetTopPoolsByApr'
import { ViewMode } from 'state/user/actions'
import { BIG_ZERO } from 'utils/bigNumber'
import Loading from 'components/Loading'
import PoolCard from './components/PoolCard'
import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
import BountyCard from './components/BountyCard'
import HelpButton from './components/HelpButton'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { getCakeVaultEarnings } from './helpers'

const Pools: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()

  return (
    <>
      <PageHeader>
        <img
          src={isMobile ? '/images/lp-bg-mobile.png' : '/images/lp-bg.png'}
          alt="Ninance-LP"
          width="100%"
          height="auto"
        />
      </PageHeader>
      <Page>
        <PoolsTable account={account} />
      </Page>
    </>
  )
}

export default Pools
