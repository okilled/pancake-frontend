import tokens from 'config/constants/tokens'
import useRefresh from 'hooks/useRefresh'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import { useNinanceFarmContract, useNinanceLPContract } from 'hooks/useContract'
import { getNinanceFramAddress } from 'utils/addressHelpers'
import { Pair } from '@pancakeswap/sdk'

import Cell from './Cell'

interface IIndividualProportion {
  account: string
}

const IndividualProportion: React.FC<IIndividualProportion> = ({ account }) => {
  const { t } = useTranslation()
  const [proportion, setProportion] = useState(0)

  const ninanceFarmContract = useNinanceFarmContract()
  const ninanceLPContract = useNinanceLPContract(Pair.getAddress(tokens.usdt, tokens.era))

  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchPersonalStaking = async () => {
      const person = await ninanceFarmContract.userInfo('0', account)
      const all = await ninanceLPContract.balanceOf(getNinanceFramAddress())

      setProportion(+formatBigNumberToFixed(person?.[0]) / +formatBigNumberToFixed(all))
    }

    fetchPersonalStaking()
  }, [fastRefresh, ninanceFarmContract, account, ninanceLPContract])

  return <Cell title={t('Individual Ratio')} value={proportion} loading={false} account={account} unit="%" />
}

export default IndividualProportion
