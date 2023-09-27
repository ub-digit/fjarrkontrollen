import Base from 'ember-simple-auth/authenticators/base';
import { Promise, resolve } from 'rsvp';
import ENV from '../config/environment';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { isUnauthorizedError} from 'ember-ajax/errors';

export default class GUPAuthenticator extends Base {
  @service ajax;

  restore(data) {
    return new Promise((resolve, reject) => {
      this.ajax.request(
        `${ENV.APP.authenticationBaseURL}/${data.token}`
      ).then(() => {
        run(() => {
          resolve(data);
        });
      }, (error) => {
        run(null, reject, error);
      });
    });
  }

  authenticate(credentials) {
    return new Promise((resolve, reject) => {
      this.ajax.post(ENV.APP.authenticationBaseURL, {
        data: {
          xkonto: credentials.identification,
          password: credentials.password
        }
      }).then((response_data) => {
        run(() => {
          const data = {
            token: response_data.access_token,
            userManagingGroupId: response_data.user.managing_group_id,
            userPickupLocationId: response_data.user.pickup_location_id,
            username: response_data.user.xkonto,
            userid: response_data.user.id,
            name: response_data.user.name
          };
          resolve(data);
        });
      }).catch((error) => {
        run(null, reject, isUnauthorizedError(error) ? "Fel användarnamn eller lösenord" : error);
      });
    });
  }
}
