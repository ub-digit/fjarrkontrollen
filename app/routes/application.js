import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationRoute extends Route {
  @service session;
  @service sessionAccount;

  async beforeModel() {
    await this.session.setup();
  }

  model() {
    return this.sessionAccount
      .loadCurrentUser('restored')
      .catch(() => this.session.invalidate());
  }

  @action
  loading(transition, originRoute) {
    let controller = this.controllerFor('application');
    controller.set('isLoading', true);
    transition.promise.finally(function() {
      controller.set('isLoading', false);
    });
  }
}
