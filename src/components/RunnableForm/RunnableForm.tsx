import {
  Box,
  Button,
  Text,
  HStack,
  Input,
  Stack,
  NativeSelectRoot,
  NativeSelectField,
} from "@chakra-ui/react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useRef } from "react";
import Sortable from "sortablejs";
import type { Schema } from "@/types/schema.ts";
import { InputField } from "../InputField/InputField.tsx";
import { RiAddLine, RiCloseLine } from "react-icons/ri";

interface RunnableFormProps {
  control: Control<Schema>;
  index: number;
  remove: (index: number) => void;
}

export const RunnableForm = ({ control, index, remove }: RunnableFormProps) => {
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext<Schema>();

  const {
    fields,
    move,
    append,
    remove: removeInput,
  } = useFieldArray({
    control,
    name: `runnables.${index}.inputs`,
  });

  const sortableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sortableContainerRef.current) {
      Sortable.create(sortableContainerRef.current, {
        animation: 150,
        onStart: () => {
          document.body.style.cursor = "grabbing";
        },
        onEnd: ({ oldIndex, newIndex }) => {
          document.body.style.cursor = "default";
          if (oldIndex !== undefined && newIndex !== undefined) {
            move(oldIndex, newIndex);
            const values = getValues();
            setValue("runnables", values.runnables, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
        },
      });
    }
  }, [move, getValues, setValue]);

  const handleRemove = (index: number) => {
    remove(index);
    const values = getValues();
    setValue(
      "runnables",
      values.runnables.filter((_, idx) => idx !== index),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const handleAppendInput = () => {
    append({
      name: `input-${fields.length + 1}`,
      label: `Input ${fields.length + 1}`,
      type: "textarea",
      required: false,
    });
    const values = getValues();
    setValue("runnables", values.runnables, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const runnableErrors = errors.runnables?.[index];

  return (
    <Box borderWidth="1px" borderRadius="lg" shadow="md">
      <Box p={4}>
        <Stack gap={4}>
          <HStack justify="space-between">
            <Text fontSize="xl" fontWeight="bold">
              Runnable #{index + 1}
            </Text>
            <Button
              onClick={() => handleRemove(index)}
              colorScheme="red"
              aria-label="Remove Runnable"
            >
              <RiCloseLine />
            </Button>
          </HStack>

          {runnableErrors?.path && (
            <Text color="red.500" fontSize="sm">
              {runnableErrors.path.message}
            </Text>
          )}

          <Box>
            <Text mb={2}>Type</Text>
            <NativeSelectRoot>
              <NativeSelectField
                placeholder="Select option"
                {...register(`runnables.${index}.type`)}
                className="chakra-input css-1c6j008"
              >
                <option value="initial">Initial</option>
                <option value="secondary">Secondary</option>
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>

          <Box>
            <Text mb={2}>Path</Text>
            <Input {...register(`runnables.${index}.path`)} />
          </Box>

          <Button
            onClick={handleAppendInput}
            bg="blue.500"
            color="white"
            w="fit-content"
            _hover={{ bg: "blue.600" }}
            _active={{ bg: "blue.700" }}
          >
            <RiAddLine />
            Add Input
          </Button>

          {runnableErrors?.inputs && (
            <Text color="red.500" fontSize="sm">
              {runnableErrors.inputs.message}
            </Text>
          )}

          <Stack gap={4} ref={sortableContainerRef}>
            {fields.map((input, inputIndex) => (
              <InputField
                key={input.id}
                runnableIndex={index}
                index={inputIndex}
                remove={removeInput}
              />
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default RunnableForm;
