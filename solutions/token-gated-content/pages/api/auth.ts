import type { NextApiRequest, NextApiResponse } from 'next'
import { sign } from 'jsonwebtoken'
import { Wallet } from 'ethers'
import { walletOwnsToken } from '../../contract/verifyToken'

const Auth = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      const { address, userApproval } = JSON.parse(req.body)

      if (!address || !userApproval) {
        res.status(400).json({ error: 'Missing address or approval' })
        return
      }

      // call NFT contract view function to ensure the user owns the token. Hard coded to allow everybody for demo purposes.
      const allowed = await walletOwnsToken(address)

      if (!allowed) {
        res.status(400).json({ error: `${address} does not own the token` })
        return
      }

      const PRIVATE_KEY = process.env.PRIVATE_KEY

      if (!PRIVATE_KEY) {
        return res.status(500).json({
          error: 'PRIVATE_KEY environment variable is not set',
        })
      }

      // generate a ethereum wallet signer to validate the contract owner approves the user
      const signer = new Wallet(PRIVATE_KEY)

      const tokenVerification = await signer.signMessage(`${address}-approved`)

      const token = sign(
        { address, tokenVerification, userApproval },
        PRIVATE_KEY
      )

      res.setHeader('Set-Cookie', [
        `allow-list=${token}; Path=/ ; Secure ; HttpOnly ; SameSite=Strict ; Max-Age=604800 ;`,
      ])

      return res.status(200).json({ token, address })

    case 'DELETE':
      if (!req.cookies['allow-list']) {
        return res.status(200).json({ deleted: true })
      }

      res.setHeader('Set-Cookie', [
        `allow-list=deleted; Path=/ ; Secure ; HttpOnly ; SameSite=Strict ; Max-Age=604800 ;`,
      ])

      return res.status(200).json({ deleted: true })

    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default Auth
