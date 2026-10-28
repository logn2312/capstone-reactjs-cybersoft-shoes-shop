export default function SortSelect({ value, onChange }) {
  return (
    <label className="sort-select">
      <span>Price</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="decrease">High → Low</option>
        <option value="ascending">Low → High</option>
      </select>
    </label>
  )
}
