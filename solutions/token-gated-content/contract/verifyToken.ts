import { BigNumber, BigNumberish, Contract, getDefaultProvider } from 'ethers'
import abi from './vercel.abi.json'

export const contract = new Contract(
  process.env.CONTRACT_ADDRESS!,
  abi,
  getDefaultProvider('rinkeby')
)

export const walletOwnsToken = async (address: string) => {
  const [balance]: [BigNumber] = await contract.functions.balanceOf(address)
  // return balance._hex = '0x1' set how much tokens needed as a minimum to access the page
  return balance._hex === '0x00'
}
