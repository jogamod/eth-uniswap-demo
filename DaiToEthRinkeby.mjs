import { web3, sendSignedTx } from "./utils.mjs";
import { daiExchangeAddress, addressFrom, daiExchangeAbi } from "./constants.mjs";

const daiExchangeContract = new web3.eth.Contract(JSON.parse(daiExchangeAbi), daiExchangeAddress)

const TOKENS_SOLD = web3.utils.toHex(0.4 * 10 ** 18); // 0.4DAI
const MIN_ETH = web3.utils.toHex(5000000000000000); // 0.005ETH
const DEADLINE = 1582393932;

const tokenToEthEncodedABI = daiExchangeContract.methods
    .tokenToEthSwapInput(TOKENS_SOLD, MIN_ETH, DEADLINE)
    .encodeABI();


const sendTransaction = async () => {
    const transactionNonce = await web3.eth.getTransactionCount(addressFrom)
    const transactionObject = {
        nonce: web3.utils.toHex(transactionNonce),
        gasLimit: web3.utils.toHex(6000000),
        gasPrice: web3.utils.toHex(10000000000),
        to: daiExchangeAddress,
        from: addressFrom,
        data: tokenToEthEncodedABI
    };

    try {
        sendSignedTx(transactionObject)
    } catch (err) {
        console.error(err)
    }
}

sendTransaction()