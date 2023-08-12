import { useNavigate, useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import Iconify from '../components/iconify';

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  console.log('orderId in params', orderId);

  return (
    <div>
      <h1>Order Details Page</h1>
      <IconButton size="large" color="inherit" onClick={() => navigate(-1)}>
        <Iconify icon={'mdi:arrow-left'} />
      </IconButton>
    </div>
  );
};

export default OrderDetailsPage;
