import Ember from 'ember';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Ember.Component.extend({
  totalPages: null,
  currentPage: null,
  currentPageItemsCount: 4,
  firstPageItemsCount: 2,
  lastPageItemsCount: 2,

  isLastPage: computed('currentPage', 'totalPages', function() {
    return this.get('currentPage') == this.get('totalPages');
  }),

  isFirstPage: computed('currentPage', function() {
    return this.get('currentPage') == 1;
  }),

  //showAllPages (override) ??
  //firstPage for zero/one indexed....
  //pageItemComponent: 'bs-paginator-item',
  pageItems: computed(
    'totalPages',
    'currentPage',
    'currentPageItemsCount',
    'firstPageItemsCount',
    'lastPageItemsCount', function() {
      //TODO: Normalize numbers parseInt?
      let total = this.get('totalPages');
      let current = this.get('currentPage');
      let currentCount = this.get('currentPageItemsCount');
      let firstCount = this.get('firstPageItemsCount');
      let lastCount = this.get('lastPageItemsCount');
      let items = A([]);

      if (!total) {
        return items;
      }

      let pushItems = (from, to) => {
        for (let i = from; i <= to; ++i) {
          items.push({
            page: i,
            isActive: this.get('currentPage') == i
          });
        }
      };

      if((currentCount + firstCount + lastCount) >= total) {
        pushItems(1, total);
        return items;
      }

      // Add first page items
      pushItems(1, firstCount);

      //let n3 = Math.max(1, current - Math.floor((currentCount - 1) / 2));
      //let p2 = Math.min(total, current + Math.ceil((currentCount - 1) / 2));
      let p1 = current - Math.floor((currentCount - 1) / 2);
      let p2 = current + Math.ceil((currentCount - 1) / 2);

      // Offset range if start or end position overlaps with other
      // boundary

      let lastP1 = (total - lastCount + 1);

      if (p1 <= firstCount) {
        let offset = Math.abs(firstCount - p1) + 1;
        p1 += offset;
        p2 += offset;
      }
      else if (p2 >= lastP1) {
        let offset = (p2 - lastP1) + 1;
        p1 -= offset;
        p2 -= offset;
      }

      // Gap between first items and page items?
      if ((p1 - firstCount) > 1) {
        items.push({
          spacer: true
        });
      }

      // Add current page items
      pushItems(p1, p2);

      // Gap betweenlast items and page items?
      if ((lastP1 - p2) > 1) {
        items.push({
          spacer: true
        });
      }

      // Add last page items
      pushItems(lastP1, total);

      return items;
    }
  ),

  actions: {
    nextPage() {
      if (this.get('currentPage') < this.get('totalPages')) {
        this.get('pageChanged')(this.get('currentPage') + 1);
      }
    },

    previousPage() {
      if (this.get('currentPage') > 1) {
        this.get('pageChanged')(this.get('currentPage') - 1);
      }
    },

    changePage(value) {
      this.get('pageChanged')(value);
    }
  }
});
