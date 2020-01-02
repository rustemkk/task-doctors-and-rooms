import { DataTypes } from 'sequelize';

import { BaseModel } from '../utils/base.model';


const consultationsModel = new BaseModel('Consultations', {
  doctorId: {
    type: DataTypes.INTEGER,
  },
  roomId: {
    type: DataTypes.INTEGER,
  },
  begin: {
    type: DataTypes.DATE,
  },
  end: {
    type: DataTypes.DATE,
  },
});

export default consultationsModel;