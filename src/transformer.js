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