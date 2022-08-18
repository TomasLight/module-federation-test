import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';

test('check if ~components import is resolved correctly', () => {
  const onClick = jest.fn();

  render(<Button onClick={onClick} />);

  fireEvent.click(screen.getByText('default button name'));

  expect(onClick).toBeCalledTimes(1);
});
