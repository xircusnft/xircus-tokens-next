import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useCallback } from "react";

function SimpleTable({ header, body, renderData = [] }) {
  const renderTD = useCallback((item) => renderData.map((e, i) => <Td key={i}>{item[e]}</Td>), [renderData]);

  return (
    <Table variant="simple">
      <Thead>
        <Tr>{Array.isArray(header) && header.map((item, index) => <Th key={index}>{item}</Th>)}</Tr>
      </Thead>
      <Tbody>
        {Array.isArray(body) &&
          body.map((item, index) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              {renderTD(item, index)}
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
}

export default React.memo(SimpleTable);
