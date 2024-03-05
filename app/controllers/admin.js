import Ember from 'ember';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { isArray } from '@ember/array';
import powerSelectOverlayedOptions from '../mixins/power-select-overlayed-options';
import ENV from '../config/environment';
import RSVP from 'rsvp';

export default Ember.Controller.extend(powerSelectOverlayedOptions, {
  session: inject(),
  toast: inject(),
  mitt: inject(),

  isShowingScanModal: false,
  isShowingSetDeliveredScanModal: false,
  isShowingUserSettingModal:false,
  loggedInUser: null,

  powerSelectOverlayedOptions: [{
    source: 'managingGroups',
    target: 'managingGroupOptions',
    valueProperty: 'id',
    labelProperty: 'name',
    noneLabel: 'Inget valt'
    }, {
    source: 'pickupLocations',
    target: 'pickupLocationOptions',
    valueProperty: 'id',
    labelProperty: 'nameSv',
    noneLabel: 'Inget valt'
  }],

  affiliation: computed('session', 'loggedInUser.{managingGroupId,pickupLocationId}', function() {
    let currentUserId = this.get('session.data.authenticated.userid');
    let currentUser = this.store.peekRecord('user', currentUserId);
    if (currentUser.managingGroupId) {
      return " | Handläggningsgrupp: " + this.get('managingGroups').findBy('id', currentUser.managingGroupId.toString()).name;
    }
    else {
      if (currentUser.pickupLocationId) {
        return " | Avhämtningsbibliotek: " + this.get('pickupLocations').findBy('id', currentUser.pickupLocationId.toString()).nameSv;
      }
      else {
        return "";
      }
    }
    this.set("loggedInUser", currentUser);
  }),

  userList: computed(function() {
    this.store.findAll('user');
  }),


  activeUserSirName: computed('loggedInUser.name', function() {
    let currentUserId = this.get('session.data.authenticated.userid'); 
    let currentUser = this.store.peekRecord('user', currentUserId);
    this.set("loggedInUser", currentUser);
    return currentUser.name;
  }),

  exportUrl: computed(function() {
     return ENV.APP.serviceURL + "/orders/export/?token=" + this.get('session.data.authenticated.token');
  }),

  findOrderPromise(barcode) {
    return this.store.queryRecord('order', {order_number: barcode}).catch((error) => {
      if (
          isArray(error.errors) &&
          error.errors[0] &&
          error.errors[0].status == '404'
         ) {
        throw 'Ingen order med numret hittades';
      }
      else {
        throw error;
      }
    });
  },

  actions: {
    logout() {
      this.get('session').invalidate();
    },

    scan(changeset) {
      return this.findOrderPromise(changeset.get('barcode')).then((order) => {
        this.set('isShowingScanModal', false);
        this.transitionToRoute('admin.post', order.get('id'));
      });
    },

    scanDelivered(changeset) {
      return new RSVP.Promise((resolve, reject) => {
        this.findOrderPromise(changeset.get('barcode')).then((order) => {
          order.setDelivered().then(() => {
            // Manually reload order since was not fetched using
            // order id (using barcode) which results in warning and
            // Ember not pushing the record to store(?)
            order.reload().then((order) => {
              this.mitt.emitter.emit('orderUpdated', order);
              this.get('toast').success(
                `Order status ändrad till levererad för order <b>${changeset.get('barcode')}</b>.`,
                'Status ändrad'
              );
              resolve();
            }).catch((error) => reject(error));
          }).catch((error) => reject(error));
        }).catch((error) => reject(error));
      }).catch((error) => {
        if (error.errors) {
          if (error.errors.status == '500') {
            this.get('toast').error(
              error.errors.message,
              error.errors.error
            );
          }
          else {
            this.get('toast').warning(
              error.errors.message,
              error.errors.error
            );
          }
        }
        else {
          throw error;
        }
      });
    }
  }
});
