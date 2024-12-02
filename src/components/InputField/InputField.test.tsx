import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/utils";
import userEvent from "@testing-library/user-event";
import { InputField } from "@/components";
import { TestWrapper } from "@/test/TestWrapper";

describe("InputField", () => {
  it("renders correctly with default props", () => {
    render(
      <TestWrapper>
        {() => <InputField runnableIndex={0} index={0} remove={vi.fn()} />}
      </TestWrapper>,
    );

    expect(screen.getByText(/Input #1/)).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders different input types", async () => {
    const { rerender } = render(
      <TestWrapper>
        {() => <InputField runnableIndex={0} index={0} remove={vi.fn()} />}
      </TestWrapper>,
    );

    expect(screen.getByText("Textarea")).toBeInTheDocument();

    rerender(
      <TestWrapper>
        {() => <InputField runnableIndex={0} index={0} remove={vi.fn()} />}
      </TestWrapper>,
    );

    expect(screen.getByText("Dropdown")).toBeInTheDocument();
  });

  it("removes an input field", async () => {
    const user = userEvent.setup();
    const removeMock = vi.fn();

    render(
      <TestWrapper>
        {() => <InputField runnableIndex={0} index={0} remove={removeMock} />}
      </TestWrapper>,
    );

    const removeButton = screen.getByRole("button", { name: /×/ });
    await user.click(removeButton);

    expect(removeMock).toHaveBeenCalledWith(0);
  });
});
