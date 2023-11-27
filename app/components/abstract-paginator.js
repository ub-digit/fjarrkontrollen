import Component from '@glimmer/component';
import { computed, action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class AbstractPaginator extends Component {
  @tracked totalPages = null;
  @tracked currentPage = null;
  @tracked currentPageItemsCount = 4;
  @tracked firstPageItemsCount = 2;
  @tracked lastPageItemsCount = 2;

  get isLastPage() {
    return this.args.currentPage == this.args.totalPages;
  }

  get isFirstPage() {
    return this.args.currentPage == 1;
  }

  //@computed('totalPages', 'currentPage', 'currentPageItemsCount', 'firstPageItemsCount', 'lastPageItemsCount')
  get pageItems() {
    //TODO: Normalize numbers parseInt?
    let total = this.args.totalPages;
    let current = this.args.currentPage;
    let currentCount = this.args.currentPageItemsCount;
    let firstCount = this.args.firstPageItemsCount;
    let lastCount = this.args.lastPageItemsCount;
    let items = A([]);

    if (!total) {
      return items;
    }

    let pushItems = (from, to) => {
      for (let i = from; i <= to; ++i) {
        items.push({
          page: i,
          isActive: current == i
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
      let offset = firstCount - p1 + 1;
      p1 += offset;
      p2 += offset;
    }
    else if (p2 >= lastP1) {
      let offset = p2 - lastP1 + 1;
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

  @action
  nextPage() {
    if (this.args.currentPage < this.args.totalPages) {
      this.args.pageChanged(this.args.currentPage + 1);
    }
  }

  @action
  previousPage() {
    if (this.args.currentPage > 1) {
      this.args.pageChanged(this.args.currentPage - 1);
    }
  }

  @action
  changePage(value) {
    this.args.pageChanged(value);
  }
}
