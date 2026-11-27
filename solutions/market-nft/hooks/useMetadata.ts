import { metadataByMetadataId, ParsedDataReturn } from "@mintbase-js/data";
import { MetadataByMetadataIdQueryResult } from "@mintbase-js/data/lib/api/metadataByMetadataId/metadataByMetadataId.types";
import { useQuery } from "react-query";
import { TokenListData } from "../types/data.types";
import { numberToYocto } from "../utils/numbers";

const mapMetadata = (
  metadata: ParsedDataReturn<MetadataByMetadataIdQueryResult>
): Partial<TokenListData> => {
  const firstListing = metadata?.data?.listings[0];

  if (!firstListing || firstListing === null) {
    return {
      amountAvailable: 0,
      tokensTotal: 0,
      price: "0",
      tokenId: undefined,
    };
  }

  const { price } = firstListing;

  return {
    amountAvailable: metadata?.data?.simpleSaleCount.aggregate.count,
    tokensTotal: metadata?.data?.tokenCount.aggregate.count,
    price: price ? numberToYocto(price) : "0",
    tokenId: firstListing.token?.token_id,
    nftContractId: firstListing.token.nft_contract_id,
    marketId: firstListing.market_id,
    title: metadata?.data?.metadata?.[0].title,
    description: metadata?.data?.metadata?.[0].description,
    coverImage: metadata?.data?.metadata?.[0].media,
    minter: metadata?.data?.minters?.[0].minter,
  };
};

const useMetadata = ({
  metadataId,
}: {
  metadataId: string;
}): Partial<TokenListData> => {
  const { isLoading, data: metadata } = useQuery(
    ["metadataByMetadataId", metadataId],
    () => metadataByMetadataId(metadataId),
    {
      select: mapMetadata,
    }
  );

  return { ...metadata, isLoading };
};

export { useMetadata };
