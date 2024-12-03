import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/utils";
import userEvent from "@testing-library/user-event";
import { FormBuilder } from "@/components";

vi.mock("../../store/useSchemaStore", () => ({
  useSchemaStore: vi.fn(() => ({
    schema: { runnables: [] },
    setSchema: vi.fn(),
    resetSchema: vi.fn(),
  })),
}));

describe("FormBuilder", () => {
  it("renders correctly", () => {
    render(<FormBuilder />);
    expect(screen.getByText("Form Schema Builder")).toBeInTheDocument();
  });

  it("adds new runnable when clicking button", async () => {
    const user = userEvent.setup();
    render(<FormBuilder />);

    const addButton = screen.getByRole("button", { name: /add runnable/i });
    await user.click(addButton);

    const runnableText = await screen.findByText(/Runnable #1/i);
    expect(runnableText).toBeInTheDocument();
  });

  it("shows schema preview", () => {
    render(<FormBuilder />);
    expect(screen.getByText("Schema Preview")).toBeInTheDocument();

    const previewBox = screen.getByText((content) => {
      return content.includes('"runnables": []');
    });
    expect(previewBox).toBeInTheDocument();
  });

  it("resets schema when clicking reset button", async () => {
    const user = userEvent.setup();
    render(<FormBuilder />);

    const resetButton = screen.getByRole("button", { name: /reset schema/i });
    await user.click(resetButton);

    const previewBox = screen.getByText((content) => {
      return content.includes('"runnables": []');
    });
    expect(previewBox).toBeInTheDocument();
  });
});
