import Model, { attr } from '@ember-data/model';

export default Model.extend({
  label: attr('string'),
  subjectSv: attr('string'),
  subjectEn: attr('string'),
  bodySv: attr('string'),
  bodyEn: attr('string'),
  disabled: attr('boolean'),
  position: attr('number')
});
