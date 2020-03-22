import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import React from 'react';

const defaultOptions = {
  title: {
    text: '',
  },
  credits: {
    enabled: false,
  },
  yAxis: {
    title: {
      text: 'Confirmed Cases',
    },
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
  },
  plotOptions: {
    series: {
      label: {
        connectorAllowed: false,
      },
    },
  },
};

export function LineChart({title, data, categories}) {
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        ...defaultOptions,
        series: data,
        xAxis: {
          categories,
        },
        title: {
          text: title,
        },
      }}
    />
  );
}