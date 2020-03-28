import React, {useState, useEffect, useMemo} from 'react';
import './App.css';
import axios from 'axios';
import csvToJson from 'csvtojson';
import * as R from 'ramda';
import {LineChart} from './LineChart';
import Select from 'react-select';
import {makeDateList, makeRegionList, makeLineChartData} from './transformer';
import CounterInput from 'react-counter-input';

const reportList = [
  {
    id: 'confirmed',
    url: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv',
    title: 'Confirmed Cases',
  },
  {
    id: 'deaths',
    url: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv',
    title: 'Deaths',
  },
  {
    id: 'recovered',
    url: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv',
    title: 'Recovered Cases',
  },
]

export default function App() {
  const [data, setData] = useState([]);
  const [selectedRegionList, setSelectedRegionList] = useState([]);
  const [metricById, setMetricById] = useState({ confirmed: true, deaths: false, recovered: false });
  useEffect(() => {
    axios.get(reportList[0].url).then(({data: csvStr}) => {
      csvToJson({
        noheader: true,
        output: 'csv',
      })
        .fromString(csvStr)
        .then(data => setData(data));
    });
  }, []);

  const regionList = makeRegionList(data);

  return (
    <div className="app l-column">
      {/*<p className="l-center" style={{ fontSize: 100, margin: 0 }}>&#128567;</p>*/}
      <h1 className="section l-center">COVID-19 Data Explorer</h1>
      <div className="section l-center">
        <div style={{ width: 300 }}>
          <Select
            options={regionList}
            isMulti
            onChange={selectedList =>
              setSelectedRegionList(R.defaultTo([])(selectedList))
            }
            placeholder="Select Region/Country"
          />
        </div>
        <div className="l-flex" style={{ marginLeft: 30 }}>
          {reportList.map(({ title, id }) => (
            <Checkbox
              key={id}
              id={id}
              name={title}
              isChecked={metricById[id]}
              onChange={() => setMetricById((prevMetricById => ({ ...prevMetricById, [id]: !prevMetricById[id] })))}
            />
          ))}
        </div>
      </div>
      {R.not(R.isEmpty(selectedRegionList)) && (
        reportList.map(({id, url, title }) => (
          <Report
            key={id}
            selectedRegionList={selectedRegionList}
            url={url}
            title={title}
            isShown={metricById[id]}
          />
        ))
      )}
    </div>
  );
}

export function calcGrowthRate (past, present, n) {
  if (past === 0) {
    return null;
  }
  return ((Math.pow(present / past, 1 / n) - 1) * 100).toFixed(2);
}

function Report ({ selectedRegionList, url, title, isShown }) {
  const [data, setData] = useState([]);
  const [growthRange, setGrowthRange] = useState(7);

  useEffect(() => {
    axios.get(url).then(({data: csvStr}) => {
      csvToJson({
        noheader: true,
        output: 'csv',
      })
        .fromString(csvStr)
        .then(data => setData(data));
    });
  }, []);

  if (!isShown) {
    return null;
  }

  const dateList = makeDateList(data);
  const lineChartData = makeLineChartData({ data, selectedRegionList });

  const growth = R.ifElse(
    () => R.and(R.not(R.isEmpty(data)), R.pipe(R.length, R.equals(1))(selectedRegionList)),
    R.pipe(
      R.head,
      R.prop('data'),
      R.takeLast(growthRange),
      (data) => {
        const past = R.head(data);
        const present = R.last(data);
        return calcGrowthRate(past, present, growthRange)
      },
    ),
    () => null
  )(lineChartData);
  return (
    <div className="chart">
      <h2>{title}</h2>
      { growth && (
        <div>
          <h4>Avg Daily Growth Rate: {growth}%</h4>
          <div className="l-vCenter">
            <h4>Range of days:</h4>
            <CounterInput count={growthRange} onCountChange={count => setGrowthRange(count)} />
          </div>
        </div>
      )}
      <LineChart
        title={title}
        data={lineChartData}
        categories={dateList}
      />
    </div>
  );
}

function Checkbox ({ id,  name, isChecked, onChange }) {
  return (
    <div className="checkbox">
      <input type="checkbox" id={id} name={name} checked={isChecked} onChange={onChange} />
      <label htmlFor={id}>{name}</label>
    </div>
  );
}