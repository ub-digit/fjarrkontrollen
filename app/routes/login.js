import EmberObject from '@ember/object';
import CredentialsValidations from '../validations/credentials';
import lookupValidator from 'ember-changeset-validations';
import { Changeset } from 'ember-changeset';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class LoginRoute extends Route {
  @service session;

  beforeModel() {
    this.session.prohibitAuthentication('index');
  }

  setupController(controller) {
    let credentials = EmberObject.create({
      identification: '',
      password: ''
    });
    let changeset = Changeset(
      credentials,
      lookupValidator(CredentialsValidations),
      CredentialsValidations
    );
    controller.set('changeset', changeset);
  }
}
