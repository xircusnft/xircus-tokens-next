import { Box, Center, Container, Grid, Heading, Input, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import allChains from "../../public/chains.json";

export default function Chains() {
  const [search, setSearch] = useState("");
  const cardBg = useColorModeValue("gray.100", "gray.900");

  const chains = useMemo(
    () =>
      search.length > 2 ? allChains.filter((o) => JSON.stringify(o.name).search(new RegExp(search, "ig")) > -1) : [],
    [search]
  );

  return (
    <Container maxW="container.xl">
      <Heading as="h3" size="lg" mt={5}>
        List Of Chains
      </Heading>
      <Box my={2}>
        <Input placeholder="Search Blockchain" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Box>
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4}>
        {chains.map((chain) => (
          <Link key={chain.networkId} href={`/chains/${chain.networkId}`}>
            <Center flexDirection="column" h="100px" bg={cardBg} pointer="cursor" borderRadius="md">
              <Heading size="md">{chain.name}</Heading>
              <Heading size="sm">{chain.networkId}</Heading>
            </Center>
          </Link>
        ))}
      </Grid>
    </Container>
  );
}
