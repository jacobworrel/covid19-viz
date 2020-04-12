import {calcAvgGrowthRate, calcGrowthRate} from './calc';

describe(`calcGrowthRate`, () => {
  test('calculates average growth rate', () => {
    // @see https://www.wikihow.com/Calculate-an-Annual-Percentage-Growth-Rate
    expect(calcAvgGrowthRate(10000, 65000, 4)).toEqual("59.67")
  });

  test('calculates growth rate', () => {
    expect(calcGrowthRate(100, 110)).toEqual('10.00');
  });
});