import Model, { attr } from '@ember-data/model';

export default Model.extend({
  label:  attr('string'),
  nameSv: attr('string'),
  defaultManagingGroupId: attr('string'),
});
