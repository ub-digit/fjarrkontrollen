import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { isArray } from '@ember/array';
import powerSelectOverlayedOptions from '../../mixins/power-select-overlayed-options';
import RSVP from 'rsvp';

export default Controller.extend(powerSelectOverlayedOptions, {
    session: inject(),
    toast: inject(),
    admin: controller(),


powerSelectOverlayedOptions: [{
    source: 'managingGroups',
    target: 'managingGroupOptions',
    valueProperty: 'id',
    labelProperty: 'name',
    noneLabel: 'Inget valt'
  }, {
    source: 'pickupLocations',
    target: 'pickupLocationOptions',
    valueProperty: 'id',
    labelProperty: 'nameSv',
    noneLabel: 'Inget valt'
  }],


  actions: {
    saveUser(activeUser) {
    let that = this;
    return new RSVP.Promise((resolve, reject) => {
      activeUser.save().then((model) => {
        // update session
        that.admin.set("loggedInUser", model);
        this.toast.success('Dina uppgifter sparades.','Sparad', {positionClass: 'toast-top-right', showDuration: '300', hideDuration: '1000', timeOut: '2000', extendedTimeOut: '2000'});
      }).catch((error) => {
        //TODO: format of error??? Probably an object, produce error and test
        this.set('messageErrors', error);
        reject(error);
      });
    });
    },
    exitUserAdmin() {
      history.back();
    }
    
  }
});
