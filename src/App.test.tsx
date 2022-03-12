import { render, screen } from '@testing-library/react';
import App from './App';

test('initial maze type', () => {
  render(<App />);
  const elem = screen.getByLabelText('Type:') as HTMLInputElement;
  expect(elem).toBeInTheDocument();
  expect(elem.value).toEqual('rectangular');
});
