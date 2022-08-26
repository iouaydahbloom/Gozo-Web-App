import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useERC20Assets from "../../../hooks/useERC20Assets";
import { ERC20Asset } from "../../../models/assets/ERC20Asset";
import CryptoTokenItem from "./CryptoTokenItem/CryptoTokenItem";

interface Props {
    chain?: string,
    setToken?: (item: any) => any
}

const CryptoTokens: React.FC<Props> = ({ chain, setToken }) => {

    const { assets } = useERC20Assets(chain);
    const { Moralis } = useMoralis();

    const renderItem = useCallback((item: ERC20Asset, index: number) => {
        return (
            <div key={`token_${index}`} onClick={() => (setToken ? setToken(item) : null)}>
                <CryptoTokenItem
                    name={item.name}
                    logo={item.logo ?? ''}
                    balance={parseFloat(Moralis.Units.FromWei(item.balance, parseInt(item.decimals)))}
                    symbol={item.symbol}
                />
            </div>
        )
    }, [chain])

    return (
        <>
            {
                assets && assets.map((asset, index) => {
                    return renderItem(asset, index)
                })
            }
        </>
    )
}

export default CryptoTokens;
