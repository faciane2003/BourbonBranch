import ItemTableCard from "../shared/ItemTableCard";

export default function Team() {
  return (
    <ItemTableCard
      title="Team"
      scope="team"
      fields={[
        { key: "name", label: "Name", type: "text" },
        { key: "roles", label: "Roles", type: "text" },
        { key: "cell", label: "Cell", type: "text" },
        { key: "usualShifts", label: "Usual Shifts", type: "text" }
      ]}
    />
  );
}
