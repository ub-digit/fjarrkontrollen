import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
export default class LoginController extends Controller {
  @service session;
  @tracked errorMessage = false; //#TODO Remove tracked?

  @action
  authenticate() {
    this.get('session').authenticate('authenticator:torii', 'gub')
    .catch((reason) => {
      this.set('errorMessage', reason);
    })
    .finally(() => {
      this.set('loginDisabled', false);
    });
  }
}
