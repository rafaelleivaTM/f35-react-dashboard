import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
// @mui
import { Box, Card, CardHeader, CircularProgress } from "@mui/material";
// components
import { useChart } from "../../../components/chart";

// ----------------------------------------------------------------------

BarChartSummaryRangeInfo.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
};

export default function BarChartSummaryRangeInfo({ title, subheader, chartLabels, chartData, loading, ...other }) {
  const columns = [
    {
      name: 'Pending',
      data: chartData.map((item) => item.pending),
    },
    {
      name: 'Waiting Payment',
      data: chartData.map((item) => item.waiting_payment),
    },
    {
      name: 'In Progress',
      data: chartData.map((item) => item.in_progress),
    },
    {
      name: 'Failed',
      data: chartData.map((item) => item.failed),
    },
    {
      name: 'Custom Status',
      data: chartData.map((item) => item.custom_status),
    },
    {
      name: 'Cancelled',
      data: chartData.map((item) => item.cancelled),
    },
    {
      name: 'Warning',
      data: chartData.map((item) => item.warning),
    },
    {
      name: 'Success',
      data: chartData.map((item) => item.success),
    },
  ];
  const categories = chartData.map((item) => item.date);
  const options = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '90%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    yaxis: {
      title: {
        text: 'Procesadas',
      },
    },
    fill: {
      opacity: [1],
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val}`;
        },
      },
    },
  };
  const chartOptions = useChart(options);

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} action={loading ? <CircularProgress size={30} /> : <></>} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="bar" series={columns} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
