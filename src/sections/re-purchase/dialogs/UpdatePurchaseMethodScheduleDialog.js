import React, { useState } from 'react';
import { Alert, CircularProgress, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import * as PropsTypes from 'prop-types';
import UpdatePurchaseMethodScheduleForm from '../forms/UpdatePurchaseMethdoScheduleForm';
import { api } from '../../../redux/api/apiSlice';

UpdatePurchaseMethodScheduleDialog.propsTypes = {
  onSubmitSchedule: PropsTypes.func,
  schedulesSelected: PropsTypes.array,
  open: PropsTypes.bool,
  onClose: PropsTypes.func,
};
export default function UpdatePurchaseMethodScheduleDialog({ onSubmitSchedule, schedulesSelected, open, onClose }) {
  const [formScheduleState, setFormScheduleState] = useState({
    status: '',
    evaluate_next: '',
    attempt: '',
    note: '',
    po_info_completed: '',
  });

  const [updateSchedule, { isLoading: isUpdatingSchedule, isError, error }] =
    api.endpoints.updateSchedule.useMutation();

  const handleChange = (event) => {
    setFormScheduleState({
      ...formScheduleState,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // remove from formScheduleState the empty values
    Object.keys(formScheduleState).forEach((key) => {
      if (!formScheduleState[key] || formScheduleState[key] === '') {
        delete formScheduleState[key];
      }
    });
    console.log(formScheduleState);
    if (
      formScheduleState.attempt ||
      formScheduleState.note ||
      formScheduleState.po_info_completed ||
      formScheduleState.status
    ) {
      updateSchedule({
        schedules: schedulesSelected,
        data: formScheduleState,
      })
        .then((response) => {
          if (response?.data && response.data.statusCode === 200) {
            console.log('Response success from updateSchedule', response);
            onSubmitSchedule(formScheduleState);
            handleClose();
          } else {
            console.log('Response fail from updateSchedule', response);
          }
        })
        .catch((error) => {
          console.log('Error from updateSchedule', error);
        });
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography variant={'h6'}>Update Purchase Method Schedule</Typography>
          {isUpdatingSchedule && <CircularProgress size={30} />}
        </Stack>
      </DialogTitle>
      <DialogContent>
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error updating schedules: {error?.message}
          </Alert>
        )}
        <UpdatePurchaseMethodScheduleForm
          formState={formScheduleState}
          handleChange={handleChange}
          onCloseModal={handleClose}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
