import { useMoralis, useWeb3Transfer } from 'react-moralis';
import { appConfig } from '../constants/appConfig';

const useBlockchainTransfer = (amount: string | number) => {
    const { Moralis, isWeb3Enabled, enableWeb3 } = useMoralis();
    const { fetch, error, isFetching } = useWeb3Transfer({
        amount: Moralis.Units.Token(amount != '' ? amount : 0, 18),
        receiver: appConfig.adminWallet,
        type: "erc20",
        contractAddress: appConfig.tokenContract
    })

    async function send() {
        if (!isWeb3Enabled) await enableWeb3();

        return fetch()
            .then(async (result: any) => {
                return result.wait();
            })
            .catch(error => {
                return error;
            })
    }

    return {
        send,
        isSending: isFetching,
        error
    }
}

export default useBlockchainTransfer;