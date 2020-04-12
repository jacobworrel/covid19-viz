import React, {useState} from 'react';
import './App.css';
import * as R from 'ramda';
import {TimeSeriesReport} from './TimeSeriesReport';
import {PieChart} from './PieChart';
import {makeDateList, makeRegionList, makeLineChartData, makeSelectOption, makeOptions, makeCountyOptions, groupByState, groupByCounty, isOnlyUSA, isNotEmpty, parseRow} from './transformer';
import { Tab } from './Tab';
import { useFetchCSV } from './customHook';
import { MultiSelect } from './MultiSelect';
import styled from 'styled-components';

const titleByMetricId = {
  cases: 'Confirmed Cases',
  deaths: 'Deaths',
};

export default function App() {
  const [selectedMetric, setSelectedMetric] = useState('cases');

  // GLOBAL
  const [selectedCountryList, setSelectedCountryList] = useState([makeSelectOption('US')]);
  const globalCasesData = useFetchCSV('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv');
  const globalDeathsData = useFetchCSV('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv');

  // STATE
  const [selectedStateList, setSelectedStateList] = useState([makeSelectOption('California')]);
  const stateData = useFetchCSV('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv');
  const byState = groupByState(stateData);

  // COUNTY
  const [selectedCountyList, setSelectedCountyList] = useState([{ value: 'Los Angeles,California', label: 'Los Angeles' }]);
  const countyData= useFetchCSV('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv');
  const byCounty = groupByCounty(countyData);

  const selectCountry = R.pipe(
    R.tap(() => {
      setSelectedStateList([]);
      setSelectedCountyList([]);
    }),
    selectedList => setSelectedCountryList(selectedList)
  );

  const selectState = R.pipe(
    R.tap(() => setSelectedCountyList([])),
    selectedList => setSelectedStateList(selectedList)
  );

  const isCountyListNotEmpty = isNotEmpty(selectedCountyList);
  const isStateListNotEmpty = isNotEmpty(selectedStateList);
  const selectedPlaceList = isCountyListNotEmpty ? selectedCountyList : isStateListNotEmpty ? selectedStateList : selectedCountryList;
  const byPlace = isCountyListNotEmpty ? byCounty : isStateListNotEmpty ? byState : null;
  const globalData = {
    cases: globalCasesData,
    deaths: globalDeathsData,
  };

  return (
    <div className="app l-column">
      <h1 className="section l-center">COVID-19 Data Explorer</h1>
      <div className="section l-center widget">
        <MultiSelect
          options={makeRegionList(globalCasesData)}
          onChange={selectCountry}
          placeholder="Select Region/Country"
          value={selectedCountryList}
        />
        {isOnlyUSA(selectedCountryList) && (
          <MultiSelect
            options={makeOptions(byState)}
            onChange={selectState}
            placeholder="Select State"
            value={selectedStateList}
          />
        )}
        {isOnlyUSA(selectedCountryList) && isNotEmpty(selectedStateList) && (
          <MultiSelect
            options={R.pipe(
              R.filter(R.any(([date, county, state]) => R.includes(state)(R.pluck('value')(selectedStateList)))),
              makeCountyOptions,
            )(byCounty)}
            onChange={selectedList => setSelectedCountyList(selectedList)}
            placeholder="Select County"
            value={selectedCountyList}
          />
        )}
      </div>

      <div className="l-flex">
        <Tab
          id="cases"
          name={titleByMetricId.cases}
          onClick={() => setSelectedMetric('cases')}
          selectedMetric={selectedMetric}
        />
        <Tab
          id="deaths"
          name={titleByMetricId.deaths}
          onClick={() => setSelectedMetric('deaths')}
          selectedMetric={selectedMetric}
        />
      </div>

      <ReportWrapper key={selectedMetric} className="l-flexColumn l-vCenter">
        <TimeSeriesReport
          selectedMetric={selectedMetric}
          data={R.pipe(
            R.ifElse(
              R.isNil,
              () => {
                const data = globalData[selectedMetric];
                return {
                  chartData: makeLineChartData({ data, selectedRegionList: selectedCountryList }),
                  dateList: makeDateList(data),
                }
              },
              R.pipe(
                byPlace => {
                  const data = R.pipe(
                    R.pickBy((val, key) => R.includes(key)(R.pluck('value')(selectedPlaceList))),
                    R.values,
                    R.map(x => R.map(parseRow)(x))
                  )(byPlace);
                  const dateList = R.pipe(R.reduce(R.maxBy(R.length), []), R.pluck('date'))(data);
                  const dateListLength = R.length(dateList);
                  const chartData = R.map(
                    x => {
                      const name = R.pipe(
                        R.head,
                        R.defaultTo({}),
                        R.prop('place')
                      )(x);
                      return {
                        data: R.pipe(
                          R.when(
                            R.pipe(
                              R.length,
                              R.lt(R.__, dateListLength),
                            ),
                            list => {
                              const diff = dateListLength - R.length(list);
                              return R.concat(R.times(R.always(0))(diff), list);
                            }
                          ),
                          R.pluck(selectedMetric), R.map(parseInt)
                        )(x),
                        name,
                      };
                    }
                  )(data);
                  return {
                    chartData,
                    dateList,
                  }
                }
              )
            ),
          )(byPlace)}
          title={titleByMetricId[selectedMetric]}
          selectedPlaceList={selectedPlaceList}
        />
        {isOnlyUSA(selectedCountryList) && (
          <PieWrapper className="l-flex l-hCenter">
            <PieChart
              metricTitle={titleByMetricId[selectedMetric]}
              data={R.pipe(
                R.map(
                  R.pipe(
                    R.last,
                    ([date, state, fips, cases, deaths]) => ({ state, cases, deaths }),
                    (x) => ({ name: x.state, y: parseInt(x[selectedMetric]) })
                  )
                ),
                R.values,
                R.sort(R.descend(R.prop('y'))),
                R.take(10),
              )(byState)}
            />
          </PieWrapper>
        )}
      </ReportWrapper>
    </div>
  );
}

const ReportWrapper = styled.div`
  border: 1px solid #E2E2E2;
  padding: 30px;
`;

const PieWrapper = styled.div`
  width: 100%;
`;