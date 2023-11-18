import React from 'react';
import { Button, Checkbox, FormControlLabel, Grid, Stack, TextField } from '@mui/material';
import * as PropsTypes from 'prop-types';

UpdatePurchaseMethodScheduleForm.propsTypes = {
  onCloseModal: PropsTypes.func,
  formState: PropsTypes.object,
  handleChange: PropsTypes.func,
  onSubmit: PropsTypes.func,
};

export default function UpdatePurchaseMethodScheduleForm({ onCloseModal, formState, handleChange, onSubmit }) {
  const handleCloseModal = () => {
    onCloseModal();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            name="status"
            label="Status"
            type="number"
            value={formState.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="evaluate_next"
            label="Evaluate Next (1/0)"
            type="number"
            value={formState.evaluate_next}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="attempt"
            label="Attempt"
            type="number"
            value={formState.attempt}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="po_info_completed"
            label="PO Info Completed (1/0)"
            type="number"
            value={formState.po_info_completed}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            name={'resetNote'}
            checked={formState.resetNote}
            onChange={handleChange}
            control={<Checkbox />}
            label="Reset Note"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="note"
            label="Note"
            value={formState.note}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
      </Grid>
      <Stack direction={'row'} justifyContent={'end'} spacing={3} marginTop={2}>
        <Button onClick={handleCloseModal} color="primary">
          Cancel
        </Button>
        <Button
          type={'submit'}
          color="primary"
          disabled={
            (!formState.status || formState.status === '') &&
            (!formState.evaluate_next || formState.evaluate_next === '') &&
            (!formState.attempt || formState.attempt === '') &&
            (!formState.po_info_completed || formState.po_info_completed === '') &&
            (!formState.note || formState.note === '') &&
            !formState.resetNote
          }
        >
          Update
        </Button>
      </Stack>
    </form>
  );
}
