import { daiTokenAbi, daiTokenAddress, daiExchangeAddress, addressFrom } from './constants.mjs';
import { sendSignedTx, web3 } from './utils.mjs';

const daiTokenContract = new web3.eth.Contract(
    JSON.parse(daiTokenAbi),
    daiTokenAddress
  );

  const TOKENS = web3.utils.toHex(2 * 10 ** 18); // 1 DAI

  const approveEncodedABI = daiTokenContract.methods.approve(daiExchangeAddress, TOKENS).encodeABI()

  const sendTransaction = async () => {
    const transactionNonce = await web3.eth.getTransactionCount(addressFrom)
    const transactionObject = {
        nonce: web3.utils.toHex(transactionNonce),
        gasLimit: web3.utils.toHex(6000000),
        gasPrice: web3.utils.toHex(10000000000),
        to: daiTokenAddress,
        from: addressFrom,
        data: approveEncodedABI
      };

    try{
        sendSignedTx(transactionObject)
    }catch(err){
        console.error(err)
    }
}

sendTransaction()

