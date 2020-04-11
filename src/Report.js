import React, {useState} from 'react';
import * as R from 'ramda';
import CounterInput from 'react-counter-input';
import {LineChart} from './LineChart';
import {calcGrowthRate} from './calc';
import { isNotEmpty, isLength1, calcNew } from './transformer';
import { ColumnChart } from './ColumnChart';

export function Report ({ selectedPlaceList, data: { chartData, dateList } = {}, title }) {
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
  return (
    <div className="chart">
      <h2>{title}</h2>
      { growth && (
        <div>
          <h4 style={{ marginBottom: 5 }}>Avg Daily Growth Rate: {growth}%</h4>
          <div className="l-vCenter">
            <h4 style={{ margin: 0 }}>Range (in days):</h4>
            <CounterInput count={growthRange} onCountChange={count => setGrowthRange(count)} min={2} inputStyle={{ width: 28 }} />
          </div>
        </div>
      )}
        <LineChart
          title={`Total ${title}`}
          data={chartData}
          categories={dateList}
        />
        <ColumnChart
          title={`New ${title}`}
          data={calcNew(chartData)}
          categories={dateList}
        />
    </div>
  );
}