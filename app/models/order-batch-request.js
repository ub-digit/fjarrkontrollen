import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  batchId: attr('string'), // uuid
  orderListIds: attr('string'),
  allItems: attr('json'), // array of objects with shortform data
  itemsFailed: attr('string'), // array of objects with shortform data that failed
  errors: attr('json'), // array of error messages
  pickupLocationId: attr('string'),
  comments: attr('string'),
  name: attr('string'),
  company1: attr('string'),
  company2: attr('string'),
  company3: attr('string'),
  emailAddress: attr('string'),
  xAccount: attr('string'), // fetch from Koha
  authenticatedXAccount: attr('string'),
  customerTypeId: attr('string'),
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

  /* Actions: */
});
