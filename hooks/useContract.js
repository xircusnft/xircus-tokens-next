import { filterMethods } from './utils'

export const usePairToken = (web3) => {
  const getPair = async(address) => {
    if (address && !address.startsWith('0x') && address.length != 42) return false
    try {
      const pair = new web3.eth.Contract(require('../contracts/pair.json'), address)
      const name = await pair.methods.name().call()
      const token0 = await pair.methods.token0().call()
      const token1 = await pair.methods.token1().call()
      const decimals = await pair.methods.decimals().call()
      const totalSupply = await pair.methods.totalSupply().call()
      const symbol = await pair.methods.symbol().call()
      const factory = await pair.methods.factory().call()
      const reserves = await pair.methods.getReserves().call()

      return {
        name,
        address,
        token0,
        token1,
        decimals,
        totalSupply,
        symbol,
        factory,
        reserves,
        balanceOf: pair.methods.balanceOf
      }
    } catch(e) {
      return false
    }
  }

  return {
    getPair
  }
}

export const useToken = (web3) => {
  // const web3 = useWeb3()

  const getToken = async(address, full = false) => {
    const token = new web3.eth.Contract(require('../contracts/token.json'), address)
    try {
      return {
        ...(full ? filterMethods(token.methods) : { balanceOf: token.methods.balanceOf }),
        address,
        name: await token.methods.name().call(),
        symbol: await token.methods.symbol().call(),
        decimals: await token.methods.decimals().call(),
        totalSupply: await token.methods.totalSupply().call()
      }
    } catch (e) {
      return false
    }
  }

  const getNFTToken = async(address) => {
    const token = new web3.eth.Contract(require('../contracts/token.json'), address)
    try {
      return {
        name: await token.methods.name().call(),
        symbol: await token.methods.symbol().call(),
      }
    } catch (e) {
      return false
    }
  }

  const getTokenBalance = async(address, account) => {
    try {
      const token = await getToken(address, true)
      return await token.balanceOf(account).call()
    } catch (e) {
      return -1;
    }
  }

  return {
    getToken,
    getTokenBalance,
    getNFTToken
  }
}
