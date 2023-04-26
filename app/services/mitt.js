import Service from '@ember/service';
import mitt from 'mitt';

export default Service.extend({
  emitter: null,

  init() {
    this._super(...arguments);
    this.set('emitter', mitt());
  }

});
