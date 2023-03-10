export const chainHex = {
  Fuji: '0xa869',
  AvalancheMainNet: '0xa86a',
  AvalancheLocal: '0xa870'
}

export const networkConfigs: any = {
  "0x1": { currencySymbol: "ETH", blockExplorerUrl: "https://etherscan.io/" },
  "0x3": { currencySymbol: "ETH", blockExplorerUrl: "https://ropsten.etherscan.io/" },
  "0x4": { currencySymbol: "ETH", blockExplorerUrl: "https://kovan.etherscan.io/" },
  "0x2a": { currencySymbol: "ETH", blockExplorerUrl: "https://rinkeby.etherscan.io/" },
  "0x5": { currencySymbol: "ETH", blockExplorerUrl: "https://goerli.etherscan.io/" },
  "0x539": {
    chainName: "Local Chain",
    currencyName: "ETH",
    currencySymbol: "ETH",
    rpcUrl: "http://127.0.0.1:7545",
  },
  "0xa86a": {
    chainId: 43114,
    chainName: "Avalanche Mainnet",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    blockExplorerUrl: "https://cchain.explorer.avax.network/",
  },
  "0xa869": {
    chainId: 43113,
    chainName: "Avalanche Fuji Testnet",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    blockExplorerUrl: "https://testnet.snowtrace.io/",
  },
  "0xa870": {
    chainId: 43112,
    chainName: "Avalanche Local Network",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    rpcUrl: "http://localhost:18344/ext/bc/C/rpc"
  },
  "0x38": {
    chainId: 56,
    chainName: "Smart Chain",
    currencyName: "BNB",
    currencySymbol: "BNB",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    blockExplorerUrl: "https://bscscan.com/",
  },
  "0x61": {
    chainId: 97,
    chainName: "Smart Chain - Testnet",
    currencyName: "BNB",
    currencySymbol: "BNB",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    blockExplorerUrl: "https://testnet.bscscan.com",
  },
  "0x89": {
    chainId: 137,
    chainName: "Polygon Mainnet",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    rpcUrl: "https://rpc-mainnet.maticvigil.com",
    blockExplorerUrl: "https://explorer-mainnet.maticvigil.com",
  },
  "0x13881": {
    chainId: 80001,
    chainName: "Mumbai",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    rpcUrl: "https://rpc-mumbai.matic.today",
    blockExplorerUrl: "https://rpc-mumbai.matic.today",
  }
};

export const getNativeByChain = (chain: string) => networkConfigs[chain]?.currencySymbol || "NATIVE";

export const getExplorer = (chain: string) => networkConfigs[chain]?.blockExplorerUrl;
