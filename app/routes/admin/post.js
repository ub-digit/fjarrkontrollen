import Ember from 'ember';
import RSVP from 'rsvp';
import { inject } from '@ember/service';
import ResetScroll from "../../mixins/reset-scroll";

export default Ember.Route.extend(ResetScroll, {
  session: inject(),
  mitt: inject(),

  model(param) {
    return RSVP.hash({
      order: this.store.findRecord('order', param.id),
      notes: this.store.query('note', { order_id: param.id }),
    });
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
    controller.setProperties(model);
    this.controllerFor('admin.index').set('lastOrderViewed', model.order.get('id'));
    const maybeFetchNotes = (updatedOrder) => {
      if (updatedOrder.get('id') === model.order.get('id')) {
        this.store.query('note', { order_id: updatedOrder.get('id') }).then(notes => {
          controller.set('notes', notes);
        });
      }
    }
    this.set('maybeFetchNotes', maybeFetchNotes);
    this.mitt.emitter.on('orderUpdated', maybeFetchNotes);
  },
  actions: {
    willTransition() {
      this.mitt.emitter.off('orderUpdated', this.maybeFetchNotes);
      return true;
    }
  }
});
