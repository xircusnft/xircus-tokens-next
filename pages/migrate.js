import { Box, Container, Heading, Button, HStack, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";

export default function Migrate() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleClick = async (targetFile) => {
    setLoading(true);

    const reply = await fetch(`${process.env.HOST}/api/migrate?targetFile=${targetFile}`);

    const result = await reply.json();
    console.error(result.error);

    toast({
      title: reply.ok ? "Successfull" : "Failed",
      description: reply.ok ? "Records successfully updated." : "Please check console for the error.",
      status: reply.ok ? "success" : "error",
      duration: 9000,
      isClosable: true,
      position: "top-right",
    });

    if (reply.ok) {
    }

    setLoading(false);
  };

  return (
    <Container maxW="container.xl">
      <Heading as="h3" size="lg" mt={5}>
        Please select file to purge and populate.
      </Heading>
      <Box my={2}>
        <HStack spacing="24px">
          <Button colorScheme="teal" size="lg" onClick={handleClick.bind(this, "exchanges")} isDisabled={loading}>
            Exchanges
          </Button>
          <Button colorScheme="teal" size="lg" onClick={handleClick.bind(this, "exchanges")} isDisabled={loading}>
            Pairs
          </Button>
        </HStack>
      </Box>
      <Box>{loading && <Text>Please wait...</Text>}</Box>
    </Container>
  );
}
