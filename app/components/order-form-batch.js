import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import powerSelectOverlayedOptions from '../mixins/power-select-overlayed-options';
import { computed, get, action } from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';
import orderBatchRequest from '../models/order-batch-request';
import { tracked } from '@glimmer/tracking';

export default class OrderFormBatch extends Component.extend(
  powerSelectOverlayedOptions
) {
  @service('authenticated-ajax') ajax;
  @service session;
  @service mitt;
  @service store;
  @service toast;

  powerSelectOverlayedOptions = [
    {
      source: 'deliverySources',
      target: 'deliverySourceOptions',
      valueProperty: 'id',
      labelProperty: 'name',
      disabledProperty: 'isDisabled',
      noneLabel: 'Ej angivet',
    },
    {
      source: 'deliveryMethods',
      target: 'deliveryMethodOptions',
      valueProperty: 'id',
      labelProperty: 'name',
      disabledProperty: 'isDisabled',
      noneLabel: 'Ej angivet',
    },
  ];

  userId = reads('session.data.authenticated.userid');
  errors = null;
  order = null;

  @computed('customerTypes', 'orderBatchRequest.customerTypeId')
  get isUniversityCustomerType() {
    return (
      this.customerTypes.findBy('label', 'univ')?.id ===
      this.orderBatchRequest.customerTypeId
    );
  }

  @computed('customerTypes', 'orderBatchRequest.customerTypeId')
  get isOvriCustomerType() {
    return (
      this.customerTypes.findBy('label', 'ovri')?.id ===
      this.orderBatchRequest.customerTypeId
    );
  }

  @computed('customerTypes')
  get customerTypesFilteredForBatchImport() {
    return this.customerTypes.filter((type) => {
      if (type.label === 'ovri' || type.label === 'univ') {
        return type;
      }
    });
  }

  @computed('orderBatchRequest.allItems')
  get hasOrderID() {
    if (
      this.orderBatchRequest.allItems.length > 0 &&
      Array.isArray(this.orderBatchRequest.allItems) &&
      this.orderBatchRequest.allItems[0].id
    ) {
      return true;
    }
    return false;
  }

  @computed('isFetching', 'orderBatchRequest.orderListIds')
  get isBtnFetchOrdersDisabled() {
    return (
      this.isFetching ||
      !this.orderBatchRequest ||
      !this.orderBatchRequest.orderListIds ||
      this.orderBatchRequest.orderListIds.trim().length === 0
    );
  }

  @computed('orderBatchRequest.itemsFailed')
  get failedItems() {
    if (
      !this.orderBatchRequest ||
      !Array.isArray(this.orderBatchRequest.itemsFailed)
    ) {
      return '';
    }
    return this.orderBatchRequest.itemsFailed
      .map((item) =>
        Object.entries(item)
          .map(([key, value]) => `${value}`)
          .join(', ')
      )
      .join('\n');
  }

  @action updateSelected(id) {
    let item = this.orderBatchRequest.allItems.findBy('id', id);
    if (item) {
      item.selected = !item.selected;
    }
  }

  // Observer alternative, but doesn't seem to work after update
  // @observer('orderBatchRequest.libraryCardNumber')
  @action
  fetchPatronInfo(cardnumber) {
    this.ajax
      .fetch(`${ENV.APP.serviceURL}/koha_patrons/${cardnumber}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        let patron = data.patron;
        this.set(
          'orderBatchRequest.name',
          `${patron.first_name} ${patron.last_name}`
        );
        this.set('orderBatchRequest.xAccount', patron.xaccount);
        this.set('orderBatchRequest.emailAddress', patron.email);
        this.set('orderBatchRequest.kohaOrganisation', patron.organisation);
        this.set('orderBatchRequest.kohaUserCategory', patron.user_category);
        this.set('orderBatchRequest.phoneNumber', patron.phone);

        this.set(
          'orderBatchRequest.customerTypeId',
          this.customerTypes.findBy('label', 'univ').get('id')
        );

        // Hidden properties
        this.set('orderBatchRequest.authenticatedXAccount', patron.xaccount);
        this.set('orderBatchRequest.kohaBorrowernumber', patron.borrowernumber);
      })
      .catch((error) => {
        if ('status' in error && error.status == 404) {
          this.toast.warning(
            `Hittar ingen låntagare med lånekortsnummber <b>${cardnumber}</b>.`,
            'Låntagaren hittades inte'
          );
        } else {
          this.toast.error(
            'Ett oväntat serverfel har inträffat.',
            'Oväntat serverfel'
          );
        }
      });
  }

  // Use setter action instead since observers don't seem to work after update
  @action
  setOrderType(orderBatchRequest, orderType) {
    orderBatchRequest.set('orderTypeId', orderType.get('id'));
    if (this.order.isNew && orderType.get('id')) {
      orderBatchRequest.set(
        'managingGroupId',
        orderType.get('defaultManagingGroupId')
      );
    }
  }
}
