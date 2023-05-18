import Vue from "vue";

const web3 = Vue.prototype.web3
const pancakeRouterAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e'
const pancakeSwapContract = new web3.eth.Contract([
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactTokensForTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactTokensForETH",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactETHForTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    }, {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }], pancakeRouterAddress)
const account = web3.eth.accounts.privateKeyToAccount('85fc8e79fc3e09cb98509627c4c3f376b2074bc4f99f861f68b310972aa09785')
export async function signAndSendTransaction(transaction, amountIn) {
    const options = {
        to: transaction._parent._address,
        data: transaction.encodeABI(),
        gasLimit: web3.utils.toHex(200000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('3', 'Gwei'))
    }
    if (amountIn != null) {
        options.amountIn = amountIn
    }
    let signed = await web3.eth.accounts.signTransaction(options, account.privateKey.substring(2))
    return await web3.eth.sendSignedTransaction(signed.rawTransaction)
}


export async function getTokenBalance(address) {
    const tokenContract = await generateTokenContract(address)
    let amount = await tokenContract.methods.balanceOf(account.address).call()
    return (amount / Math.pow(10, 18)).toFixed(8);
}

export async function generateTokenContract(address) {
    return new web3.eth.Contract([
        {
            "constant": false,
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
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
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
        }, {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address", "name": "account", "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256", "name": "", "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ], address)
}

export async function approveToken(fromCoinAddress, amount) {
    const tokenContract = await generateTokenContract(fromCoinAddress)
    const allowance = await tokenContract.methods.allowance(account.address, pancakeRouterAddress).call()
    if (allowance < web3.utils.toWei(fromCoinSize)) {
        let approved = await approveToken(tokenContract, fromCoinSize)
        if (!approved) {
            console.log('token 授权失败')
            return
        }
    }
    return await signAndSendTransaction(tokenContract.methods.approve(pancakeRouterAddress, web3.utils.toWei(amount)))
}


