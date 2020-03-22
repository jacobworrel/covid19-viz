import React, {useState, useEffect, useMemo} from 'react';
import './App.css';
import axios from 'axios';
import csvToJson from 'csvtojson';
import * as R from 'ramda';
import {LineChart} from './LineChart';
import Select from 'react-select';
import {makeDateList, makeRegionList, makeLineChartData} from './transformer';

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
      <div className="section l-center">COVID-19 Data Explorer</div>
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

function Report ({ selectedRegionList, url, title, isShown }) {
  const [data, setData] = useState([]);
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
  return (
    <div className="chart">
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
    <div>
      <input type="checkbox" id={id} name={name} checked={isChecked} onChange={onChange} />
      <label htmlFor={id}>{name}</label>
    </div>
  );
}