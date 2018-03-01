import {
  getContracts,
  ITrustMeshContracts,
} from '@keymesh/trustmesh'

import Web3Type from 'web3'
const Web3: Web3Type = require('web3')

import proteus = require('wire-webapp-proteus')
const ed2curve = require('ed2curve')

// const web3: Web3Type = new (Web3 as any)('https://rinkeby.infura.io')
const web3: Web3Type = new (Web3 as any)('http://localhost:8545')

export async function main() {
  const contracts = await getContracts(web3)
  const identity = await contracts.identities.getIdentity('0x71E51Ad59b0C1F628d65C051Bc0bB5676dD8f88D')

  // change broadcastMessages to ProofContract.ProofEvent
  const messages = await contracts.broadcastMessages.getBroadcastMessages()
  const signedMessage = JSON.parse(web3.utils.hexToString(messages.result[0].signedMessage))

  const publicKey = generatePublicKeyFromHexStr(identity.publicKey)
  console.log(signedMessage)

  console.log(publicKey.verify(uint8ArrayFromHex(signedMessage.signature), signedMessage.message))
}

function generatePublicKeyFromHexStr(publicKeyHexString: string) {
  const preKeyPublicKeyEd = uint8ArrayFromHex(publicKeyHexString)
  const preKeyPublicKeyCurve = ed2curve.convertPublicKey(preKeyPublicKeyEd)
  return proteus.keys.PublicKey.new(
    preKeyPublicKeyEd,
    preKeyPublicKeyCurve,
  )
}

function uint8ArrayFromHex(hex: string): Uint8Array {
  return new Uint8Array(web3.utils.hexToBytes(hex))
}
