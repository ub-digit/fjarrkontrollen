import { resolve, reject } from 'rsvp';
import Service, { inject } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';

export default Service.extend({
  session: inject(),

  loadCurrentUser(authenticatedOrRestored) {
    if (!isEmpty(this.get('session.data.authenticated'))) {
      let account = this.get('session.data.authenticated');
      account['authenticatedOrRestored'] = authenticatedOrRestored;
      this.setProperties(account);
      return resolve();
    }
    else {
      reject();
    }
  },

  defaultPickupLocationId: computed('userPickupLocationId', function() {
    return this.userPickupLocationId ? this.userPickupLocationId.toString() : null;
  }),

  defaultManagingGroupId: computed('userManagingGroupId', function() {
    return this.userManagingGroupId ? this.userManagingGroupId.toString() : null;
  })
});
