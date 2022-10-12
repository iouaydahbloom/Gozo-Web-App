import { Contract, getDefaultProvider, utils } from 'ethers';
import { DefenderRelaySigner, DefenderRelayProvider } from 'defender-relay-client/lib/ethers';

const appID = 'hQwYL4jhKhSNcWfDx0dqAeMlO9vHDiXXxw6Tpi48';
const domain = 'https://guzd7kiuk1du.usemoralis.com:2053/server';
const rpcProviderUrl = 'https://api.avax-test.network/ext/bc/C/rpc';
const adminWalletAddress = '0x78F733d968E0b369Ac4a959916C12D770a4bFeF4';
const tokenContractAddress = '0x45d49DeA525065778Ca52c9fB3c39edf51C3Fb89';
const forwarderContractAddress = '0xDEA4a094D07aaF097B9fbA684161732C7A4475f1';
const forwarderContractABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "gas", "type": "uint256" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct MinimalForwarder.ForwardRequest", "name": "req", "type": "tuple" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "name": "execute", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }], "name": "getNonce", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "gas", "type": "uint256" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct MinimalForwarder.ForwardRequest", "name": "req", "type": "tuple" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "name": "verify", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }];
const tokenContractABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "initialSupply",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "initialSupplyRecipient",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "defaultOwner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "forwarder",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "previousAdminRole",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "newAdminRole",
                "type": "bytes32"
            }
        ],
        "name": "RoleAdminChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleRevoked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "payer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TransferedToOwner",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            }
        ],
        "name": "getRoleAdmin",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "hasRole",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "forwarder",
                "type": "address"
            }
        ],
        "name": "isTrustedForwarder",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "renounceRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "revokeRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_trustedForwarder",
                "type": "address"
            }
        ],
        "name": "setTrustedForwarder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "transferToOwner",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "trustedForwarder",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "versionRecipient",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

async function estimatePreRelay(request) {
    console.log('--- Estimating Prerelay request transaction fees ---');
    const gasLimit = (parseInt(request.gas)).toString();
    const provider = getDefaultProvider(rpcProviderUrl);
    return Promise.all([
        provider.getGasPrice(),
        fetch(`${domain}/functions/token_price?_ApplicationId=${appID}`).then(res => res.json()),
        fetch(`${domain}/functions/avax_price?_ApplicationId=${appID}`).then(res => res.json()),
        fetch(`${domain}/functions/crypto_transaction_extra_fee?_ApplicationId=${appID}`).then(res => res.json())
    ]).then(result => {
        const [gasPrice, tokenPriceResult, avaxPriceResult, extraFeeResult] = result;
        if (!gasPrice || !tokenPriceResult.result.data || !avaxPriceResult.result.data || !extraFeeResult.result.data) {
            console.log('Error in Estimating prerelay: Missing important values to calculate fees');
            throw new Error('Failed to estimate transaction fees');
        }
        const transactionFee = parseInt(utils.formatUnits(gasLimit, 'wei')) * parseFloat(utils.formatEther(gasPrice));
        const fees = (parseFloat(extraFeeResult.result.data) + (parseFloat(avaxPriceResult.result.data.usdPrice) * transactionFee)) / parseFloat(tokenPriceResult.result.data.usdPrice);
        console.log('Estimating prerelay success with fee', Math.ceil(fees));
        return Math.ceil(fees);
    })
}

async function preRelay(signer, request) {
    console.log('--- Prerelay started ---');
    try {
        //estimate fees to transfer the amount to admin
        const tokenToPay = await estimatePreRelay(request);
        const tokenContract = new Contract(tokenContractAddress, tokenContractABI, signer);
        //transfer tokens as gas fees from the user wallet to the treasury wallet
        const tx = await tokenContract.transferFrom(
            request.from,
            adminWalletAddress,
            utils.parseUnits(tokenToPay.toString(), 18),
            { gasLimit: utils.formatUnits(60000, 'wei') }
        );
        const receipt = await tx.wait();
        if (!receipt.status) {
            throw new Error(`Not Enought tokens to pay for your transaction`);
        }
        console.log('Prerelay success with transaction receipt', receipt);
        return receipt;
    } catch (error) {
        console.log('Error in prerelay', error);
        throw new Error('Failed to pay transaction fees, try again later');
    }
}

async function relay(forwarder, request, signature) {
    console.log('--- Relay started ---');
    try {
        console.log('relay validation request and sign ', request, signature);
        const valid = await forwarder.verify(request, signature);
        if (!valid) throw new Error(`Invalid request`);
        const gasLimit = (parseInt(request.gas) + 50000).toString();
        const tx = await forwarder.execute(request, signature, { gasLimit });
        console.log('relay validation success with tx hash', tx.hash);
        return tx;
    } catch (error) {
        console.log('Error in relay: ', error);
        throw new Error('Failed to relay transaction');
    }
}

async function handler(event) {
    if (!event.request || !event.request.body) throw new Error(`Missing payload`);
    const { request, signature, skipFees, isEstimating } = event.request.body;
    if (isEstimating) {
        return { fees: await estimatePreRelay(request) };
    }

    const credentials = { ...event };
    const provider = new DefenderRelayProvider(credentials);
    const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });
    const forwarder = new Contract(forwarderContractAddress, forwarderContractABI, signer);

    if (!skipFees) await preRelay(signer, request);

    const tx = await relay(forwarder, request, signature);
    console.log(`Sent meta-tx: ${tx.hash}`);
    const receipt = await tx.wait();
    return {
        relayReceipt: receipt
    }
}

export default {
    handler,
    relay
}