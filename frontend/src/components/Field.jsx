export default function Field({ field, value, onChange, lookups = {} }) {
  const [name, label, type, required, options] = field;
  const common = {
    id: name,
    name,
    value: value ?? "",
    onChange: (event) => onChange(name, event.target.value),
    required: Boolean(required),
    className: "field-control",
    autoComplete: "off"
  };

  return (
    <label className="block space-y-2" htmlFor={name}>
      <span className="field-label">
        {label}{required ? <span className="required-mark"> *</span> : ""}
      </span>

      {type === "textarea" ? (
        <textarea {...common} rows={3} placeholder={`Enter ${label.toLowerCase()}`} />
      ) : type === "select" ? (
        <select {...common}>
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option.toUpperCase()}>{option}</option>
          ))}
        </select>
      ) : type === "lookup" ? (
        <select {...common}>
          <option value="">Select {label.toLowerCase()}</option>
          {(lookups[options] || []).map((option) => (
            <option key={option.ID} value={option.ID}>{option.LABEL}</option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={type}
          step={type === "number" ? "any" : undefined}
          min={type === "number" ? "0" : undefined}
          placeholder={type === "date" ? undefined : `Enter ${label.toLowerCase()}`}
        />
      )}
    </label>
  );
}
