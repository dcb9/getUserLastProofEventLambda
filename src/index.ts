import {
  getContracts,
  ITrustMeshContracts,
} from '@keymesh/trustmesh'

import { Handler, Context, Callback } from 'aws-lambda'

import Web3Type from 'web3'
const Web3: Web3Type = require('web3')
const ed2curve = require('ed2curve')

import proteus = require('wire-webapp-proteus')
import { IProofEvent } from '@keymesh/trustmesh/lib/SocialProofs'
import { keys } from 'wire-webapp-proteus'
import { twitterResource } from './resources/TwitterResource'
import ENV from './config'
import { claimTextToSignedClaim } from './utils'

const web3: Web3Type = new (Web3 as any)(ENV.WEB3_URL)

console.log('web3_url', ENV.WEB3_URL)

async function getValidSocialProof(userAddress: string, platform: PLATFORMS) {
  console.log('userAddress', userAddress)

  const contracts = await getContracts(web3)
  const identity = await contracts.identities.getIdentity(userAddress)
  console.log(identity)

  const proofEvents = await contracts.socialProofs.ProofEvent({
    filter: {
      userAddress,
      platformName: web3.utils.stringToHex(platform),
    },
    fromBlock: 0,
  })

  console.log(identity.publicKey)
  console.log(proofEvents)
  const publicKey = generatePublicKeyFromHexStr(identity.publicKey)
  const signedSocialProof = getLastProof(publicKey, proofEvents.result)
  if (signedSocialProof === null) {
    throw new Error('social proof could not found')
  }

  console.log(signedSocialProof.socialProof)
  const isValid = await verify(publicKey, platform, signedSocialProof.socialProof.proofURL)
  if (!isValid) {
    throw new Error('the claim is invalid')
  }

  return signedSocialProof.socialProof
}

async function verify(publicKey: keys.PublicKey, platform: PLATFORMS, proofURL: string) {
    const claimText = await getClaimTextFunctions[platform](proofURL)
    if (claimText === null) {
      throw new Error('Claim text not found')
    }

    console.log(claimText)
    const signedClaim = claimTextToSignedClaim(claimText)
    console.log(signedClaim)
    return publicKey.verify(
      uint8ArrayFromHex(signedClaim.signature),
      signedClaim.userAddress,
    )
}

function getLastProof(publicKey: keys.PublicKey, proofEvents: IProofEvent[]): any | null {
  for (let i = proofEvents.length - 1; i >= 0; i--) {
    const proofEvent = proofEvents[i]
    const signedSocialProof = JSON.parse(web3.utils.hexToString(proofEvent.data))
    if (!publicKey.verify(
      uint8ArrayFromHex(signedSocialProof.signature),
      JSON.stringify(signedSocialProof.socialProof),
    )) {
      continue
    }

    return signedSocialProof
  }

  return null
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

enum PLATFORMS {
  GITHUB = 'github',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
}

const getClaimTextFunctions = {
  [PLATFORMS.FACEBOOK]: (proofURL: string) => 'need imply',
  [PLATFORMS.TWITTER]: (proofURL: string) => twitterResource.getTweet(proofURL),
  [PLATFORMS.GITHUB]: (proofURL: string) => 'need imply',
}

export const toChecksumAddress = web3.utils.toChecksumAddress

const getUserLastProofEvent: Handler = async (event: any, context: Context, callback: Callback) => {
  try {
    console.log(event)
    const socialProof = await getValidSocialProof(event.userAddress, event.platform)
    callback(undefined, socialProof)
  } catch (e) {
    callback(e)
  }
}

export { getUserLastProofEvent }
