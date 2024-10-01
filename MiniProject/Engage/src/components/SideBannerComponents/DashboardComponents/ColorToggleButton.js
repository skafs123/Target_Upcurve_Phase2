import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CheckIcon from "@mui/icons-material/Check";

const buttonValues = [
  { value: "all", label: "All" },
  { value: "received", label: "Received" },
  { value: "sent", label: "Sent" },
];

export default function ColorToggleButton({ onSelectionChange }) {
  const [alignment, setAlignment] = React.useState("all");

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null && newAlignment !== alignment) {
      setAlignment(newAlignment);
      onSelectionChange(newAlignment); 
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      sx={{
        display: "flex",
        width: "100%", 
        padding: "4px 0", 
        fontSize: "1rem",
      }}
    >
      {buttonValues.map(({ value, label }) => (
        <ToggleButton
          key={value}
          value={value}
          sx={{
            flex: 1/8,
            borderRadius: value === "all" ? "100px 0 0 100px" : value === "sent" ? "0 100px 100px 0" : "0",
            padding: "8px 16px",
            fontSize: "0.8rem",
            backgroundColor: alignment === value ? "primary.main" : "#f0ecec",
            color: alignment === value ? "white" : "black",
            border: `1px solid black`,
            borderRight: value !== "sent" ? "2px solid black" : "1px solid black",
            borderTopLeftRadius: value === "all" ? "100px" : "0",
            borderTopRightRadius: value === "sent" ? "100px" : "0",
            borderBottomLeftRadius: value === "all" ? "100px" : "0",
            borderBottomRightRadius: value === "sent" ? "100px" : "0",
          }}
        >
          {alignment === value && (
            <CheckIcon
              sx={{
                fontWeight: "bold",
                position: "relative",
                right: 4,
                top: 1,
                color: "#0033A0",
                fontSize: "0.7rem",
              }}
            />
          )}
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}