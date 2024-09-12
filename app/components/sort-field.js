import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  //tagName: 'a',
  //attributeBindings: ['role'],
  //role: 'button',
  sortField: null,
  sortFieldText: null,
  currentSortField: null,
  currentSortDirection: null,

  faClass: computed('currentSortDirection', function() {
    return this.currentSortDirection == 'ASC' ? 'fa-angle-down' : 'fa-angle-up';
  }),

  isCurrentSortField: computed('sortField', 'currentSortField', function() {
    return this.sortField == this.currentSortField;
  }),

  actions: {
    onClick() {
      if (this.isCurrentSortField) {
        this.onChangeSortDirection(this.currentSortDirection == 'ASC' ? 'DESC' : 'ASC');
      }
      else {
        this.onChangeSortDirection('DESC');
        this.onChangeSortField(this.sortField);
      }
      return false;
    }
  }
});
