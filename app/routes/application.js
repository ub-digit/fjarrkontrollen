import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationRoute extends Route {
  @service session;

  async beforeModel() {
    await this.session.setup();
  }

  @action
  loading(transition, originRoute) {
    let controller = this.controllerFor('application');
    controller.set('isLoading', true);
    transition.promise.finally(function() {
      controller.set('isLoading', false);
    });
  }

  @action
  accessDenied() {
    // this needed, ever called?
    this.transitionTo('login');
  }
}
