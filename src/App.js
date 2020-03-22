import React, {useState, useEffect, useMemo} from 'react';
import axios from 'axios';
import csvToJson from 'csvtojson';
import * as R from 'ramda';
import {LineChart} from './LineChart';
import Select from 'react-select';

const confirmedUrl =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';

const makeOption = x => ({value: x, label: x});
export default function App() {
  const [data, setData] = useState([]);
  const [selectedRegionList, setSelectedRegionList] = useState([]);
  useEffect(() => {
    axios.get(confirmedUrl).then(({data: csvStr}) => {
      csvToJson({
        noheader: true,
        output: 'csv',
      })
        .fromString(csvStr)
        .then(data => setData(data));
    });
  }, []);

  const dateList = R.pipe(
    R.head,
    R.defaultTo([]),
    R.drop(4),
    R.unnest,
  )(data);
  const regionList = R.pipe(
    R.drop(1),
    R.map(([region, country]) =>
      region === '' ? makeOption(country) : makeOption(region),
    ),
    R.sortBy(R.prop('value')),
  )(data);
  const lineChartData = useMemo(() => {
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
  }, [data, selectedRegionList]);

  return (
    <div className="App">
      <Select
        options={regionList}
        isMulti
        onChange={selectedList =>
          setSelectedRegionList(R.defaultTo([])(selectedList))
        }
        placeholder="Select Region/Country"
      />
      <LineChart data={lineChartData} categories={dateList}/>
    </div>
  );
}
