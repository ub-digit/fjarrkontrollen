import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject } from '@ember/service';
import ResetScroll from '../../mixins/reset-scroll';

export default Route.extend(ResetScroll, {
  session: inject(),
  mitt: inject(),

  model() {
    return this.store.createRecord('orderBatchRequest', {
      batchId: null,
      orderListIds: '',
      deliveryMethodId: this.modelFor('admin')
        ['deliveryMethods'].findBy('label', 'send')
        ?.get('id'),
      pickupLocationId: this.modelFor('admin')
        ['pickupLocations'].findBy('label', 'Gm')
        ?.get('id'),
      allItems: [],
      errors: [],
      itemsFound: [],
      itemsFailed: [],
      customerTypeId: null,
    });
  },

  setupController(controller, model) {
    let optionModels = this.modelFor('admin');
    ['pickupLocations', 'customerTypes', 'deliveryMethods'].forEach(function (
      property
    ) {
      controller.set(property, optionModels[property]);
    });
    controller.set('orderBatchRequest', model);
  },

  actions: {
    willTransition() {},
  },
});
