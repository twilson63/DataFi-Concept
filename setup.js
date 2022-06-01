import Arweave from 'arweave'
import fs from 'fs'

const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
})

// load wallet

const w = await arweave.wallets.generate()
const addr = await arweave.wallets.jwkToAddress(w)
fs.writeFileSync('wallet.json', JSON.stringify(w))
await arweave.api.get(`mint/${addr}/${arweave.ar.arToWinston('100')}`)

// create contract
const source = fs.readFileSync('./contract.js', 'utf-8')
const initState = JSON.stringify({ count: 0, names: [] })

const tx = await arweave.createTransaction({ data: source })
tx.addTag('Content-Type', 'application/javascript')
tx.addTag('App-Name', 'SmartWeaveContractSource')
tx.addTag('App-Version', '0.3.0')

await arweave.transactions.sign(tx, w)
await arweave.transactions.post(tx)
await arweave.api.get('mine')
console.log(tx.id)