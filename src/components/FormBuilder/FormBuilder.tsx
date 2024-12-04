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
import {
  RiAddCircleLine,
  RiEditLine,
  RiEyeLine,
  RiRefreshLine,
} from "react-icons/ri";
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

const Divider = () => <Box border="1px solid" borderColor="gray.200" />;

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
    base: "sm",
    md: "md",
    lg: "lg",
  }) as "sm" | "md" | "lg";

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
    <Container maxW="1200px" p={8}>
      <Box
        borderRadius="xl"
        p={8}
        bg="rgba(0, 0, 0, 0.7)"
        backdropFilter="blur(10px)"
        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        border="1px solid rgba(255, 255, 255, 0.18)"
      >
        <FormProvider {...methods}>
          <Stack gap={8}>
            <Box textAlign="center">
              <Text fontSize="4xl" fontWeight="bold" color="white">
                Form Schema Builder
              </Text>
              <Text color="whitesmoke" mt={2}>
                Build, edit, and preview your form schema effortlessly.
              </Text>
            </Box>
            <Divider />

            <HStack justify="space-between" wrap="wrap" gap={4}>
              <HStack gap={4} wrap="wrap">
                <Button
                  onClick={handleAddRunnable}
                  bg="blue.500"
                  color="white"
                  disabled={isPreviewMode || fields.length >= 20}
                  size={buttonSize}
                  _hover={{ bg: "blue.600" }}
                >
                  <RiAddCircleLine style={{ marginRight: "8px" }} />
                  Add Runnable
                </Button>
                <Button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  bg={isPreviewMode ? "green.500" : "gray.500"}
                  color="white"
                  size={buttonSize}
                  _hover={{
                    bg: isPreviewMode ? "green.600" : "gray.600",
                  }}
                  disabled={!schema.runnables.length}
                >
                  {isPreviewMode ? (
                    <>
                      <RiEditLine style={{ marginRight: "8px" }} />
                      Edit Mode
                    </>
                  ) : (
                    <>
                      <RiEyeLine style={{ marginRight: "8px" }} />
                      Preview Mode
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  bg="red.500"
                  color="white"
                  size={buttonSize}
                  _hover={{ bg: "red.600" }}
                >
                  <RiRefreshLine style={{ marginRight: "8px" }} />
                  Reset Schema
                </Button>
              </HStack>
              <ImportExport schema={schema} onImport={handleImport} />
            </HStack>

            {validationErrors.length > 0 && (
              <Box
                bg="red.50"
                border="1px solid"
                borderColor="red.200"
                p={4}
                borderRadius="md"
              >
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
                <Stack gap={4} bg="gray.50" borderRadius="md">
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
      </Box>
    </Container>
  );
};

export default FormBuilder;
