import React from 'react'
import { useTranslation } from 'contexts/Localization'

import Cell from './Cell'

interface IAPY {
  account: string
}

const APY: React.FC<IAPY> = ({ account }) => {
  const { t } = useTranslation()

  return <Cell title={t('APY')} value={0} loading={false} account={account} unit="%" />
}

export default APY
