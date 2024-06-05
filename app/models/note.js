import Model, { attr } from '@ember-data/model';

export default Model.extend({
  //orderId: DS.belongsTo('order'),
  //userId: DS.belongsTo('user'),
  orderId: attr('string'),
  userId: attr('string'),
  emailTemplateLabel: attr('string'),
  subject: attr('string'),
  message: attr('string'),
  isEmail: attr('boolean'),
  noteTypeId: attr('string'),
  createdAt: attr('date'),
  updatedAt: attr('date')
});
