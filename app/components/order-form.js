import { reads } from '@ember/object/computed';
import { once } from '@ember/runloop';
import Component from '@ember/component';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import powerSelectOverlayedOptions from '../mixins/power-select-overlayed-options';
import { computed, observer, get } from '@ember/object';
import { inject } from '@ember/service';
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
  ajax: inject('authenticated-ajax'),
  session: inject(),
  toast: inject(),
  userId: reads('session.data.authenticated.userid'),

  errors: null,
  saveOrder: null, //??
  showAllValidations: false,

  setManagingGroup: observer('changeset.orderTypeId', function() {
    //WTF??
    once(this, function() {
      if (this.order.isNew && this.get('changeset.orderTypeId')) {
        let orderType = this.orderTypes.findBy('id', this.get('changeset.orderTypeId'));
        this.set('changeset.managingGroupId', orderType.get('defaultManagingGroupId'));
      }
    });
  }),

  kohaSearchUrl: computed('order.orderNumber', function() {
    return this.get('order.orderNumber') ? ENV.APP.kohaSearchURL + this.get('order.orderNumber') : false;
  }),

  librisUrl: computed('order.librisRequestId', function() {
    return ENV.APP.librisFjarrlanURL + this.get('order.librisRequestId');
  }),

  init() {
    this._super(...arguments);
    //this.set() ?
    let order = this.order;
    let validator = this.orderValidations;
    this.set('changeset', Changeset(
      order,
      lookupValidator(validator),
      validator
    ));
  },

  actions: {
    fetchPatronInfo(cardnumber) {
      this.ajax.request(`${ENV.APP.serviceURL}/koha_patrons/${cardnumber}`).then((data) => {
        let patron = data.patron;
        this.set('changeset.name', `${patron.first_name} ${patron.last_name}`);
        this.set('changeset.xAccount', patron.xaccount);
        this.set('changeset.emailAddress', patron.email);
        this.set('changeset.kohaOrganisation', patron.organisation);
        this.set('changeset.kohaUserCategory', patron.user_category);
        this.set('changeset.phoneNumber', patron.phone);

        this.set('changeset.customerTypeId', this.customerTypes.findBy('label', 'koha').get('id'));

        // Hidden properties
        this.set('changeset.authenticatedXAccount', patron.xaccount);
        this.set('changeset.kohaBorrowernumber', patron.borrowernumber);

      }).catch((error) => {
        if (error.status == 404) {
          this.toast.warning(
            `Hittar ingen låntagare med lånekortsnummber <b>${cardnumber}</b>.`,
            'Låntagaren hittades inte'
          );
        }
        else {
          this.toast.error(
            'Ett oväntat serverfel har inträffat.',
            'Oväntat serverfel'
          );
        }
      });
    },

    orderInvalid(changeset) {
      //TODO: translation of prop, lookup with i18n
      //and create custom validation message
      this.set('errors', changeset.get('errors').map((error) => {
        return error['validation'];
      }));
    },
  }
});
