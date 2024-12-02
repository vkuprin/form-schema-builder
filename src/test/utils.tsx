import { render as rtlRender, screen } from "@testing-library/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ReactElement } from "react";
import userEvent from "@testing-library/user-event";

const render = (ui: ReactElement) => ({
  ...rtlRender(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>),
  user: userEvent.setup(),
});

export * from "@testing-library/react";
export { render, screen };
