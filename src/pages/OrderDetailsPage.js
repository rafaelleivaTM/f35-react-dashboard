import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { alpha, styled } from '@mui/material/styles';
import Iconify from '../components/iconify';

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
  const { orderId } = useParams();
  console.log('orderId in params', orderId);

  const onChangeInputSearchValue = () => {};

  const dataOrder = {
    id: '1370070',
    so: '106017535',
    order_id: '2501136674',
    purchase_status: '103',
    warehouse_status: '0',
    warehouseId: '6',
    is_express: '0',
    customer_email: '5toelementoproductora@gmail.com',
    created_at: '2023-08-12 20:36:31',
    updated_at: '2023-08-12 21:15:16',
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
          />

          <Button variant="contained" color={'error'} startIcon={<Iconify icon="eva:search-fill" />}>
            Search
          </Button>
        </Stack>

        <Card>
          <CardHeader title={'General information'} />

          <CardContent>
            <Grid container spacing={2} sx={{ flexWrap: 'wrap' }}>
              {Object.keys(dataOrder).map((prop, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index} sx={{}}>
                  <TagInfo elevation={3}>
                    <Stack alignItems={'start'} sx={{ p: [0, 1] }}>
                      <Typography variant={'body2'}>{prop}</Typography>
                      <Typography variant={'subtitle2'} sx={{ wordBreak: 'break-all', fontSize: '100%' }}>
                        {dataOrder[prop]}
                      </Typography>
                    </Stack>
                  </TagInfo>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default OrderDetailsPage;
