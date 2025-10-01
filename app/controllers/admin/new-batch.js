import { reads } from '@ember/object/computed';
import Controller from '@ember/controller';
import { computed, get } from '@ember/object';
import { isBlank } from '@ember/utils';
import { inject } from '@ember/service';
//import RSVP from 'rsvp';
import ENV from '../../config/environment';
import orderBatchRequest from '../../models/order-batch-request';

export default Controller.extend({
  session: inject(),
  toast: inject(),
  autuhathenticatedAjax: inject('authenticated-ajax'),
  userId: reads('session.data.authenticated.userid'),
  isFetching: false,
  states: ['new', 'processing', 'completed', 'failed'],
  currentState: null,
  init: function () {
    this._super(...arguments);
    this.set('currentState', this.states[0]); // set initial state as 'new'
  },

  actions: {
    reset() {},
    submitOrdersForCreation() {
      setTimeout(() => {
        fetch(ENV.APP.serviceURL + '/orders_bulk_import', {
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
            Object.keys(data).forEach((key) => {
              this.set(`orderBatchRequest.${key}`, data[key]);
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
          .finally(() => {});
      }, 2000);
    },

    fetchOrdersForCreation() {
      this.set('isFetching', true);
      setTimeout(() => {
        fetch(`${ENV.APP.serviceURL}/order_batch_requests`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw response;
            }
          })
          .then((data) => {
            console.log(data);
            Object.keys(data).forEach((key) => {
              this.set(`orderBatchRequest.${key}`, data[key]);
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
          });
      }, 2000); // Simulate loading
    },

    cancelOrderBatchImport() {
      this.set('currentState', this.states[0]);
    },
    clearOrderBatchForm() {
      location.reload(true); // Reload the page to reset the form and state quickly superhacky
    },
  },
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
});
