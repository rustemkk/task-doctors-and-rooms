import { DataTypes } from 'sequelize';

import { BaseModel } from '../utils/base.model';


const doctorsModel = new BaseModel('Doctors', {
  name: {
    type: DataTypes.STRING,
  },
  times: {
    type: DataTypes.JSON,
  },
});

export default doctorsModel;