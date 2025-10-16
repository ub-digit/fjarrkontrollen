import { reads } from '@ember/object/computed';
import Controller from '@ember/controller';
import { computed, get, observer } from '@ember/object';
import { isBlank } from '@ember/utils';
import { inject } from '@ember/service';
//import RSVP from 'rsvp';
import ENV from '../../config/environment';

export default Controller.extend({
  session: inject(),
  toast: inject(),
  userId: reads('session.data.authenticated.userid'),
  isFetching: false,
  isPosting: false,
  states: ['new', 'processing', 'completed', 'failed'],
  currentState: null,
  init: function () {
    this._super(...arguments);
    this.set('currentState', this.states[0]); // set initial state as 'new'
  },

  actions: {
    submitOrdersForCreation() {
      this.set('isPosting', true);
      fetch(
        ENV.APP.serviceURL +
          `/batch_import/${this.get('orderBatchRequest.batchId')}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer ' + this.get('session.data.authenticated.token'),
          },
          body: JSON.stringify({
            orderBatchRequest: this.orderBatchRequest,
          }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          this.orderBatchRequest.set('allItems', []);
          Object.keys(data.orderBatchRequest).forEach((key) => {
            if (
              key === 'allItems' &&
              !Array.isArray(data.orderBatchRequest[key])
            ) {
              let arr = JSON.parse(data.orderBatchRequest[key]);
              arr.forEach((item) => {
                this.orderBatchRequest.allItems.pushObject(item);
              });
            } else if (key === 'pickupLocationId') {
              let value = data.orderBatchRequest[key];
              if (typeof value === 'number') {
                value = value.toString();
              }
              this.set(`orderBatchRequest.${key}`, value);
            } else if (key === 'customerTypeId') {
              let value = data.orderBatchRequest[key];
              if (typeof value === 'number') {
                value = value.toString();
              }
              this.set(`orderBatchRequest.${key}`, value);
            } else if (key === 'deliveryMethodId') {
              let value = data.orderBatchRequest[key];
              if (typeof value === 'number') {
                value = value.toString();
              }
              this.set(`orderBatchRequest.${key}`, value);
            } else {
              this.set(`orderBatchRequest.${key}`, data.orderBatchRequest[key]);
            }
          });
          this.set('currentState', this.states[2]);
          this.get('toast').success(`Ordrar skapades.`, 'Ordrar skapade');
        })
        .catch((error) => {
          if ('status' in error && error.status == 404) {
            this.set('orderBatchRequest.errors', ['Inga ordrar hittades']);
          } else {
            error.json().then((err) => {
              if (err && 'errors' in err) {
                this.set('orderBatchRequest.errors', err.errors);
              } else {
                this.set('orderBatchRequest.errors', [
                  'Okänt fel vid hämtning av ordrar',
                ]);
              }
            });
          }
        })
        .finally(() => {
          this.set('isPosting', false);
          window.scrollTo(0, 0);
        });
    },

    fetchOrdersForCreation() {
      this.set('isFetching', true);
      fetch(ENV.APP.serviceURL + `/batch_import/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + this.get('session.data.authenticated.token'),
        },
        body: JSON.stringify({
          orderBatchRequest: this.orderBatchRequest,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          Object.keys(data.orderBatchRequest).forEach((key) => {
            if (
              key === 'allItems' &&
              !Array.isArray(data.orderBatchRequest[key])
            ) {
              let arr = JSON.parse(data.orderBatchRequest[key]);
              arr.forEach((item) => {
                this.orderBatchRequest.allItems.pushObject(item);
              });
            } else if (key === 'pickupLocationId') {
              let value = data.orderBatchRequest[key];
              if (typeof value === 'number') {
                value = value.toString();
              }
              this.set(`orderBatchRequest.${key}`, value);
            } else if (key === 'customerTypeId') {
              let value = data.orderBatchRequest[key];
              if (typeof value === 'number') {
                value = value.toString();
              }
              this.set(`orderBatchRequest.${key}`, value);
            } else if (key === 'deliveryMethodId') {
              let value = data.orderBatchRequest[key];
              if (typeof value === 'number') {
                value = value.toString();
              }
              this.set(`orderBatchRequest.${key}`, value);
            } else {
              this.set(`orderBatchRequest.${key}`, data.orderBatchRequest[key]);
            }
          });
          this.set('currentState', this.states[1]);
        })
        .catch((error) => {
          if ('status' in error && error.status == 404) {
            this.toast.warning(`Hittar inga ordrar.`, 'ordern hittades inte');
          } else {
            this.toast.error(
              'Ett oväntat serverfel har inträffat.',
              'Oväntat serverfel'
            );
          }
        })
        .finally(() => {
          this.set('isFetching', false);
          window.scrollTo(0, 0);
        });
    },

    cancelOrderBatchImport() {
      this.set('orderBatchRequest.batchId', null);
      this.set('orderBatchRequest.allItems', []);
      this.set('currentState', this.states[0]);
      this.set('orderBatchRequest.itemsFailed', null);
    },
    clearOrderBatchForm() {
      location.reload(true); // Reload the page to reset the form and state quickly superhacky
    },
  },

  debug: computed(
    'orderBatchRequest.{batchId,orderListIds,allItems,itemsFailed,errors,pickupLocationId,name,company1,company2,company3,emailAddress,xAccount,authenticatedXAccount,customerTypeId,deliveryMethodId,invoicingName,invoicingCompany,invoicingAddress,invoicingPostalAddress1,invoicingPostalAddress2,invoicingId,deliveryAddress,deliveryBox,deliveryPostalCode,deliveryCity,deliveryComments}',
    function () {
      return JSON.stringify(this.orderBatchRequest, null, 2);
    }
  ),

  isEditing: computed('currentState', function () {
    return get(this, 'currentState') === this.states[0]; // only editable in 'new' state
  }),
  isCancelVisible: computed('currentState', function () {
    return get(this, 'currentState') === this.states[1];
  }),
  isClearFormVisible: computed('currentState', function () {
    return get(this, 'currentState') === this.states[0];
  }),

  isPostFormVisible: computed('currentState', function () {
    return get(this, 'currentState') === this.states[1];
  }),

  isHomelinkVisible: computed('currentState', function () {
    return get(this, 'currentState') === this.states[2];
  }),

  hasSelectedItems() {
    if (isBlank(this.orderBatchRequest.allItems)) {
      return false;
    }
    return this.orderBatchRequest.allItems.some((item) => item.selected);
  },
});
