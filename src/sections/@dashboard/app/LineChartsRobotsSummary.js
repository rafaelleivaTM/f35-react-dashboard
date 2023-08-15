import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
// @mui
import { Box, Card, CardHeader, CircularProgress, FormControl, MenuItem, Select, Stack } from "@mui/material";
// components
import { useRef } from "react";
import { useChart } from "../../../components/chart";
import { ROBOTS_VISUAL_DATA } from "../../../utils/constants";

// ----------------------------------------------------------------------

LineChartsRobotsSummary.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  criteria: PropTypes.string,
  loading: PropTypes.bool,
  onCriteriaChange: PropTypes.func,
};

export default function LineChartsRobotsSummary({
  title,
  subheader,
  chartLabels,
  chartData,
  criteria,
  loading,
  onCriteriaChange,
  ...other
}) {
  const chartRef = useRef(null);

  const chartOptions = useChart({
    colors: [
      ROBOTS_VISUAL_DATA.find((r) => r.displayAvatarCode === 'DO').color,
      ROBOTS_VISUAL_DATA.find((r) => r.displayAvatarCode === 'ZINC').color,
      ROBOTS_VISUAL_DATA.find((r) => r.displayAvatarCode === 'EBAY').color,
      ROBOTS_VISUAL_DATA.find((r) => r.displayAvatarCode === 'MIRA').color,
    ],
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} ${criteria || ''}`;
          }
          return y;
        },
      },
    },
  });

  function handleChange(event) {
    onCriteriaChange(event.target.value);
    updateChartLabelCriteria(event.target.value);
  }

  const updateChartLabelCriteria = (criteria) => {
    if (chartRef.current) {
      chartRef.current.chart
        .updateOptions({
          tooltip: {
            shared: true,
            intersect: false,
            y: {
              formatter: (y) => {
                if (typeof y !== 'undefined') {
                  return `${y.toFixed(0)} ${criteria || ''}`;
                }
                return y;
              },
            },
          },
        })
        .then();
    }
  };

  const actions = () => (
    <Stack direction="row" spacing={1} alignItems={'center'}>
      {loading ? <CircularProgress size={30} sx={{ mr: 1 }} /> : <></>}
      <FormControl sx={{ minWidth: 120 }} size="small">
        <Select
          value={criteria}
          onChange={(event) => handleChange(event)}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value={'Effectiveness'}>Effectiveness</MenuItem>
          <MenuItem value={'Failed'}>Failed</MenuItem>
          <MenuItem value={'Cancelled'}>Cancelled</MenuItem>
          <MenuItem value={'Success'}>Success</MenuItem>
          <MenuItem value={'Warning'}>Warning</MenuItem>
          <MenuItem value={'Total'}>Total</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} action={actions()} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart ref={chartRef} type="line" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
