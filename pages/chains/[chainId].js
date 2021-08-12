import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useCallback } from "react";
import SimpleTable from "../../components/SimpleTable";
import getPairList from "../../services/getPairList";

function ChainDetails({ tokenList }) {
  const renderEmpty = useCallback(() => tokenList.length == 0 && <Box>No associated token yet.</Box>, [tokenList]);
  const renderTable = useCallback(
    () =>
      tokenList.length > 0 && (
        <SimpleTable
          header={[
            "#",
            "Name",
            "Liquidity Pair Token Address",
            "Token Address",
            "Stable Token Address",
            "Decentralize Exchange Router Address",
          ]}
          body={tokenList}
          renderData={["name", "lp", "token", "stable", "router"]}
        />
      ),
    [tokenList]
  );

  return (
    <Box m={5} overflowX="scroll" p={5}>
      {renderEmpty()}
      {renderTable()}
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
