import { Helmet } from "react-helmet-async";
// @mui
import { Container, Grid, Stack } from "@mui/material";
// components
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// sections
import {
  AppConversionRates,
  AppErrorList,
  AppTasks,
  AppWidgetSummary,
  DonutChartPanel,
  LineChartsRobotsSummary,
  PieChartRobotStat
} from "../sections/@dashboard/app";
import apiService from "../services/apiService";
import { STATUS_COLORS } from "../utils/constants";
import BarChartSummaryRangeInfo from "../sections/@dashboard/app/BarChartSummaryRangeInfo";
import { addNotification } from "../redux/notificationsSlice";
import { fetchF35ChartsDataForToday } from "../services/apiCalls";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const dispatch = useDispatch();
  const dateRange = useSelector((state) => state.dateRange);

  const [generalSummaryByRange, setGeneralSummaryByRange] = useState([]);
  const [loadingGeneralSummaryByRange, setLoadingGeneralSummaryByRange] = useState(false);

  const [summaryEfficiencyByRange, setSummaryEfficiencyByRange] = useState({});
  const [loadingSummaryEfficiencyByRange, setLoadingSummaryEfficiencyByRange] = useState(false);

  const f35SummaryStats = useSelector((state) => state.todayStats.f35SummaryStats);
  const loadingF35SummaryStats = useSelector((state) => state.todayStats.loadingF35SummaryStats);

  const robotsErrorInfo = useSelector((state) => state.todayStats.robotsErrorInfo);
  const loadingRobotsErrors = useSelector((state) => state.todayStats.loadingRobotsErrors);

  const doSummaryStats = useSelector((state) => state.todayStats.doSummaryStats);
  const loadingDoSummaryStats = useSelector((state) => state.todayStats.loadingDoSummaryStats);

  const zincSummaryStats = useSelector((state) => state.todayStats.zincSummaryStats);
  const loadingZincSummaryStats = useSelector((state) => state.todayStats.loadingZincSummaryStats);

  const ebaySummaryStats = useSelector((state) => state.todayStats.ebaySummaryStats);
  const loadingEbaySummaryStats = useSelector((state) => state.todayStats.loadingEbaySummaryStats);

  const miraSummaryStats = useSelector((state) => state.todayStats.miraSummaryStats);
  const loadingMiraSummaryStats = useSelector((state) => state.todayStats.loadingMiraSummaryStats);

  const [summaryEfficiencyCriteriaChartValue, setSummaryEfficiencyCriteriaChartValue] = useState('Effectiveness');

  useEffect(() => {
    const fetchGeneralSummaryByRange = async () => {
      setLoadingGeneralSummaryByRange(true);
      const response = await apiService.getRobotsSummaryByRange(dateRange.startDate, dateRange.endDate);
      setLoadingGeneralSummaryByRange(false);
      setGeneralSummaryByRange(response.data);
      console.log(`fetchGeneralSummaryByRange`, response);
    };

    const fetchSummaryEfficiencyByRange = async () => {
      setLoadingSummaryEfficiencyByRange(true);
      const response = await apiService.getRobotsSummaryEfficiencyByRange(dateRange.startDate, dateRange.endDate);
      setLoadingSummaryEfficiencyByRange(false);
      setSummaryEfficiencyByRange(response.data || {});
      console.log(`fetchSummaryEfficiencyByRange`, response.data);
    };

    fetchGeneralSummaryByRange().then();
    fetchSummaryEfficiencyByRange().then();
  }, [dateRange]);

  useEffect(() => {
    const fetchMissingOrdersBetweenBPAndF35 = async () => {
      const response = await apiService.getMissingOrdersBetweenBPAndF35();
      if (response.data) {
        response.data.forEach((order) => {
          const criticalNotification = {
            id: order,
            title: `Order ${order} is missing between BP and F35`,
            description: 'The order is in BP in F35 status, but not in F35 tables',
            avatar: null,
            type: 'order_critical',
            createdAt: new Date().toISOString(),
            isUnRead: true,
          };
          dispatch(addNotification(criticalNotification));
        });
      }
      console.log(`fetchMissingOrdersBetweenBPAndF35`, response);
    };

    fetchMissingOrdersBetweenBPAndF35().then();
  }, [dispatch]);

  useEffect(() => {
    if (!f35SummaryStats || Object.keys(f35SummaryStats).length === 0) {
      fetchF35ChartsDataForToday(dispatch).then();
    }
  }, [dispatch, f35SummaryStats]);

  return (
    <>
      <Helmet>
        <title> F35 Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Sales" total={714000} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Users" total={1352831} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Item Orders" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            <Stack spacing={3}>
              <BarChartSummaryRangeInfo
                title="Summary by range"
                subheader={`From ${dateRange.startDate} to ${dateRange.endDate}`}
                chartData={generalSummaryByRange}
                loading={loadingGeneralSummaryByRange}
              />

              <LineChartsRobotsSummary
                title="Robots summary"
                subheader="Select a criteria to see the summary"
                chartLabels={
                  summaryEfficiencyByRange && summaryEfficiencyByRange.DO
                    ? summaryEfficiencyByRange?.DO.map((item) => item.date)
                    : []
                }
                chartData={Object.keys(summaryEfficiencyByRange).map((key) => ({
                  name: key,
                  type: 'line',
                  fill: 'solid',
                  data: summaryEfficiencyByRange[key].map((item) => item[summaryEfficiencyCriteriaChartValue]),
                }))}
                criteria={summaryEfficiencyCriteriaChartValue}
                loading={loadingSummaryEfficiencyByRange}
                onCriteriaChange={(criteria) => setSummaryEfficiencyCriteriaChartValue(criteria)}
              />

              <AppConversionRates
                title="Purchases by Countries"
                subheader="(+43%) than last year"
                chartData={[
                  { label: 'Italy', value: 400 },
                  { label: 'Japan', value: 430 },
                  { label: 'China', value: 448 },
                  { label: 'Canada', value: 470 },
                  { label: 'France', value: 540 },
                  { label: 'Germany', value: 580 },
                  { label: 'South Korea', value: 690 },
                  { label: 'Netherlands', value: 1100 },
                  { label: 'United States', value: 1200 },
                  { label: 'United Kingdom', value: 1380 },
                ]}
              />

              <AppErrorList title="Errores" list={robotsErrorInfo} loading={loadingRobotsErrors} />

              <AppTasks
                title="Tasks"
                list={[
                  { id: '1', label: 'Create FireStone Logo' },
                  { id: '2', label: 'Add SCSS and JS files if required' },
                  { id: '3', label: 'Stakeholder Meeting' },
                  { id: '4', label: 'Scoping & Estimations' },
                  { id: '5', label: 'Sprint Showcase' },
                ]}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={4} lg={3}>
            <Stack spacing={2}>
              <DonutChartPanel
                title="F35 Summary"
                total={parseInt(f35SummaryStats?.total, 10) || 0}
                effectiveness={parseInt(f35SummaryStats?.overall_effectiveness, 10) || 0}
                loading={loadingF35SummaryStats}
                chartData={[
                  { label: 'In Progress', value: parseInt(f35SummaryStats?.InProgress, 10) || 0 },
                  { label: 'Pending', value: parseInt(f35SummaryStats?.Pending, 10) || 0 },
                  { label: 'Manual', value: parseInt(f35SummaryStats?.Manual, 10) || 0 },
                  { label: 'Cancelled', value: parseInt(f35SummaryStats?.Cancelled, 10) || 0 },
                  { label: 'Warning', value: parseInt(f35SummaryStats?.Warning, 10) || 0 },
                  { label: 'Purchased', value: parseInt(f35SummaryStats?.Success, 10) || 0 },
                  { label: 'DevBlocked', value: parseInt(f35SummaryStats?.DevBlocked, 10) || 0 },
                  {
                    label: 'Waiting Payment',
                    value: parseInt(f35SummaryStats?.Waiting_payment, 10) || 0,
                  },
                ]}
                chartColors={STATUS_COLORS}
              />

              <PieChartRobotStat
                title="DO today"
                total={parseInt(doSummaryStats?.Total, 10) || 0}
                effectiveness={parseInt(doSummaryStats?.Effectiveness, 10) || 0}
                chartData={[
                  { label: 'In Progress', value: parseInt(doSummaryStats?.InProgress, 10) || 0 },
                  { label: 'Pending', value: parseInt(doSummaryStats?.Pending, 10) || 0 },
                  { label: 'Failed', value: parseInt(doSummaryStats?.Failed, 10) || 0 },
                  { label: 'Cancelled', value: parseInt(doSummaryStats.Cancelled, 10) || 0 },
                  { label: 'Warning', value: parseInt(doSummaryStats?.Warning, 10) || 0 },
                  { label: 'Success', value: parseInt(doSummaryStats?.Success, 10) || 0 },
                  { label: 'DevBlocked', value: parseInt(doSummaryStats?.DevBlocked, 10) || 0 },
                ]}
                chartColors={STATUS_COLORS}
                loading={loadingDoSummaryStats}
              />

              <PieChartRobotStat
                title="Zinc today"
                total={parseInt(zincSummaryStats?.Total, 10) || 0}
                effectiveness={parseInt(zincSummaryStats?.Effectiveness, 10) || 0}
                chartData={[
                  { label: 'In Progress', value: parseInt(zincSummaryStats?.InProgress, 10) || 0 },
                  { label: 'Pending', value: parseInt(zincSummaryStats?.Pending, 10) || 0 },
                  { label: 'Failed', value: parseInt(zincSummaryStats?.Failed, 10) || 0 },
                  { label: 'Cancelled', value: parseInt(zincSummaryStats.Cancelled, 10) || 0 },
                  { label: 'Warning', value: parseInt(zincSummaryStats?.Warning, 10) || 0 },
                  { label: 'Success', value: parseInt(zincSummaryStats?.Success, 10) || 0 },
                  { label: 'DevBlocked', value: parseInt(zincSummaryStats?.DevBlocked, 10) || 0 },
                ]}
                chartColors={STATUS_COLORS}
                loading={loadingZincSummaryStats}
              />

              <PieChartRobotStat
                title="Ebay today"
                total={parseInt(ebaySummaryStats?.Total, 10) || 0}
                effectiveness={parseInt(ebaySummaryStats?.Effectiveness, 10) || 0}
                chartData={[
                  { label: 'In Progress', value: parseInt(ebaySummaryStats?.InProgress, 10) || 0 },
                  { label: 'Pending', value: parseInt(ebaySummaryStats?.Pending, 10) || 0 },
                  { label: 'Failed', value: parseInt(ebaySummaryStats?.Failed, 10) || 0 },
                  { label: 'Cancelled', value: parseInt(ebaySummaryStats.Cancelled, 10) || 0 },
                  { label: 'Warning', value: parseInt(ebaySummaryStats?.Warning, 10) || 0 },
                  { label: 'Success', value: parseInt(ebaySummaryStats?.Success, 10) || 0 },
                  { label: 'DevBlocked', value: parseInt(ebaySummaryStats?.DevBlocked, 10) || 0 },
                ]}
                chartColors={STATUS_COLORS}
                loading={loadingEbaySummaryStats}
              />

              <PieChartRobotStat
                title="Mira today"
                total={parseInt(miraSummaryStats?.Total, 10) || 0}
                effectiveness={parseInt(miraSummaryStats?.Effectiveness, 10) || 0}
                chartData={[
                  { label: 'In Progress', value: parseInt(miraSummaryStats?.InProgress, 10) || 0 },
                  { label: 'Pending', value: parseInt(miraSummaryStats?.Pending, 10) || 0 },
                  { label: 'Failed', value: parseInt(miraSummaryStats?.Failed, 10) || 0 },
                  { label: 'Cancelled', value: parseInt(miraSummaryStats.Cancelled, 10) || 0 },
                  { label: 'Warning', value: parseInt(miraSummaryStats?.Warning, 10) || 0 },
                  { label: 'Success', value: parseInt(miraSummaryStats?.Success, 10) || 0 },
                  { label: 'DevBlocked', value: parseInt(miraSummaryStats?.DevBlocked, 10) || 0 },
                ]}
                chartColors={STATUS_COLORS}
                loading={loadingMiraSummaryStats}
              />

              {/* <AppCurrentSubject */}
              {/*  title="Current Subject" */}
              {/*  chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']} */}
              {/*  chartData={[ */}
              {/*    { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] }, */}
              {/*    { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] }, */}
              {/*    { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] }, */}
              {/*  ]} */}
              {/*  chartColors={[...Array(6)].map(() => theme.palette.text.secondary)} */}
              {/* /> */}

              {/* <AppOrderTimeline */}
              {/*  title="Order Timeline" */}
              {/*  list={[...Array(5)].map((_, index) => ({ */}
              {/*    id: faker.datatype.uuid(), */}
              {/*    title: [ */}
              {/*      '1983, orders, $4220', */}
              {/*      '12 Invoices have been paid', */}
              {/*      'Order #37745 from September', */}
              {/*      'New order placed #XF-2356', */}
              {/*      'New order placed #XF-2346', */}
              {/*    ][index], */}
              {/*    type: `order${index + 1}`, */}
              {/*    time: faker.date.past(), */}
              {/*  }))} */}
              {/* /> */}

              {/* <AppTrafficBySite */}
              {/*  title="Traffic by Site" */}
              {/*  list={[ */}
              {/*    { */}
              {/*      name: 'FaceBook', */}
              {/*      value: 323234, */}
              {/*      icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />, */}
              {/*    }, */}
              {/*    { */}
              {/*      name: 'Google', */}
              {/*      value: 341212, */}
              {/*      icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />, */}
              {/*    }, */}
              {/*    { */}
              {/*      name: 'Linkedin', */}
              {/*      value: 411213, */}
              {/*      icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />, */}
              {/*    }, */}
              {/*    { */}
              {/*      name: 'Twitter', */}
              {/*      value: 443232, */}
              {/*      icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />, */}
              {/*    }, */}
              {/*  ]} */}
              {/* /> */}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
