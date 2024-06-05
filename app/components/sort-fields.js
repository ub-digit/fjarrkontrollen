import Component from '@ember/component';

export default Component.extend({

  sortFields: null,
  currentSortField: null,
  currentSortDirection: null,
  onChangeSortField: function() {},
  onChangeSortDirection: function() {},

  actions: {
    onChangeSortField() {
      this.onChangeSortField(...arguments);
    },
    onChangeSortDirection() {
      this.onChangeSortDirection(...arguments);
    },
  }

});
