import { Box, Container, Heading, Input, VStack } from "@chakra-ui/react";
import chainListLocal from "../../services/chainListLocal";
import { useRouter } from "next/router";

function Chains({ chains }) {
  const router = useRouter();

  const handleSelected = (cid) => {
    console.log(cid);
    router.push("/chains/" + encodeURIComponent(cid));
  };

  return (
    <Container>
      <Heading as="h3" size="lg" mt={5}>
        List Of Chains
      </Heading>
      <Box my={2}>
        <Input placeholder="Search Blockchain"></Input>
      </Box>
      <Box maxHeight="80vh" overflowY="scroll">
        {" "}
        <VStack mt={5} align="stretch" spacing={2}>
          {Array.isArray(chains) &&
            chains.map((elem, index) => (
              <Box
                key={index}
                as="button"
                textAlign="start"
                _hover={{ backgroundColor: "blue.600" }}
                p={1}
                borderRadius="md"
                onClick={handleSelected.bind(this, elem.chainId)}
              >
                {elem.name}
              </Box>
            ))}
        </VStack>
      </Box>
    </Container>
  );
}

export default Chains;

export async function getStaticProps(context) {
  let chains = [];

  chains = await chainListLocal();
  return {
    props: { chains },
  };
}
