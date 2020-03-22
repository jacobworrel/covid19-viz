import { makeRegionList } from './transformer';
import { makeDateList } from './transformer';

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
});
