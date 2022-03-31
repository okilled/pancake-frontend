import tokens from 'config/constants/tokens'
import useRefresh from 'hooks/useRefresh'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import { useNinanceFarmContract, useNinanceLPContract } from 'hooks/useContract'
import { getNinanceFramAddress } from 'utils/addressHelpers'
import { Pair } from '@pancakeswap/sdk'

import Cell from './Cell'

interface ITotalCommunityStaking {
  account: string
}

const TotalCommunityStaking: React.FC<ITotalCommunityStaking> = ({ account }) => {
  const [communityStaking, setCommunityStaking] = useState(0)
  const ninanceFarmContract = useNinanceFarmContract()
  const { fastRefresh } = useRefresh()
  const { t } = useTranslation()
  const ninanceLPContract = useNinanceLPContract(Pair.getAddress(tokens.usdt, tokens.era))

  useEffect(() => {
    const fetchCommunityStaking = async () => {
      const res = await ninanceLPContract.balanceOf(getNinanceFramAddress())
      setCommunityStaking(+formatBigNumberToFixed(res))
    }

    fetchCommunityStaking()
  }, [fastRefresh, ninanceLPContract, account, ninanceFarmContract])

  return <Cell title={t('Total Community Staking')} value={communityStaking} loading={false} account={account} />
}

export default TotalCommunityStaking
