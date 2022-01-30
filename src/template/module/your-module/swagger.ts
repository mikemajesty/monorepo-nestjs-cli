import { Swagger } from 'libs/utils';

export class SwagggerResponse {
  static getExemple = {
    200: Swagger.defaultResponseText({ status: 200, text: 'exemple' }),
    500: Swagger.defaultResponseError({
      status: 500,
      route: '/module',
    }),
  };
}

export class SwagggerRequest {
  /** If requesters has a body.  */
}
