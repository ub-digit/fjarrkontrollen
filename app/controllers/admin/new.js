import { reads } from '@ember/object/computed';
import Controller from '@ember/controller';
import NewOrderValidations from '../../validations/new-order';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import { inject } from '@ember/service';
//import RSVP from 'rsvp';
import ENV from '../../config/environment';

export default Controller.extend({
  NewOrderValidations,

  session: inject(),
  userId: reads('session.data.authenticated.userid'),
  isEditing: true,
  showValidations: false,
  messageErrors: null, //???

  actions: {
    saveOrder(changeset) {
      changeset.save().then((order) => {
        this.transitionToRoute('admin.post', order.get('id'));
      }).catch((error) => {
        //TODO: format of error??? Probably an object, produce error and test
        this.set('messageErrors', error);
      });
      /*
      return changeset.validate().then(() => {
        if (changeset.get('isValid')) {
          changeset.save().then((order) => {
            this.transitionToRoute('admin.post', order.get('id'));
          }).catch((error) => {
            //TODO: format of error??? Probably an object, produce error and test
            this.set('messageErrors', error);
          });
        }
        else {
          console.log('set errors?');
        }
      });
      */
    }
  }
});
