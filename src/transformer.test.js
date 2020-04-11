import { makeRegionList } from './transformer';
import { makeDateList } from './transformer';
import { calcNew } from './transformer';

describe(`transformer`, () => {
  describe(`makeRegionList`, () => {
    it('makes region list', () => {
      const data = [
        ['headers'],
        ['California', 'US'],
        ['', 'Italy'],
        ['Texas', 'US'],
      ];
      expect(makeRegionList(data)).toEqual([
        { value: 'California', label: 'California' },
        { value: 'Italy', label: 'Italy' },
        { value: 'Texas', label: 'Texas' },
      ]);
    });
    it('sorts region list', () => {
      const data = [
        ['headers'],
        ['California', 'US'],
        ['Texas', 'US'],
        ['', 'Italy'],
      ];
      expect(makeRegionList(data)).toEqual([
        { value: 'California', label: 'California' },
        { value: 'Italy', label: 'Italy' },
        { value: 'Texas', label: 'Texas' },
      ]);
    });
  });

  describe(`makeDateList`, () => {
    it(`makes date list`, () => {
      const data = [
        ['region','country','lat','long','date1','date2'],
      ];

      expect(makeDateList(data)).toEqual(['date1', 'date2'])
    });
  });

  describe(`calcNew`, () => {
    it(`should`, () => {
      const data = [
        { data: [1,2,3,4,5], name: 'Foo' },
        { data: [1,3,1,10,5], name: 'Bar' },
      ];

      expect(calcNew(data)).toEqual([
        { data: [1, 1, 1, 1, 1], name: 'Foo' },
        { data: [1, 2, 0, 9, 0], name: 'Bar' },
      ])
    });
  });
});
