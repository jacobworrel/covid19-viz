import React, {useState, useEffect, useMemo} from 'react';
import './App.css';
import axios from 'axios';
import csvToJson from 'csvtojson';
import * as R from 'ramda';
import {LineChart} from './LineChart';
import Select from 'react-select';
import {makeDateList, makeRegionList, makeLineChartData} from './transformer';

const confirmedUrl =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';

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

  const dateList = makeDateList(data);
  const regionList = makeRegionList(data);
  const lineChartData = useMemo(() => makeLineChartData({ data, selectedRegionList }), [data, selectedRegionList])

  return (
    <div className="app l-column">
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
        <LineChart
          title="Confirmed Cases"
          data={lineChartData}
          categories={dateList}
        />
      )}
    </div>
  );
}
