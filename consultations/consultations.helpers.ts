import * as moment from 'moment';

import { IDoctor } from '../doctors/doctors.definition';
import { IRoom } from '../rooms/rooms.definition';

import { IConsultation } from './consultations.definitions';


export const getWorkingHoursByDate = (entity: IDoctor | IRoom, date: moment.Moment) => {
  const dayOfWeek = moment(date).isoWeekday();
  const time = entity.times[dayOfWeek - 1];
  if (time === null) {
    return null;
  }
  const [beginHour, beginMinute] = time.begin.split(':');
  const [endHour, endMinute] = time.end.split(':');
  const begin = moment(date).set('hour', +beginHour).set('minute', +beginMinute);
  const end = moment(date).set('hour', +endHour).set('minute', +endMinute);

  return { begin, end };
}

// each timeString represents 1 minute duration
// example '2019-12-30T15:10:00+08:00' - means duration of 1 minute since '2019/12/30 15:10:00' till '2019/12/30 15:10:59' 
export const addAvailableTimeStrings = (entity: IDoctor | IRoom, beginPeriod: moment.Moment, endPeriod: moment.Moment) => {
  let currentMinute = moment(beginPeriod);
  let availableTimeStrings = [];
  while (currentMinute.isBefore(endPeriod)) {
    const workingHours = getWorkingHoursByDate(entity, currentMinute);
    if (workingHours && currentMinute.isBetween(workingHours.begin, workingHours.end, null, '[)')) {
      availableTimeStrings.push(currentMinute.format());
    }
    currentMinute = currentMinute.add(1, 'minute');
  };

  return { ...entity, availableTimeStrings };
}

export const addConsultationTimeStrings = (consultation: IConsultation) => {
  let currentMinute = moment(consultation.begin);
  let timeStrings = [];
  while (currentMinute.isBefore(consultation.end)) {
    timeStrings.push(currentMinute.format());
    currentMinute = currentMinute.add(1, 'minute');
  };

  return { ...consultation, timeStrings };
}