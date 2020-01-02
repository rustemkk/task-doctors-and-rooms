import { DataTypes } from 'sequelize';

import { BaseModel } from '../utils/base.model';


const roomsModel = new BaseModel('Rooms', {
  name: {
    type: DataTypes.STRING,
  },
  times: {
    type: DataTypes.JSON,
  },
});

export default roomsModel;