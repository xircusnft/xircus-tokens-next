import { Box, Container, Heading, Button, HStack, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";

export default function Migrate() {
  const [loading, setLoading] = useState({ isLoading: false, selectedBtn: "" });
  const toast = useToast();

  const handleClick = async (targetFile) => {
    setLoading({ isLoading: true, selectedBtn: targetFile });

    const reply = await fetch(`${process.env.HOST}/api/migrate?targetFile=${targetFile}`);

    const result = await reply.json();
    console.error(result.error);

    toast({
      title: reply.ok ? "Successfull" : "Failed",
      description: reply.ok ? `Successfully updated ${targetFile} record.` : "Please check console for the error.",
      status: reply.ok ? "success" : "error",
      duration: 9000,
      isClosable: true,
      position: "top-right",
    });

    if (reply.ok) {
    }

    setLoading({ isLoading: false, selectedBtn: "" });
  };

  return (
    <Container maxW="container.xl">
      <Heading as="h3" size="lg" mt={5}>
        Please select file to purge and populate.
      </Heading>
      <Box my={2}>
        <HStack spacing="24px">
          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleClick.bind(this, "exchanges")}
            isDisabled={loading.isLoading}
            isLoading={loading.isLoading && loading.selectedBtn == "exchanges"}
            loadingText="Please wait..."
          >
            Exchanges
          </Button>
          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleClick.bind(this, "pairs")}
            isDisabled={loading.isLoading}
            isLoading={loading.isLoading && loading.selectedBtn == "pairs"}
            loadingText="Please wait..."
          >
            Pairs
          </Button>
        </HStack>
      </Box>
    </Container>
  );
}
