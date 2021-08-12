import { Box, Container, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import getPairList from "../../services/getPairList";

function ChainDetails({ tokenList }) {
  let output = <></>;

  if (tokenList.length <= 0) output = <Box>No associated token yet.</Box>;

  if (Array.isArray(tokenList) && tokenList.length > 0) {
    output = (
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Name</Th>
            <Th>Liquidity Pair Token Address</Th>
            <Th>Token Address</Th>
            <Th>Stable Token Address</Th>
            <Th>Decentralize Exchange Router Address</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tokenList.map((item, index) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td>{item.name}</Td>
              <Td>{item.lp}</Td>
              <Td>{item.token}</Td>
              <Td>{item.stable}</Td>
              <Td>{item.router}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  }

  return (
    <Box m={5} overflowX="scroll" p={5}>
      {output}
    </Box>
  );
}

export default ChainDetails;

export async function getServerSideProps(context) {
  let tokenList = [];

  if (context.params.chainId) {
    tokenList = await getPairList(context.params.chainId);
  }

  return {
    props: { tokenList },
  };
}
