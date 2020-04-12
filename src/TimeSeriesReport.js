import React, {useState} from 'react';
import * as R from 'ramda';
import {LineChart} from './LineChart';
import {calcGrowthRate} from './calc';
import { isNotEmpty, isLength1, calcNew } from './transformer';
import { ColumnChart } from './ColumnChart';
import { Checkbox } from './Checkbox';

export function TimeSeriesReport ({ selectedPlaceList, data: { chartData, dateList } = {}, title }) {
  const [timeRangeById, setTimeRangeById] = useState({ allTime: false, last30Days: true });
  const growth = R.ifElse(
    () => R.and(isNotEmpty(chartData), isLength1(selectedPlaceList)),
    R.pipe(
      R.head,
      R.prop('data'),
      R.takeLast(2),
      (data) => {
        const past = R.head(data);
        const present = R.last(data);
        return calcGrowthRate(past, present)
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
        {R.pipe(
          R.keys,
          R.map(id => (
            <Checkbox
              key={id}
              id={id}
              name={timeRangeNameById[id]}
              isChecked={timeRangeById[id]}
              onChange={() => setTimeRangeById(prevTimeRangeById => ({ ...R.map(R.always(false))(prevTimeRangeById), [id]: !prevTimeRangeById[id] }))}
            />
          ))
        )(timeRangeById)}
      </div>
      { growth && (<div style={{ margin: '20px 0'}}>Daily Growth Rate: {growth}%</div>)}
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

const timeRangeNameById = {
  allTime: 'All Time',
  last30Days: 'Last 30 Days',
};