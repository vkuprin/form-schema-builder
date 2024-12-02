import { Button, Stack, Input } from "@chakra-ui/react";
import { useRef } from "react";
import type { Schema } from "@/types/schema";

interface ImportExportProps {
  schema: Schema;
  onImport: (schema: Schema) => void;
}

export const ImportExport = ({ schema, onImport }: ImportExportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(schema, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.download = "form-schema.json";
    link.href = url;
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        onImport(imported);
      } catch {
        console.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Stack direction="row" gap={4}>
      <Input
        type="file"
        accept=".json"
        onChange={handleImport}
        ref={fileInputRef}
        display="none"
        aria-label="Import Schema"
      />
      <Button
        onClick={handleExport}
        bg="green.500"
        color="white"
        _hover={{ bg: "green.600" }}
      >
        Export Schema
      </Button>
      <Button
        onClick={() => fileInputRef.current?.click()}
        bg="blue.500"
        color="white"
        _hover={{ bg: "blue.600" }}
      >
        Import Schema
      </Button>
    </Stack>
  );
};
