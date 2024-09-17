import Ember from 'ember';
import EmberObject from '@ember/object';
import BarcodeDataValidations from '../validations/barcode-data';

export default Ember.Component.extend({
  BarcodeDataValidations,
  isSubmitting: false, //Hack to access internal form state outside of form
  error: null,

  init() {
    this._super(...arguments);
    this.set('barcodeData', EmberObject.create({ barcode: null }));
  },

  actions: {
    resetState() {
      this.set('error', null);
    },
    onSubmit(changeset) {
      // validate, or skip since cannot submit without isValid?
      return this.get('onSubmit')(changeset).then(() => {
        changeset.rollback();
        document.querySelector('#scan-order-modal-input-field').focus();
      }, (error) => {
        if (typeof error === 'string') {
          changeset.pushErrors('barcode', error);
        }
        else {
          this.set('error', 'Ett oväntat fel inträffade');
          throw error;
        }
      });
    },
  }
});
