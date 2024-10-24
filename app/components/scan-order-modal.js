import Component from '@ember/component';
import EmberObject from '@ember/object';
import BarcodeDataValidations from '../validations/barcode-data';

export default Component.extend({
  BarcodeDataValidations,
  isSubmitting: false, //Hack to access internal form state outside of form
  error: null,

  init() {
    this._super(...arguments);
    this.set('barcodeData', new EmberObject({ barcode: null }));
  },

  actions: {
    resetState() {
      this.set('error', null);
    },
    onSubmit(changeset) {
      // validate, or skip since cannot submit without isValid?
      return this.onSubmit(changeset).then(() => {
        changeset.rollback();
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
