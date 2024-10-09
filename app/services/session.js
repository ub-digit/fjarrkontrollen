import { inject as service } from '@ember/service';
import BaseSessionService from 'ember-simple-auth/services/session';

import { computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SessionService extends BaseSessionService {

  @tracked authenticatedOrRestored = 'restored';

  handleAuthentication() {
    this.authenticatedOrRestored = 'authenticated';
    return super.handleAuthentication(...arguments);
  }

  @computed('data.authenticated.userPickupLocationId')
  get defaultPickupLocationId() {
    return this.data.authenticated.userPickupLocationId ? this.data.authenticated.userPickupLocationId.toString() : null;
  }

  @computed('data.authenticated.defaultManagingGroupId')
  get defaultManagingGroupId() {
    return this.data.authenticated.userManagingGroupId ? this.data.authenticated.userManagingGroupId.toString() : null;
  }

}
