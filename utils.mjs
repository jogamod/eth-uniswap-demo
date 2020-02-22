import Web3 from 'web3';
import EthTx from 'ethereumjs-tx'
import { privKey, infuraURL } from './constants.mjs'

export const web3 = new Web3(
    new Web3.providers.HttpProvider(infuraURL)
)

export const sendSignedTx = (transactionObject) =>{
    let transaction = new EthTx.Transaction(transactionObject, {'chain':'rinkeby'})
    const privateKey = Buffer.from(privKey, "hex")
    transaction.sign(privateKey)
    const serializedEthTx = transaction.serialize().toString("hex")
    web3.eth.sendSignedTransaction(`0x${serializedEthTx}`)
        .on('receipt', console.log);
}