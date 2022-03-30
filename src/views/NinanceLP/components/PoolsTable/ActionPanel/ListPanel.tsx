import Balance from 'components/Balance'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { Button, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

import ActionTitle from './ActionTitle'
import { ActionContent, List, ListItem } from './styles'

interface ListPanelProps {
  dataSource: { value: string; date: number }[]
  title: string
  RenderTitleRight?: React.ReactNode
  value: number
  loading: boolean
  unit: string
}

const ListPanel: React.FunctionComponent<ListPanelProps> = ({
  dataSource = [],
  value,
  RenderTitleRight,
  title,
  loading,
  unit,
}) => {
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()

  if (loading) {
    return (
      <>
        <Flex justifyContent="space-between">
          <ActionTitle>{title}</ActionTitle>
          {RenderTitleRight}
        </Flex>

        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </>
    )
  }

  return (
    <>
      <Flex justifyContent="space-between">
        <ActionTitle>{title}</ActionTitle>
        {RenderTitleRight}
      </Flex>

      <ActionContent>
        <Flex pt="16px">
          <Balance lineHeight="1" color="#F5B420" bold fontSize="20px" decimals={5} value={value} unit={unit} />
        </Flex>
        {dataSource.length > 0 ? (
          <Flex pt="16px">
            <Button
              startIcon={
                <img
                  src="/images/arrow-dowm.svg"
                  width={12}
                  height={12}
                  alt="arrow"
                  style={{ transform: `rotate(${visible ? '0.5' : '0'}turn)`, marginRight: '4px' }}
                />
              }
              scale="xs"
              type="button"
              variant="text"
              onClick={() => {
                setVisible((v) => !v)
              }}
            >
              {visible ? t('Hide') : t('Show')}
            </Button>
          </Flex>
        ) : null}
      </ActionContent>

      <List visible={visible}>
        {dataSource.map((item) => {
          return (
            <ListItem key={item.value}>
              <Flex justifyContent="space-between" alignItems="center">
                <Text color="textSubtle" fontSize="14px">
                  {item.value}
                  {unit}
                </Text>
                <Text color="textSubtle" fontSize="14px">
                  {dayjs.unix(item?.date).format('YYYY-MM-DD')}
                </Text>
              </Flex>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

export default ListPanel
