import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject } from '@ember/service';
import RSVP from 'rsvp';
import { computed } from '@ember/object';

export default Component.extend({
  store: inject(),
  setOrderAssignedUserPromise: null,
  orderId: null,
  assignedUsername: null,
  assignedUserId: null,
  loggedInUsername: null,
  loggedInUserId: null,

  classNames: ['order-user-switcher'],

  assignedUserIsLoggedInUser: computed('assignedUserId', 'loggedInUserId', function() {
    return this.assignedUserId == this.loggedInUserId;
  }),

  setOrderAssignedUser: task(function * (orderId, newUserId) {
    let promise = new RSVP.Promise((resolve, reject) => {
      this.store.find('order', orderId).then((order) => {
        order.set('userId', newUserId);
        //TODO: If error in then below, will propagate to parent catch???
        order.save().then(() => {
          resolve();
          //TODO: refresh model needed??
        }).catch((error) => {
          //TODO: error handling the ember concurrency way, should be an easy fix
          console.log(error);
          reject(error);
        });
      });
    });
    yield promise;
  })
});
