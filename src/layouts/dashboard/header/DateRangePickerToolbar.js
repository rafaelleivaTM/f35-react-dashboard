import { useEffect } from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { dateRangeUpdated } from '../../../redux/dateRangeSlide';
import { getDateFormatted } from '../../../utils/formatTime';

export const DateRangePickerToolbar = () => {
  const dateRange = useSelector((state) => state.dateRange);
  const dispatch = useDispatch();

  const { afterToday } = DateRangePicker;

  const now = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  useEffect(() => {
    console.log(`El valor del rango ha sido cambiado en el store ${JSON.stringify(dateRange)}`);
  }, [dateRange]);

  const onChangeRangeAction = (range) => {
    dispatch(
      dateRangeUpdated({
        startDate: getDateFormatted(range[0]),
        endDate: getDateFormatted(range[1]),
      })
    );
  };

  const dateRangeValue = [new Date(dateRange.startDate), new Date(dateRange.endDate)];
  // convert dateRangeValue values to UTC date
  dateRangeValue[0] = new Date(dateRangeValue[0].getTime() + dateRangeValue[0].getTimezoneOffset() * 60000);
  dateRangeValue[1] = new Date(dateRangeValue[1].getTime() + dateRangeValue[1].getTimezoneOffset() * 60000);

  return (
    <DateRangePicker
      appearance="subtle"
      value={dateRangeValue}
      onChange={(range) => onChangeRangeAction(range)}
      shouldDisableDate={afterToday()}
      // defaultValue={[new Date(dateRange.startDate), new Date(dateRange.endDate)]}
      defaultCalendarValue={[lastMonth, now]}
      cleanable={false}
      placement={'autoVerticalEnd'}
      menuStyle={{ zIndex: 9999, marginTop: '.3rem' }}
      preventOverflow
    />
  );
};
