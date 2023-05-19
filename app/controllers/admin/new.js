import Ember from 'ember';
import OrderValidations from '../../validations/order';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import { inject } from '@ember/service';
//import RSVP from 'rsvp';
import ENV from '../../config/environment';

export default Ember.Controller.extend({
  OrderValidations,

  session: inject(),
  userId: computed.reads('session.data.authenticated.userid'),
  isEditing: true,

  messageErrors: null, //???

  actions: {
    saveOrder(changeset) {
      return changeset.save().then((order) => {
        this.transitionToRoute('admin.post', order.get('id'));
      }).catch((error) => {
        //TODO: format of error??? Probably an object, produce error and test
        this.set('messageErrors', error);
      });
    }
  }
});
