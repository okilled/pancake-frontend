import useRequest from '@ahooksjs/use-request'
import axios from 'axios'
import React from 'react'
import { useTranslation } from 'contexts/Localization'

import Cell from './Cell'

interface IAPY {
  account: string
}

const APY: React.FC<IAPY> = ({ account }) => {
  const baseUrl = process.env.REACT_APP_NINANCE_BASEURL

  const { t } = useTranslation()

  const { data } = useRequest(() => axios.get(`${baseUrl}/v1/farm/seven/total?address=${account}`), {
    pollingInterval: 5000,
    formatResult: (res) => {
      return res?.data?.data?.total
    },
  })

  return <Cell title={t('APY')} value={0} loading={false} account={account} unit="%" />
}

export default APY
