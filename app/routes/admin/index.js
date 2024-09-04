import { inject as service } from '@ember/service';
import { isEmpty, isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import Route from '@ember/routing/route';

export default class AdminIndexRoute extends Route {
  @service session;
  @service store;

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

  defaultFilterValuesSet = false //hack

  @computed('session.authenticatedOrRestored', 'defaultFilterValuesSet')
  get setDefaultFilterValues() {
    return this.session.authenticatedOrRestored === 'authenticated' && !this.defaultFilterValuesSet;
  }

  model(params) {
    let filter = {};

    if (this.setDefaultFilterValues) {
      params.managingGroupId = this.get('session.defaultManagingGroupId');
      params.pickupLocationId = this.get('session.defaultPickupLocationId');
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

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('meta', model.meta);
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
    if (this.setDefaultFilterValues) {
      controller.set('managingGroupId', this.get('session.defaultManagingGroupId'));
      controller.set('pickupLocationId', this.get('session.defaultPickupLocationId'));
      this.set('defaultFilterValuesSet', true);
    }
  }
}
