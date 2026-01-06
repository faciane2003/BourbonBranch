import { TextField } from "@mui/material";
import { useState } from "react";
import ItemTableCard from "../shared/ItemTableCard";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <ItemTableCard
      title="Items"
      scope="items"
      searchTerm={searchTerm}
      searchControl={
        <TextField
          size="small"
          placeholder="Search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          sx={{ minWidth: 180 }}
        />
      }
    />
  );
}
