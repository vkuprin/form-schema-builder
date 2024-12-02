import { Box, Button, Container, Text, Stack, HStack } from "@chakra-ui/react";
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSchemaStore } from "@/store/useSchemaStore";
import { useHistoryStore } from "@/store/useHistoryStore";
import {
  RunnableForm,
  SchemaPreview,
  FormPreview,
  ImportExport,
} from "@/components";
import type { Schema } from "@/types/schema";
import { formSchema } from "@/validation/schema";
import { validateSchema } from "@/validation/utils";

export const FormBuilder = () => {
  const { schema, setSchema } = useSchemaStore();
  const { push: pushToHistory } = useHistoryStore();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const methods = useForm<Schema>({
    defaultValues: schema,
    resolver: zodResolver(formSchema),
  });

  const { control, handleSubmit } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "runnables",
  });

  const onSubmit = (data: Schema) => {
    const validation = validateSchema(data);
    if (validation.success) {
      setSchema(data);
      pushToHistory(data);
      setValidationErrors([]);
    } else {
      setValidationErrors(validation.errors?.map((e) => e.message) || []);
    }
  };

  const handleAddRunnable = () => {
    append({
      type: "initial",
      path: `runnable-${fields.length + 1}`,
      inputs: [],
    });
  };

  const handleImport = (importedSchema: Schema) => {
    const validation = validateSchema(importedSchema);
    if (validation.success) {
      setSchema(importedSchema);
      pushToHistory(importedSchema);
      setValidationErrors([]);
    } else {
      setValidationErrors(["Invalid schema format"]);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="container.xl" py={8}>
        <FormProvider {...methods}>
          <Stack gap={8}>
            <Box pb={4} borderBottom="2px" borderColor="gray.200">
              <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                Form Schema Builder
              </Text>
            </Box>

            <HStack justify="space-between">
              <Stack direction="row" gap={4}>
                <Button
                  onClick={handleAddRunnable}
                  bg="blue.500"
                  color="white"
                  disabled={isPreviewMode || fields.length >= 20}
                  size="lg"
                  _hover={{ bg: "blue.600" }}
                >
                  Add Runnable
                </Button>
                <Button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  bg={isPreviewMode ? "green.500" : "gray.500"}
                  color="white"
                  size="lg"
                  _hover={{ bg: isPreviewMode ? "green.600" : "gray.600" }}
                >
                  {isPreviewMode ? "Edit Mode" : "Preview Mode"}
                </Button>
              </Stack>
              <Stack direction="row" gap={4}>
                <ImportExport schema={schema} onImport={handleImport} />
              </Stack>
            </HStack>

            {validationErrors.length > 0 && (
              <Box p={4} bg="red.100" borderRadius="md">
                {validationErrors.map((error, index) => (
                  <Text key={index} color="red.600">
                    {error}
                  </Text>
                ))}
              </Box>
            )}

            {isPreviewMode ? (
              <FormPreview schema={schema} onSubmit={console.log} />
            ) : (
              <form onChange={handleSubmit(onSubmit)}>
                <Stack gap={6}>
                  {fields.map((runnable, index) => (
                    <RunnableForm
                      key={runnable.id}
                      control={control}
                      index={index}
                      remove={remove}
                    />
                  ))}
                </Stack>
              </form>
            )}

            {!isPreviewMode && <SchemaPreview schema={schema} />}
          </Stack>
        </FormProvider>
      </Container>
    </Box>
  );
};
