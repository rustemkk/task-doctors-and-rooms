import { expect } from 'chai';
import * as moment from 'moment';

import { IDoctor } from '../../doctors/doctors.definition';

import { addAvailableTimeStrings, addConsultationTimeStrings, getWorkingHoursByDate } from '../consultations.helpers';


const doctor: IDoctor = {
  id: 42,
  name: 'Dr. Test',
  times: [
    { begin: '09:00', end: '17:00' },
    { begin: '13:00', end: '21:00' },
    { begin: '09:00', end: '17:00' },
    { begin: '09:00', end: '17:00' },
    { begin: '09:00', end: '17:00' },
    null,
    null,
  ]
}

describe('Consultations unit tests', () => {

  it('Should test getWorkingHoursByDate', () => {
    let res = getWorkingHoursByDate(doctor, moment('2020-01-25'));
    expect(res).to.equal(null);

    res = getWorkingHoursByDate(doctor, moment('2020-01-26'));
    expect(res).to.equal(null);

    res = getWorkingHoursByDate(doctor, moment('2020-01-27'));
    expect(res.begin.format()).to.equal(moment('2020-01-27 09:00').format());
    expect(res.end.format()).to.equal(moment('2020-01-27 17:00').format());

    res = getWorkingHoursByDate(doctor, moment('2020-01-28'));
    expect(res.begin.format()).to.equal(moment('2020-01-28 13:00').format());
    expect(res.end.format()).to.equal(moment('2020-01-28 21:00').format());
  });

  it('Should test addAvailableTimeStrings', () => {
    let res = addAvailableTimeStrings(doctor, moment('2020-01-25 09:00'), moment('2020-01-25 19:00'));
    expect(res.availableTimeStrings.length).to.equal(0);

    res = addAvailableTimeStrings(doctor, moment('2020-01-27 01:00'), moment('2020-01-27 23:00'));
    expect(res.availableTimeStrings.length).to.equal(480);

    res = addAvailableTimeStrings(doctor, moment('2020-01-27 09:00'), moment('2020-01-27 09:30'));
    expect(res.availableTimeStrings.length).to.equal(30);
    expect(res.availableTimeStrings[0]).to.equal(moment('2020-01-27 09:00').format());
    expect(res.availableTimeStrings[29]).to.equal(moment('2020-01-27 09:29').format());

    res = addAvailableTimeStrings(doctor, moment('2020-01-27 16:30'), moment('2020-01-27 18:00'));
    expect(res.availableTimeStrings.length).to.equal(30);
    expect(res.availableTimeStrings[0]).to.equal(moment('2020-01-27 16:30').format());
    expect(res.availableTimeStrings[29]).to.equal(moment('2020-01-27 16:59').format());
  });

  it('Should test addConsultationTimeStrings', () => {
    let res = addConsultationTimeStrings({ id: 232, doctorId: 42, roomId: 1, begin: moment('2020-01-27 14:00'), end: moment('2020-01-27 15:00') });
    expect(res.timeStrings.length).to.equal(60);
    expect(res.timeStrings[0]).to.equal(moment('2020-01-27 14:00').format());
    expect(res.timeStrings[59]).to.equal(moment('2020-01-27 14:59').format());

    res = addConsultationTimeStrings({ id: 233, doctorId: 42, roomId: 1, begin: moment('2020-01-27 16:00'), end: moment('2020-01-27 16:30') });
    expect(res.timeStrings.length).to.equal(30);
    expect(res.timeStrings[0]).to.equal(moment('2020-01-27 16:00').format());
    expect(res.timeStrings[29]).to.equal(moment('2020-01-27 16:29').format());
  });

});