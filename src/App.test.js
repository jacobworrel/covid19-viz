import React from 'react';
import { render } from '@testing-library/react';
import App, {calcGrowthRate} from './App';

test('renders app', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeTruthy();
});

describe(`calcGrowthRate`, () => {
  test('calculates growth rate', () => {
    // @see https://www.wikihow.com/Calculate-an-Annual-Percentage-Growth-Rate
    expect(calcGrowthRate(10000, 65000, 4)).toEqual("59.67")
  });
});
