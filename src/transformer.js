import * as R from 'ramda';


export const makeSelectOption = x => ({value: x, label: x});

export const makeDateList = R.pipe(
  R.head,
  R.defaultTo([]),
  R.drop(4),
  R.unnest,
);

export const makeRegionList = R.pipe(
  R.drop(1),
  R.map(([region, country]) =>
    region === '' ? makeSelectOption(country) : makeSelectOption(region),
  ),
  R.sortBy(R.prop('value')),
);

export const makeOptions = R.pipe(
  R.keys,
  R.map(makeSelectOption),
  R.sortBy(R.prop('value')),
);

export const makeCountyOptions = R.pipe(
  R.keys,
  R.map(
    key => {
      const county = R.pipe(
        R.split(','),
        R.head,
      )(key);

      return {
        value: key,
        label: county,
      }
    }
  ),
  R.sortBy(R.prop('id')),
);

export const makeLineChartData = ({ data, selectedRegionList}) => {
  const valueList = R.pluck('value')(selectedRegionList);
  return R.pipe(
    R.filter(
      ([region, country]) =>
        R.includes(region)(valueList) || R.includes(country)(valueList),
    ),
    R.map(([region, country, lat, long, ...timeSeriesData]) => ({
      name: R.ifElse(
        ([region]) => R.not(R.isEmpty(region)),
        R.join(', '),
        ([_, country]) => country,
      )([region, country]),
      data: R.map(parseInt)(timeSeriesData),
    })),
    R.unnest,
  )(data);
};

export const groupByCounty = R.pipe(
  R.drop(1),
  R.groupBy(([date, county, state]) => R.join(',')([county, state]))
);

export const groupByState = R.pipe(
  R.drop(1),
  R.groupBy(([date, state]) => state)
);

export const isLength1 = R.pipe(R.length, R.equals(1));
export const isOnlyUSA = selectedRegionList => R.includes(makeSelectOption('US'))(selectedRegionList) && isLength1(selectedRegionList);
export const isNotEmpty = x => R.not(R.isEmpty(x));

export const parseRow = (row) => {
  const [date, place] =  R.take(2)(row);
  const [cases, deaths] =  R.takeLast(2)(row);

  return {
    date,
    place,
    cases,
    deaths,
  }
};