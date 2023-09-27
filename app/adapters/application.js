import DS from 'ember-data';
import ENV from '../config/environment';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import ActiveModelAdapter from 'active-model-adapter';

export default class ApplicationAdapter extends ActiveModelAdapter {
  @service session;

  host = ENV.APP.serviceURL;

  @computed('session.data.authenticated.access_token')
  get headers() {
    const headers = {};
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    }
    return headers;
  }

  handleResponse(status) {
    if (status === 401) {
      this.session.invalidate()
    }
    return this._super(...arguments);
  }

  /*
  authorize(xhr) {
    let { token } = this.get('session.data.authenticated');
    if (isPresent(token)) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
  }
  ajax: function(url, type, hash) {
    if (Ember.isEmpty(hash)) { hash = {}; }
    if (Ember.isEmpty(hash.data)) { hash.data = {}; }
    hash.data.token = this.container.lookup('route:application').get('session.content.secure.token');
    return this._super(url, type, hash);
  }
  */
}

// TODO: Where is this used/needed? Should not id just be number in model?
DS.Model.reopen({
  idInt: computed('id', function() {
    return this.get('id') ? parseInt(this.get('id')) : undefined;
  })
});

/*
var get = Ember.get;  //getPath = Ember.getPath,  set = Ember.set, fmt = Ember.String.fmt;

Ember.Select.reopen({
  optionDisabledPath: null
});

Ember.SelectOption.reopen({
  attributeBindings: ['disabled'],

  init: function() {
    this.disabledPathDidChange();

    this._super();
  },

  disabledPathDidChange: Ember.observer(function() {
    var valuePath = get(this, 'parentView.optionDisabledPath');

    if (!valuePath) { return; }

    Ember.defineProperty(this, 'disabled', Ember.computed(function() {
      return get(this, valuePath);
    }).property(valuePath));
  })
});
*/
