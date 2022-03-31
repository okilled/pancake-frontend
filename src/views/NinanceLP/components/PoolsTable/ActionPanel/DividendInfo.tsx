import Balance from 'components/Balance'
import tokens from 'config/constants/tokens'
import useRefresh from 'hooks/useRefresh'
import React, { useEffect, useState } from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { getNinanceFramAddress } from 'utils/addressHelpers'
import { formatBigNumberToFixed } from 'utils/formatBalance'

import { ActionContainer, ActionTitles } from './styles'

const DividendInfo = () => {
  const { t } = useTranslation()
  const { fastRefresh } = useRefresh()
  const [eraValue, setEraValue] = useState(0)
  const [usdtValue, setUsdtValue] = useState(0)

  const era = useERC20(tokens.era.address)
  const usdt = useERC20(tokens.usdt.address)

  useEffect(() => {
    const fetchReserve = async () => {
      const eraBalance = await era.balanceOf(getNinanceFramAddress())
      const usdtBalance = await usdt.balanceOf(getNinanceFramAddress())

      setEraValue(+formatBigNumberToFixed(eraBalance))
      setUsdtValue(+formatBigNumberToFixed(usdtBalance))
    }

    fetchReserve()
  }, [era, usdt, fastRefresh])

  return (
    <ActionContainer>
      <Flex flexDirection={['row', 'row', 'column']}>
        <Flex flexDirection="column">
          <ActionTitles>
            <Flex alignItems="center">
              <img src="/images/lp-title-icon.png" alt="DividendInfoTitle" width="19px" height="auto" />
              <Text fontSize="12px" bold color="textSubtle" as="span" ml="2px">
                {t('Total Dividend Pool')}
              </Text>
            </Flex>
          </ActionTitles>
          <Flex flexDirection="column" mt="12px">
            <Balance lineHeight="1" color="primary" bold fontSize="18px" decimals={3} value={eraValue} unit="ERA" />
            <Balance
              lineHeight="1"
              color="primary"
              bold
              fontSize="18px"
              decimals={3}
              value={usdtValue}
              unit="USDT"
              mt="12px"
            />
          </Flex>
        </Flex>

        <Flex mt={[0, 0, '28px']}>
          <img src="/images/lp-dividend.png" alt="bg" />
        </Flex>
      </Flex>
    </ActionContainer>
  )
}

export default DividendInfo
