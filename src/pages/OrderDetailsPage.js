import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { Helmet } from 'react-helmet-async';
import { alpha, styled } from '@mui/material/styles';
import { useState } from 'react';
import XMLViewer from 'react-xml-viewer';
import Iconify from '../components/iconify';
import {
  useGetOrderFinalInfoForOrderQuery,
  useGetOrderProductsForOrderQuery,
  useGetOrderRobotsInfoForOrderQuery,
  useGetOrderSchedulesForOrderQuery,
  useGetOrderToPurchaseDataForOrderQuery,
} from '../redux/api/apiSlice';

const StyledSearch = styled(OutlinedInput, {
  shouldForwardProp: (prop) => prop !== 'hasValue',
})(({ theme }) => ({
  width: 240,
  marginRight: theme.spacing(3),
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

const TagInfo = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 'auto',
  width: 'auto',
  lineHeight: '60px',
}));

const InfoCard = ({ title, isLoadingData, data, renderValue }) => (
  <Card sx={{ mb: 2 }}>
    <CardHeader title={title} />
    <CardContent>
      {isLoadingData ? (
        <Box display={'flex'}>
          <Skeleton variant="rectangular" width={'100%'} height={'70px'} />
        </Box>
      ) : (
        data &&
        data.length > 0 &&
        data.map((item, indexS) => (
          <div key={indexS}>
            <Grid container spacing={2} sx={{ flexWrap: 'wrap' }}>
              {item &&
                Object.keys(item).map((prop, index) => (
                  <Grid item xs={12} sm={'auto'} key={index} sx={{ '&': { maxWidth: '100% !important' } }}>
                    <TagInfo elevation={3} sx={{ display: 'inline-flex', px: 1 }}>
                      <Stack alignItems={'start'} sx={{ p: [0, 1] }}>
                        <Typography variant={'body2'}>{prop}</Typography>
                        <Typography variant={'subtitle2'} sx={{ fontSize: '100%', wordWrap: 'break-word' }}>
                          {renderValue(prop, item[prop])}
                        </Typography>
                      </Stack>
                    </TagInfo>
                  </Grid>
                ))}
            </Grid>
            {indexS < data.length - 1 && <Divider sx={{ my: 3 }} />}
          </div>
        ))
      )}
    </CardContent>
  </Card>
);

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const f35Statuses = useSelector((state) => state.appConfig.f35Statuses);
  const { orderId } = useParams();
  console.log('orderId in params', orderId);

  const [orderInputSearch, setOrderInputSearch] = useState(orderId || '');

  const {
    data: orderSummaryData,
    isLoading: isLoadingOrderSummaryData,
    refetch: refetchOrderSummaryData,
    isFetching: isFetchingOrderSummaryData,
    isError: isErrorOrderSummaryData,
  } = useGetOrderToPurchaseDataForOrderQuery(orderId, {
    skip: !orderId,
  });
  const {
    data: orderSchedulesData,
    isLoading: isLoadingOrderSchedulesData,
    refetch: refetchOrderSchedulesData,
    isFetching: isFetchingOrderSchedulesData,
    isError: isErrorOrderSchedulesData,
  } = useGetOrderSchedulesForOrderQuery(orderId, {
    skip: !orderId,
  });
  const {
    data: orderProductsData,
    isLoading: isLoadingOrderProductsData,
    refetch: refetchOrderProductsData,
    isFetching: isFetchingOrderProductsData,
    isError: isErrorOrderProductsData,
  } = useGetOrderProductsForOrderQuery(orderId, {
    skip: !orderId,
  });
  const {
    data: orderFinalInfoData,
    isLoading: isLoadingOrderFinalInfoData,
    refetch: refetchOrderFinalInfoData,
    isFetching: isFetchingOrderFinalInfoData,
    isError: isErrorOrderFinalInfoData,
  } = useGetOrderFinalInfoForOrderQuery(orderId, {
    skip: !orderId,
  });
  const {
    data: orderRobotsInfoData,
    isLoading: isLoadingOrderRobotsInfoData,
    refetch: refetchOrderRobotsInfoData,
    isFetching: isFetchingOrderRobotsInfoData,
    isError: isErrorOrderRobotsInfoData,
    isI,
  } = useGetOrderRobotsInfoForOrderQuery(orderId, {
    skip: !orderId,
  });

  const onChangeInputSearchValue = (event) => {
    setOrderInputSearch(event.target.value);
  };

  const handleSearch = () => {
    console.log('Searching info of order', orderId);
    navigate(`/dashboard/order-details/${orderInputSearch}`);
    refetchOrderSummaryData();
    refetchOrderSchedulesData();
    refetchOrderProductsData();
    refetchOrderFinalInfoData();
    refetchOrderRobotsInfoData();
  };

  const renderValue = (property, value) => {
    if (value === null || value === undefined || value === '') {
      return '\u00A0';
    }

    if (property.toLowerCase() === 'status') {
      return f35Statuses[value] || value;
    }

    return value;
  };

  const displayAsJson = (robotName, prop) => {
    switch (robotName.toLowerCase()) {
      case 'mira':
        return ['purchase_request', 'purchase_response', 'verify_response'].includes(prop);
      case 'amzo':
        return ['purchase_request', 'purchase_response', 'verify_response'].includes(prop);
      case 'zinc_amz':
        return ['request', 'response'].includes(prop);
      default:
        return false;
    }
  };

  const displayAsXml = (robotName, prop) => {
    switch (robotName.toLowerCase()) {
      case 'do':
        return ['request', 'response'].includes(prop);
      default:
        return false;
    }
  };

  const getXML = (str) => {
    const srtIndexXmlStart = str.indexOf('<cXML');
    return str.substring(srtIndexXmlStart);
    // return str;
  };

  return (
    <>
      <Helmet>
        <title> Order Details </title>
      </Helmet>
      <Container maxWidth={'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Order Details
          </Typography>
          <IconButton size="large" color="inherit" onClick={() => navigate(-1)}>
            <Iconify icon={'mdi:arrow-left'} />
          </IconButton>
        </Stack>

        <Stack direction={'row'} mb={5}>
          <StyledSearch
            onChange={onChangeInputSearchValue}
            placeholder="Enter order..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
            value={orderInputSearch}
          />

          <Button
            variant="contained"
            color={'error'}
            disabled={!orderInputSearch}
            onClick={handleSearch}
            startIcon={<Iconify icon="eva:search-fill" />}
          >
            Search
          </Button>
        </Stack>

        <InfoCard
          title="General information"
          isLoadingData={isLoadingOrderSummaryData || isFetchingOrderSummaryData}
          data={[orderSummaryData]}
          renderValue={renderValue}
        />

        <InfoCard
          title="Schedules"
          isLoadingData={isLoadingOrderSchedulesData || isFetchingOrderSchedulesData}
          data={orderSchedulesData}
          renderValue={renderValue}
        />

        <InfoCard
          title="Products"
          isLoadingData={isLoadingOrderProductsData || isFetchingOrderProductsData}
          data={orderProductsData}
          renderValue={renderValue}
        />

        <InfoCard
          title="Final info"
          isLoadingData={isLoadingOrderFinalInfoData || isFetchingOrderFinalInfoData}
          data={[orderFinalInfoData]}
          renderValue={renderValue}
        />

        <Card sx={{ mb: 2 }}>
          <CardHeader title={'Robot info'} />

          <CardContent>
            {isLoadingOrderRobotsInfoData || isFetchingOrderRobotsInfoData ? (
              <Box display={'flex'}>
                <Skeleton variant="rectangular" width={'100%'} height={'70px'} />
              </Box>
            ) : (
              orderRobotsInfoData &&
              orderRobotsInfoData.length > 0 &&
              orderRobotsInfoData.map((robot, index) => {
                if (robot[0]) {
                  const robotData = robot[0];
                  const robotName = robot.robot;
                  return (
                    <div key={index}>
                      <Typography variant={'h6'}>{robotName}</Typography>
                      <Grid container spacing={2} sx={{ flexWrap: 'wrap' }}>
                        {Object.keys(robotData).map((prop, indexR) => {
                          const isJson = displayAsJson(robotName, prop);
                          const isXml = displayAsXml(robotName, prop);
                          return (
                            <Grid
                              item
                              xs={12}
                              sm={isJson ? 12 : 'auto'}
                              key={indexR}
                              sx={{ '&': { maxWidth: '100% !important' } }}
                            >
                              <TagInfo elevation={3} sx={{ display: 'inline-flex', px: 1 }}>
                                <Stack alignItems={'start'} sx={{ p: [0, 1] }}>
                                  <Typography variant={'body2'}>{prop}</Typography>
                                  {isJson ? (
                                    <Box sx={{ width: '100%' }}>
                                      <JsonView
                                        src={JSON.parse(robotData[prop])}
                                        collapsed={1}
                                        displayArrayKey={false}
                                      />
                                    </Box>
                                  ) : isXml ? (
                                    <XMLViewer xml={getXML(robotData[prop])} collapsible initalCollapsedDepth={1} />
                                  ) : (
                                    <Typography
                                      variant={'subtitle2'}
                                      sx={{
                                        fontSize: '100%',
                                        wordWrap: 'break-word',
                                      }}
                                    >
                                      {renderValue(prop, robotData[prop])}
                                    </Typography>
                                  )}
                                </Stack>
                              </TagInfo>
                            </Grid>
                          );
                        })}
                      </Grid>
                      {index < orderRobotsInfoData.length - 1 && <Divider sx={{ my: 3 }} />}
                    </div>
                  );
                }
                return <div key={index} />;
              })
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default OrderDetailsPage;
