import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { PhoneInput } from './PhoneInput';

function ControlledPicker() {
  const [value, setValue] = useState('');
  return (
    <div>
      <PhoneInput value={value} onChange={setValue} />
      <output data-testid="emitted">{value}</output>
    </div>
  );
}

describe('PhoneInput', () => {
  it('renders the TUN +216 code as the default selection', () => {
    render(<ControlledPicker />);
    expect(screen.getByRole('combobox')).toHaveValue('+216');
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('emits the combined "+216 <digits>" value while typing', async () => {
    const user = userEvent.setup();
    render(<ControlledPicker />);
    await user.type(screen.getByRole('textbox'), '71 000 111');
    expect(screen.getByTestId('emitted')).toHaveTextContent('+216 71 000 111');
  });

  it('keeps the digits and swaps the code when another country is chosen', async () => {
    const user = userEvent.setup();
    render(<ControlledPicker />);
    await user.type(screen.getByRole('textbox'), '333 123 456');
    await user.selectOptions(screen.getByRole('combobox'), '+39');
    expect(screen.getByTestId('emitted')).toHaveTextContent('+39 333 123 456');
  });

  it('preserves a pasted code that is not in the preset list', async () => {
    const user = userEvent.setup();
    render(<ControlledPicker />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.paste('+49 170 555 888');
    expect(screen.getByTestId('emitted')).toHaveTextContent('+49 170 555 888');
  });
});