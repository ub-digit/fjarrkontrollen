import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class AdminRoute extends Route {
  @service session;
  @service store;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  model() {
    return RSVP.hash({
      managingGroups: this.store.findAll('managing-group'),
      pickupLocations: this.store.findAll('pickup-location'),
      statusGroups: this.store.findAll('status-group'),
      orderTypes: this.store.findAll('order-type'),
      deliverySources: this.store.findAll('delivery-source'),
      deliveryMethods: this.store.findAll('delivery-method'),
      customerTypes: this.store.findAll('customer-type'),
      users: this.store.findAll('user'),
      noteTypes: this.store.findAll('note-type'),

      //Used by order page only
      emailTemplates: this.store.findAll('email-template'),
      statuses: this.store.findAll('status'),
    });
  }

  setupController(controller, model) {
    [
      'managingGroups', 'pickupLocations', 'statuses'
    ].forEach(function (property) {
      controller.set(property, model[property]);
    });
  }

}
