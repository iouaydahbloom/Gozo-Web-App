import { useWeb3Transfer } from 'react-moralis';
import { appConfig } from '../constants/appConfig';
import useBlockchain from "./useBlockchain";

const useBlockchainTransfer = (amount: string | number) => {
    const { helpers, isWeb3Enabled, enableWeb3 } = useBlockchain();
    const { fetch, error, isFetching } = useWeb3Transfer({
        amount: helpers.Units.Token(amount != '' ? amount : 0, 18),
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