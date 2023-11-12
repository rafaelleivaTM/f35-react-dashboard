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
import { Helmet } from 'react-helmet-async';
import { alpha, styled } from '@mui/material/styles';
import { useState } from 'react';
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

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const f35Statuses = useSelector((state) => state.appConfig.f35Statuses);
  const { orderId } = useParams();
  console.log('orderId in params', orderId);

  const [orderInputSearch, setOrderInputSearch] = useState(orderId || '');

  const {
    data: orderSummaryData,
    isLoading: isLoadingOrderSummaryData,
    isError: isErrorOrderSummaryData,
  } = useGetOrderToPurchaseDataForOrderQuery(orderId, {
    skip: !orderId,
  });
  const {
    data: orderSchedulesData,
    isLoading: isLoadingOrderSchedulesData,
    isError: isErrorOrderSchedulesData,
  } = useGetOrderSchedulesForOrderQuery(orderId, {
    skip: !orderId,
  });
  console.log('isLoadingOrderSchedulesData', isLoadingOrderSchedulesData);
  const {
    data: orderProductsData,
    isLoading: isLoadingOrderProductsData,
    isError: isErrorOrderProductsData,
  } = useGetOrderProductsForOrderQuery(orderId, {
    skip: !orderId,
  });
  const {
    data: orderFinalInfoData,
    isLoading: isLoadingOrderFinalInfoData,
    isError: isErrorOrderFinalInfoData,
  } = useGetOrderFinalInfoForOrderQuery(orderId, {
    skip: !orderId,
  });
  console.log('isLoadingOrderFinalInfoData', isLoadingOrderFinalInfoData);
  const {
    data: orderRobotsInfoData,
    isLoading: isLoadingOrderRobotsInfoData,
    isError: isErrorOrderRobotsInfoData,
  } = useGetOrderRobotsInfoForOrderQuery(orderId, {
    skip: !orderId,
  });

  const onChangeInputSearchValue = (event) => {
    setOrderInputSearch(event.target.value);
  };

  const handleSearch = () => {
    console.log('Searching info of order', orderId);
    // set orderId in params
    navigate(`/dashboard/order-details/${orderInputSearch}`);
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

        <Card sx={{ mb: 2 }}>
          <CardHeader title={'General information'} />

          <CardContent>
            {isLoadingOrderSummaryData ? (
              <Box display={'flex'}>
                <Skeleton variant="rectangular" width={'100%'} height={'70px'} />
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ flexWrap: 'wrap' }}>
                {orderSummaryData &&
                  Object.keys(orderSummaryData).map((prop, index) => (
                    <Grid item xs={12} sm={'auto'} key={index} sx={{ '&': { maxWidth: '100% !important' } }}>
                      <TagInfo elevation={3} sx={{ display: 'inline-flex', px: 1 }}>
                        <Stack alignItems={'start'} sx={{ p: [0, 1] }}>
                          <Typography variant={'body2'}>{prop}</Typography>
                          <Typography variant={'subtitle2'} sx={{ fontSize: '100%', wordWrap: 'break-word' }}>
                            {renderValue(prop, orderSummaryData[prop])}
                          </Typography>
                        </Stack>
                      </TagInfo>
                    </Grid>
                  ))}
              </Grid>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardHeader title={'Schedules'} />

          <CardContent>
            {isLoadingOrderSchedulesData ? (
              <Box display={'flex'}>
                <Skeleton variant="rectangular" width={'100%'} height={'70px'} />
              </Box>
            ) : (
              orderSchedulesData &&
              orderSchedulesData.length > 0 &&
              orderSchedulesData.map((schedule, indexS) => (
                <div key={indexS}>
                  <Grid container spacing={2} sx={{ flexWrap: 'wrap' }}>
                    {Object.keys(schedule).map((prop, index) => (
                      <Grid item xs={12} sm={'auto'} key={index} sx={{ '&': { maxWidth: '100% !important' } }}>
                        <TagInfo elevation={3} sx={{ display: 'inline-flex', px: 1 }}>
                          <Stack alignItems={'start'} sx={{ p: [0, 1] }}>
                            <Typography variant={'body2'}>{prop}</Typography>
                            <Typography variant={'subtitle2'} sx={{ fontSize: '100%', wordWrap: 'break-word' }}>
                              {renderValue(prop, schedule[prop])}
                            </Typography>
                          </Stack>
                        </TagInfo>
                      </Grid>
                    ))}
                  </Grid>
                  {indexS < orderSchedulesData.length - 1 && <Divider sx={{ my: 3 }} />}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardHeader title={'Products'} />

          <CardContent>
            {isLoadingOrderProductsData ? (
              <Box display={'flex'}>
                <Skeleton variant="rectangular" width={'100%'} height={'70px'} />
              </Box>
            ) : (
              orderProductsData &&
              orderProductsData.length > 0 &&
              orderProductsData.map((product, index) => (
                <div key={index}>
                  <Grid container spacing={2} sx={{ flexWrap: 'wrap' }}>
                    {Object.keys(product).map((prop, indexP) => (
                      <Grid item xs={12} sm={'auto'} key={indexP} sx={{ '&': { maxWidth: '100% !important' } }}>
                        <TagInfo elevation={3} sx={{ display: 'inline-flex', px: 1 }}>
                          <Stack alignItems={'start'} sx={{ p: [0, 1] }}>
                            <Typography variant={'body2'}>{prop}</Typography>
                            <Typography variant={'subtitle2'} sx={{ fontSize: '100%', wordWrap: 'break-word' }}>
                              {renderValue(prop, product[prop])}
                            </Typography>
                          </Stack>
                        </TagInfo>
                      </Grid>
                    ))}
                  </Grid>
                  {index < orderProductsData.length - 1 && <Divider sx={{ my: 3 }} />}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardHeader title={'Final info'} />

          <CardContent>
            {isLoadingOrderFinalInfoData ? (
              <Box display={'flex'}>
                <Skeleton variant="rectangular" width={'100%'} height={'70px'} />
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ flexWrap: 'wrap' }}>
                {orderFinalInfoData &&
                  Object.keys(orderFinalInfoData).map((prop, index) => (
                    <Grid item xs={12} sm={'auto'} key={index} sx={{ '&': { maxWidth: '100% !important' } }}>
                      <TagInfo elevation={3} sx={{ display: 'inline-flex', px: 1 }}>
                        <Stack alignItems={'start'} sx={{ p: [0, 1] }}>
                          <Typography variant={'body2'}>{prop}</Typography>
                          <Typography variant={'subtitle2'} sx={{ fontSize: '100%', wordWrap: 'break-word' }}>
                            {renderValue(prop, orderFinalInfoData[prop])}
                          </Typography>
                        </Stack>
                      </TagInfo>
                    </Grid>
                  ))}
              </Grid>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardHeader title={'Robot info'} />

          <CardContent>
            {isLoadingOrderRobotsInfoData ? (
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
                        {Object.keys(robotData).map((prop, indexR) => (
                          <Grid item xs={12} sm={'auto'} key={indexR} sx={{ '&': { maxWidth: '100% !important' } }}>
                            <TagInfo elevation={3} sx={{ display: 'inline-flex', px: 1 }}>
                              <Stack alignItems={'start'} sx={{ p: [0, 1] }}>
                                <Typography variant={'body2'}>{prop}</Typography>
                                <Typography variant={'subtitle2'} sx={{ fontSize: '100%', wordWrap: 'break-word' }}>
                                  {renderValue(prop, robotData[prop])}
                                </Typography>
                              </Stack>
                            </TagInfo>
                          </Grid>
                        ))}
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
