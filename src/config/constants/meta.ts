import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'NinanceSwap',
  description: 'NinanceSwap',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('NinanceSwap')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('NinanceSwap')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('NinanceSwap')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('NinanceSwap')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('NinanceSwap')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('NinanceSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('NinanceSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('NinanceSwap')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('NinanceSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('NinanceSwap')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('NinanceSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('NinanceSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('NinanceSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('NinanceSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('NinanceSwap')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('NinanceSwap')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('NinanceSwap')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('NinanceSwap')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('NinanceSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('NinanceSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('NinanceSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('NinanceSwap')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('NinanceSwap')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Your Profile')} | ${t('NinanceSwap')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('NinanceSwap')}`,
      }
    default:
      return null
  }
}
