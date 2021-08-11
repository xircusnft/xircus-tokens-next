import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Select,
  AlertIcon,
  FormHelperText,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import fs from "fs/promises";
import path from "path";
import FormAutoComplete from "../components/FormAutoComplete";
import getRouterList from "../services/getRouterList";
import validateToken from "../util/validateToken";

const initialValue = {
  chain: "",
  name: "",
  lp: "",
  token: "",
  stable: "",
  router: "",
};

export default function Home(props) {
  const chains = props.chains ?? [];
  const [formValues, setFormValues] = useState(initialValue);
  const [formError, setFormError] = useState(initialValue);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiFeedback, setApiFeedback] = useState({ show: false, isError: false, msg: "" });
  let countdownTimer = null;
  const [routerList, setRouterList] = useState([]);
  const [clearChainInput, setclearChainInput] = useState(false);

  const handleOnChange = ({ target: { name, value } }) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (name == "name" && value.length <= 0) {
      setFormError((prev) => ({ ...prev, [name]: true }));
    } else {
      setFormError((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleOnChangeTokens = ({ target: { name, value } }) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (validateToken(value)) {
      setFormError((prev) => ({ ...prev, [name]: false }));
    } else {
      setFormError((prev) => ({ ...prev, [name]: true }));
    }
  };

  const resetApiFeedback = () => {
    setApiFeedback({ show: false, isError: false, msg: "" });
  };

  const resetFormValues = () => {
    setFormValues(initialValue);
    setFormError(initialValue);
    setclearChainInput((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetApiFeedback();
    setApiLoading(true);
    countdownTimer && clearTimeout(countdownTimer);

    // const isInvalidData = Object.values(formError).some((value) => value === true || value === null);

    let isValidData = true;
    Object.entries(formError).forEach(([key, value]) => {
      if (value === true || value === "") {
        isValidData = false;
        setFormError((prev) => ({ ...prev, [key]: true }));
      }
    });

    if (isValidData) {
      const response = await fetch(`${process.env.HOST}/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const result = await response.json();

      if (response.ok) resetFormValues();

      setApiFeedback({ show: true, isError: !response.ok, msg: result.message });
    } else {
      setApiLoading(false);
      return;
    }

    countdownTimer = setTimeout(() => {
      setApiLoading(false);
      resetApiFeedback();
    }, 1500);
  };

  const handleSelectedChain = (item) => {
    if (item.chainId && item.formId) {
      setFormValues((prev) => ({ ...prev, [item.formId]: item.chainId }));
      setFormError((prev) => ({ ...prev, [item.formId]: false }));
    } else {
      setFormError((prev) => ({ ...prev, [item.formId]: true }));
    }
  };

  useEffect(() => {
    return () => {
      countdownTimer && clearTimeout(countdownTimer);
    };
  }, [countdownTimer]);

  useEffect(() => {
    if (formValues.chain <= 0) return;

    (async function () {
      const _routerList = await getRouterList({ chainId: formValues.chain });

      setRouterList(_routerList);
      setFormValues((prev) => ({ ...prev, router: "" }));
    })();
  }, [formValues.chain]);

  return (
    <Container centerContent>
      <Box mt={[2, 100]} mb={3}>
        <Image src={"/xircus-animated.gif"} width={200} alt="XIRCUS" />
      </Box>
      <Box w={["100%", 400]} p={5} borderWidth="1px" borderRadius="lg" mb={100}>
        <form onSubmit={handleSubmit} autoComplete="off">
          <FormAutoComplete
            id="chain"
            options={chains}
            renderItem={(item) => item.name}
            renderKey={(item) => item.chainId}
            onSelect={handleSelectedChain}
            name="chain"
            autoComplete="off"
            label="EVM Chain Network"
            placeholder="Select Chain"
            control={{ mb: 4, isInvalid: formError.chain }}
            errormsg="Please select Blockchain."
            clearValue={clearChainInput}
          />

          <FormControl id="name" mb={3} isInvalid={formError.name}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              name="name"
              maxLength={255}
              onChange={handleOnChange}
              placeholder="e.g Market-BUSD PancakeSwap"
              value={formValues.name}
            />
            <FormErrorMessage>Please enter name.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.lp} id="lp" mb={3}>
            <FormLabel htmlFor="lp">Liquidity Pair Token Address:</FormLabel>
            <Input
              name="lp"
              placeholder="0x00000"
              maxLength={42}
              onChange={handleOnChangeTokens}
              value={formValues.lp}
            />
            <FormErrorMessage>Please enter valid token address.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.token} id="token" mb={3}>
            <FormLabel htmlFor="token">Token Address:</FormLabel>
            <Input
              name="token"
              placeholder="0x00000"
              maxLength={42}
              onChange={handleOnChangeTokens}
              value={formValues.token}
            />
            <FormErrorMessage>Invalid token address.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.stable} id="stable" mb={3}>
            <FormLabel htmlFor="stable">Stable Token Address:</FormLabel>
            <Input
              name="stable"
              placeholder="0x00000"
              maxLength={42}
              onChange={handleOnChangeTokens}
              value={formValues.stable}
            />
            <FormErrorMessage>Invalid token address.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.router} id="router" mb={3} isDisabled={formValues.chain === ""}>
            <FormLabel htmlFor="router">Decentralize Exchange Router Address:</FormLabel>
            <Select name="router" placeholder="-" value={formValues.router} onChange={handleOnChangeTokens}>
              {Array.isArray(routerList) &&
                routerList.map((e, i) => (
                  <option key={`${e.networkId}_${i}`} value={e.router}>
                    {e.name}
                  </option>
                ))}
            </Select>
            <FormErrorMessage>Invalid token address.</FormErrorMessage>
          </FormControl>

          {apiFeedback.show && (
            <Alert status={apiFeedback.isError ? "error" : "success"}>
              <AlertIcon />
              {apiFeedback.msg}
            </Alert>
          )}

          <Button
            type="submit"
            mt={3}
            colorScheme="orange"
            variant="solid"
            isLoading={apiLoading}
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

export async function getStaticProps(context) {
  // const res = await fetch(`${process.env.HOST}/chains.json`);
  // const data = await res.json();
  let chains = [];

  try {
    const data = await fs.readFile(path.join(process.cwd(), "public", "chains.json"));
    chains = JSON.parse(data);
  } catch (error) {}

  return {
    props: { chains },
  };
}
