import Ember from 'ember';
import UnAuthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import EmberObject from '@ember/object';
import CredentialsValidations from '../validations/credentials';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';

export default Ember.Route.extend(UnAuthenticatedRouteMixin, {
  setupController: function(controller) {
    let credentials = EmberObject.create({
      identification: '',
      password: ''
    });
    let changeset = new Changeset(
      credentials,
      lookupValidator(CredentialsValidations),
      CredentialsValidations
    );
    controller.set('changeset', changeset);
  }
});
