import * as R from 'ramda';


const makeSelectOption = x => ({value: x, label: x});

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