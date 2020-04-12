import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import React from 'react';

const defaultOptions = {
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
  chart: {
    zoomType: 'xy',
    resetZoomButton: {
      position: {
        align: 'left',
      },
    },
  }
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
            text: '',
          },
        },
        title: {
          text: title,
        },
      }}
    />
  );
}