import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { isArray } from '@ember/array';
import RSVP from 'rsvp';


export default Component.extend({
    session: inject(),
    toast: inject(),

  init() {
    this._super(...arguments);
  },

  actions: {
    resetState() {
      this.set('error', null);
    },
    onSubmit(activeUser) {
    let that = this;
    return new RSVP.Promise((resolve, reject) => {
      activeUser.save().then((model) => {
        // update session
            that.set("loggedInUser", model);
        this.toast.success('Dina uppgifter sparades.','Sparad', {positionClass: 'toast-top-right', showDuration: '300', hideDuration: '1000', timeOut: '2000', extendedTimeOut: '2000'});
        this.set("open", false);
      }).catch((error) => {
        //TODO: format of error??? Probably an object, produce error and test
        this.set('messageErrors', error);
        reject(error);
      });
    });
    }
    
  }
});
