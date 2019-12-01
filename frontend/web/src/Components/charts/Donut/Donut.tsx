import Chart from 'react-apexcharts';
import React from 'react';
import { FundType } from '../../../Models/fund-store';

export interface Props {
  fund: FundType;
}

export const FundCharts = (props: Props) => {
  const generateSeries = fund => {
    const total = fund.tokens;
    const bought = fund.entries.reduce((total, entry) => {
      console.log(entry.toJSON().tokens_amount);
      return total + entry.toJSON().tokens_amount;
    }, 0);
    return [bought, total - bought];
  };

  const state = {
    series: generateSeries(props.fund),
    options: {
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val + '%';
        },
      },
      labels: ['bought', 'missing'],

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              show: false,
            },
          },
        },
      ],
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
      },
    },
  };

  return <Chart options={state.options} series={state.series} type="donut" width="380" />;
};
