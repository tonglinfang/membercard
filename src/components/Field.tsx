type FieldProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: 'text' | 'date' | 'tel' | 'number' | 'email';
  required?: boolean;
  multiline?: boolean;
  rows?: number;
};

export function Field({
  label, value, onChange, placeholder,
  type = 'text', required, multiline, rows = 3,
}: FieldProps) {
  const inputClass =
    'w-full border border-gray-300 rounded-xl px-4 py-3 text-base bg-white ' +
    'focus:outline-none focus:ring-2 focus:ring-[#00B900] focus:border-transparent transition-shadow';
  const id = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          required={required}
          aria-required={required}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          className={inputClass}
        />
      )}
    </div>
  );
}