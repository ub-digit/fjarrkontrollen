import Ember from 'ember';
import RSVP from 'rsvp';
import { inject } from '@ember/service';
import ResetScroll from "../../mixins/reset-scroll";

export default Ember.Route.extend(ResetScroll, {
  session: inject(),
  mitt: inject(),

  model() {
    return this.store.createRecord('order', {orderPath: 'Staff'}); //Set orderPath or not?
  },

  setupController(controller, model) {
    let optionModels = this.modelFor('admin');
    [
      'managingGroups',
      'pickupLocations',
      'statuses',
      'deliverySources',
      'deliveryMethods',
      'orderTypes',
      'emailTemplates',
      'users',
      'customerTypes',
      'noteTypes'
    ].forEach(function (property) {
      controller.set(property, optionModels[property]);
    });
    controller.set('order', model);
  }
});
