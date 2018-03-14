import ENV from './config'
import {
    encode as base58Encode,
    decode as base58Decode,
} from 'bs58check'
import { toChecksumAddress } from './index'

export function base58ToHex(base58Str: string): string {
  return `0x${base58Decode(base58Str).toString('hex')}`
}

export function base58ToChecksumAddress(encodedAddress: string): string {
    return toChecksumAddress(base58ToHex(encodedAddress))
}

export function claimTextToSignedClaim(claimText: string) {
  const regStr = `\\s+(\\w+)-(\\w+)`
  const parts = new RegExp(regStr).exec(claimText)
  if (parts === null) {
    throw new Error('Invalid claim text, regStr: ' + regStr)
  }
  return {
    userAddress: base58ToChecksumAddress(parts[1]),
    signature: base58ToHex(parts[2]),
  }
}
