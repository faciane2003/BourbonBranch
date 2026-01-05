import ItemTableCard from "../shared/ItemTableCard";

export default function Tasks() {
  return (
    <ItemTableCard
      title="Tasks"
      scope="tasks"
      fields={[
        { key: "objective", label: "Objective", type: "text" },
        { key: "notes", label: "Notes", type: "text" },
        { key: "status", label: "Status", type: "text" }
      ]}
    />
  );
}
