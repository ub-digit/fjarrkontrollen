import Base from 'ember-simple-auth/authenticators/base';
import { Promise, resolve } from 'rsvp';
import ENV from '../config/environment';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default class GUPAuthenticator extends Base {

  //TODO: review this
  restore(data) {
    return new Promise((resolve, reject) => {
    fetch(`${ENV.APP.authenticationBaseURL}/${data.token}`)
      .then(() => {
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
      this.fetch(ENV.APP.authenticationBaseURL, {
        method: 'POST',
        headers: { //TODO: Need this?
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          xkonto: credentials.identification,
          password: credentials.password
        })
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
        //@TODO: error format??
        run(null, reject, true ? "Fel användarnamn eller lösenord" : error);
      });
    });
  }
}
