import ItemTableCard from "../shared/ItemTableCard";

export default function Parties() {
  return (
    <ItemTableCard
      title="Parties"
      scope="parties"
      fields={[
        { key: "date", label: "Date", type: "date" },
        { key: "time", label: "Time", type: "time" },
        { key: "howMany", label: "How many?", type: "text" },
        { key: "specialRequests", label: "Special Requests", type: "text" },
        { key: "contact", label: "Contact", type: "text" },
        { key: "cell", label: "Cell", type: "text" }
      ]}
    />
  );
}
