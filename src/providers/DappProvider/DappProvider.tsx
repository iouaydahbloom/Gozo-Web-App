import React, { useCallback, useEffect, useState } from 'react';
import { chainHex } from '../../helpers/networks';
import dappContext, { ContractsMetadata } from './dappContext';
import { ERC20Metadata } from '../../models/assets/ERC20Asset';
import useAuthentication from '../../hooks/useAuthentication';
import useCloud from '../../hooks/useCloud';
import { cloudFunctionName } from '../../constants/cloudFunctionName';

const DappProvider: React.FC = ({ children }) => {
  const { user } = useAuthentication();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [defaultTokenMetadata, setDefaultTokenMetadata] = useState<ERC20Metadata | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [contractsMetadata, setContractsMetadata] = useState<ContractsMetadata>({
    tokenContractAddress: '',
    gameContractAddress: '',
    relayerContractAddress: '',
    forwarderContractAddress: '',
    tokenContractAbi: [],
    gameContractAbi: [],
    forwarderContractAbi: [],
    botWalletAddress: ''
  })
  const { run } = useCloud();

  const getDefaultTokenMetadata = useCallback(async () => {
    return run(cloudFunctionName.tokenDefaultMetadata, null)
      .then(result => {
        if (!result.isSuccess) return null;
        //@ts-ignore
        setDefaultTokenMetadata(result.data);
        return result.data;
      });
  }, [])

  const getAppContractsMetadata = useCallback(async () => {
    const web3DependenciesResult = await run(cloudFunctionName.web3Dependencies, null, res => res as ContractsMetadata)
    if (!web3DependenciesResult.isSuccess) return null;
    setContractsMetadata(web3DependenciesResult.data);
    return web3DependenciesResult.data;
  }, [])

  const initDapp = useCallback(async () => {
    return Promise.all([
      getDefaultTokenMetadata(),
      getAppContractsMetadata()
    ])
      .then(result => {
        if (result[0] && result[1]) {
          setIsReady(true);
        }
      })
  }, [])

  useEffect(() => {
    initDapp();
  }, [])

  useEffect(() => {
    setWalletAddress(user?.walletAddress ?? null)
  }, [user?.walletAddress])

  return (
    <dappContext.Provider
      value={{
        walletAddress,
        chainId: chainHex.Fuji,
        defaultTokenMetadata: defaultTokenMetadata,
        tokenContractAddress: contractsMetadata.tokenContractAddress,
        gameContractAddress: contractsMetadata.gameContractAddress,
        relayerContractAddress: contractsMetadata.relayerContractAddress,
        forwarderContractAddress: contractsMetadata.forwarderContractAddress,
        tokenContractAbi: contractsMetadata.tokenContractAbi,
        gameContractAbi: contractsMetadata.gameContractAbi,
        forwarderContractAbi: contractsMetadata.forwarderContractAbi,
        botWalletAddress: contractsMetadata.botWalletAddress,
        isReady,
        refresh: initDapp
      }}>
      {children}
    </dappContext.Provider>
  )
}

function useDapp() {
  const context = React.useContext(dappContext);
  if (context === undefined) {
    throw new Error('useDapp must be used within a DappProvider');
  }
  return context;
}

export { DappProvider, useDapp };
