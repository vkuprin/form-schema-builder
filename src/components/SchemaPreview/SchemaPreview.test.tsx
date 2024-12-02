import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/utils";
import { SchemaPreview } from "@/components";
import type { Schema } from "@/types/schema";

const mockSchema: Schema = {
  runnables: [
    {
      type: "initial",
      path: "runnable-1",
      inputs: [
        {
          name: "input-1",
          label: "Test Input",
          type: "textarea",
          required: true,
        },
      ],
    },
  ],
};

describe("SchemaPreview", () => {
  it("renders schema preview correctly", () => {
    render(<SchemaPreview schema={mockSchema} />);
    expect(screen.getByText("Schema Preview")).toBeInTheDocument();
  });

  it("displays schema in JSON format", () => {
    render(<SchemaPreview schema={mockSchema} />);
    const jsonPreview = screen.getByText((content) =>
      content.includes('"type": "initial"'),
    );
    expect(jsonPreview).toBeInTheDocument();
  });
});
