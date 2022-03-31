import useRequest from '@ahooksjs/use-request'
import axios from 'axios'
import Balance from 'components/Balance'
import useRefresh from 'hooks/useRefresh'
import useToast from 'hooks/useToast'
import React, { useEffect, useState } from 'react'
import { Button, Flex, Heading, Modal, Text, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useNinanceFarmContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import { ethers } from 'ethers'
import { ConfirmationPendingContent } from 'components/TransactionConfirmationModal'

import ActionTitle from './ActionTitle'
import ListPanel from './ListPanel'
import { ActionContainer, ActionContent, Divider, StyledDiv, StyledFlex } from './styles'

enum SYMBOL {
  'USDT' = 1,
  'ERA' = 2,
}

const HarvestAction = () => {
  const baseUrl = process.env.REACT_APP_NINANCE_BASEURL
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastSuccess, toastError } = useToast()
  const ninanceFarmContract = useNinanceFarmContract()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { fastRefresh } = useRefresh()
  const [pendingEra, setPendingEra] = useState(0)
  const [pendingU, setPendingU] = useState(0)
  const [priceSymbol, setPriceSymbol] = useState(SYMBOL.USDT)
  const [loading, setLoading] = useState(false)

  const { data: totalData, refresh: refreshTotalData } = useRequest(
    () => axios.get(`${baseUrl}/v1/farm/total?address=${account}&priceSymbol=${priceSymbol}`),
    {
      pollingInterval: 5000,
      formatResult: (res) => {
        return res?.data?.data?.total
      },
    },
  )

  const { data: listlData, refresh: refreshListData } = useRequest(
    () => axios.get(`${baseUrl}/v1/farm/list?address=${account}&priceSymbol=${priceSymbol}&page=1&size=9999`),
    {
      pollingInterval: 5000,
      formatResult: (res) => {
        return res?.data?.data?.list.map((item) => {
          return {
            value: item?.amount,
            date: item?.createdAt,
          }
        })
      },
    },
  )

  const [open, close] = useModal(
    <Modal title={t('Pending Confirmation')} headerBackground="gradients.cardHeader">
      <ConfirmationPendingContent pendingText="" />
    </Modal>,
    false,
    false,
  )

  useEffect(() => {
    const fetchPending = async () => {
      const res = await ninanceFarmContract.pendingReward('0', account)
      // setPendingEra(+formatBigNumberToFixed(res))
      setPendingU(+formatBigNumberToFixed(res))
    }

    if (account) {
      fetchPending()
    }
  }, [fastRefresh, account, ninanceFarmContract, callWithGasPrice])

  if (!account) {
    return (
      <Flex flexDirection="column" flex={1}>
        <ActionContainer>
          <Flex justifyContent="space-between">
            <Flex alignItems="center" flex={1}>
              <img
                alt="USDT"
                src="/images/lp-token2.svg"
                style={{ width: 24, height: 24, marginRight: 8, marginLeft: -5 }}
              />
              <ActionTitle>{t('Claimable Assets')}</ActionTitle>
            </Flex>
          </Flex>

          <Flex alignItems="flex-end">
            <Flex pt="18px" flexDirection="column" flex={1}>
              <Text fontSize="12px" bold color="textSubtle">
                USDT
              </Text>
              <Heading>0</Heading>
            </Flex>
          </Flex>
        </ActionContainer>
      </Flex>
    )
  }

  const claim = async () => {
    open()
    try {
      const tx = await callWithGasPrice(ninanceFarmContract, 'deposit', ['0', ethers.utils.parseEther('0')])
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Success'))
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } finally {
      close()
    }
  }

  return (
    <Flex flexDirection="column" flex={1}>
      <ActionContainer>
        <Flex justifyContent="space-between">
          <Flex alignItems="center" flex={1}>
            <img
              alt="USDT"
              src="/images/lp-token2.svg"
              style={{ width: 24, height: 24, marginRight: 8, marginLeft: -5 }}
            />
            <ActionTitle>{t('Claimable Assets')}</ActionTitle>
          </Flex>
        </Flex>

        <Flex alignItems="flex-end">
          <Flex pt="18px" flexDirection="column" flex={1}>
            <Text fontSize="12px" bold color="textSubtle">
              USDT
            </Text>
            <Balance lineHeight="1" color="#F5B420" bold fontSize="20px" decimals={5} value={pendingU} />
          </Flex>
          <Button scale="sm" type="button" variant="secondary" style={{ fontSize: '14px' }} onClick={claim}>
            {t('Claim')}
          </Button>
        </Flex>
      </ActionContainer>
      <ActionContainer>
        <ListPanel
          loading={loading}
          dataSource={listlData ?? []}
          title={t('Total Claimed %symbol%', { symbol: priceSymbol === SYMBOL.USDT ? 'USDT' : 'ERA' })}
          value={totalData ?? 0}
          unit={priceSymbol === SYMBOL.USDT ? 'USDT' : 'ERA'}
        />
      </ActionContainer>
    </Flex>
  )
}

export default HarvestAction
