import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  xkonto: attr('string'),
  name: attr('string'),
  managingGroupId: attr('string'),
  pickupLocationId: attr('string'),
});
