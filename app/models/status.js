import DS from 'ember-data';
import { not } from '@ember/object/computed';

export default DS.Model.extend({
  nameSv: DS.attr('string'),
  isActive: DS.attr('boolean'),
  isDisabled: not('isActive'),
  label: DS.attr('string')
});
