import Arweave from 'arweave'
import * as sw from 'redstone-smartweave/esm'

const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
})

const smartweave = sw.SmartWeaveNodeFactory.memCachedBased(arweave).useArweaveGateway().build()

const contract = smartweave.contract('xBCtl8df5iBc7txeHDU_rzXE43ha9AtrffLoLIIAR0E')

console.log(await contract.readState())
