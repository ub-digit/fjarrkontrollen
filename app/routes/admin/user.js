import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject } from '@ember/service';
import ResetScroll from "../../mixins/reset-scroll";

export default Route.extend(ResetScroll, {
  session: inject('session'),
  sessionAccount: inject('session-account'),

  model() {
    return RSVP.hash({
      managingGroups: this.store.findAll('managing-group'),
      pickupLocations: this.store.findAll('pickup-location'),
      activeUser: this.store.peekRecord('user',this.get('sessionAccount.userid')),
    }); 
  }, 

  setupController(controller, model) {
    [
      'managingGroups', 'pickupLocations', 'activeUser'
    ].forEach(function (property) {
      controller.set(property, model[property]);
    });

  },


});
