import { useState } from "react";
// @mui
import { Button, Menu, MenuItem, Typography } from "@mui/material";
// component
import PropTypes from "prop-types";
import Iconify from "../../../components/iconify";

// ----------------------------------------------------------------------

export const VENDORS_OPTIONS = [
  { value: 'amz', label: 'Amazon' },
  { value: 'ebay', label: 'Ebay' },
  { value: 'wrt', label: 'Walmart' },
  { value: 'mira', label: 'Mira' },
];

ReBuyVendorsSelect.propTypes = {
  vendorSelected: PropTypes.string,
  venderSelectedHandler: PropTypes.func,
};

export default function ReBuyVendorsSelect({ vendorSelected, venderSelectedHandler }) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const getVendorLabel = (vendor) => {
    return VENDORS_OPTIONS.find((option) => option.value === vendor).label;
  };

  const handleSelect = (value) => {
    venderSelectedHandler(value);
    handleClose();
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
        sx={{ width: '185px' }}
      >
        Vendor:&nbsp;
        <Typography
          component="span"
          variant="subtitle2"
          sx={{
            color: 'text.secondary',
            width: '72px', // Establece el ancho que desees aquí
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {vendorSelected ? getVendorLabel(vendorSelected) || 'None' : 'Select Vendor'}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {VENDORS_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === vendorSelected}
            onClick={() => handleSelect(option.value)}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
