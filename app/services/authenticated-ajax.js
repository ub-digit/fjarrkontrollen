 import { computed } from '@ember/object';
import { inject } from '@ember/service';
import AjaxService from 'ember-ajax/services/ajax';
import ENV from '../config/environment';

export default AjaxService.extend({
  trustedHosts: [ENV.APP.serviceURL.replace(/^https?:\/\//, '').replace(/:\d+$/, '')],
  session: inject(),
  headers: computed('session.data.authenticated.token', {
    get() {
      let headers = {};
      const token = this.get('session.data.authenticated.token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      return headers;
    }
  })
});
