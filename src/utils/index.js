import Vue from "vue";

const web3 = Vue.prototype.web3
const currentAccount = Vue.prototype.currentAccount
const ethereum = Vue.prototype.ethereum
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

export async function signAndSendTransaction(transaction, amountIn) {
    const options = {
        from: currentAccount,
        to: transaction._parent._address,
        data: transaction.encodeABI(),
        gas: web3.utils.toHex(200000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('3', 'Gwei'))
    }
    if (amountIn != null) {
        options.value = amountIn
    }
    const msgHash = web3.utils.sha3(JSON.stringify(options))
    web3.eth.sendTransaction(options).then((ret) => {
        console.log(ret)
    })
    // let signed = await web3.eth.accounts.signTransaction(options, currentAccount.privateKey.substring(2))
    // ethereum.request({
    //     method: 'eth_sendRawTransaction',
    //     params: signed.rawTransaction
    // }).then((transactionHash) => {
    //     console.log('transactionHash: ' + transactionHash);
    // })
    // .catch(console.error);
}

export async function sendTransaction(signed) {
    return await web3.eth.sendSignedTransaction(signed.rawTransaction)
}

export async function swap(fromCoinAddress, toCoinAddress, fromCoinSize) {
    const amountIn = web3.utils.toWei(fromCoinSize)  // 将要花费0.1个bnb
    const amountOutMin = 0 // 将要获得x个busd， x = （1-滑点%） * 本应可兑换的个数，100 * 100%-1% = 99 =  amountOutMin  0相当于100%滑点
    const deadline = Math.floor(Date.now() / 1000) + 60 * 2;
    if (fromCoinAddress == '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c') {
        // 用bnb买其他币走此方法
        tx = await signAndSendTransaction(pancakeSwapContract.methods.swapExactETHForTokens(
            amountOutMin,
            [fromCoinAddress, toCoinAddress],
            currentAccount,
            deadline
        ), amountIn)
    } else if (toCoinAddress == '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c') {
        // 其他币兑换bnb
        tx = await signAndSendTransaction(pancakeSwapContract.methods.swapExactTokensForETH(
            amountIn,
            amountOutMin,
            [fromCoinAddress, toCoinAddress],
            account.address,
            deadline
        ))
    } else {
        //其他币兑换其他币
        tx = await signAndSendTransaction(pancakeSwapContract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amountIn,
            amountOutMin,
            [fromCoinAddress, toCoinAddress],
            account.address,
            deadline
        ))
    }
}

export async function signTransaction(transaction, amountIn) {
    const options = {
        to: transaction._parent._address,
        data: transaction.encodeABI(),
        gasLimit: web3.utils.toHex(200000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('3', 'Gwei'))
    }
    if (amountIn != null) {
        options.amountIn = amountIn
    }
    let signed = await web3.eth.accounts.signTransaction(options, currentAccount.privateKey.substring(2))
    return signed
}


export async function getDefaultBalance() {
    let balance = await web3.eth.getBalance(currentAccount)
    return balance / Math.pow(10, 18)
}

export async function getTokenBalance(address) {
    const tokenContract = await generateTokenContract(address)
    let amount = await tokenContract.methods.balanceOf(currentAccount).call()
    return (amount / Math.pow(10, 18)).toFixed(8);
}

export async function tokenName(tokenContract) {
    let name = await tokenContract.methods.name.call().call()
    name = name.replaceAll(' ', '').replaceAll('Token', '')
    return name
}

export async function generateTokenContract(address) {
    return new web3.eth.Contract([
        {
            "constant": true,
            "inputs": [

            ],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
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
    const allowance = await tokenContract.methods.allowance(currentAccount, pancakeRouterAddress).call()
    if (allowance < web3.utils.toWei(fromCoinSize)) {
        let approved = await approveToken(tokenContract, fromCoinSize)
        if (!approved) {
            console.log('token 授权失败')
            return
        }
    }
    return await signAndSendTransaction(tokenContract.methods.approve(pancakeRouterAddress, web3.utils.toWei(amount)))
}


