import Transform from '@ember-data/serializer/transform';
import EmberObject from '@ember/object';

// Converts stringified json coming from database (usually in table-field 'settings') to a POJO
export default class jsonTransform extends Transform {
  deserialize(serialized) {
    return JSON.parse(serialized);
  }

  serialize(deserialized) {
    return JSON.stringify(deserialized);
  }
}
