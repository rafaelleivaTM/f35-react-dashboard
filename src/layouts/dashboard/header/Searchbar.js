import { useState } from "react";
// @mui
import { styled } from "@mui/material/styles";
import { Button, ClickAwayListener, IconButton, Input, InputAdornment, Slide } from "@mui/material";
// utils
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bgBlur } from "../../../utils/cssStyles";
// component
import Iconify from "../../../components/iconify";
import { searchOrdersUpdated } from "../../../redux/searchOrdersSlice";
import { parseSearchInput } from "../../../utils/functionsUtils";

// ----------------------------------------------------------------------

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledSearchbar = styled('div')(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

export default function Searchbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const searchAction = () => {
    if (inputValue) {
      const orders = parseSearchInput(inputValue);
      dispatch(searchOrdersUpdated(orders));
      setInputValue('');
      navigate('/dashboard/orders');
    } else {
      dispatch(searchOrdersUpdated([]));
      setOpen(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!open && (
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:search-fill" />
          </IconButton>
        )}

        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder="Search…"
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button variant="contained" onClick={searchAction}>
              Search
            </Button>
          </StyledSearchbar>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
