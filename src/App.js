import React, {useState} from 'react';
import './App.css';
import * as R from 'ramda';
import {Report} from './Report';
import Select from 'react-select';
import {makeDateList, makeRegionList, makeLineChartData, makeSelectOption, makeOptions, makeCountyOptions, groupByState, groupByCounty, isOnlyUSA, isNotEmpty, parseRow} from './transformer';
import { Checkbox } from './Checkbox';
import { useFetchCSV } from './customHook';


const selectWidth = 250;
const widgetMarginLeft = 30;

const titleByMetricId = {
  cases: 'Confirmed Cases',
  deaths: 'Deaths',
};

export default function App() {
  const [metricById, setMetricById] = useState({ cases: true, deaths: false });

  // GLOBAL
  const [selectedCountryList, setSelectedRegionList] = useState([makeSelectOption('US')]);
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

  return (
    <div className="app l-column">
      <h1 className="section l-center">COVID-19 Data Explorer</h1>
      {/*<p className="l-center" style={{ fontSize: 100, margin: 0 }}>&#128567;</p>*/}
      <div className="section l-center">
        <div style={{ width: selectWidth }}>
          <Select
            options={makeRegionList(globalCasesData)}
            isMulti
            onChange={R.pipe(
              R.defaultTo([]),
              R.when(
                R.isEmpty,
                R.tap(() => {
                  setSelectedStateList([]);
                  setSelectedCountyList([]);
                }),
              ),
              selectedList => setSelectedRegionList(selectedList)
            )}
            placeholder="Select Region/Country"
            value={selectedCountryList}
          />
        </div>
        {isOnlyUSA(selectedCountryList) && (
          <div style={{ width: selectWidth, marginLeft: widgetMarginLeft }} >
            <Select
              options={makeOptions(byState)}
              isMulti
              onChange={
                R.pipe(
                  R.defaultTo([]),
                  R.when(
                    R.isEmpty,
                    R.tap(() => setSelectedCountyList([])),
                  ),
                  selectedList => setSelectedStateList(selectedList)
                )
              }
              placeholder="Select State"
              value={selectedStateList}
            />
          </div>
        )}
        {isOnlyUSA(selectedCountryList) && isNotEmpty(selectedStateList) && (
          <div style={{ width: selectWidth, marginLeft: widgetMarginLeft }}>
            <Select
              options={R.pipe(
                R.filter(R.any(([date, county, state]) => R.includes(state)(R.pluck('value')(selectedStateList)))),
                makeCountyOptions,
              )(byCounty)
              }
              isMulti
              onChange={selectedList =>
                setSelectedCountyList(R.defaultTo([])(selectedList))
              }
              placeholder="Select County"
              value={selectedCountyList}
            />
          </div>
        )}
        <div className="l-flex" style={{ marginLeft: widgetMarginLeft }}>
          {R.pipe(
            R.keys,
            R.map(
              metricId => (
                <Checkbox
                  key={metricId}
                  id={metricId}
                  name={titleByMetricId[metricId]}
                  isChecked={metricById[metricId]}
                  onChange={() => setMetricById((prevMetricById => ({ ...prevMetricById, [metricId]: !prevMetricById[metricId] })))}
                />
              )
            )
          )(metricById)}
        </div>
      </div>

      { R.pipe(
        R.filter(R.equals(true)),
        R.keys,
        R.map(selectedMetric => {
          const isCountyListNotEmpty = isNotEmpty(selectedCountyList);
          const isStateListNotEmpty = isNotEmpty(selectedStateList);
          const selectedPlaceList = isCountyListNotEmpty ? selectedCountyList : isStateListNotEmpty ? selectedStateList : selectedCountryList;
          const byPlace = isCountyListNotEmpty ? byCounty : isStateListNotEmpty ? byState : null;
          const globalData = {
            cases: globalCasesData,
            deaths: globalDeathsData,
          };
          return (
            <Report
              key={selectedMetric}
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
          )
        })
      )(metricById)}
    </div>
  );
}

