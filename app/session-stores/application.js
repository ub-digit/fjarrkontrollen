import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

import Configuration from 'ember-simple-auth/configuration';

Configuration.routeAfterAuthentication = 'admin.index';

export default class ApplicationSessionStore extends AdaptiveStore {
  cookieName = 'gub-fjarrkontrollen'

  handleAuthentication() {
    super.handleAuthentication('admin.index');
  }
}
