import * as moment from 'moment';


export interface IConsultation {
  id: number;
  doctorId: number;
  roomId: number;
  begin: Date | moment.Moment;
  end: Date | moment.Moment;
  timeStrings?: string[];
}