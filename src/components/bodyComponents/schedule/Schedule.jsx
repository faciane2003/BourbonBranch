import ItemTableCard from "../shared/ItemTableCard";

export default function Schedule() {
  return (
    <ItemTableCard
      title="Schedule Requests"
      scope="schedule"
      fields={[
        { key: "date", label: "Date", type: "date" },
        {
          key: "shift",
          label: "AM/PM",
          type: "select",
          options: ["AM", "PM", "Both"]
        },
        { key: "role", label: "Role", type: "text" },
        { key: "name", label: "Name", type: "text" },
        { key: "cell", label: "Cell", type: "text" },
        { key: "notes", label: "Notes", type: "text" }
      ]}
    />
  );
}
