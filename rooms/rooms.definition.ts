export interface IRoom {
  id: number;
  name: string;
  times: IRoomTime[];
  availableTimeStrings?: string[];
  dataValues?: any;
}

export interface IRoomTime {
  begin: string;
  end: string;
}