import Controller from '@ember/controller';
import { computed, observer, action } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject } from '@ember/service';
import { debounce } from '@ember/runloop';
//import { task } from 'ember-concurrency';
import powerSelectOverlayedOptions from '../../mixins/power-select-overlayed-options'
import { A } from '@ember/array';

export default Controller.extend(powerSelectOverlayedOptions, {
  session: inject(),

  powerSelectOverlayedOptions: [{
    source: 'managingGroups',
    target: 'managingGroupOptions',
    valueProperty: 'id',
    labelProperty: 'name',
    noneLabel: 'Alla handläggningsgrupper'
  }, {
    source: 'pickupLocations',
    target: 'pickupLocationOptions',
    valueProperty: 'id',
    labelProperty: 'nameSv',
    /*disabledProperty: 'is_active',*/
    noneLabel: 'Alla avhämtningsbibliotek'
  }, {
    source: 'orderTypes',
    target: 'orderTypeOptions',
    valueProperty: 'id',
    labelProperty: 'nameSv',
    noneLabel: 'Alla beställningstyper'
  }, {
    source: 'deliverySources',
    target: 'deliverySourceOptions',
    valueProperty: 'label',
    labelProperty: 'name',
    noneLabel: 'Alla leveransställen'
  }, {
    source: 'deliveryMethods',
    target: 'deliveryMethodOptions',
    valueProperty: 'label',
    labelProperty: 'name',
    noneLabel: 'Alla leveransmetoder'
  }],

  queryParams: {
    managingGroupId: 'managing_group',
    pickupLocationId: 'pickup_location',
    statusGroupLabel: 'status_group',
    searchTermsDebounced: 'search',
    orderTypeId: 'order_type',
    deliverySourceLabel: 'delivery_source',
    deliveryMethodLabel: 'delivery_method',
    isArchivedOptionValue: 'is_archived',
    toBeInvoiced: 'to_be_invoiced',
    userId: 'user',
    currentPage: 'page',
    sortField: 'sort_field',
    sortDirection: 'sort_direction'
  },

  sortFields: {
    order_number: 'Ordernummer',
    name: 'Låntagare',
    order_type_id: 'Typ',
    title: 'Titel',
    status_id: 'Status',
  },

  filtersExpanded: null,

  /* Filters */
  managingGroupId: null,
  pickupLocationId: null,
  statusGroupLabel: 'all',
  orderTypeId: null,
  deliverySourceLabel: null,
  deliveryMethodLabel: null,
  isArchivedOptionValue: 'false',
  toBeInvoiced: null,
  userId: null,
  searchTermsDebounced: null,
  searchTerms: null,
  /* End filters */

  /* Pagination */
  currentPage: null,

  /* Sorting*/
  sortField: null,
  sortDirection: null,

  /*
  setOrderAssignedUserPromise(orderId, newUserId) {
    return new RSVP.Promise((resolve, reject) => {
      this.store.find('order', orderId).then(function(order) {
        order.set('userId', newUserId);
        //TODO: If error in then below, will propagate to parent catch???
        order.save().then(() => {
          resolve();
          //TODO: refresh model needed??
        }).catch((error) => {
          //TODO: error handling, ember concurrency way?
          console.log(error);
          reject(error);
        });
      });
    });
  },
  */

  init() {
    this._super(...arguments);
    this.set('searchTermsDebounced', this.searchTerms);
    this.set('isArchivedOptions', A([{
      label: 'Visa bada aktiva och arkiverade',
      value: '',
    }, {
      label: 'Visa endast aktiva',
      value: 'false'
    }, {
      label: 'Visa endast arkiverade',
      value: 'true'
    }
    ]));
  },

  myOrdersFilterActive: computed('userId', function() {
    return !!this.userId;
  }),

  ordersFilterChanged: observer(
    'pickupLocationId',
    'statusGroupLabel',
    'searchTermsDebounced',
    'orderTypeId',
    'deliverySourceLabel',
    'deliveryMethodLabel',
    'isArchivedOptionValue',
    'toBeInvoiced',
    'userId',
    'sortField',
    'sortDirection', function() {
    // Reset pagination
    this.set('currentPage', null);
  }),

  setSearchTermsDebounced() {
    this.set('searchTermsDebounced', this.searchTerms);
  },

  @action
  setPickupLocationId(pickupLocation) {
    this.set('pickupLocationId', pickupLocation.value)
  },

  @action
  setStatusGroupLabel(statusGroup) {
    this.set('statusGroupLabel', statusGroup.get('label'))
  },


  actions: {
    resetFilters() {
      [
        'orderTypeId',
        'deliverySourceLabel',
        'deliveryMethodLabel',
        'toBeInvoiced',
        'userId',
        'searchTermsDebounced',
        'searchTerms'
      ].forEach((filterKey) => {
        this.set(filterKey, null);
      });
      this.set('isArchivedOptionValue', 'false');
      this.set('statusGroupLabel', 'all');
      this.set('managingGroupId', this.get('session.defaultManagingGroupId'));
      this.set('pickupLocationId', this.get('session.defaultPickupLocationId'));
    },

    setToBeInvoiced(value) {
      this.set('toBeInvoiced', value ? true : null);
    },

    setMyOrders(value) {
      this.set('userId', value
        ? this.get('session.authenticated.data.userid')
        : null
      );
    },

    setSearchTerms(value) {
      this.set('searchTerms', value);
      debounce(this, 'setSearchTermsDebounced', 500);
    },

  }
});
