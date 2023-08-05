import { Helmet } from "react-helmet-async";
import { faker } from "@faker-js/faker";
// @mui
import { useTheme } from "@mui/material/styles";
import { Container, Grid } from "@mui/material";
// components
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  DonutChartPanel
} from "../sections/@dashboard/app";
import apiService from "../services/apiService";
import { ROBOTS } from "../utils/constants";
import BarChartSummaryRangeInfo from "../sections/@dashboard/app/BarChartSummaryRangeInfo";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const dateRange = useSelector((state) => state.dateRange);

  const [robotsData, setRobotsData] = useState({});
  const [robotsErrorInfo, setRobotsErrorInfo] = useState([]);
  const [loadingRobotsErrors, setLoadingRobotsErrors] = useState(false);

  const [generalSummary, setGeneralSummary] = useState([]);
  const [loadingGeneralSummary, setLoadingGeneralSummary] = useState(false);

  const fetchGeneralSummary = async () => {
    setLoadingGeneralSummary(true);
    const response = await apiService.getRobotsSummaryByRange(dateRange.startDate, dateRange.endDate);
    setLoadingGeneralSummary(false);
    setGeneralSummary(response.data);
    console.log(response);
  };

  const fetchRobotsStatsData = async () => {
    const data = await apiService.getRobotsStats();
    setRobotsData(data);
    console.log(data);
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
  };

  useEffect(() => {
    fetchGeneralSummary().then();
  }, [dateRange]);

  useEffect(() => {
    fetchRobotsStatsData().then();
    fetchRobotsErrorInfo().then();
  }, []);

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

          <Grid item xs={12} md={6} lg={8}>
            {/* <AppWebsiteVisits */}
            {/*  title="Website Visits" */}
            {/*  subheader="(+43%) than last year" */}
            {/*  chartLabels={[ */}
            {/*    '01/01/2003', */}
            {/*    '02/01/2003', */}
            {/*    '03/01/2003', */}
            {/*    '04/01/2003', */}
            {/*    '05/01/2003', */}
            {/*    '06/01/2003', */}
            {/*    '07/01/2003', */}
            {/*    '08/01/2003', */}
            {/*    '09/01/2003', */}
            {/*    '10/01/2003', */}
            {/*    '11/01/2003', */}
            {/*  ]} */}
            {/*  chartData={[ */}
            {/*    { */}
            {/*      name: 'Team A', */}
            {/*      type: 'column', */}
            {/*      fill: 'solid', */}
            {/*      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30], */}
            {/*    }, */}
            {/*    { */}
            {/*      name: 'Team B', */}
            {/*      type: 'area', */}
            {/*      fill: 'gradient', */}
            {/*      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43], */}
            {/*    }, */}
            {/*    { */}
            {/*      name: 'Team C', */}
            {/*      type: 'line', */}
            {/*      fill: 'solid', */}
            {/*      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39], */}
            {/*    }, */}
            {/*  ]} */}
            {/* /> */}
            <BarChartSummaryRangeInfo
              title="Summary by range"
              subheader={`From ${dateRange.startDate} to ${dateRange.endDate}`}
              chartData={generalSummary}
              loading={loadingGeneralSummary}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <DonutChartPanel
              title="F35 Summary"
              total={parseInt(robotsData?.stats?.summary?.total, 10) || 0}
              loading={robotsData?.stats?.summary === undefined}
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
              chartColors={[
                'rgb(36,157,241)', // IN progress
                'rgb(193,104,169)', // Pending
                'rgb(248,157,157)', // Waiting Payment
                'rgb(142,244,8)', // Manual
                'rgba(153, 102, 255, 1)', // Cancelled
                'rgba(255, 159, 64, 1)', // Warning
                'rgb(27,157,114)', // Completed
                'rgb(190,190,190)', // Blocked
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
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
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
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
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppErrorList title="Errores" list={robotsErrorInfo} loading={loadingRobotsErrors} />
          </Grid>

          <Grid item xs={12} md={4} lg={3}>
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
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
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
          </Grid>

          <Grid item xs={12} md={4} lg={5}>
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
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
