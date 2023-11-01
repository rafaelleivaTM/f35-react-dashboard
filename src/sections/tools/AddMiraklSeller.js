import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CircularProgress, Grid, TextField } from '@mui/material';
import apiService from '../../services/apiService';
import Iconify from '../../components/iconify';

const CreateMiraklSellerForm = () => {
  const [name, setName] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [supplier, setSupplier] = useState('');
  const [loading, setLoading] = useState(false);
  const [successFullCreation, setSuccessFullCreation] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const purchaseGroup = {
      name,
      seller_id: sellerId,
      supplier: +supplier,
    };

    setSuccessFullCreation(false);
    setLoading(true);
    apiService
      .createPurchaseGroup(purchaseGroup)
      .then((response) => {
        console.log('response from createPurchaseGroup', response);
        if (response?.data && response.statusCode === 201) {
          setSupplier('');
          setName('');
          setSellerId('');
          setSuccessFullCreation(true);
        } else {
          setSuccessFullCreation(false);
        }
      })
      .catch((error) => {
        console.log('error from getOrdersListSchedules', error);
        setSuccessFullCreation(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card>
      <CardHeader
        title={'Add Mirakl Seller'}
        action={
          loading ? (
            <CircularProgress size={30} />
          ) : successFullCreation ? (
            <Iconify icon={'eva:checkmark-circle-2-fill'} sx={{ color: 'rgb(64,157,95)' }} />
          ) : (
            <></>
          )
        }
        sx={{ '& .MuiCardHeader-action': { alignSelf: 'center', m: 0, display: 'flex' } }}
      />

      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Seller ID" value={sellerId} onChange={(e) => setSellerId(e.target.value)} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                required
                onKeyDown={(event) => {
                  if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
                    event.preventDefault();
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} display={'flex'} justifyContent={'flex-end'} sx={{ mr: 1 }}>
              <Button type="submit" color={'error'} variant="contained" disabled={!name || !sellerId || !supplier}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateMiraklSellerForm;
