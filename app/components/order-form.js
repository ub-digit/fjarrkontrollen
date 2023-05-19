import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import powerSelectOverlayedOptions from '../mixins/power-select-overlayed-options';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { get }   from '@ember/object';
import ENV from '../config/environment';

export default Component.extend(powerSelectOverlayedOptions, {
  powerSelectOverlayedOptions: [{
    source: 'deliverySources',
    target: 'deliverySourceOptions',
    valueProperty: 'id',
    labelProperty: 'name',
    disabledProperty: 'isDisabled',
    noneLabel: 'Ej angivet'
  }, {
    source: 'deliveryMethods',
    target: 'deliveryMethodOptions',
    valueProperty: 'id',
    labelProperty: 'name',
    disabledProperty: 'isDisabled',
    noneLabel: 'Ej angivet'
  }, {
    source: 'statuses',
    target: 'statusOptions',
    valueProperty: 'id',
    labelProperty: 'nameSv',
    disabledProperty: 'isDisabled'
  }],
  session: inject(),
  userId: computed.reads('session.data.authenticated.userid'),

  errors: null,
  saveOrder: null, //??
  showAllValidations: true, //??

  setManagingGroup: Ember.observer('changeset.orderTypeId', function() {
    if (this.get('order').isNew) {
      let orderType = this.get('orderTypes').findBy('id', this.get('changeset.orderTypeId'));
      this.set('changeset.managingGroupId', orderType.get('defaultManagingGroupId'));
    }
  }),

  kohaSearchUrl: computed('order.orderNumber', function() {
    return this.get('order.orderNumber') ? ENV.APP.kohaSearchURL + this.get('order.orderNumber') : false;
  }),

  init() {
    this._super(...arguments);
    //this.set() ?
    //
    let order = get(this, 'order');
    let validator = get(this, 'orderValidations');
    this.changeset = new Changeset(order, validator);
    /*
    this.set('changeset', new Changeset(
      this.order,
      lookupValidator(this.orderValidations),
      this.orderValidations
    ));
    */
  },


  actions: {
    orderInvalid(changeset) {
      //TODO: translation of prop, lookup with i18n
      //and create custom validation message
      this.set('errors', changeset.get('errors').map((error) => {
        return error['validation'];
      }));
    },
  }
});
