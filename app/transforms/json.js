// myapp/transforms/json.js
import DS from 'ember-data';

// Converts stringified json coming from database (usually in table-field 'settings') to a POJO
export default DS.Transform.extend({
  deserialize: function (serialized) {
    return JSON.parse(serialized);
  },
  serialize: function (deserialized) {
    return JSON.stringify(deserialized);
  },
});
