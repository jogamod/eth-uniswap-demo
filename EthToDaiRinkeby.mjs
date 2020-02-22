import Web3 from 'web3';
import EthTx from 'ethereumjs-tx'
import { daiExchangeAbi, daiExchangeAddress } from './constants.mjs';

const addressFrom = "0x44dDd4501eE8c55AAF80658E50a67Ac4ae8Faa79"
const privKey = "92cb180d402b4b95807e91392f2fac9c73fb30a98445169381af7bc2486da0e8"
const infuraURL = "https://rinkeby.infura.io/v3/c6807416c10d4086977491f564e48de3"

const web3 = new Web3(
    new Web3.providers.HttpProvider(infuraURL)
)

const daiExchangeContract = new web3.eth.Contract(JSON.parse(daiExchangeAbi), daiExchangeAddress)

const ETH_SOLD = web3.utils.toHex(50000000000000000); // 0.05ETH
const MIN_TOKENS = web3.utils.toHex(0.2 * 10 ** 18); // 0.2 DAI
const DEADLINE = 1582393932;

const exchangeEncodedABI = daiExchangeContract.methods.ethToTokenSwapInput(MIN_TOKENS, DEADLINE).encodeABI()

const sendTransaction = async () => {
    const transactionNonce = await web3.eth.getTransactionCount(addressFrom)
    const transactionObject = {
        nonce: web3.utils.toHex(transactionNonce),
        gasLimit: web3.utils.toHex(6000000),
        gasPrice: web3.utils.toHex(10000000000),
        to: daiExchangeAddress,
        from: addressFrom,
        data: exchangeEncodedABI,
        value: ETH_SOLD
      };

    try{
        sendSignedTx(transactionObject)
    }catch(err){
        console.error(err)
    }
}

const sendSignedTx = (transactionObject) =>{
    let transaction = new EthTx.Transaction(transactionObject, {'chain':'rinkeby'})
    const privateKey = Buffer.from(privKey, "hex")
    transaction.sign(privateKey)
    const serializedEthTx = transaction.serialize().toString("hex")
    web3.eth.sendSignedTransaction(`0x${serializedEthTx}`)
        .on('receipt', console.log);
}

sendTransaction()