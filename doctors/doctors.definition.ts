export interface IDoctor {
  id: number;
  name: string;
  times: IDoctorTime[];
  availableTimeStrings?: string[];
  dataValues?: any;
}

export interface IDoctorTime {
  begin: string;
  end: string;
}