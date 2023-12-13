import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Grid, Stack } from '@mui/material';
// components
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// sections
import {
  AppErrorList,
  AppIncomingOrders,
  AppWidgetSummary,
  DonutChartPanel,
  LineChartsRobotsSummary,
  PieChartRobotStat,
} from '../sections/@dashboard/app';
import apiService from '../services/apiService';
import { F35_ROBOTS, STATUS_COLORS } from '../utils/constants';
import BarChartSummaryRangeInfo from '../sections/@dashboard/app/BarChartSummaryRangeInfo';
import { addNotification } from '../redux/notificationsSlice';
import {
  useGetActiveOrdersQuery,
  useGetF35GeneralSummaryQuery,
  useGetOldestSchedulesQuery,
  useGetSummaryEfficiencyByRobotQuery,
  useGetWaitingPaymentOrdersQuery,
  useIncomingOrdersByRangeQuery,
  useRobotsErrorInfoQuery,
} from '../redux/api/apiSlice';
import { getDateFormatted } from '../utils/formatTime';
import OldestSchedules from '../sections/@dashboard/app/OldestSchedules';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const dispatch = useDispatch();
  const dateRange = useSelector((state) => state.dateRange);

  const [generalSummaryByRange, setGeneralSummaryByRange] = useState([]);
  const [loadingGeneralSummaryByRange, setLoadingGeneralSummaryByRange] = useState(false);

  const [summaryEfficiencyByRange, setSummaryEfficiencyByRange] = useState({});
  const [loadingSummaryEfficiencyByRange, setLoadingSummaryEfficiencyByRange] = useState(false);

  // const [incomingOrdersByRange, setIncomingOrdersByRange] = useState({});
  // const [loadingIncomingOrdersByRange, setLoadingIncomingOrdersByRange] = useState(false);

  const [totalErrorsWidget, setTotalErrorsWidget] = useState(0);
  const [totalManualWidget, setTotalManualWidget] = useState(0);
  const [totalSuccessfullyWidget, setTotalSuccessfullyWidget] = useState(0);
  const [totalSuccessfullyMiraOrders, setTotalSuccessfullyMiraOrders] = useState(0);
  const [totalActiveOrders, setTotalActiveOrders] = useState(0);
  const [waitingPaymentOrders, setWaitingPaymentOrders] = useState(0);

  const { data: activeOrders } = useGetActiveOrdersQuery(undefined);
  if (activeOrders && +activeOrders.active !== totalActiveOrders) {
    setTotalActiveOrders(+activeOrders.active);
  }
  const { data: waitingPaymentData } = useGetWaitingPaymentOrdersQuery(undefined);
  if (waitingPaymentData && +waitingPaymentData.waitingPayment !== waitingPaymentOrders) {
    setWaitingPaymentOrders(+waitingPaymentData.waitingPayment);
  }
  if (waitingPaymentData) console.log(`Response of waitingPaymentData`, waitingPaymentData);

  const {
    data: oldestSchedules,
    isLoading: loadingOldestSchedules,
    isFetching: fetchingOldestSchedules,
  } = useGetOldestSchedulesQuery(undefined);
  if (oldestSchedules) console.log(`Response of oldestSchedules`, oldestSchedules);

  const date = getDateFormatted();
  const {
    data: f35SummaryStats,
    isLoading: loadingF35SummaryStats,
    isFetching: fetchingF35SummaryStats,
  } = useGetF35GeneralSummaryQuery(date);
  if (f35SummaryStats && Object.keys(f35SummaryStats).length > 0) {
    if (f35SummaryStats?.Manual && +f35SummaryStats.Manual !== totalManualWidget) {
      setTotalManualWidget(+f35SummaryStats.Manual);
    }
    if (f35SummaryStats?.Success && +f35SummaryStats.Success !== totalSuccessfullyWidget) {
      setTotalSuccessfullyWidget(+f35SummaryStats.Success);
    }
  }

  const {
    data: amzoSummaryStats,
    isLoading: loadingAmzoSummaryStats,
    isFetching: fetchingAmzoSummaryStats,
  } = useGetSummaryEfficiencyByRobotQuery({ date, robot: F35_ROBOTS.AMZO });
  if (amzoSummaryStats) console.log(`Response of amzoSummaryStats`, amzoSummaryStats);

  const {
    data: doSummaryStats,
    isLoading: loadingDoSummaryStats,
    isFetching: fetchingDoSummaryStats,
  } = useGetSummaryEfficiencyByRobotQuery({ date, robot: F35_ROBOTS.DO });
  if (doSummaryStats) console.log(`Response of doSummaryStats`, doSummaryStats);

  const {
    data: zincSummaryStats,
    isLoading: loadingZincSummaryStats,
    isFetching: fetchingZincSummaryStats,
  } = useGetSummaryEfficiencyByRobotQuery({ date, robot: F35_ROBOTS.ZINC_AMZ });
  if (zincSummaryStats) console.log(`Response of zincAMZSummaryStats`, zincSummaryStats);

  const {
    data: ebaySummaryStats,
    isLoading: loadingEbaySummaryStats,
    isFetching: fetchingEbaySummaryStats,
  } = useGetSummaryEfficiencyByRobotQuery({ date, robot: F35_ROBOTS.EBAY });
  if (ebaySummaryStats) console.log(`Response of ebaySummaryStats`, ebaySummaryStats);

  const {
    data: miraSummaryStats = [],
    isLoading: loadingMiraSummaryStats,
    isFetching: fetchingMiraSummaryStats,
  } = useGetSummaryEfficiencyByRobotQuery({ date, robot: F35_ROBOTS.MIRA });
  if (miraSummaryStats) console.log(`Response of miraSummaryStats`, miraSummaryStats);
  if (miraSummaryStats && miraSummaryStats.length > 0) {
    if (miraSummaryStats[0]?.Success && +miraSummaryStats[0]?.Success !== totalSuccessfullyMiraOrders) {
      setTotalSuccessfullyMiraOrders(+miraSummaryStats[0]?.Success);
    }
  }

  const {
    data: incomingOrdersByRange,
    isLoading: loadingIncomingOrdersByRange,
    refetch: refetchIncomingOrdersByRange,
    isFetching: fetchingIncomingOrdersByRange,
  } = useIncomingOrdersByRangeQuery(dateRange, {
    skip: !dateRange,
  });
  if (incomingOrdersByRange) console.log(`fetchIncomingOrdersByRange`, incomingOrdersByRange);

  const {
    data: robotsErrorInfo,
    isLoading: loadingRobotErrors,
    refetch: refetchRobotErrors,
    isFetching: fetchingRobotErrors,
  } = useRobotsErrorInfoQuery(dateRange, {
    skip: !dateRange,
  });
  if (robotsErrorInfo) console.log(`Response of robotsErrorInfo`, robotsErrorInfo);
  if (robotsErrorInfo && robotsErrorInfo.length > 0) {
    const sumeAllErrors = robotsErrorInfo.reduce((acc, error) => acc + parseInt(error.count, 10), 0);

    if (totalErrorsWidget !== sumeAllErrors) {
      setTotalErrorsWidget(sumeAllErrors);
    }
  }

  const [summaryEfficiencyCriteriaChartValue, setSummaryEfficiencyCriteriaChartValue] = useState('Effectiveness');

  useEffect(() => {
    refetchRobotErrors();
    refetchIncomingOrdersByRange();

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
  }, [dateRange, refetchRobotErrors, refetchIncomingOrdersByRange]);

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
            isCritical: true,
          };
          dispatch(addNotification(criticalNotification));
        });
      }
      console.log(`fetchMissingOrdersBetweenBPAndF35`, response);
    };

    fetchMissingOrdersBetweenBPAndF35().then();
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> F35 Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs>
            <AppWidgetSummary
              title="Mirak Success"
              total={totalSuccessfullyMiraOrders}
              icon={'ant-design:medium-circle-filled'}
            />
          </Grid>

          <Grid item xs>
            <AppWidgetSummary
              title="Successfull Orders"
              total={totalSuccessfullyWidget}
              color="success"
              icon={'ant-design:check-circle-filled'}
            />
          </Grid>

          <Grid item xs>
            <AppWidgetSummary
              title="Manual Orders"
              total={totalManualWidget}
              color="warning"
              icon={'ant-design:solution-outlined'}
            />
          </Grid>

          <Grid item xs>
            <AppWidgetSummary title="Errors" total={totalErrorsWidget} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

          <Grid item xs>
            <AppWidgetSummary
              title="Active Orders"
              total={totalActiveOrders}
              color="info"
              icon={'fluent-mdl2:time-entry'}
            />
          </Grid>

          <Grid item xs>
            <AppWidgetSummary
              title="Waiting Payment"
              total={waitingPaymentOrders}
              color="info"
              icon={'fluent-mdl2:time-entry'}
            />
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            <Stack spacing={3}>
              <BarChartSummaryRangeInfo
                title="Summary by range"
                subheader={`From ${dateRange.startDate} to ${dateRange.endDate}`}
                chartData={generalSummaryByRange || []}
                loading={loadingGeneralSummaryByRange}
              />

              <LineChartsRobotsSummary
                title="Robots summary"
                subheader="Select a criteria to see the summary"
                chartLabels={
                  summaryEfficiencyByRange && summaryEfficiencyByRange.do
                    ? summaryEfficiencyByRange?.do.map((item) => item.date)
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

              {/* <AppConversionRates */}
              {/*  title="Purchases by Countries" */}
              {/*  subheader="(+43%) than last year" */}
              {/*  chartData={[ */}
              {/*    { label: 'Italy', value: 400 }, */}
              {/*    { label: 'Japan', value: 430 }, */}
              {/*    { label: 'China', value: 448 }, */}
              {/*    { label: 'Canada', value: 470 }, */}
              {/*    { label: 'France', value: 540 }, */}
              {/*    { label: 'Germany', value: 580 }, */}
              {/*    { label: 'South Korea', value: 690 }, */}
              {/*    { label: 'Netherlands', value: 1100 }, */}
              {/*    { label: 'United States', value: 1200 }, */}
              {/*    { label: 'United Kingdom', value: 1380 }, */}
              {/*  ]} */}
              {/* /> */}

              <AppIncomingOrders
                title="Incoming Orders"
                subheader={`From ${dateRange.startDate} to ${dateRange.endDate}`}
                list={incomingOrdersByRange || { byHours: [], byDays: [] }}
                loading={loadingIncomingOrdersByRange || fetchingIncomingOrdersByRange}
              />

              <AppErrorList
                title="Errors"
                list={robotsErrorInfo || []}
                loading={loadingRobotErrors || fetchingRobotErrors}
              />

              {/* <AppTasks */}
              {/*  title="Tasks" */}
              {/*  list={[ */}
              {/*    { id: '1', label: 'Create FireStone Logo' }, */}
              {/*    { id: '2', label: 'Add SCSS and JS files if required' }, */}
              {/*    { id: '3', label: 'Stakeholder Meeting' }, */}
              {/*    { id: '4', label: 'Scoping & Estimations' }, */}
              {/*    { id: '5', label: 'Sprint Showcase' }, */}
              {/*  ]} */}
              {/* /> */}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4} lg={3}>
            <Stack spacing={2}>
              <DonutChartPanel
                title="F35 Summary"
                total={parseInt(f35SummaryStats?.total, 10) || 0}
                effectiveness={parseInt(f35SummaryStats?.overall_effectiveness, 10) || 0}
                loading={loadingF35SummaryStats}
                silenceLoading={!loadingF35SummaryStats && fetchingF35SummaryStats}
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
                title="AMZO today"
                total={parseInt(amzoSummaryStats?.Total, 10) || 0}
                effectiveness={parseInt(amzoSummaryStats?.Effectiveness, 10) || 0}
                chartData={[
                  { label: 'In Progress', value: parseInt(amzoSummaryStats?.InProgress, 10) || 0 },
                  { label: 'Pending', value: parseInt(amzoSummaryStats?.Pending, 10) || 0 },
                  { label: 'Failed', value: parseInt(amzoSummaryStats?.Failed, 10) || 0 },
                  { label: 'Cancelled', value: parseInt(amzoSummaryStats?.Cancelled, 10) || 0 },
                  { label: 'Warning', value: parseInt(amzoSummaryStats?.Warning, 10) || 0 },
                  { label: 'Success', value: parseInt(amzoSummaryStats?.Success, 10) || 0 },
                  { label: 'DevBlocked', value: parseInt(amzoSummaryStats?.DevBlocked, 10) || 0 },
                ]}
                chartColors={STATUS_COLORS}
                loading={loadingAmzoSummaryStats}
                silenceLoading={!loadingAmzoSummaryStats && fetchingAmzoSummaryStats}
              />

              <PieChartRobotStat
                title="DO today"
                total={parseInt(doSummaryStats?.Total, 10) || 0}
                effectiveness={parseInt(doSummaryStats?.Effectiveness, 10) || 0}
                chartData={[
                  { label: 'In Progress', value: parseInt(doSummaryStats?.InProgress, 10) || 0 },
                  { label: 'Pending', value: parseInt(doSummaryStats?.Pending, 10) || 0 },
                  { label: 'Failed', value: parseInt(doSummaryStats?.Failed, 10) || 0 },
                  { label: 'Cancelled', value: parseInt(doSummaryStats?.Cancelled, 10) || 0 },
                  { label: 'Warning', value: parseInt(doSummaryStats?.Warning, 10) || 0 },
                  { label: 'Success', value: parseInt(doSummaryStats?.Success, 10) || 0 },
                  { label: 'DevBlocked', value: parseInt(doSummaryStats?.DevBlocked, 10) || 0 },
                ]}
                chartColors={STATUS_COLORS}
                loading={loadingDoSummaryStats}
                silenceLoading={!loadingDoSummaryStats && fetchingDoSummaryStats}
              />

              <PieChartRobotStat
                title="Zinc AMZ today"
                total={parseInt(zincSummaryStats?.Total, 10) || 0}
                effectiveness={parseInt(zincSummaryStats?.Effectiveness, 10) || 0}
                chartData={[
                  { label: 'In Progress', value: parseInt(zincSummaryStats?.InProgress, 10) || 0 },
                  { label: 'Pending', value: parseInt(zincSummaryStats?.Pending, 10) || 0 },
                  { label: 'Failed', value: parseInt(zincSummaryStats?.Failed, 10) || 0 },
                  { label: 'Cancelled', value: parseInt(zincSummaryStats?.Cancelled, 10) || 0 },
                  { label: 'Warning', value: parseInt(zincSummaryStats?.Warning, 10) || 0 },
                  { label: 'Success', value: parseInt(zincSummaryStats?.Success, 10) || 0 },
                  { label: 'DevBlocked', value: parseInt(zincSummaryStats?.DevBlocked, 10) || 0 },
                ]}
                chartColors={STATUS_COLORS}
                loading={loadingZincSummaryStats}
                silenceLoading={!loadingZincSummaryStats && fetchingZincSummaryStats}
              />

              <PieChartRobotStat
                title="Ebay today"
                total={parseInt(ebaySummaryStats?.Total, 10) || 0}
                effectiveness={parseInt(ebaySummaryStats?.Effectiveness, 10) || 0}
                chartData={[
                  { label: 'In Progress', value: parseInt(ebaySummaryStats?.InProgress, 10) || 0 },
                  { label: 'Pending', value: parseInt(ebaySummaryStats?.Pending, 10) || 0 },
                  { label: 'Failed', value: parseInt(ebaySummaryStats?.Failed, 10) || 0 },
                  { label: 'Cancelled', value: parseInt(ebaySummaryStats?.Cancelled, 10) || 0 },
                  { label: 'Warning', value: parseInt(ebaySummaryStats?.Warning, 10) || 0 },
                  { label: 'Success', value: parseInt(ebaySummaryStats?.Success, 10) || 0 },
                  { label: 'DevBlocked', value: parseInt(ebaySummaryStats?.DevBlocked, 10) || 0 },
                ]}
                chartColors={STATUS_COLORS}
                loading={loadingEbaySummaryStats}
                silenceLoading={!loadingEbaySummaryStats && fetchingEbaySummaryStats}
              />

              <PieChartRobotStat
                title="Mira today"
                total={parseInt(miraSummaryStats[0]?.Total, 10) || 0}
                effectiveness={parseInt(miraSummaryStats[0]?.Effectiveness, 10) || 0}
                chartData={[
                  { label: 'In Progress', value: parseInt(miraSummaryStats[0]?.InProgress, 10) || 0 },
                  { label: 'Pending', value: parseInt(miraSummaryStats[0]?.Pending, 10) || 0 },
                  { label: 'Failed', value: parseInt(miraSummaryStats[0]?.Failed, 10) || 0 },
                  { label: 'Cancelled', value: parseInt(miraSummaryStats[0]?.Cancelled, 10) || 0 },
                  { label: 'Warning', value: parseInt(miraSummaryStats[0]?.Warning, 10) || 0 },
                  { label: 'Success', value: parseInt(miraSummaryStats[0]?.Success, 10) || 0 },
                  { label: 'DevBlocked', value: parseInt(miraSummaryStats[0]?.DevBlocked, 10) || 0 },
                ]}
                chartColors={STATUS_COLORS}
                loading={loadingMiraSummaryStats}
                silenceLoading={!loadingMiraSummaryStats && fetchingMiraSummaryStats}
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

          <Grid item xs={12}>
            <OldestSchedules
              title={'Oldest Schedules'}
              data={oldestSchedules || {}}
              loading={loadingOldestSchedules || fetchingOldestSchedules}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
