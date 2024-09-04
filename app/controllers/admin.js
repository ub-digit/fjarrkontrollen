import Controller from '@ember/controller';
import { computed, action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { isArray } from '@ember/array';
import powerSelectOverlayedOptions from '../mixins/power-select-overlayed-options';
import ENV from '../config/environment';
import RSVP from 'rsvp';

export default class AdminController extends Controller.extend(powerSelectOverlayedOptions) {
  @service session;
  @service toast;
  @service mitt;

  @tracked isShowingScanModal = false;
  isShowingSetDeliveredScanModal = false; //Works without tracked?
  isShowingUserSettingModal = false; // Currently never mutated
  //loggedInUser = null; //remove?

  powerSelectOverlayedOptions = [{
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
  }];

  @computed('session.{defaultManagingGroupId,defaultPickupLocationId}')
  get affiliation() {
    let managingGroupId = this.session.defaultManagingGroupId;
    let pickupLocationId = this.session.defaultPickupLocationId;
    if (managingGroupId) {
      return " | Handläggningsgrupp: " + this.managingGroups.findBy('id', managingGroupId).name;
    }
    else {
      if (pickupLocationId) {
        return " | Avhämtningsbibliotek: " + this.pickupLocations.findBy('id', pickupLocationId).nameSv;
      }
      else {
        return "";
      }
    }
  }
  /*
  //Could be replaced with @tracked loggeInUser?
  @computed('loggedInUser.name')
  get activeUserSirName() {
    //TODO: This needs some reviewing
    let currentUserId = this.get('session.data.authenticated.userid');
    let currentUser = this.store.peekRecord('user', currentUserId);
    this.set("loggedInUser", currentUser);
    return currentUser.name;
  }
  */

  @computed('session.data.authenticated.token') //TODO: ???
  get exportUrl() {
     return ENV.APP.serviceURL + "/orders/export/?token=" + this.get('session.data.authenticated.token');
  }

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
  }

  @action
  logout() {
    this.session.invalidate();
  }

  @action
  scan(changeset) {
    return this.findOrderPromise(changeset.get('barcode')).then((order) => {
      this.isShowingScanModal = false;
      this.transitionToRoute('admin.post', order.get('id'));
    });
  }

  @action
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
    }).catch((err) => {
      if (err.errors && isArray(err.errors)) {
        let error = err.errors[0];
        if (error.status == '500') {
          this.get('toast').error(
            error.message,
            error.error
          );
        }
        else {
          this.get('toast').warning(
            error.message,
            error.error
          );
        }
      }
      else {
        throw err;
      }
    });
  }
}
