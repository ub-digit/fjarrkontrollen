import { inject as service } from '@ember/service';
import BaseSessionService from 'ember-simple-auth/services/session';

export default class SessionService extends BaseSessionService {
  @service sessionAccount;

  handleAuthentication() {
    super.handleAuthentication(...arguments);
    return this.sessionAccount
      .loadCurrentUser('authenticated')
      .catch(() => this.invalidate());
  }
}
