import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import React from 'react';

const defaultOptions = {
  credits: {
    enabled: false,
  },
  chart: {
    type: 'column',
    zoomType: 'xy',
    resetZoomButton: {
      position: {
        align: 'left',
      },
    },
  }
};

export function ColumnChart({title, data, categories}) {
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