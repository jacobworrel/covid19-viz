import React, {useState} from 'react';
import * as R from 'ramda';
import CounterInput from 'react-counter-input';
import {LineChart} from './LineChart';
import {calcGrowthRate} from './calc';
import { isNotEmpty, isLength1, calcNew } from './transformer';
import { ColumnChart } from './ColumnChart';
import { Checkbox } from './Checkbox';

export function Report ({ selectedPlaceList, data: { chartData, dateList } = {}, title }) {
  const [timeRangeById, setTimeRangeById] = useState({ allTime: false, last30Days: true });
  const [growthRange, setGrowthRange] = useState(2);
  const growth = R.ifElse(
    () => R.and(isNotEmpty(chartData), isLength1(selectedPlaceList)),
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
  )(chartData);

  const takeLast30 = R.when(
    () => R.propEq('last30Days', true)(timeRangeById),
    R.takeLast(30)
  );
  const chartDataWithTimeRange = R.map(
    R.pipe(
      ({ name, data }) => {
        return {
          name,
          data: takeLast30(data)
        };
      }
    )
  )(chartData);
  return (
    <div className="chart">
      <h2>{title}</h2>
      <div className="l-flex">
        <label>Time Range:</label>
        <Checkbox
          id="allTime"
          name="All Time"
          isChecked={timeRangeById.allTime}
          onChange={() => setTimeRangeById(prevTimeRangeById => ({ ...R.map(R.always(false))(prevTimeRangeById), allTime: !prevTimeRangeById.allTime }))}
        />
        <Checkbox
          id="last30Days"
          name="Last 30 Days"
          isChecked={timeRangeById.last30Days}
          onChange={() => setTimeRangeById((prevTimeRangeById => ({ ...R.map(R.always(false))(prevTimeRangeById), last30Days: !prevTimeRangeById.last30Days })))}
        />
      </div>
      { growth && (
        <div>
          <h4 style={{ marginBottom: 5 }}>Daily Growth Rate: {growth}%</h4>
          {/*<div className="l-vCenter">*/}
          {/*  <h4 style={{ margin: 0 }}>Growth Rate Range (in days):</h4>*/}
          {/*  <CounterInput count={growthRange} onCountChange={count => setGrowthRange(count)} min={2} inputStyle={{ width: 28 }} />*/}
          {/*</div>*/}
        </div>
      )}
        <LineChart
          title={`Total ${title}`}
          data={chartDataWithTimeRange}
          categories={takeLast30(dateList)}
        />
        <ColumnChart
          title={`New ${title}`}
          data={calcNew(chartDataWithTimeRange)}
          categories={takeLast30(dateList)}
        />
    </div>
  );
}