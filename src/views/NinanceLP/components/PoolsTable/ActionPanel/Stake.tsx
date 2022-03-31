import Balance from 'components/Balance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import tokens from 'config/constants/tokens'
import useRefresh from 'hooks/useRefresh'
import useToast from 'hooks/useToast'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Modal, Text, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { getNinanceFramAddress } from 'utils/addressHelpers'
import { useERC20, useNinanceFarmContract, useNinanceLPContract } from 'hooks/useContract'
import { ConfirmationPendingContent } from 'components/TransactionConfirmationModal'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import { Pair } from '@pancakeswap/sdk'

import ActionTitle from './ActionTitle'
import StakeList from './StakeList'
import { ActionContainer, ActionContent, ActionTitles, StakeContent } from './styles'

const Staked = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const ninanceFarmContract = useNinanceFarmContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess, toastError } = useToast()
  const pairAdddress = useMemo(() => Pair.getAddress(tokens.usdt, tokens.era), [])
  const ninanceLPContract = useNinanceLPContract(pairAdddress)
  const erc20 = useERC20(pairAdddress)
  // const { fastRefresh } = useRefresh()
  const [stakeQuantity, setStakeQuantity] = useState(25)
  const [hasApprove, setHasApprove] = useState(false)

  const usePoolBalance = () => {
    const { fastRefresh } = useRefresh()
    const [balance, setBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0))

    useEffect(() => {
      const getPoolBalance = async () => {
        const result = await ninanceLPContract.balanceOf(account)
        setBalance(result)
      }

      getPoolBalance()
    }, [fastRefresh])

    return balance
  }

  const poolBalance = usePoolBalance()

  const displayPoolBalanceNum = useMemo(() => {
    return +formatBigNumberToFixed(poolBalance)
  }, [poolBalance])

  const [open, close] = useModal(
    <Modal title={t('Pending Confirmation')} headerBackground="gradients.cardHeader">
      <ConfirmationPendingContent pendingText="" />
    </Modal>,
    false,
    false,
  )

  const calcAmount = useCallback(() => {
    // -1 === max
    return stakeQuantity === -1 ? poolBalance : poolBalance.div(100).mul(stakeQuantity)
  }, [stakeQuantity, poolBalance])

  // useEffect(() => {
  //   const checkApprove = async () => {
  //     const amount = await erc20.allowance(account, getNinanceFramAddress())

  //     setHasApprove(+formatBigNumberToFixed(amount) >= +formatBigNumberToFixed(calcAmount()))
  //   }
  //   checkApprove()
  // }, [fastRefresh, account, calcAmount, erc20])

  const enabled = async () => {
    open()
    try {
      const amount = calcAmount()
      const approveTx = await callWithGasPrice(erc20, 'approve', [getNinanceFramAddress(), amount])
      const receipt = await approveTx.wait()
      if (receipt.status) {
        setHasApprove(true)
        toastSuccess(t('Success'))
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } finally {
      close()
    }
  }

  const confirm = async () => {
    open()
    try {
      const amount = calcAmount()
      const tx = await callWithGasPrice(ninanceFarmContract, 'deposit', ['0', amount])
      const receipt = await tx.wait()
      if (receipt.status) {
        setHasApprove(false)
        toastSuccess(t('Success'))
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } finally {
      close()
    }
  }

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <Flex flexDirection="column" flex={1}>
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <StakeContent>
          <Flex justifyContent="space-between">
            <ActionTitle>{t('NINANCE-LP Balance')}</ActionTitle>
            <Balance
              color="primary"
              bold
              fontSize="12px"
              decimals={5}
              value={displayPoolBalanceNum}
              unit="USDT/ERA-LP"
            />
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mt="12px">
            <ActionTitle>{t('Stake Quantity')}</ActionTitle>
            <Flex>
              <Button
                mr="2px"
                scale="xs"
                onClick={() => {
                  setStakeQuantity(25)
                  setHasApprove(false)
                }}
                variant={stakeQuantity === 25 ? 'primary' : 'tertiary'}
              >
                25%
              </Button>
              <Button
                mr="2px"
                scale="xs"
                onClick={() => {
                  setStakeQuantity(50)
                  setHasApprove(false)
                }}
                variant={stakeQuantity === 50 ? 'primary' : 'tertiary'}
              >
                50%
              </Button>
              <Button
                mr="2px"
                scale="xs"
                onClick={() => {
                  setStakeQuantity(75)
                  setHasApprove(false)
                }}
                variant={stakeQuantity === 75 ? 'primary' : 'tertiary'}
              >
                75%
              </Button>
              <Button
                mr="2px"
                scale="xs"
                onClick={() => {
                  setStakeQuantity(-1)
                  setHasApprove(false)
                }}
                variant={stakeQuantity === -1 ? 'primary' : 'tertiary'}
              >
                MAX
              </Button>
            </Flex>
          </Flex>
          <Flex justifyContent="space-between" mt="20px">
            <Button variant="primary" scale="sm" width="100%" onClick={hasApprove ? confirm : enabled}>
              {hasApprove ? t('Confirm') : t('Enabled')}
            </Button>
          </Flex>
        </StakeContent>
      </ActionContainer>
      <ActionContainer>
        <StakeList />
      </ActionContainer>
    </Flex>
  )
}

export default Staked
