import { daiExchangeAbi, daiExchangeAddress, addressFrom, infuraURL } from './constants.mjs';
import { sendSignedTx, web3 } from './utils.mjs';

const daiExchangeContract = new web3.eth.Contract(JSON.parse(daiExchangeAbi), daiExchangeAddress)

const ETH_SOLD = web3.utils.toHex(100000000000000000); // 0.1ETH
const MIN_TOKENS = web3.utils.toHex(0.2 * 10 ** 18); // 0.2 DAI
const DEADLINE = 1682393932;

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

sendTransaction()