import '../styles/globals.css'
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { UseWalletProvider, ConnectionRejectedError, useWallet } from 'use-wallet'
import theme from '../theme'

function MyApp({ Component, pageProps }) {
  return (
    <UseWalletProvider
      chainId={56}
      connectors={{
        walletconnect: {
          rpcUrl: 'https://bsc-dataseed.binance.org/',
          bridge: 'https://pancakeswap.bridge.walletconnect.org/'
        },
      }}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </UseWalletProvider>
  );
}

export default MyApp;
