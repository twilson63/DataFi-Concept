import Arweave from 'arweave'
import fs from 'fs'

const CONTRACT_SRC = 'vjHkpnnhdcC-wliEG-RhYiizUrC3wQJdpuDA2yMrd2w'
const w = JSON.parse(fs.readFileSync('./wallet.json'))

const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
})

const indexHTML = fs.readFileSync('./app/index.html', 'utf-8')
// create html file
const index = await arweave.createTransaction({ data: indexHTML })
index.addTag('Content-Type', 'text/html')
await arweave.transactions.sign(index, w)
await arweave.transactions.post(index)

// Create Contract
const tx = await arweave.createTransaction({ data: createPathManifest(index.id) })
tx.addTag('Content-Type', 'application/x.arweave-manifest+json')
tx.addTag('App-Name', 'SmartWeaveContract')
tx.addTag('App-Version', '0.3.0')
tx.addTag('Contract-Src', CONTRACT_SRC)
tx.addTag('Init-State', JSON.stringify({ count: 0, names: [] }))

await arweave.transactions.sign(tx, w)
await arweave.transactions.post(tx)
await arweave.api.get('mine')
console.log(tx.id)

function createPathManifest(id) {
  return `
{
  "manifest": "arweave/paths",
  "version": "0.1.0",
  "index": {
    "path": "index.html"
  },
  "paths": {
    "index.html": {
      "id": "${id}"
    }
  }
}
  `
}