import { Switch as ChSwitch } from "@chakra-ui/switch";
import { Box } from "@chakra-ui/react";
import * as React from "react";

export interface SwitchProps {
  inputProps?: {
    name?: string;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

export const SwitchStuff: React.FC<SwitchProps> = ({ inputProps }) => {
  return (
    <Box p={1}>
      <ChSwitch
        name={inputProps?.name}
        isChecked={inputProps?.checked}
        onChange={inputProps?.onChange}
        size="md"
        colorScheme="blue"
        sx={{
          "span.chakra-switch__track": {
            display: "block",
            width: "51px",
            height: "26.8px",
            bg: "gray.300",
            borderRadius: "full",
            position: "relative",
            transition: "background-color 0.3s",
          },
          "span.chakra-switch__thumb": {
            display: "block",
            width: "27px",
            height: "27px",
            bg: "white",
            borderRadius: "full",
            transition: "all 0.3s",
            transform: inputProps?.checked
              ? "translateX(22px)"
              : "translateX(2px)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
            margin: "2px",
          },
          "&[data-checked] span.chakra-switch__track": {
            bg: "#3b82f6",
          },
          "&:hover span.chakra-switch__thumb": {
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
          },
        }}
      />
    </Box>
  );
};
