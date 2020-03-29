import {calcGrowthRate} from './calc';

describe(`calcGrowthRate`, () => {
  test('calculates growth rate', () => {
    // @see https://www.wikihow.com/Calculate-an-Annual-Percentage-Growth-Rate
    expect(calcGrowthRate(10000, 65000, 4)).toEqual("59.67")
  });
});