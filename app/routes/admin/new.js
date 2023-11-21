import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject } from '@ember/service';
import ResetScroll from "../../mixins/reset-scroll";

export default Route.extend(ResetScroll, {
  session: inject(),
  mitt: inject(),

  model() {
    let newStatusId = this.modelFor('admin')['statuses'].findBy('label', 'new').get('id');
    return this.store.createRecord('order', {orderPath: 'Staff', statusId: newStatusId});
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
  },

  actions: {
    willTransition() {
      this.controllerFor(this.routeName).set('showAllValidations', false);
      let order = this.modelFor(this.routeName);
      if (order.get('isNew')) {
        this.store.deleteRecord(order);
      }
      return true;
    }
  }
});
