import moment from 'moment-timezone';
import { DATETIME_FORMAT, HCM_TIMEZONE } from '../constant';
moment.suppressDeprecationWarnings = true;

export const getNow = (format: string = DATETIME_FORMAT.ddmmyyyy) => {
  const timeString = moment().tz(HCM_TIMEZONE).format(format);
  return timeString;
};
