import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Text,
  Stack,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const { schema, setSchema, resetSchema } = useSchemaStore();
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

  const buttonSize = useBreakpointValue({
    base: "md",
    md: "lg",
  }) as "sm" | "md" | "lg" | "xl";

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

  const handleRemoveRunnable = (index: number) => {
    remove(index);
    const updatedSchema = {
      ...schema,
      runnables: schema.runnables.filter((_, idx) => idx !== index),
    };
    setSchema(updatedSchema);
    pushToHistory(updatedSchema);
    handleSubmit(onSubmit)();
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

  const handleReset = () => {
    resetSchema();
    methods.reset();
  };

  return (
    <Box bg="gray.50" minH="100vh" p={4}>
      <Container maxW="container.xl" py={6}>
        <FormProvider {...methods}>
          <Stack gap={6}>
            <Box pb={4} borderBottom="2px" borderColor="gray.200">
              <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                Form Schema Builder
              </Text>
            </Box>

            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <Stack direction="row" gap={4} flexWrap="wrap">
                <Button
                  onClick={handleAddRunnable}
                  bg="blue.500"
                  color="white"
                  disabled={isPreviewMode || fields.length >= 20}
                  size={buttonSize}
                  _hover={{ bg: "blue.600" }}
                >
                  Add Runnable
                </Button>
                <Button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  bg={isPreviewMode ? "green.500" : "gray.500"}
                  color="white"
                  size={buttonSize}
                  _hover={{ bg: isPreviewMode ? "green.600" : "gray.600" }}
                  disabled={!schema.runnables.length}
                >
                  {isPreviewMode ? "Edit Mode" : "Preview Mode"}
                </Button>
                <Button
                  onClick={handleReset}
                  bg="red.500"
                  color="white"
                  size={buttonSize}
                  _hover={{ bg: "red.600" }}
                >
                  Reset Schema
                </Button>
              </Stack>
              <ImportExport schema={schema} onImport={handleImport} />
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
                <Stack gap={4}>
                  {fields.map((runnable, index) => (
                    <RunnableForm
                      key={runnable.id}
                      control={control}
                      index={index}
                      remove={handleRemoveRunnable}
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

export default FormBuilder;
