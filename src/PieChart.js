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
    height: 800,
    width: 800,
    type: 'pie',
    zoomType: 'xy',
  }
};

export function PieChart({metricTitle, data }) {
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        ...defaultOptions,
        title: {
          text: `Top 10 States by ${metricTitle}`,
        },
        series: [{
          name: metricTitle,
          data,
        }],
      }}
    />
  );
}