import useRefresh from 'hooks/useRefresh'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import { useNinanceFarmContract } from 'hooks/useContract'

import Cell from './Cell'

interface ICellTotalPersonalStaking {
  account: string
}

const TotalPersonalStaking: React.FC<ICellTotalPersonalStaking> = ({ account }) => {
  const [personalStaking, setPersonalStaking] = useState(0)
  const ninanceFarmContract = useNinanceFarmContract()
  const { fastRefresh } = useRefresh()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchPersonalStaking = async () => {
      const res = await ninanceFarmContract.userInfo('0', account)
      setPersonalStaking(+formatBigNumberToFixed(res?.[0]))
    }

    fetchPersonalStaking()
  }, [fastRefresh, ninanceFarmContract, account])

  return <Cell title={t('Individual Staking')} value={personalStaking} loading={false} account={account} />
}

export default TotalPersonalStaking
