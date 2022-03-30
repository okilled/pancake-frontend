import useRefresh from 'hooks/useRefresh'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import { useNinanceFarmContract, useNinanceLPContract } from 'hooks/useContract'
import { NINANCE_ERA_USDT_PAIR } from 'config/constants'
import { getNinanceFramAddress } from 'utils/addressHelpers'

import Cell from './Cell'

interface ITotalCommunityStaking {
  account: string
}

const TotalCommunityStaking: React.FC<ITotalCommunityStaking> = ({ account }) => {
  const [communityStaking, setCommunityStaking] = useState(0)
  const ninanceFarmContract = useNinanceFarmContract()
  const { fastRefresh } = useRefresh()
  const { t } = useTranslation()

  const ninanceLPContract = useNinanceLPContract(NINANCE_ERA_USDT_PAIR)

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
