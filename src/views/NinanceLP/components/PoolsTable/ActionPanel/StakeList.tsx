import Balance from 'components/Balance'
import ninanceFarmAbi from 'config/abi/ninanceFarm.json'
import dayjs from 'dayjs'
import useRefresh from 'hooks/useRefresh'
import useToast from 'hooks/useToast'
import React, { useEffect, useMemo, useState } from 'react'
import { Button, Flex, Modal, Skeleton, Text, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useNinanceFarmContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { multicallv2 } from 'utils/multicall'
import { getNinanceFramAddress } from 'utils/addressHelpers'
import { ethers } from 'ethers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ConfirmationPendingContent } from 'components/TransactionConfirmationModal'

import useCountdown from './useCountdown'
import { ActionTitles, StakeListBox, StakeListItem } from './styles'

enum STATUS {
  'staking',
  'redeemable',
  'withdraw',
}

const CountDown = ({ countDown, status }: { countDown: number; status: any }) => {
  const { t } = useTranslation()
  const deadline = useMemo(() => dayjs().add(countDown, 's').format('YYYY-MM-DD HH:mm:ss'), [countDown])
  const { hour, minute, second } = useCountdown({
    deadline,
  })

  return (
    <div>
      {status === STATUS.staking
        ? t('Redeemable after %dateTime%', {
            dateTime: `${hour}:${minute}:${second}s`,
          })
        : t('Automatic renewal after %dateTime%', {
            dateTime: `${hour}:${minute}:${second}s`,
          })}
    </div>
  )
}

const StakeList = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const ninanceFarmContract = useNinanceFarmContract()
  const { fastRefresh } = useRefresh()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess, toastError } = useToast()

  const [list, setList] = useState<any>([])
  const [hide, setHide] = useState(true)
  const [loading, setLoading] = useState(true)

  const [open, close] = useModal(
    <Modal title={t('Pending Confirmation')} headerBackground="gradients.cardHeader">
      <ConfirmationPendingContent pendingText="" />
    </Modal>,
    false,
    false,
  )

  useEffect(() => {
    const fetchList = async () => {
      const nonce = await ninanceFarmContract.nonce(account)
      const nonceNum = nonce.toNumber()

      const calls = []
      const cur = Math.floor(new Date().getTime() / 1000)
      // const day = 86400
      const lock = 15 * 60 // 锁仓周期
      const renew = lock + 5 * 60 // 续期周期
      // const lock = day * 15 // 锁仓周期
      // const renew = lock + day // 续期周期

      for (let i = 0; i < nonceNum; i++) {
        calls.push({
          address: getNinanceFramAddress(),
          name: 'locked',
          params: [account, i],
        })
      }
      const listData = await multicallv2(ninanceFarmAbi, calls)

      setList(
        listData.map((item) => {
          const lockTime = Number(item?.[2].toNumber() || '0')
          const canRedeemable = (cur - lockTime) % renew > lock && (cur - lockTime) % renew < renew
          return {
            // isWithdraw true表示已赎回
            amount: ethers.utils.formatEther(item?.[1]),
            depositTime: dayjs.unix(item?.[2].toNumber()).format('YYYY-MM-DD'),
            status: item?.[0] ? STATUS.withdraw : canRedeemable ? STATUS.redeemable : STATUS.staking,
            countDown: canRedeemable ? renew - ((cur - lockTime) % renew) : lock - ((cur - lockTime) % renew),
          }
        }),
      )
      setLoading(false)
    }

    fetchList()
  }, [account, ninanceFarmContract, fastRefresh])

  const redeem = async (nonce: number) => {
    open()
    try {
      const tx = await callWithGasPrice(ninanceFarmContract, 'withdraw', ['0', [nonce]])

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

  if (loading) {
    return (
      <>
        <ActionTitles>
          <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
            {t('Personal Staking List')}
          </Text>
        </ActionTitles>
        <Flex flexDirection="column" justifyContent="center">
          <Skeleton width={180} height="32px" marginTop={14} />
        </Flex>
      </>
    )
  }

  return (
    <>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {t('Personal Staking List')}
        </Text>
      </ActionTitles>
      <Flex flexDirection="column" justifyContent="center">
        <StakeListBox>
          {list.map((item, index) => {
            return hide && index > 1 ? null : (
              <StakeListItem key={item.amount}>
                <Flex flexDirection="column">
                  <Text color="textSubtle" fontSize="14px">
                    <Balance color="primary" bold fontSize="12px" decimals={5} value={Number(item.amount)} unit="LP" />
                  </Text>
                  <Text color="textSubtle" fontSize="12px">
                    {item?.depositTime}
                  </Text>
                </Flex>
                <Text color="textSubtle" fontSize="12px">
                  {item.status === STATUS.withdraw ? null : (
                    <CountDown countDown={item.countDown} status={item.status} />
                  )}
                </Text>
                <Text color="textSubtle" fontSize="12px">
                  {item.status === STATUS.withdraw ? (
                    t('Redeemed')
                  ) : item.status === STATUS.redeemable ? (
                    <Button scale="xs" variant="secondary" onClick={() => redeem(index)}>
                      {t('Redeem')}
                    </Button>
                  ) : (
                    <Text fontSize="12px" color="#F5B420">
                      {t('Profiting')}
                    </Text>
                  )}
                </Text>
              </StakeListItem>
            )
          })}
        </StakeListBox>
        {list.length > 2 ? (
          <Button
            scale="xs"
            type="button"
            variant="text"
            onClick={() => {
              setHide((v) => !v)
            }}
            startIcon={
              <img
                src="/images/arrow-dowm.svg"
                width={12}
                height={12}
                alt="arrow"
                style={{ transform: `rotate(${hide ? '0' : '0.5'}turn)`, marginRight: '4px' }}
              />
            }
          >
            {hide ? t('Show') : t('Hide')}
          </Button>
        ) : null}
      </Flex>
    </>
  )
}

export default StakeList
