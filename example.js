import Arweave from 'arweave'
import * as sw from 'redstone-smartweave/esm'

const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
})

const smartweave = sw.SmartWeaveNodeFactory.memCachedBased(arweave).useArweaveGateway().build()

const contract = smartweave.contract('L1Z1XVUTVeLQGpztVZ4sC_G0lgDJTFDb-jwVHc2mH-A')

console.log(await contract.readState())
