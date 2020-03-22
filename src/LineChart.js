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
        yAxis: {
          title: {
            text: title,
          },
        },
        title: {
          text: title,
        },
      }}
    />
  );
}