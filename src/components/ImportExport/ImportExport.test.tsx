import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/utils";
import userEvent from "@testing-library/user-event";
import { ImportExport } from "@/components";
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

describe("ImportExport", () => {
  it("exports schema to JSON file", async () => {
    const user = userEvent.setup();
    render(<ImportExport schema={mockSchema} onImport={vi.fn()} />);

    const exportButton = screen.getByRole("button", { name: /export schema/i });
    await user.click(exportButton);

    expect(window.URL.createObjectURL).toHaveBeenCalled();
  });

  it("imports schema from JSON file", async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    render(<ImportExport schema={mockSchema} onImport={onImport} />);

    const importButton = screen.getByRole("button", { name: /import schema/i });
    await user.click(importButton);

    const fileInput = screen.getByLabelText(/import schema/i);
    const file = new File([JSON.stringify(mockSchema)], "schema.json", {
      type: "application/json",
    });
    await user.upload(fileInput, file);

    expect(onImport).toHaveBeenCalledWith(mockSchema);
  });

  it("handles invalid JSON file import", async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    render(<ImportExport schema={mockSchema} onImport={onImport} />);

    const importButton = screen.getByRole("button", { name: /import schema/i });
    await user.click(importButton);

    const fileInput = screen.getByLabelText(/import schema/i);
    const file = new File(["invalid json"], "schema.json", {
      type: "application/json",
    });
    await user.upload(fileInput, file);

    expect(onImport).not.toHaveBeenCalled();
  });
});
