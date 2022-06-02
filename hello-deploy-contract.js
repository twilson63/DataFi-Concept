import fs from 'fs'
import Bundlr from '@bundlr-network/client';

// load wallet
const w = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'))
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

console.log(tx.id)