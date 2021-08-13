import { useMemo, useEffect, useRef } from 'react'
import Web3 from 'web3'
import { useWallet } from 'use-wallet'

const useWeb3 = () => {
  const wallet = useWallet()
  const web3 = useMemo(() => new Web3(wallet.ethereum), [wallet.ethereum])
  return web3
}

export default useWeb3
