import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
// @mui
import { styled, useTheme } from "@mui/material/styles";
// utils
import { Box, Card, CardActions, CardContent, CardHeader, CircularProgress, Skeleton } from "@mui/material";
import { fNumber } from "../../../utils/formatNumber";
// components
import { useChart } from "../../../components/chart";
import LinealProgressEffectiveness from "../../../components/LinealProgressEffectinevess/LinealProgressEffectiveness";

// ----------------------------------------------------------------------

const CHART_HEIGHT = 272;

const StyledChartWrapper = styled('div')(() => ({
  height: CHART_HEIGHT,
  // marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  // '& .apexcharts-legend': {
  //   height: LEGEND_HEIGHT,
  //   alignContent: 'center',
  //   position: 'relative !important',
  //   borderTop: `solid 1px ${theme.palette.divider}`,
  //   top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  // },
}));

// ----------------------------------------------------------------------

PieChartRobotStat.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartColors: PropTypes.arrayOf(PropTypes.string),
  chartData: PropTypes.array,
  total: PropTypes.number,
  effectiveness: PropTypes.number,
  loading: PropTypes.bool,
  silenceLoading: PropTypes.bool,
};

export default function PieChartRobotStat({
  title,
  subheader,
  chartColors,
  chartData,
  total,
  effectiveness,
  loading,
  silenceLoading,
  ...other
}) {
  const theme = useTheme();
  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = useChart({
    colors: chartColors,
    labels: chartLabels,
    stroke: { colors: [theme.palette.background.paper] },
    // legend: { floating: true, horizontalAlign: 'center' },
    legend: false,
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={silenceLoading ? <CircularProgress size={30} /> : <></>}
      />
      {loading ? (
        <Box display={'flex'} justifyContent={'center'} sx={{ p: 3 }}>
          <Skeleton variant="rounded" width={CHART_HEIGHT} height={CHART_HEIGHT + 30} />
        </Box>
      ) : (
        <>
          <CardContent sx={{ px: 1, pt: 1, pb: 0 }}>
            <StyledChartWrapper dir="ltr">
              <ReactApexChart type="pie" series={chartSeries} options={chartOptions} height={280} />
            </StyledChartWrapper>
          </CardContent>
          <CardActions sx={{ width: '100%', px: 3 }}>
            <LinealProgressEffectiveness total={total} value={effectiveness || 0} />
          </CardActions>
        </>
      )}
    </Card>
  );
}
