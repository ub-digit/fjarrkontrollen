import { reads } from '@ember/object/computed';
import { once } from '@ember/runloop';
import Component from '@ember/component';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import powerSelectOverlayedOptions from '../mixins/power-select-overlayed-options';
import { computed, observer, get, action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from '../config/environment';

export default class OrderFrom extends Component.extend(powerSelectOverlayedOptions) {
  @service('authenticated-ajax') ajax;
  @service session;
  @service toast;

  powerSelectOverlayedOptions = [
    {
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
    }
  ];

  userId = reads('session.data.authenticated.userid');
  errors = null;
  saveOrder = null; //??
  showValidations = false;
  changeset = null;

  setManagingGroup = observer('changeset.orderTypeId', function() {
    //WTF??
    //TODO: Test if this hack still needed after update
    once(this, function() {
      if (this.order.isNew && this.get('changeset.orderTypeId')) {
        let orderType = this.orderTypes.findBy('id', this.get('changeset.orderTypeId'));
        this.set('changeset.managingGroupId', orderType.get('defaultManagingGroupId'));
      }
    });
  })

  @computed('order.orderNumber')
  get kohaSearchUrl() {
    return this.get('order.orderNumber') ? ENV.APP.kohaSearchURL + this.get('order.orderNumber') : false;
  }

  @computed('order.librisRequestId')
  get librisUrl() {
    return ENV.APP.librisFjarrlanURL + this.get('order.librisRequestId');
  }

  init() {
    super.init(...arguments);
    let validator = this.get('orderValidations');
    this.set('changeset', Changeset(
      this.get('order'),
      lookupValidator(validator),
      validator
    ));
  }

  @action
  fetchPatronInfo(cardnumber) {
    this.ajax.fetch(`${ENV.APP.serviceURL}/koha_patrons/${cardnumber}`).then((data) => {
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
  }

  @action
  orderInvalid(changeset) {
    //TODO: translation of prop, lookup with i18n
    //and create custom validation message
    this.set('errors', changeset.get('errors').map((error) => {
      return error['validation'];
    }));
  }
}
