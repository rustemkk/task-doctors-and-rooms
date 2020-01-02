import { expect } from 'chai';
import * as moment from 'moment';

import testService from '../../utils/test.service';


before(async () => {
  await testService.destroyTables(['Consultations', 'Doctors', 'Rooms']);
  await testService.init();
});

after(() => testService.close());

describe('Consultations e2e tests', () => {

  it('Should post and get resources', async () => {
    let res = await testService.post('/api/resources', {
      doctors: [
        {
          id: 1,
          name: 'Dr. Willson',
          times: [
            { begin: '09:00', end: '17:00' },
            { begin: '09:00', end: '17:00' },
            { begin: '09:00', end: '17:00' },
            { begin: '09:00', end: '17:00' },
            { begin: '09:00', end: '17:00' },
            null,
            null,
          ]
        },
        {
          id: 2,
          name: 'Dr. Hell',
          times: [
            { begin: '13:00', end: '21:00' },
            { begin: '13:00', end: '21:00' },
            { begin: '13:00', end: '21:00' },
            { begin: '13:00', end: '21:00' },
            { begin: '13:00', end: '21:00' },
            null,
            null,
          ]
        }
      ],
      rooms: [
        {
          id: 1,
          name: 'Room #1',
          times: [
            { begin: '09:00', end: '21:00' },
            { begin: '09:00', end: '21:00' },
            { begin: '09:00', end: '21:00' },
            { begin: '09:00', end: '21:00' },
            { begin: '09:00', end: '21:00' },
            null,
            null,
          ]
        },
        {
          id: 2,
          name: 'Room #2',
          times: [
            { begin: '09:00', end: '21:00' },
            { begin: '09:00', end: '21:00' },
            { begin: '09:00', end: '21:00' },
            { begin: '09:00', end: '21:00' },
            { begin: '09:00', end: '21:00' },
            null,
            null,
          ]
        },
      ]
    });
    expect(res.body.message).to.equal('Ok');

    res = await testService.get('/api/resources');
    expect(res.body.doctors.length).to.equal(2);
    expect(res.body.doctors[0].name).to.equal('Dr. Willson');
    expect(res.body.doctors[1].times[2].begin).to.equal('13:00');
    expect(res.body.rooms.length).to.equal(2);
  });

  it('Should post and get consultations', async () => {
    let res = await testService.post('/api/consultations', [
      { id: 1, doctorId: 1, roomId: 1, begin: moment('2020-01-27 09:00'), end: moment('2020-01-27 10:00') },
      { id: 2, doctorId: 1, roomId: 1, begin: moment('2020-01-27 10:00'), end: moment('2020-01-27 11:00') },
      { id: 3, doctorId: 1, roomId: 1, begin: moment('2020-01-27 11:00'), end: moment('2020-01-27 13:00') },
      { id: 4, doctorId: 1, roomId: 1, begin: moment('2020-01-27 14:00'), end: moment('2020-01-27 14:30') },
      { id: 5, doctorId: 2, roomId: 2, begin: moment('2020-01-27 12:00'), end: moment('2020-01-27 15:00') },
    ]);
    expect(res.body.message).to.equal('Ok');

    res = await testService.get('/api/consultations');
    expect(res.body.length).to.equal(5);
    expect(res.body[1].id).to.equal(2);
    expect(res.body[1].roomId).to.equal(1);
  });

  it('Should check availability for a full busy day', async () => {
    const begin = encodeURIComponent(moment('2020-01-27 00:00').format());
    const end = encodeURIComponent(moment('2020-01-28 00:00').format());
    const duration = 30;
    const res = await testService.get(`/api/availability?begin=${begin}&end=${end}&duration=${duration}`);
    expect(res.body.length).to.equal(4);
    expect(res.body[0].begin).to.equal(moment('2020-01-27 13:00').format());
    expect(res.body[0].end).to.equal(moment('2020-01-27 14:00').format());
    expect(res.body[1].begin).to.equal(moment('2020-01-27 14:30').format());
    expect(res.body[1].end).to.equal(moment('2020-01-27 17:00').format());
    expect(res.body[2].begin).to.equal(moment('2020-01-27 15:00').format());
    expect(res.body[2].end).to.equal(moment('2020-01-27 17:00').format());
    expect(res.body[3].begin).to.equal(moment('2020-01-27 15:00').format());
    expect(res.body[3].end).to.equal(moment('2020-01-27 21:00').format());
  });

  it('Should check availability at night', async () => {
    const begin = encodeURIComponent(moment('2020-01-28 00:00').format());
    const end = encodeURIComponent(moment('2020-01-28 01:00').format());
    const duration = 30;
    const res = await testService.get(`/api/availability?begin=${begin}&end=${end}&duration=${duration}`);
    expect(res.body.length).to.equal(0);
  });

  it('Should check availability on the weekend', async () => {
    const begin = encodeURIComponent(moment('2020-01-26 13:00').format());
    const end = encodeURIComponent(moment('2020-01-26 14:00').format());
    const duration = 30;
    const res = await testService.get(`/api/availability?begin=${begin}&end=${end}&duration=${duration}`);
    expect(res.body.length).to.equal(0);
  });

  it('Should check availability in the middle of a free working day', async () => {
    const begin = encodeURIComponent(moment('2020-01-28 13:00').format());
    const end = encodeURIComponent(moment('2020-01-28 14:00').format());
    const duration = 30;
    const res = await testService.get(`/api/availability?begin=${begin}&end=${end}&duration=${duration}`);
    expect(res.body.length).to.equal(1);
    expect(res.body[0].begin).to.equal(moment('2020-01-28 13:00').format());
    expect(res.body[0].end).to.equal(moment('2020-01-28 14:00').format());
  });

  it('Should check availability in the middle of a busy day', async () => {
    const begin = encodeURIComponent(moment('2020-01-27 12:00').format());
    const end = encodeURIComponent(moment('2020-01-27 16:00').format());
    const duration = 60;
    const res = await testService.get(`/api/availability?begin=${begin}&end=${end}&duration=${duration}`);
    expect(res.body.length).to.equal(3);
    expect(res.body[0].begin).to.equal(moment('2020-01-27 13:00').format());
    expect(res.body[0].end).to.equal(moment('2020-01-27 14:00').format());
    expect(res.body[1].begin).to.equal(moment('2020-01-27 14:30').format());
    expect(res.body[1].end).to.equal(moment('2020-01-27 16:00').format());
    expect(res.body[2].begin).to.equal(moment('2020-01-27 15:00').format());
    expect(res.body[2].end).to.equal(moment('2020-01-27 16:00').format());
  });

  it('Should check availability for three days', async () => {
    const begin = encodeURIComponent(moment('2020-01-26 00:00').format());
    const end = encodeURIComponent(moment('2020-01-29 00:00').format());
    const duration = 30;
    const res = await testService.get(`/api/availability?begin=${begin}&end=${end}&duration=${duration}`);
    expect(res.body.length).to.equal(6);
    expect(res.body[0].begin).to.equal(moment('2020-01-27 13:00').format());
    expect(res.body[0].end).to.equal(moment('2020-01-27 14:00').format());
    expect(res.body[1].begin).to.equal(moment('2020-01-27 14:30').format());
    expect(res.body[1].end).to.equal(moment('2020-01-27 17:00').format());
    expect(res.body[2].begin).to.equal(moment('2020-01-28 09:00').format());
    expect(res.body[2].end).to.equal(moment('2020-01-28 17:00').format());
    expect(res.body[3].begin).to.equal(moment('2020-01-27 15:00').format());
    expect(res.body[3].end).to.equal(moment('2020-01-27 17:00').format());
    expect(res.body[4].begin).to.equal(moment('2020-01-27 15:00').format());
    expect(res.body[4].end).to.equal(moment('2020-01-27 21:00').format());
    expect(res.body[5].begin).to.equal(moment('2020-01-28 13:00').format());
    expect(res.body[5].end).to.equal(moment('2020-01-28 21:00').format());
  });

});