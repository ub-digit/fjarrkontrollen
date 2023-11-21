import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';
//import ENV from '../config/environment';

export default class AuthenticatedFetch extends Service {
  //trustedHosts: [ENV.APP.serviceURL.replace(/^https?:\/\//, '').replace(/:\d+$/, '')],
  @service session;

  fetch(resource, options = {}) {
    const token = this.session.data.authenticated.token;
    // TODO: Less ugly way of doing this?
    if (token) {
      if ('headers' in options) {
        options.headers = {};
      }
      options.headers.Authorization = `Bearer ${token}`;
    }
    return fetch(resource, options);
  }
}
