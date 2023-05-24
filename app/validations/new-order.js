import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  statusId: [
    validatePresence({ presence: true, message: 'Status är obligatoriskt' })
  ],
  orderTypeId: [
    validatePresence({ presence: true, message: 'Beställningstyp är obligatoriskt' })
  ],
  managingGroupId: [
    validatePresence({ presence: true, message: 'Handläggningsgrupp är obligatoriskt' })
  ],
  pickupLocationId: [
    validatePresence({ presence: true, message: 'Avhämtningsbibliotek är obligatoriskt' })
  ],
  deliveryMethodId: [
    validatePresence({ presence: true, message: 'Leveransmetod är obligatoriskt' })
  ],
  customerTypeId: [
    validatePresence({ presence: true, message: 'Kundtyp är obligatoriskt' })
  ]
};
