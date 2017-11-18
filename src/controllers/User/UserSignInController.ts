import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import db from '../../database';
import * as UserInsertDAO from '@daos/User/UserInsertDAO';
import * as UserSelectDAO from '@daos/User/UserSelectDAO';
import { transaction } from '../../database/databaseUtils';
import { authConfig } from '../../config/marmoym-config';
import MarmoymError from "../../models/MarmoymError";
import ErrorType from '../../models/ErrorType';
import SignInUserParam from '@models/RequestParam/SignInUserParam';

export async function signInUser(param: SignInUserParam) {
  const userSelected = await UserSelectDAO.selectUserByEmail(param.email);
  
  if (userSelected.length == 0) {
    throw new MarmoymError(ErrorType.USR.USER_NOT_FOUND);
  } else {
    const userInfo = userSelected[0];
    
    if (userInfo.status == 'P') {
      throw new MarmoymError(ErrorType.USR.USER_STATUS_PENDING);
    }

    if (bcrypt.compareSync(param.password, userInfo.password)) {
      return jwt.sign(
        {
          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
        },
        authConfig.jwtSecret,
        {
          expiresIn: authConfig.tokenExpireDuration
        }
      );
    } else {
      throw new MarmoymError(ErrorType.USR.USER_INCORRECT_PASSWORD);
    }
  }
}