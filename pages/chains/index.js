import { Box, Container, Heading, Input, VStack } from "@chakra-ui/react";
import chainListLocal from "../../services/chainListLocal";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

function Chains({ chains }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSelected = (cid) => {
    console.log(cid);
    router.push(`/chains/${encodeURIComponent(cid)}`);
  };

  const results = useMemo(
    () =>
      search.length > 2 ? chains.filter((o) => JSON.stringify(o.name).search(new RegExp(search, "ig")) > -1) : chains,
    [search]
  );

  return (
    <Container>
      <Heading as="h3" size="lg" mt={5}>
        List Of Chains
      </Heading>
      <Box my={2}>
        <Input placeholder="Search Blockchain" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Box>
      <Box maxHeight="80vh" overflowY="scroll">
        {" "}
        <VStack mt={5} align="stretch" spacing={2}>
          {Array.isArray(results) &&
            results.map((elem, index) => (
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
