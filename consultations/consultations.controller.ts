import { intersection, isEqual, pull, some, uniqWith } from 'lodash';
import * as moment from 'moment';
import { Op } from 'sequelize';

import { IDoctor } from '../doctors/doctors.definition';
import DoctorsModel from '../doctors/doctors.model';
import { IRoom } from '../rooms/rooms.definition';
import RoomsModel from '../rooms/rooms.model';

import { IConsultation } from './consultations.definitions';
import { addAvailableTimeStrings, addConsultationTimeStrings } from './consultations.helpers';
import ConsultationsModel from './consultations.model';


async function getResources(ctx) {
  const doctors: IDoctor[] = await DoctorsModel.findAll({});
  const rooms: IRoom[] = await RoomsModel.findAll({});

  ctx.body = { doctors, rooms };
}

async function getConsultations(ctx) {
  const consultations: IConsultation[] = await ConsultationsModel.findAll({});

  ctx.body = consultations;
}

async function getAvailability(ctx) {
  const { begin, end, duration } = ctx.request.query;
  const beginPeriod = moment(begin);
  const endPeriod = moment(end);

  let [doctors, rooms, consultations] = await Promise.all([
    DoctorsModel.findAll({}),
    RoomsModel.findAll({}),
    ConsultationsModel.findAll({
      [Op.or]: [
        { begin: { [Op.between]: [beginPeriod, endPeriod] }, end: { [Op.between]: [beginPeriod, endPeriod] } },
        { begin: { [Op.lt]: endPeriod }, end: { [Op.gt]: beginPeriod } },
      ]
    })
  ])

  // make time strings for doctors, rooms & consultations
  doctors = doctors.map(doctor => addAvailableTimeStrings(doctor.dataValues, beginPeriod, endPeriod));
  rooms = rooms.map(room => addAvailableTimeStrings(room.dataValues, beginPeriod, endPeriod));
  consultations = consultations.map(consultation => addConsultationTimeStrings(consultation.dataValues));

  // exclude consultations from doctors & rooms
  doctors.map(doctor => {
    consultations
      .forEach(c => c.doctorId === doctor.id && pull(doctor.availableTimeStrings, ...(c.timeStrings || [])));
  });
  rooms.map(room => {
    consultations
      .forEach(c => c.roomId === room.id && pull(room.availableTimeStrings, ...(c.timeStrings || [])));
  });

  // searching for solutions among doctors and rooms
  let solutions = [];
  doctors.forEach(doctor => {
    rooms.forEach(room => {
      const timeIntersections = intersection(doctor.availableTimeStrings, room.availableTimeStrings);
      let currentBegin = moment(timeIntersections[0]);
      for (let i = 1; i < timeIntersections.length; i++) {
        if (i === timeIntersections.length - 1) {
          if (moment(timeIntersections[i]).diff(currentBegin, 'minutes') + 1 >= duration) {
            solutions.push({
              begin: currentBegin.format(),
              end: moment(timeIntersections[i]).add(1, 'minute').format(),
            });
          }
        } else if (moment(timeIntersections[i]).diff(moment(timeIntersections[i - 1]), 'minutes') > 1) {
          if (moment(timeIntersections[i - 1]).diff(currentBegin, 'minutes') + 1 >= duration) {
            solutions.push({
              begin: currentBegin.format(),
              end: moment(timeIntersections[i - 1]).add(1, 'minute').format()
            });
          }
          currentBegin = moment(timeIntersections[i]);
        }
      }
    });
  });

  // removing duplicate periods
  solutions = uniqWith(solutions, isEqual);

  ctx.body = solutions;
}

async function postResources(ctx) {
  const { doctors, rooms } = ctx.request.body;

  await DoctorsModel.model.bulkCreate(doctors, { updateOnDuplicate: ['name', 'times'] });
  await RoomsModel.model.bulkCreate(rooms, { updateOnDuplicate: ['name', 'times'] });

  ctx.body = { message: 'Ok' };
}

async function postConsultations(ctx) {
  const consultations = ctx.request.body;

  await ConsultationsModel.model.bulkCreate(consultations, { updateOnDuplicate: ['doctorId', 'roomId', 'begin', 'end'] });

  ctx.body = { message: 'Ok' };
}

export const routes = {
  get: {
    '/resources': getResources,
    '/consultations': getConsultations,
    '/availability': getAvailability,
  },
  post: {
    '/resources': postResources,
    '/consultations': postConsultations,
  },
};