import { useEffect, useState, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Spinner,
  Spacer,
  Input,
  Select,
  AlertIcon,
  InputGroup,
  InputRightElement,
  FormHelperText,
  useToast,
} from "@chakra-ui/react";
import chains from "../public/chains.json";
import FormAutoComplete from "../components/FormAutoComplete";
import getRouterList from "../services/getRouterList";
import validateToken from "../util/validateToken";
import { usePairToken, useToken } from "../hooks/useContract";
import Web3 from "web3";

const initialValue = {
  chainId: "",
  name: "",
  pair: "",
  token: "",
  stable: "",
  router: "",
};

let countdownTimer = null;

export default function Home(props) {
  const [form, setForm] = useState(initialValue);
  const [formError, setFormError] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [pairing, setPairing] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, isError: false, msg: "" });
  const [routers, setRouters] = useState([]);
  const [clearChainInput, setclearChainInput] = useState(false);
  const [token, setToken] = useState(false);
  const [stable, setStable] = useState(false);
  const [chain, setChain] = useState(false);
  const toast = useToast();

  const web3 = useMemo(() => {
    if (chain && chain.rpc.length > 0) {
      console.log("CHAIN", chain);
      return new Web3(chain.rpc[0]);
    }
  }, [chain]);

  const { getPair } = usePairToken(web3);
  const { getToken } = useToken(web3);

  const handleOnChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name == "name" && value.length <= 0) {
      setFormError((prev) => ({ ...prev, [name]: true }));
    } else {
      setFormError((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleOnChangeTokens = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (validateToken(value)) {
      setFormError((prev) => ({ ...prev, [name]: false }));
    } else {
      setFormError((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handlePairChange = async ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (value.startsWith("0x") && value.length == 42) {
      setPairing(true);
      const pair = await getPair(value);
      if (pair) {
        const _token = await getToken(pair.token0);
        const _stable = await getToken(pair.token1);
        setToken(_token);
        setStable(_stable);
        setForm((prev) => ({
          ...prev,
          token: _token.address,
          stable: _stable.address,
          name: `${_token.symbol}-${_stable.symbol}`,
        }));
        console.log("PAIR", pair, _token, _stable);
      } else {
        toast({
          title: "LP Pair Address",
          description: "Please enter the LP Pair address from the selected blockchain",
          position: "top-right",
          status: "error",
          isClosable: true,
        });
      }
    }
    setPairing(false);
  };

  const resetFeedback = () => {
    setFeedback({ show: false, isError: false, msg: "" });
  };

  const resetForm = () => {
    setForm(initialValue);
    setFormError(initialValue);
    setclearChainInput((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetFeedback();
    setLoading(true);

    let isValidData = true;
    const validateOnly = ["chainId", "name", "pair"];
    validateOnly.forEach((key) => {
      console.log(`key: ${key} value: ${form[key]}`);
      if (form[key] === true || form[key] === "") {
        isValidData = false;
        setFormError((prev) => ({ ...prev, [key]: true }));
      }
    });

    if (isValidData) {
      const reply = await fetch(`${process.env.HOST}/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await reply.json();
      if (reply.ok) {
        resetForm();
      }

      setFeedback({
        show: true,
        isError: !reply.ok,
        msg: result.message,
      });
    }

    setLoading(false);
  };

  const handleSelectedChain = (item) => {
    if (item.chainId && item.formId) {
      setChain(item);
      setForm((prev) => ({ ...prev, [item.formId]: item.chainId }));
      setFormError((prev) => ({ ...prev, [item.formId]: false }));
    } else {
      setFormError((prev) => ({ ...prev, [item.formId]: true }));
    }
  };

  useEffect(() => {
    if (form.chainId) {
      getRouters(form.chainId);
    }
  }, [form.chainId]);

  const getRouters = async (chainId) => {
    setRouters(await getRouterList({ chainId }));
    setForm({ ...form, router: "" });
  };

  return (
    <Container centerContent>
      <Box mt={[2, 100]} mb={3}>
        <Image src="/xircus-animated.gif" width={200} alt="XIRCUS" />
      </Box>
      <Box w={[`100%`, 400]} p={5} borderWidth="1px" borderRadius="lg" mb={100}>
        <form onSubmit={handleSubmit} autoComplete="off">
          <FormAutoComplete
            id="chainId"
            options={chains}
            renderItem={(item) => item.name}
            renderKey={(item) => item.chainId}
            onSelect={handleSelectedChain}
            name="chainId"
            autoComplete="off"
            label="EVM Chain Network"
            placeholder="Select Chain"
            control={{ mb: 4, isInvalid: formError.chainId }}
            errormsg="Please select a blockchain"
            clearValue={clearChainInput}
          />

          <FormControl isInvalid={formError.router} id="router" mb={3} isDisabled={form.chainId === ""}>
            <FormLabel htmlFor="router">Decentralize Exchange Router Address:</FormLabel>
            <Select name="router" placeholder="-" value={form.router} onChange={handleOnChangeTokens}>
              {(routers || []).map((e, i) => (
                <option key={`${e.networkId}_${i}`} value={e.router}>
                  {e.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Invalid Token Address</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.pair} id="pair" mb={3} isDisabled={!(form.chainId > 0)}>
            <FormLabel htmlFor="pair">Liquidity Pair Token Address: </FormLabel>
            <InputGroup>
              <Input name="pair" placeholder="0x00000" maxLength={42} onChange={handlePairChange} value={form.pair} />
              {pairing && (
                <InputRightElement>
                  <Spinner size="sm" />
                </InputRightElement>
              )}
            </InputGroup>
            <FormErrorMessage>Please enter valid token address.</FormErrorMessage>
          </FormControl>

          <FormControl id="name" mb={3} isInvalid={formError.name} isDisabled>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              name="name"
              maxLength={255}
              onChange={handleOnChange}
              placeholder="e.g Market-BUSD PancakeSwap"
              value={form.name}
            />
            <FormErrorMessage>Please enter name.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.token} id="token" mb={3} isDisabled>
            <FormLabel htmlFor="token">Token Address: {token && token.name}</FormLabel>
            <Input
              name="token"
              placeholder="0x00000"
              maxLength={42}
              onChange={handleOnChangeTokens}
              value={form.token}
            />
            <FormErrorMessage>Invalid token address.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.stable} id="stable" mb={3} isDisabled={true}>
            <FormLabel htmlFor="stable">Stable Address: {stable && stable.name}</FormLabel>
            <Input
              name="stable"
              placeholder="0x00000"
              maxLength={42}
              onChange={handleOnChangeTokens}
              value={form.stable}
            />
            <FormErrorMessage>Invalid Token Address</FormErrorMessage>
          </FormControl>

          {feedback.show && (
            <Alert status={feedback.isError ? "error" : "success"}>
              <AlertIcon />
              {feedback.msg}
            </Alert>
          )}

          <Button
            type="submit"
            mt={3}
            colorScheme="orange"
            variant="solid"
            isLoading={loading}
            loadingText="Please wait..."
            spinnerPlacement="start"
            width="full"
            bgGradient="linear(to-l, #8a2387, #e94057, #f27121)"
            color="white"
          >
            Add Token
          </Button>
        </form>
      </Box>
    </Container>
  );
}
