import { format } from 'util';

import HttpStatus from '@constants/HttpStatus';
import Logger from '@src/modules/Logger';
import MarmoymError from '@models/MarmoymError';
import { PROD_ENV } from '@utils/envUtils';
import ResponseType from '@models/ResponseType';

/**
 * 
 * @version 0.0.1
 */
export default function errorHandler(err, req, res, next) {
  if (!(err instanceof Error)) {
    // err = MarmoymError.ofType(null, ResponseType.NOT_ERROR_OBJECT);
  }

  if (!err.code) {
    err.code = ResponseType.UNDEFINED_TYPE_ERROR.code;
    err.message = ResponseType.UNDEFINED_TYPE_ERROR.message;
  }

  // When TypeError, prints request information
  if (err.code === ResponseType.TYPE_ERROR.code) {
    err.message = format(err.message, req.query, req.body);
  }

  Logger.error('[%s] %s %s', err.code, err.name, err.message);
  Logger.debug('[%s] %s', err.code, err.stack);

  res.status(HttpStatus.ERROR)
    .send({
      code: err.code,
      ...!PROD_ENV ? { message: err.message }: {},
    })

};
