import Model, { attr } from '@ember-data/model';
import { not } from '@ember/object/computed';

export default Model.extend({
  nameSv: attr('string'),
  isActive: attr('boolean'),
  isDisabled: not('isActive'),
  label: attr('string')
});
