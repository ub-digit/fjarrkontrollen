import Ember from 'ember';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { isArray } from '@ember/array';
import powerSelectOverlayedOptions from '../mixins/power-select-overlayed-options';
import ENV from '../config/environment';

export default Ember.Controller.extend(powerSelectOverlayedOptions, {
  session: inject(),
  toast: inject(),

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
    return this.store.findRecord('order', barcode).catch((error) => {
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
      return this.findOrderPromise(changeset.get('barcode')).then((order) => {
        return order.setDelivered().then(() => {
          this.get('toast').success(
            `Order status ändrad till levererad för order <b>${changeset.get('barcode')}</b>.`,
            'Status ändrad'
          );
        }).catch((error) => {
          if (isArray(error.errors)) {
            this.get('toast').error(
              error.errors[0].detail,
              error.errors[0].title
            );
          }
          else {
            throw error;
          }
        });
      }).catch((error) => {
        if (error.errors) {
          // TODO: Why different error format?
          // this is very confusing
          this.get('toast').warning(
            error.errors.message,
            error.errors.error
          );
        }
        else {
          throw error;
        }
      });
    }
  }
});
