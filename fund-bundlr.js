import Bundlr from '@bundlr-network/client';
import fs from 'fs'

const w = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'))
const bundlr = new Bundlr.default("http://node2.bundlr.network", "arweave", w);

// const price = await bundlr.getPrice(1000000)

// console.log(
//   (await bundlr.fund(price))
// )
console.log(
  (await bundlr.getLoadedBalance()).toString()
)