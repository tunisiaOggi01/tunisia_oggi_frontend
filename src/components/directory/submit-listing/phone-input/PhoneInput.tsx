import { PHONE_CODES } from './phone-codes';

/** Props for the country-code picker: the full "+CC digits" form-field value. */
export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CODE_MATCH = /^(\+\d+)\s*([\s\S]*)$/;

/** Country dialing-code dropdown (e.g. TUN +216) glued to the number input; emits "+216 71 000 111". */
export function PhoneInput({ value, onChange }: PhoneInputProps) {
  const match = value.match(CODE_MATCH);
  const code = match?.[1] ?? '+216';
  const digits = match?.[2] ?? value;
  const codes = PHONE_CODES.some((c) => c.code === code)
    ? PHONE_CODES
    : [{ tag: code, code }, ...PHONE_CODES];

  function handleCodeChange(nextCode: string) {
    onChange(`${nextCode} ${digits}`);
  }

  return (
    <div className="flex border border-gray-300 focus-within:border-brand focus-within:outline-none">
      <select
        value={code}
        onChange={(e) => handleCodeChange(e.target.value)}
        aria-label="Country dialing code"
        className="w-28 shrink-0 border-0 border-r border-gray-300 bg-gray-50 p-3 text-sm focus:bg-white focus:outline-none"
      >
        {codes.map((c) => (
          <option key={c.code} value={c.code}>
            {c.tag} {c.code}
          </option>
        ))}
      </select>
      <input
        value={digits}
        onChange={(e) => onChange(`${code} ${e.target.value}`)}
        placeholder="71 000 111"
        className="w-full min-w-0 flex-1 border-0 p-3 text-sm focus:outline-none"
      />
    </div>
  );
}