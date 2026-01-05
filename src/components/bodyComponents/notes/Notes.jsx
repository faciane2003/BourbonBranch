import ItemTableCard from "../shared/ItemTableCard";

export default function Notes() {
  return (
    <ItemTableCard
      title="Notes"
      scope="notes"
      fields={[
        { key: "date", label: "Date", type: "date" },
        { key: "info", label: "Info", type: "text" },
        { key: "name", label: "Name", type: "text" },
        { key: "type", label: "Type", type: "text" }
      ]}
    />
  );
}
