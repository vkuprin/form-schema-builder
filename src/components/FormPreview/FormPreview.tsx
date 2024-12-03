import { Box, Stack } from "@chakra-ui/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import type { Schema } from "@/types/schema";
import { SchemaPreview } from "@/components";

interface FormPreviewProps {
  schema: Schema;
  onSubmit: SubmitHandler<FieldValues>;
}

export const FormPreview = ({ schema, onSubmit }: FormPreviewProps) => {
  const { handleSubmit } = useForm();

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={6}>
          <SchemaPreview schema={schema} />
        </Stack>
      </form>
    </Box>
  );
};
