import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject } from '@ember/service';
import ResetScroll from "../../../mixins/reset-scroll";

export default Route.extend(ResetScroll, {
  session: inject('session'),

  model() {
    return RSVP.hash({
      emailTemplate: this.store.findAll('email_template', { reload: true }),
      managingGroups: this.store.findAll('managing-group'),
      pickupLocations: this.store.findAll('pickup-location'),
    });
  }, 

  setupController(controller, model) {
    [
      'emailTemplate', 'managingGroups', 'pickupLocations'
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
