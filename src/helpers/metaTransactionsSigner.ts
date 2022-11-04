import ethSigUtil from 'eth-sig-util';
import { BigNumber, Contract, ethers, utils } from 'ethers';
import { appConfig } from '../constants/appConfig';
import { contractsAbi } from '../constants/contractsAbis';

const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' }
];

const ForwardRequest = [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'gas', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'data', type: 'bytes' },
];

function getMetaTxTypeData(chainId: any, verifyingContract: any) {
    return {
        types: {
            EIP712Domain,
            ForwardRequest,
        },
        domain: {
            name: 'MinimalForwarder',
            version: '0.0.1',
            chainId,
            verifyingContract,
        },
        primaryType: 'ForwardRequest',
    }
};

async function signTypedData(signer: any, from: any, data: any) {
    // If signer is a private key, use it to sign
    if (typeof (signer) === 'string') {
        const privateKey = Buffer.from(signer.replace(/^0x/, ''), 'hex');
        return ethSigUtil.signTypedData(privateKey, { data });
    }

    // Otherwise, send the signTypedData RPC call
    // Note that hardhatvm and metamask require different EIP712 input
    const isHardhat = data.domain.chainId == 31337;
    const [method, argData] = isHardhat
        ? ['eth_signTypedData', data]
        : ['eth_signTypedData_v4', JSON.stringify(data)]
    return await signer.send(method, [from, argData]);
}

async function estimateExecutionFee(contractAddress: Contract, fn: string, params: any[]) {
    let gasLimit: BigNumber;
    try {
        gasLimit = await contractAddress.estimateGas[fn](...params);
    } catch (error: any) {
        throw new Error('Executed amount exceeds balance');
    }

    return gasLimit;
}

export async function buildRequest(forwarder: any, input: any, gas: any) {
    const nonce = await forwarder.getNonce(input.from).then((nonce: any) => nonce.toString());
    return { value: 0, gas: utils.formatUnits(gas, 'wei'), nonce, ...input };
}

export async function buildTypedData(forwarder: any, request: any) {
    const chainId = await forwarder.provider.getNetwork().then((n: any) => n.chainId);
    const typeData = getMetaTxTypeData(chainId, forwarder.address);
    return { ...typeData, message: request };
}

export async function signMetaTxRequest(
    provider: any,
    signer: any,
    requestData: {
        from: string,
        contract: Contract,
        contractInterface: ethers.utils.Interface,
        method: string,
        params: any
    }
) {
    const forwarder = new Contract(appConfig.forwarderContract, contractsAbi.forwarder, signer);
    const gasLimit = await estimateExecutionFee(requestData.contract, requestData.method, requestData.params);
    const request = await buildRequest(
        forwarder,
        {
            from: requestData.from,
            to: requestData.contract.address,
            data: requestData.contractInterface.encodeFunctionData(requestData.method, requestData.params)
        },
        gasLimit);
    const toSign = await buildTypedData(forwarder, request);
    const signature = await signTypedData(provider, requestData.from, toSign);
    return { signature, request };
}
