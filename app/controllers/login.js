import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
export default class LoginController extends Controller {
  @service session;
  @tracked hasServerErrors = false;

  @action
  resetServerErrors(changeset) {
    if (this.hasServerErrors) {
      changeset.validate();
      this.hasServerErrors = false;
    }
  };

  @action
  authenticate(changeset) {
    return this.session.authenticate('authenticator:gub', {
        identification: changeset.get('identification'),
        password: changeset.get('password')
      })
      .catch((error) => {
        this.hasServerErrors = true;
        changeset.pushErrors('identification', '');
        if(typeof error === 'string') {
          changeset.pushErrors('password', error);
        }
        else {
          changeset.pushErrors('password', "Någonting gick fel, det går eventuellt för närvarande inte att logga in");
          console.dir(error);
        }
      });
  }
}
