import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/utils";
import userEvent from "@testing-library/user-event";
import { RunnableForm } from "@/components";
import { Control, useForm, FormProvider } from "react-hook-form";
import type { Schema } from "@/types/schema";
import { ReactNode } from "react";

vi.mock("sortablejs", () => ({
  default: {
    create: vi.fn((_element, options) => {
      setTimeout(() => {
        if (options && typeof options.onEnd === "function") {
          options.onEnd({ oldIndex: 0, newIndex: 1 });
        }
      }, 0);
      return {};
    }),
  },
}));

const TestWrapper = ({
  children,
}: {
  children: (props: { control: Control<Schema> }) => ReactNode;
}) => {
  const methods = useForm<Schema>({
    defaultValues: {
      runnables: [
        {
          type: "initial",
          path: "runnable-1",
          inputs: [],
        },
      ],
    },
  });

  return (
    <FormProvider {...methods}>
      {children({ control: methods.control })}
    </FormProvider>
  );
};

describe("RunnableForm", () => {
  it("renders correctly with default props", () => {
    render(
      <TestWrapper>
        {({ control }) => (
          <RunnableForm control={control} index={0} remove={vi.fn()} />
        )}
      </TestWrapper>,
    );

    expect(screen.getByText(/Runnable #1/)).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Path")).toBeInTheDocument();
  });

  it("allows removing an input", async () => {
    const user = userEvent.setup();

    const removeMock = vi.fn();
    render(
      <TestWrapper>
        {({ control }) => (
          <RunnableForm control={control} index={0} remove={removeMock} />
        )}
      </TestWrapper>,
    );

    const removeButton = screen.getByRole("button", {
      name: /Remove Runnable/,
    });
    await user.click(removeButton);

    expect(removeMock).toHaveBeenCalledWith(0);
  });
});
