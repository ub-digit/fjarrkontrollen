import { inject as service } from '@ember/service';
import { isEmpty, isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import Route from '@ember/routing/route';

export default class AdminIndexRoute extends Route {
  @service sessionAccount;

  queryParams = {
    managingGroupId: {
      refreshModel: true
    },
    pickupLocationId: {
      refreshModel: true
    },
    statusGroupLabel: {
      refreshModel: true
    },
    searchTermsDebounced: {
      refreshModel: true
    },
    orderTypeId: {
      refreshModel: true
    },
    deliverySourceLabel: {
      refreshModel: true
    },
    deliveryMethodLabel: {
      refreshModel: true
    },
    isArchivedOptionValue: {
      refreshModel: true
    },
    toBeInvoiced: {
      refreshModel: true
    },
    userId: {
      refreshModel: true
    },
    currentPage: {
      refreshModel: true
    },
    sortField: {
      refreshModel: true
    },
    sortDirection: {
      refreshModel: true
    },
  }

  defaultFiltersValuesSet = false //hack

  setDefaultFiltersValues = computed('sessionAccount.authenticatedOrRestored', 'defaultFiltersValuesSet', function() {
    return (
      this.get('sessionAccount.authenticatedOrRestored') == 'authenticated' &&
      !this.get('defaultFiltersValuesSet')
    );
  })

  model(params) {
    let filter = {};

    if (this.get('setDefaultFiltersValues')) {
      params.managingGroupId = this.get('sessionAccount.defaultManagingGroupId');
      params.pickupLocationId = this.get('sessionAccount.defaultPickupLocationId');
    }

    //TODO: Replace with mappings hash
    if (!isEmpty(params.managingGroupId)) {
      filter['current_managing_group'] = params.managingGroupId;
    }
    if (!isEmpty(params.pickupLocationId)) {
      filter['current_pickup_location'] = params.pickupLocationId;
    }
    if (!isEmpty(params.statusGroupLabel)) {
      filter['status_group'] = params.statusGroupLabel;
    }
    if (!isBlank(params.searchTermsDebounced)) {
      filter['search_term'] = params.searchTermsDebounced;
    }
    if (!isEmpty(params.orderTypeId)) {
      filter['mediaType'] = params.orderTypeId;
    }
    if (!isEmpty(params.deliverySourceLabel)) {
      filter['delivery_source'] = params.deliverySourceLabel;
    }
    if (!isEmpty(params.deliveryMethodLabel)) {
      filter['delivery_method'] = params.deliveryMethodLabel;
    }
    if (!isEmpty(params.isArchivedOptionValue)) {
      filter['is_archived'] = params.isArchivedOptionValue;
    }
    if (!isEmpty(params.toBeInvoiced)) {
      filter['to_be_invoiced'] = params.toBeInvoiced;
    }
    if (!isEmpty(params.userId)) {
      filter['user'] = params.userId;
    }
    if (!isEmpty(params.currentPage)) {
      filter['page'] = params.currentPage;
    }
    if (!isEmpty(params.sortField)) {
      filter['sortfield'] = params.sortField;
    }
    if (!isEmpty(params.sortDirection)) {
      filter['sortdir'] = params.sortDirection;
    }
    return this.store.query('order', filter);
  }

  setupController(controller) {
    this._super(...arguments); // This sets model
    let optionModels = this.modelFor('admin');
    [
      'managingGroups',
      'pickupLocations',
      'statusGroups',
      'statuses',
      'deliverySources',
      'deliveryMethods',
      'orderTypes',
      'users'
    ].forEach(function (property) {
      controller.set(property, optionModels[property]);
    });
    if (this.get('setDefaultFiltersValues')) {
      controller.set('managingGroupId', this.get('sessionAccount.defaultManagingGroupId'));
      controller.set('pickupLocationId', this.get('sessionAccount.defaultPickupLocationId'));
      this.set('defaultFiltersValuesSet', true);
    }
  }
}
