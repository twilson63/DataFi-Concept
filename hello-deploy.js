import fs from 'fs'
import Bundlr from '@bundlr-network/client';

// load wallet
const w = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'))
const bundlr = new Bundlr.default("http://node2.bundlr.network", "arweave", w);
const CONTRACT_SRC = 'aQDpiUKHPatpkvqLB3sYuXqN8zwSNUVwy8ctsIoj4cc'

const indexHTML = fs.readFileSync('./hello/dist/index.html', 'utf-8')
const indexJS = fs.readFileSync('./hello/dist/assets/index.daa38f35.js', 'utf-8')

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
    "assets/index.daa38f35.js": {
      "id": `${indexJSTx.id}`
    }
  }
}
)
// create contract and use path manifest as data
const appContract = await bundlr.createTransaction(app, {
  tags: [
    { name: 'Content-Type', value: 'application/x.arweave-manifest+json' },
    { name: 'App-Name', value: 'SmartWeaveContract' },
    { name: 'App-Version', value: '0.3.0' },
    { name: 'Contract-Src', value: CONTRACT_SRC },
    { name: 'Init-State', value: JSON.stringify({ count: 0 }) }
  ]
})

await appContract.sign()
await appContract.upload()