import DS from 'ember-data';

export default DS.Model.extend({
  label:  DS.attr('string'),
  nameSv: DS.attr('string'),
  defaultManagingGroupId: DS.attr('string'),
});
