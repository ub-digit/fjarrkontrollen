import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { memberAction } from 'ember-api-actions';

export default Model.extend({
  isArchived: attr('boolean'),
  stickyNoteId: attr('string'),
  deliverySourceId: attr('string'),
  stickyNoteSubject: attr('string'),
  stickyNoteMessage: attr('string'),
  orderTypeId: attr('string'),
  title: attr('string'),
  titleTruncated: computed('title', function() {
    return this.title
      ? this.title
          .substring(0, 20)
          .replace(/^[\s*.,]+|[.,\s]+$/g, '') + '...'
      : '';
  }),
  publicationYear : attr('string'),
  volume: attr('string'),
  issue: attr('string'),
  pages: attr('string'),
  journalTitle: attr('string'),
  issnIsbn: attr('string'),
  referenceInformation: attr('string'),
  orderOutsideScandinavia: attr('boolean'),
  notValidAfter: attr('string'),
  name: attr('string'),
  company1: attr('string'),
  company2: attr('string'),
  company3: attr('string'),
  emailAddress: attr('string'),
  phoneNumber: attr('string'),
  libraryCardNumber: attr('string'),
  xAccount: attr('string'),
  authenticatedXAccount: attr('string'),
  customerTypeId: attr('string'),
  kohaBorrowernumber: attr('string'),
  kohaUserCategory: attr('string'),
  kohaOrganisation: attr('string'),
  comments: attr('string'),
  formLang: attr('string'),
  authors: attr('string'),
  orderNumber: attr('string'),
  formLibrary: attr('string'),
  deliveryMethodId: attr('string'),
  invoicingName: attr('string'),
  invoicingCompany: attr('string'),
  invoicingAddress: attr('string'),
  invoicingPostalAddress1: attr('string'),
  invoicingPostalAddress2: attr('string'),
  invoicingId: attr('string'),
  deliveryAddress: attr('string'),
  deliveryBox: attr('string'),
  deliveryPostalCode: attr('string'),
  deliveryCity: attr('string'),
  deliveryComments: attr('string'),
  orderPath: attr('string'),
  createdAt: attr('string'),
  updatedAt: attr('string'),
  managingGroupId: attr('string'),
  pickupLocationId: attr('string'),
  userId: attr('string'),
  statusId: attr('string'),
  librisLfNumber: attr('string'),
  librisRequestId: attr('string'),
  librisid: attr('string'),
  librismisc: attr('string'),
  lendingLibrary: attr('string'),
  loanPeriod: attr('string'),
  price: attr('number'),
  toBeInvoiced: attr('boolean'),
  publicationType: attr('string'),
  period: attr('string'),

  /* Actions: */

  setDelivered: memberAction({ path: 'set_delivered' })
})
