import fs from 'fs'
//import Bundlr from '@bundlr-network/client';
import Arweave from 'arweave'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})


// load wallet
const w = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'))
const source = fs.readFileSync('./hello-contract.js', 'utf-8')

const tx = await arweave.createTransaction({ data: source })
tx.addTag('Content-Type', 'application/javascript')
tx.addTag('App-Name', 'SmartWeaveContractSource')
tx.addTag('App-Version', '0.3.0')
await arweave.transactions.sign(tx, w)
await arweave.transactions.post(tx)

/*
const bundlr = new Bundlr.default("http://node2.bundlr.network", "arweave", w);

// create contract
const source = fs.readFileSync('./hello-contract.js', 'utf-8')

const tags = [
  { name: 'Content-Type', value: 'application/javascript' },
  { name: 'App-Name', value: 'SmartWeaveContractSource' },
  { name: 'App-Version', value: '0.3.0' }
];

const tx = await bundlr.createTransaction(source, { tags })
await tx.sign()
await tx.upload()
*/

console.log(tx.id)