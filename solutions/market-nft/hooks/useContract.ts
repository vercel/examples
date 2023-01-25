import { ParsedDataReturn, storeNfts } from '@mintbase-js/data'
import { StoreNftsResult } from '@mintbase-js/data/lib/api/storeNfts/storeNfts.types'
import { useQuery } from 'react-query'

const mapStoreNfts = (data: ParsedDataReturn<StoreNftsResult>) => ({
  nftsData: data?.data?.mb_views_nft_metadata_unburned,
})

const useContracts = (store: string | string[]) => {

  const { isLoading, error, data } = useQuery(
    ['storeNfts', store],
    () => storeNfts(store, true),
    {
      retry: false,
      refetchOnWindowFocus: false,
      select: mapStoreNfts,
      enabled: !!(store || (store && store.length > 0)),
    }
  )

  return { ...data, error, loading: isLoading }
}

export { useContracts }
