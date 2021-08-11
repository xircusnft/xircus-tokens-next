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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import fs from "fs/promises";
import path from "path";

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
  const [apiFeedback, setApiFeedback] = useState({ show: false, isError: false, msg: "" });
  let countdownTimer = null;

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

    if (value.startsWith("0x") && value.length == 42) {
      setFormError((prev) => ({ ...prev, [name]: false }));
    } else {
      setFormError((prev) => ({ ...prev, [name]: true }));
    }
  };

  const resetApiFeedback = () => {
    setApiFeedback({ show: false, isError: false, msg: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetApiFeedback();
    setApiLoading(true);
    countdownTimer && clearTimeout(countdownTimer);

    // const isInvalidData = Object.values(formError).some((value) => value === true || value === null);

    let isValidData = true;
    Object.entries(formError).forEach(([key, value]) => {
      if (value === true || value === null) {
        isValidData = false;
        setFormError((prev) => ({ ...prev, [key]: true }));
      }
    });

    if (isValidData) {
      await fetch(`${process.env.HOST}/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText ?? "Adding tokens failed.");
          }
          return res.json();
        })
        .then((data) => setApiFeedback({ show: true, isError: false, msg: "Token successfully added." }))
        .catch((err) => setApiFeedback({ show: true, isError: true, msg: err.message ?? "Adding tokens failed." }));
    } else {
      setApiLoading(false);
      return;
    }

    countdownTimer = setTimeout(() => {
      setApiLoading(false);
      resetApiFeedback();
    }, 1000);
  };

  useEffect(() => {
    return () => {
      countdownTimer && clearTimeout(countdownTimer);
    };
  }, [countdownTimer]);

  return (
    <Container centerContent>
      <Box mt={[5, 100]}>
        <Image src={"/xircus-animated.gif"} width={200} alt="XIRCUS" />
      </Box>
      <Box w={["100%", 400]} p={5} borderWidth="1px" borderRadius="lg">
        <form onSubmit={handleSubmit}>
          <FormControl id="chain" mb={3} isInvalid={formError.chain}>
            <FormLabel htmlFor="chain">BLockchain</FormLabel>
            <Select name="chain" placeholder="Select Chain" onChange={handleOnChange}>
              {chains &&
                Array.isArray(chains) &&
                chains.map((e, i) => (
                  <option key={`${e.networkId}_${i}`} value={e.name}>
                    {e.name}
                  </option>
                ))}
            </Select>
            <FormErrorMessage>Please select Blockchain.</FormErrorMessage>
          </FormControl>

          <FormControl id="name" mb={3} isInvalid={formError.name}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input name="name" maxLength={255} onChange={handleOnChange} />
            <FormErrorMessage>Please enter name.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.lp} id="lp" mb={3}>
            <FormLabel htmlFor="lp">Liquidity Pair Token Address:</FormLabel>
            <Input name="lp" placeholder="0x00000" maxLength={42} onChange={handleOnChangeTokens} />
            <FormErrorMessage>Please enter valid token address.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.token} id="token" mb={3} isDisabled={true}>
            <FormLabel htmlFor="token">Token Address:</FormLabel>
            <Input name="token" placeholder="0x00000" maxLength={42} onChange={handleOnChangeTokens} />
            <FormErrorMessage>Invalid token address.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.stable} id="stable" mb={3} isDisabled={true}>
            <FormLabel htmlFor="stable">Stable Token Address:</FormLabel>
            <Input name="stable" placeholder="0x00000" maxLength={42} onChange={handleOnChangeTokens} />
            <FormErrorMessage>Invalid token address.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formError.router} id="router" mb={3} isDisabled={true}>
            <FormLabel htmlFor="router">Decentralize Exchange Router Address:</FormLabel>
            <Input name="router" placeholder="0x00000" maxLength={42} onChange={handleOnChangeTokens} />
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
            bgGradient="linear(to-r, #7928CA, #ffb100)"
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
    console.log(chains);
  } catch (error) {}

  return {
    props: { chains },
  };
}
