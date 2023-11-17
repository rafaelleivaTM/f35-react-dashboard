import PropTypes from "prop-types";
// @mui
import { styled } from "@mui/material/styles";
import { AppBar, Box, Divider, IconButton, Stack, Toolbar, Typography } from "@mui/material";
// utils
import { bgBlur } from "../../../utils/cssStyles";
// components
import Iconify from "../../../components/iconify";
//
import Searchbar from "./Searchbar";
import AccountPopover from "./AccountPopover";
import NotificationsPopover from "./NotificationsPopover";
import { DateRangePickerToolbar } from "./DateRangePickerToolbar";
import CronRefreshStats from "../../../components/scheduler_api_call/CronRefreshStats";
import LanguagePopover from "./LanguagePopover";
import { useGetHealthApiServiceQuery } from "../../../redux/api/apiSlice";

// ----------------------------------------------------------------------

const NAV_WIDTH = 250;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('xl')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('xl')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 3),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const { data: healthApi } = useGetHealthApiServiceQuery(undefined);

  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <Stack direction={'row'} spacing={3} marginRight={3}>
            <Typography variant={'caption'} color="text.secondary">
              DB Read: {healthApi?.dbRead}
            </Typography>
            <Typography
              variant={'caption'}
              color={healthApi?.isProdActive ? 'error' : 'text.secondary'}
              fontWeight={healthApi?.isProdActive ? 'bold' : 'normal'}
            >
              DB Write: {healthApi?.dbWrite}
            </Typography>
          </Stack>
          <CronRefreshStats />
          <Divider orientation={'vertical'} variant={'middle'} flexItem />
          <DateRangePickerToolbar />
          <Divider orientation={'vertical'} variant={'middle'} flexItem />
          <LanguagePopover />
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
