import Model, { attr } from '@ember-data/model';
import { not } from '@ember/object/computed';

export default Model.extend({
  label: attr('string'),
  name: attr('string'),
  isActive: attr('boolean'),
  isDisabled: not('isActive')
});
