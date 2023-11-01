// @mui
import PropTypes from "prop-types";
import {
  Badge,
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Divider,
  Link,
  Stack,
  Typography
} from "@mui/material"; // utils
import { useState } from "react";
import { fDateTime } from "../../../utils/formatTime"; // components
import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";
import LetterAvatar from "../../../components/letter-avatar";

// ----------------------------------------------------------------------

AppErrorList.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

const displayCollapsedErrorsCount = 5;
export default function AppErrorList({ title, subheader, list, loading, ...other }) {
  const [collapsedList, setCollapsedList] = useState(true);

  const handeCollapsableList = () => {
    setCollapsedList(!collapsedList);
  };

  if (list.length > displayCollapsedErrorsCount && collapsedList) {
    list = list.slice(0, displayCollapsedErrorsCount);
  }

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{ '& .MuiCardHeader-action': { alignSelf: 'center', m: 0, display: 'flex' } }}
        action={loading ? <CircularProgress size={30} /> : <></>}
      />

      <Scrollbar sx={{ height: { xs: 340, sm: 450, lg: 600 } }}>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((error, index) => (
            <ErrorItem key={error.id} error={error} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          onClick={handeCollapsableList}
          color="inherit"
          endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
        >
          {collapsedList ? 'View all' : 'View less'}
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

ErrorItem.propTypes = {
  error: PropTypes.shape({
    description: PropTypes.string,
    robotCode: PropTypes.string,
    color: PropTypes.string,
    count: PropTypes.string,
    postedAt: PropTypes.string,
    title: PropTypes.string,
  }),
};

function ErrorItem({ error }) {
  const { robotCode, title, description, postedAt, color, count } = error;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box>
        <LetterAvatar name={robotCode} color={color} />
      </Box>
      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {title}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </Box>

      <Stack alignItems={'end'} spacing={2}>
        <Badge color={'error'} badgeContent={count} sx={{ mr: 3 }} />
        <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }} noWrap>
          {fDateTime(new Date(postedAt))}
        </Typography>
      </Stack>
    </Stack>
  );
}
