import {
  Box,
  Container,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Heading,
  Image,
} from '@chakra-ui/react';
import { useState } from 'react';

const initialValue = {
  chain: null,
  name: null,
  lp: null,
  token: null,
  stable: null,
  router: null,
};

export default function Home(props) {
  const chains = props.chains ?? [];
  const [formValues, setFormValues] = useState(initialValue);
  const [formError, setFormError] = useState(initialValue);
  const [apiLoading, setApiLoading] = useState(false);

  const handleOnChange = ({ target: { name, value } }) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (name == 'name' && value.length <= 0) {
      setFormError((prev) => ({ ...prev, [name]: true }));
    } else {
      setFormError((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleOnChangeTokens = ({ target: { name, value } }) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (value.startsWith('0x') && value.length == 42) {
      setFormError((prev) => ({ ...prev, [name]: false }));
    } else {
      setFormError((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formValues);
    setApiLoading(true);

    setTimeout(() => setApiLoading(false), 500);
  };

  return (
    <Container centerContent>
      <Box mt={100}>
        <Image src={'/xircus-animated.gif'} width={200} alt='XIRCUS' />
      </Box>
      <Box w={['100%', 400]} p={5} borderWidth='1px' borderRadius='lg'>
        <form>
          <FormControl id='chain' mb={3}>
            <FormLabel htmlFor='chain'>BLockchain</FormLabel>
            <Select name='chain' placeholder='Select Chain' onChange={handleOnChange}>
              {chains &&
                Array.isArray(chains) &&
                chains.map((e, i) => (
                  <option key={`${e.networkId}_${i}`} value={e.name}>
                    {e.name}
                  </option>
                ))}
            </Select>
          </FormControl>

          <FormControl id='name' mb={3} isInvalid={formError.name}>
            <FormLabel htmlFor='name'>Name</FormLabel>
            <Input name='name' maxLength={255} onChange={handleOnChange} />
            <FormErrorMessage>Please enter name.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.lp} id='lp' mb={3}>
            <FormLabel htmlFor='lp'>Liquidity Pair Token Address:</FormLabel>
            <Input name='lp' placeholder='0x00000' maxLength={42} onChange={handleOnChangeTokens} />
            <FormErrorMessage>Please enter valid token address.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.token} id='token' mb={3} isDisabled={true}>
            <FormLabel htmlFor='token'>Token Address:</FormLabel>
            <Input name='token' placeholder='0x00000' maxLength={42} onChange={handleOnChangeTokens} />
            <FormErrorMessage>Please enter valid token address.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.stable} id='stable' mb={3} isDisabled={true}>
            <FormLabel htmlFor='stable'>Stable Token Address:</FormLabel>
            <Input name='stable' placeholder='0x00000' maxLength={42} onChange={handleOnChangeTokens} />
            <FormErrorMessage>Please enter valid token address.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.router} id='router' mb={3} isDisabled={true}>
            <FormLabel htmlFor='router'>Decentralize Exchange Router Address:</FormLabel>
            <Input name='router' placeholder='0x00000' maxLength={42} onChange={handleOnChangeTokens} />
            <FormErrorMessage>Please enter valid token address.</FormErrorMessage>
          </FormControl>

          <Button
            mt={3}
            colorScheme='orange'
            variant='solid'
            isLoading={apiLoading}
            loadingText='Please wait...'
            spinnerPlacement='start'
            width='full'
            onClick={handleSubmit}
            bgGradient='linear(to-r, #7928CA, #ffb100)'
            color='white'
          >
            Add Token
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export async function getStaticProps(context) {
  const res = await fetch(`${process.env.HOST}/chains.json`);
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { chains: data },
  };
}
