import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/utils";
import userEvent from "@testing-library/user-event";
import { FormPreview } from "@/components";
import type { Schema } from "@/types/schema";

const mockSchema: Schema = {
  runnables: [
    {
      type: "initial",
      path: "runnable-1",
      inputs: [
        {
          name: "input-1",
          label: "Test Dropdown",
          type: "dropdown",
          required: true,
          options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
          ],
        },
        {
          name: "input-2",
          label: "Test Slider",
          type: "slider",
          required: false,
          min: 1,
          max: 10,
          step: 1,
        },
        {
          name: "input-3",
          label: "Test Toggle",
          type: "toggle",
          required: true,
          defaultValue: true,
        },
      ],
    },
  ],
};

describe("FormPreview", () => {
  it("renders correctly with schema", () => {
    render(<FormPreview schema={mockSchema} onSubmit={vi.fn()} />);

    expect(screen.getByText("runnable-1")).toBeInTheDocument();
    expect(screen.getByText("Test Dropdown")).toBeInTheDocument();
    expect(screen.getByText("Test Slider")).toBeInTheDocument();
    expect(screen.getByText("Test Toggle")).toBeInTheDocument();
  });

  it("renders dropdown options", () => {
    render(<FormPreview schema={mockSchema} onSubmit={vi.fn()} />);

    const dropdown = screen.getByRole("combobox");
    expect(dropdown).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("Option 1");
    expect(options[1]).toHaveTextContent("Option 2");
  });

  it("handles slider input", () => {
    render(<FormPreview schema={mockSchema} onSubmit={vi.fn()} />);

    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("min", "1");
    expect(slider).toHaveAttribute("max", "10");
    expect(slider).toHaveAttribute("step", "1");
  });

  it("handles toggle input", () => {
    render(<FormPreview schema={mockSchema} onSubmit={vi.fn()} />);

    const toggle = screen.getByRole("checkbox");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toBeChecked();
  });

  it("submits form with correct data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<FormPreview schema={mockSchema} onSubmit={onSubmit} />);

    // Select an option in the dropdown
    const dropdown = screen.getByRole("combobox");
    await user.selectOptions(dropdown, "option2");

    // Adjust the slider
    const slider = screen.getByRole("slider");
    await user.type(slider, "5");

    // Toggle the checkbox
    const toggle = screen.getByRole("checkbox");
    await user.click(toggle);

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    // Assert that onSubmit was called
    expect(onSubmit).toHaveBeenCalled();
  });
});
