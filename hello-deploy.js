import fs from 'fs'
import Bundlr from '@bundlr-network/client';
import Arweave from 'arweave'
//import { SmartWeaveNodeFactory } from 'redstone-smartweave'

// Configure Smartweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

// js file
const js = 'dd9fca7d'
// load wallet
const w = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'))
const bundlr = new Bundlr.default("http://node2.bundlr.network", "arweave", w);
const CONTRACT_SRC = 'fIPQ4DbZnQ5GX0aomCU8WkMzTDR-guKvdCR7yg6zA7E'

const indexHTML = fs.readFileSync('./hello/dist/index.html', 'utf-8')
const indexJS = fs.readFileSync(`./hello/dist/assets/index.${js}.js`, 'utf-8')

// upload index.html
const indexHtmlTx = await bundlr.createTransaction(indexHTML, {
  tags: [
    { name: 'Content-Type', value: 'text/html' }
  ]
})
await indexHtmlTx.sign()
await indexHtmlTx.upload()

// upload index.js
const indexJSTx = await bundlr.createTransaction(indexJS, {
  tags: [
    { name: 'Content-Type', value: 'application/javascript' }
  ]
})
await indexJSTx.sign()
await indexJSTx.upload()

const app = JSON.stringify({
  manifest: "arweave/paths",
  version: "0.1.0",
  index: {
    path: "index.html"
  },
  paths: {
    "index.html": {
      "id": `${indexHtmlTx.id}`
    },
    [`assets/index.${js}.js`]: {
      "id": `${indexJSTx.id}`
    }
  }
}
)

// const result = await sw.createContract.deployFromSourceTx({
//   initState: JSON.stringify({ count: 0 }),
//   srcTxId: CONTRACT_SRC,

// })

// create contract and use path manifest as data
// const appContract = await arweave.createTransaction(app, {
//   tags: [
//     { name: 'Content-Type', value: 'application/x.arweave-manifest+json' },
//     { name: 'App-Name', value: 'SmartWeaveContract' },
//     { name: 'App-Version', value: '0.3.0' },
//     { name: 'Contract-Src', value: CONTRACT_SRC },
//     { name: 'Init-State', value: JSON.stringify({ count: 0 }) }
//   ]
// })

// await arweave.transactions.sign(appContract)
// await arweave.transactions.post(appContract)

const appContract = await arweave.createTransaction({ data: app })
appContract.addTag('Content-Type', 'application/x.arweave-manifest+json')
appContract.addTag('App-Name', 'SmartWeaveContract')
appContract.addTag('App-Version', '0.3.0')
appContract.addTag('Contract-Src', CONTRACT_SRC)
appContract.addTag('Init-State', JSON.stringify({ count: 0 }))

await arweave.transactions.sign(appContract, w)
await arweave.transactions.post(appContract)

console.log(appContract.id)