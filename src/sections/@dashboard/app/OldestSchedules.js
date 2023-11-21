import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
import Scrollbar from '../../../components/scrollbar';
import { F35_STATUS, F35_STATUS_COLORS } from '../../../utils/constants';
import Label from '../../../components/label';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

OldestSchedules.propsTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  loading: PropTypes.bool,
  data: PropTypes.object,
};
export default function OldestSchedules({ title, subheader, loading, data, ...other }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const isStatusIndex = (row) => {
    return Object.keys(row).findIndex((key) => key === 'Status');
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} action={loading ? <CircularProgress size={30} /> : <></>} />
      <Tabs value={value} onChange={handleChange} sx={{ mt: 1 }}>
        {data && Object.keys(data).map((key, index) => <Tab label={key} key={index} />)}
      </Tabs>
      <Scrollbar sx={{ height: { xs: 340, sm: 550, lg: 750 } }}>
        {data &&
          Object.keys(data).length > 0 &&
          Object.keys(data).map((key, index) => (
            <TabPanel value={value} index={index} key={index}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {Object.keys(data[key][0]).map((columnKey) => (
                        <TableCell key={columnKey}>{columnKey}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data[key].map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Object.values(row).map((cell, cellIndex) => {
                          if (cellIndex === isStatusIndex(row)) {
                            return (
                              <TableCell key={cellIndex}>
                                <Label key={cellIndex} customColor={F35_STATUS_COLORS[cell]}>
                                  {sentenceCase(F35_STATUS[cell])}
                                </Label>
                              </TableCell>
                            );
                          }
                          return <TableCell key={cellIndex}>{cell}</TableCell>;
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          ))}
      </Scrollbar>
    </Card>
  );
}
