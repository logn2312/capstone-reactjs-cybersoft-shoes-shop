const OPTIONS = [
  { label: 'Male', value: true, icon: 'bi-gender-male' },
  { label: 'Female', value: false, icon: 'bi-gender-female' },
]

export default function GenderRadio({ value, onChange }) {
  return (
    <div className="gender-group">
      <span className="form-label-ui">Gender</span>
      <div className="d-flex gap-2">
        {OPTIONS.map((opt) => (
          <label className={`gender-option ${value === opt.value ? 'active' : ''}`} key={opt.label}>
            <input
              type="radio"
              name="gender"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <i className={`bi ${opt.icon}`}></i>
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
