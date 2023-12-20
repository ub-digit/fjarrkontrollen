import { inject as service } from '@ember/service';
import BaseSessionService from 'ember-simple-auth/services/session';

export default class SessionService extends BaseSessionService {
  @service sessionAccount;

  handleAuthentication() {
    let result = super.handleAuthentication(...arguments);
    this.sessionAccount
      .loadCurrentUser('authenticated')
      .catch(() => this.invalidate());
    return result;
  }
}
