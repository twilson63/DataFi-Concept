const Arweave = require('arweave')
const { SmartWeaveNodeFactory } = require('redstone-smartweave')
const fs = require('fs')
const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
})

const smartweave = SmartWeaveNodeFactory
  .memCachedBased(arweave)
  .useArweaveGateway()
  .build()

const w = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'))
const contract = smartweave.contract('xBCtl8df5iBc7txeHDU_rzXE43ha9AtrffLoLIIAR0E').connect(w)

// contract.writeInteraction({
//   function: 'hello',
//   name: 'Beep'
// }).then(res => console.log(res))

//arweave.api.get('mine')
contract.readState().then(res => console.log(res.state))