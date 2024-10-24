import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject } from '@ember/service';
import ResetScroll from "../../../mixins/reset-scroll";

export default Route.extend(ResetScroll, {
  session: inject('session'),

  model() {
    return RSVP.hash({
      user: this.store.findAll('user'),
      managingGroups: this.store.findAll('managing-group'),
      pickupLocations: this.store.findAll('pickup-location'),
    });
  }, 

  setupController(controller, model) {
    [
      'user', 'managingGroups', 'pickupLocations'
    ].forEach(function (property) {
      controller.set(property, model[property]);
    });

  },

  actions: {
    refreshRoute: function() {
      this.refresh();
    }
  }
});
