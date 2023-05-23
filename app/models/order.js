import DS from 'ember-data';
import { computed } from '@ember/object';
import { memberAction } from 'ember-api-actions';

export default DS.Model.extend({
  isArchived: DS.attr('boolean'),
  stickyNoteId: DS.attr('string'),
  deliverySourceId: DS.attr('string'),
  stickyNoteSubject: DS.attr('string'),
  stickyNoteMessage: DS.attr('string'),
  orderTypeId: DS.attr('string'),
  title: DS.attr('string'),
  titleTruncated: computed('title', function() {
    return this.get('title')
      ? this.get('title')
          .substring(0, 20)
          .replace(/^[\s*.,]+|[.,\s]+$/g, '') + '...'
      : '';
  }),
  publicationYear : DS.attr('string'),
  volume: DS.attr('string'),
  issue: DS.attr('string'),
  pages: DS.attr('string'),
  journalTitle: DS.attr('string'),
  issnIsbn: DS.attr('string'),
  referenceInformation: DS.attr('string'),
  orderOutsideScandinavia: DS.attr('boolean'),
  notValidAfter: DS.attr('string'),
  name: DS.attr('string'),
  company1: DS.attr('string'),
  company2: DS.attr('string'),
  company3: DS.attr('string'),
  emailAddress: DS.attr('string'),
  phoneNumber: DS.attr('string'),
  libraryCardNumber: DS.attr('string'),
  xAccount: DS.attr('string'),
  authenticatedXAccount: DS.attr('string'),
  customerTypeId: DS.attr('string'),
  kohaBorrowenumber: DS.attr('string'),
  kohaUserCategory: DS.attr('string'),
  kohaOrganisation: DS.attr('string'),
  comments: DS.attr('string'),
  formLang: DS.attr('string'),
  authors: DS.attr('string'),
  orderNumber: DS.attr('string'),
  formLibrary: DS.attr('string'),
  deliveryMethodId: DS.attr('string'),
  invoicingName: DS.attr('string'),
  invoicingCompany: DS.attr('string'),
  invoicingAddress: DS.attr('string'),
  invoicingPostalAddress1: DS.attr('string'),
  invoicingPostalAddress2: DS.attr('string'),
  invoicingId: DS.attr('string'),
  deliveryAddress: DS.attr('string'),
  deliveryBox: DS.attr('string'),
  deliveryPostalCode: DS.attr('string'),
  deliveryCity: DS.attr('string'),
  deliveryComments: DS.attr('string'),
  orderPath: DS.attr('string'),
  createdAt: DS.attr('string'),
  updatedAt: DS.attr('string'),
  managingGroupId: DS.attr('string'),
  pickupLocationId: DS.attr('string'),
  userId: DS.attr('string'),
  statusId: DS.attr('string'),
  librisLfNumber: DS.attr('string'),
  librisRequestId: DS.attr('string'),
  librisid: DS.attr('string'),
  librismisc: DS.attr('string'),
  lendingLibrary: DS.attr('string'),
  loanPeriod: DS.attr('string'),
  price: DS.attr('number'),
  toBeInvoiced: DS.attr('boolean'),
  publicationType: DS.attr('string'),
  period: DS.attr('string'),

  /* Actions: */

  setDelivered: memberAction({ path: 'set_delivered' })
})
