export interface TokenListData {
  price: string;
  amountAvailable: number;
  tokensTotal: number;
  tokenId: string;
  isLoading: boolean;
  marketId?: string;
  tokenKey?: string;
  nftContractId?: string;
  title?: string;
  description?: string;
  coverImage?: string;
  minter?: string;
}