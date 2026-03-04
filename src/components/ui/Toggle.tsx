interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <label className="tog">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="tog-sl" />
    </label>
  );
}
