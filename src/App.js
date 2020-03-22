import React, {useState, useEffect, useMemo} from 'react';
import './App.css';
import axios from 'axios';
import csvToJson from 'csvtojson';
import * as R from 'ramda';
import {LineChart} from './LineChart';
import Select from 'react-select';
import {makeDateList, makeRegionList, makeLineChartData} from './transformer';

const confirmedUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';
const deathsUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv';
const recoveredUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv';

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
      </div>
      {R.not(R.isEmpty(selectedRegionList)) && (
        <Report
          selectedRegionList={selectedRegionList}
          url={confirmedUrl}
          title="Confirmed Cases"
        />
      )}

      {R.not(R.isEmpty(selectedRegionList)) && (
        <Report
          selectedRegionList={selectedRegionList}
          url={deathsUrl}
          title="Deaths"
        />
      )}

      {R.not(R.isEmpty(selectedRegionList)) && (
        <Report
          selectedRegionList={selectedRegionList}
          url={recoveredUrl}
          title="Recovered Cases"
        />
      )}
    </div>
  );
}

function Report ({ selectedRegionList, url, title }) {
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

  const dateList = makeDateList(data);
  // const lineChartData = useMemo(() => makeLineChartData({ data, selectedRegionList }), [data, selectedRegionList])
  const lineChartData = makeLineChartData({ data, selectedRegionList });
  return (
    <LineChart
      title={title}
      data={lineChartData}
      categories={dateList}
    />
  );
}