import * as bcrypt from 'bcrypt';

import db from '../../database';
import * as UserSelectDAO from '../../dao/User/UserSelectDAO';
import * as UserUpdateDAO from "../../dao/User/UserUpdateDAO";
import { transaction } from '../../database/databaseUtils';
import { authConfig } from '../../config/marmoym-config';
import MarmoymError from "../../models/MarmoymError";
import ErrorType from '../../models/ErrorType';

export function updateUser(req) {
  return transaction(async trx => {
    let encodedPw = undefined;
    let inputUsername = undefined;

    if (req.password != undefined && req.password != null) {
      encodedPw = bcrypt.hashSync(req.password, authConfig.hashSalt);
    }

    if (req.username != undefined && req.username != null) {
      const userSelectedByUsername = await UserSelectDAO.selectUserByUsername(req.username); 
      
      if (userSelectedByUsername.length == 0) {
        inputUsername = req.username;
      } else {
        throw new MarmoymError(ErrorType.USER.USERNAME_ALREADY_USED);
      }
    }

    if (encodedPw == undefined && inputUsername == undefined) {
      throw new MarmoymError(ErrorType.USER.USER_UPDATE_VALUES_EMPTY);
    } else {
      const userUpdated = await UserUpdateDAO.updateUserByUserId(trx, encodedPw, inputUsername, req.userId);
    }
    return 'UserUpdateSuccess';
  });
}