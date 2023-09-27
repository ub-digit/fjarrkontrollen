import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicatoinRoute extends Route {
  @service session;
  @service sessionAccount;

  async beforeModel() {
    await this.session.setup();
  }

  model() {
    return this._loadCurrentUser('restored');
  }

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser('authenticated');
  }

  _loadCurrentUser(authenticatedOrRestored) {
    return this.get('sessionAccount')
      .loadCurrentUser(authenticatedOrRestored)
      .catch(() => this.get('session').invalidate());
  }

  actions = {
    loading(transition, originRoute) {
      let controller = this.controllerFor('application');
      controller.set('isLoading', true);
      transition.promise.finally(function() {
        controller.set('isLoading', false);
      });
    }
  }
}
