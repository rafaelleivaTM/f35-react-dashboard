import PropTypes from 'prop-types';
import { useState } from 'react';
import { Box, Card, CardHeader, CircularProgress, Divider, Stack } from '@mui/material';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';

AppIncomingOrders.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.object,
  loading: PropTypes.bool,
};
export default function AppIncomingOrders({ title, subheader, list, loading, ...other }) {
  const theme = useTheme();
  const [showOrdersByHour, setShowOrdersByHour] = useState(true);

  // list.byHours = list.byHours || [];

  const seriesHoursData =
    list && list.byHours
      ? list?.byHours.flat().map((hour) => ({
          x: moment.utc(hour.created_at).format(),
          y: hour.ordersCount,
        }))
      : [];

  const groupedData = list.byHours.reduce((groups, item) => {
    const date = moment(item.created_at);
    const day = `${date.get('year')}-${date.get('month') + 1}-${date.get('date')}`;

    if (!groups[day]) {
      groups[day] = [];
    }

    groups[day].push(item);

    return groups;
  }, {});

  const seriesHours = Object.values(groupedData).map((dayData, index) => ({
    name: `${moment(dayData[0].created_at).format('MMM Do')}`,
    data: dayData.map((item) => item.ordersCount),
  }));

  const ordersByHourOptions = {
    chart: {
      type: 'line',
    },
    xaxis: {
      categories: seriesHoursData.map((hour) => moment(hour.x).format('HH:mm')),
    },
    yaxis: {
      title: {
        text: 'Orders',
      },
    },
    title: {
      text: 'By hours',
    },
  };

  const seriesDaysData =
    list && list.byDays
      ? list?.byDays.flat().map((day) => ({
          x: moment.utc(day.date).format('YYYY-MM-DD'),
          y: day.orderCount,
          label: day.weekDay,
        }))
      : [];

  const dayLabels = seriesDaysData.map((day) => day.label);

  const ordersByDaysData = {
    series: [
      {
        name: 'Orders',
        data: seriesDaysData,
      },
    ],
    options: {
      chart: {
        type: 'bar',
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          endingShape: 'rounded',
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: '12px',
                fontWeight: 700,
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
        formatter(val) {
          return `${val}`;
        },
      },
      stroke: {
        show: true,
        // width: 2,
        colors: ['transparent'],
      },
      legend: {
        position: 'right',
        offsetY: 40,
      },
      yaxis: {
        title: {
          text: 'Orders',
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM yyyy',
            day: 'dd MMM yyyy',
          },
        },
      },
      title: {
        text: 'By days',
      },
      tooltip: {
        y: {
          formatter(val, { series, seriesIndex, dataPointIndex }) {
            return `${seriesDaysData[dataPointIndex].label}: ${val}`;
          },
        },
      },
    },
  };

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{ '& .MuiCardHeader-action': { alignSelf: 'center', m: 0, display: 'flex' } }}
        action={
          <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ px: 3, pr: 0 }}>
            {loading ? <CircularProgress size={30} /> : <></>}
          </Stack>
        }
      />

      <Box sx={{ px: 3, mt: 2 }}>
        <Chart options={ordersByHourOptions} series={seriesHours} type="line" height={364} />
        {ordersByDaysData.series &&
          ordersByDaysData.series &&
          ordersByDaysData.series[0] &&
          ordersByDaysData.series[0].data?.length > 1 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Chart options={ordersByDaysData.options} series={ordersByDaysData.series} type="bar" height={364} />
            </>
          )}
      </Box>
    </Card>
  );
}
