const chains: any = {
  "0x1": "ETH",
  "0x89": "MATIC",
  "0x38": "BNB",
  "0xa86a": "AVAX",
  "0xa869": "AVAX"
};

export const getNativeByChain = (chain: string) => chains[chain];
