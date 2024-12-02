import { Box, Text } from "@chakra-ui/react";
import type { Schema } from "@/types/schema";

interface SchemaPreviewProps {
  schema: Schema;
}

export const SchemaPreview = ({ schema }: SchemaPreviewProps) => (
  <Box
    borderWidth="1px"
    borderRadius="lg"
    shadow="md"
    bg="white"
    borderColor="gray.200"
  >
    <Box p={6}>
      <Text fontSize="xl" fontWeight="bold" mb={4} color="blue.600">
        Schema Preview
      </Text>
      <Box
        bg="gray.50"
        p={6}
        borderRadius="md"
        whiteSpace="pre-wrap"
        fontFamily="mono"
        fontSize="sm"
        overflowX="auto"
        borderWidth="1px"
        borderColor="gray.200"
      >
        {JSON.stringify(schema, null, 2)}
      </Box>
    </Box>
  </Box>
);
