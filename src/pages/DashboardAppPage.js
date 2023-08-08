import { Helmet } from "react-helmet-async";
import { faker } from "@faker-js/faker";
// @mui
import { useTheme } from "@mui/material/styles";
import { Container, Grid, Stack } from "@mui/material";
// components
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Iconify from "../components/iconify";
// sections
import {
  AppConversionRates,
  AppCurrentSubject,
  AppErrorList,
  AppOrderTimeline,
  AppTasks,
  AppTrafficBySite,
  AppWidgetSummary,
  DonutChartPanel,
  LineChartsRobotsSummary
} from "../sections/@dashboard/app";
import apiService from "../services/apiService";
import { ROBOTS, STATUS_COLORS } from "../utils/constants";
import BarChartSummaryRangeInfo from "../sections/@dashboard/app/BarChartSummaryRangeInfo";
import { addNotification } from "../redux/notificationsSlide";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const dateRange = useSelector((state) => state.dateRange);

  const [robotsData, setRobotsData] = useState({});
  const [loadingRobotsData, setLoadingRobotsData] = useState(false);
  const [robotsErrorInfo, setRobotsErrorInfo] = useState([]);
  const [loadingRobotsErrors, setLoadingRobotsErrors] = useState(false);

  const [generalSummary, setGeneralSummary] = useState([]);
  const [loadingGeneralSummary, setLoadingGeneralSummary] = useState(false);

  const [summaryEfficiency, setSummaryEfficiency] = useState({});
  const [loadingSummaryEfficiency, setLoadingSummaryEfficiency] = useState(false);

  const [summaryEfficiencyCriteriaChartValue, setSummaryEfficiencyCriteriaChartValue] = useState('Effectiveness');

  useEffect(() => {
    const fetchGeneralSummary = async () => {
      setLoadingGeneralSummary(true);
      const response = await apiService.getRobotsSummaryByRange(dateRange.startDate, dateRange.endDate);
      setLoadingGeneralSummary(false);
      setGeneralSummary(response.data);
      console.log(`fetchGeneralSummary`, response);
    };

    const fetchSummaryEfficiency = async () => {
      setLoadingSummaryEfficiency(true);
      const response = await apiService.getRobotsSummaryEfficiencyByRange(dateRange.startDate, dateRange.endDate);
      setLoadingSummaryEfficiency(false);
      setSummaryEfficiency(response.data || {});
      console.log(`fetchSummaryEfficiency`, response.data);
    };

    fetchGeneralSummary().then();
    fetchSummaryEfficiency().then();
  }, [dateRange]);

  useEffect(() => {
    const fetchRobotsStatsData = async () => {
      setLoadingRobotsData(true);
      const response = await apiService.getRobotsStats();
      setLoadingRobotsData(false);
      setRobotsData(response);
      console.log(`fetchRobotsStatsData`, response);
    };

    const fetchRobotsErrorInfo = async () => {
      setLoadingRobotsErrors(true);
      const data = await apiService.getRobotsErrorInfo();
      const errors = [];
      ROBOTS.forEach((robot) => {
        const robotErrorList = data[robot.name];
        if (robotErrorList) {
          robotErrorList.forEach((error) => {
            errors.push({
              id: faker.datatype.uuid(),
              title: `${error.error.substring(0, 50)}...`,
              description: error.error,
              robotName: robot.name,
              robotCode: robot.displayAvatarCode,
              color: robot.color,
              postedAt: faker.date.recent(),
              count: error.count,
            });
          });
        }
      });
      errors.sort((a, b) => b.count - a.count);
      setLoadingRobotsErrors(false);
      setRobotsErrorInfo(errors);
      console.log(`fetchRobotsStatsData`, data);
    };

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

    fetchRobotsStatsData().then();
    fetchRobotsErrorInfo().then();
    fetchMissingOrdersBetweenBPAndF35().then();
  }, [dispatch]);

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
                chartData={generalSummary}
                loading={loadingGeneralSummary}
              />

              <LineChartsRobotsSummary
                title="Robots summary"
                subheader="Select a criteria to see the summary"
                chartLabels={
                  summaryEfficiency && summaryEfficiency.DO ? summaryEfficiency?.DO.map((item) => item.date) : []
                }
                chartData={Object.keys(summaryEfficiency).map((key) => ({
                  name: key,
                  type: 'line',
                  fill: 'solid',
                  data: summaryEfficiency[key].map((item) => item[summaryEfficiencyCriteriaChartValue]),
                }))}
                criteria={summaryEfficiencyCriteriaChartValue}
                loading={loadingSummaryEfficiency}
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
            <Stack spacing={3}>
              <DonutChartPanel
                title="F35 Summary"
                total={parseInt(robotsData?.stats?.summary?.total, 10) || 0}
                loading={loadingRobotsData}
                chartData={[
                  { label: 'In Progress', value: parseInt(robotsData?.stats?.summary?.inProgress, 10) || 0 },
                  { label: 'Pending', value: parseInt(robotsData?.stats?.summary?.pending, 10) || 0 },
                  { label: 'Waiting Payment', value: parseInt(robotsData?.stats?.summary?.waitingPayment, 10) || 0 },
                  { label: 'Manual', value: parseInt(robotsData?.stats?.summary?.manual, 10) || 0 },
                  { label: 'Cancelled', value: parseInt(robotsData?.stats?.summary?.cancelled, 10) || 0 },
                  { label: 'Warning', value: parseInt(robotsData?.stats?.summary?.warning, 10) || 0 },
                  { label: 'Purchased', value: parseInt(robotsData?.stats?.summary?.purchased, 10) || 0 },
                  {
                    label: 'Blocked',
                    value:
                      parseInt(robotsData?.stats?.summary?.blocked, 10) || robotsData?.stats?.summary === undefined
                        ? 1
                        : 0,
                  },
                ]}
                chartColors={STATUS_COLORS}
              />

              <AppCurrentSubject
                title="Current Subject"
                chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
                chartData={[
                  { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                  { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                  { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
                ]}
                chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
              />

              <AppOrderTimeline
                title="Order Timeline"
                list={[...Array(5)].map((_, index) => ({
                  id: faker.datatype.uuid(),
                  title: [
                    '1983, orders, $4220',
                    '12 Invoices have been paid',
                    'Order #37745 from September',
                    'New order placed #XF-2356',
                    'New order placed #XF-2346',
                  ][index],
                  type: `order${index + 1}`,
                  time: faker.date.past(),
                }))}
              />

              <AppTrafficBySite
                title="Traffic by Site"
                list={[
                  {
                    name: 'FaceBook',
                    value: 323234,
                    icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                  },
                  {
                    name: 'Google',
                    value: 341212,
                    icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                  },
                  {
                    name: 'Linkedin',
                    value: 411213,
                    icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                  },
                  {
                    name: 'Twitter',
                    value: 443232,
                    icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                  },
                ]}
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
