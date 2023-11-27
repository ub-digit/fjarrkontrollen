import Controller from '@ember/controller';
import { computed, action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { isArray } from '@ember/array';
import powerSelectOverlayedOptions from '../mixins/power-select-overlayed-options';
import ENV from '../config/environment';
import mitt from 'mitt';

export default class AdminController extends Controller.extend(powerSelectOverlayedOptions) {
  @service session;
  @service toast;
  @service mitt;

  @tracked isShowingScanModal = false;
  isShowingSetDeliveredScanModal = false; //Works without tracked?
  isShowingUserSettingModal = false; // Currently never mutated
  loggedInUser = null;

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

  /*
  @computed('session', 'loggedInUser.{managingGroupId,pickupLocationId}')
  get affiliation() {
    let currentUserId = this.get('session.data.authenticated.userid');
    let currentUser = this.store.peekRecord('user', currentUserId);
    if (currentUser.managingGroupId) {
      return " | Handläggningsgrupp: " + this.managingGroups.findBy('id', currentUser.managingGroupId.toString()).name;
    }
    else {
      if (currentUser.pickupLocationId) {
        return " | Avhämtningsbibliotek: " + this.pickupLocations.findBy('id', currentUser.pickupLocationId.toString()).nameSv;
      }
      else {
        return "";
      }
    }
    this.set("loggedInUser", currentUser);
  }

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
    return this.findOrderPromise(changeset.get('barcode')).then((order) => {
      return order.setDelivered().then(() => {
        // Manually reload order since was not fetched using
        // order id (using barcode) which results in warning and
        // Ember not pushing the record to store(?)
        order.reload();
        this.mitt.emitter.emit('orderUpdated', order);
        this.toast.success(
          `Order status ändrad till levererad för order <b>${changeset.get('barcode')}</b>.`,
          'Status ändrad'
        );
      }).catch((error) => {
        if (isArray(error.errors)) {
          this.toast.error(
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
        this.toast.warning(
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
