import { reads } from '@ember/object/computed';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import { inject } from '@ember/service';
//import RSVP from 'rsvp';
import ENV from '../../config/environment';

export default Controller.extend({
  session: inject(),
  userId: reads('session.data.authenticated.userid'),
  isEditing: true,

  actions: {
    orderBatchRequestFetched() {
      this.set('isEditing', false);
    },
    cancelOrderBatchImport() {
      this.set('isEditing', true);
    },
    clearOrderBatchForm() {
      location.reload(true);
    },
  },
});
