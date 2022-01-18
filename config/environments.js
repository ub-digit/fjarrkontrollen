/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'fjarrkontrollen',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      librisFjarrlanURL: 'http://iller.libris.kb.se/librisfjarrlan/lf.php?action=request&type=user&id='
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV['simple-auth'] = {
    authorizer: 'authorizer:gub',
    //crossOriginWhitelist: ['http://localhost:4000/'],
  };

  ENV['ember-toastr'] = {
    injectAs: 'toast',
    toastrOptions: {
      closeButton: true,
      debug: false,
      newestOnTop: true,
      progressBar: true,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '10000',
      extendedTimeOut: '10000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.contentSecurityPolicyHeader = 'Disabled-Content-Security-Policy';
    ENV.APP.serviceURL = 'http://localhost:3000';
    ENV.APP.authenticationBaseURL = 'http://localhost:3000/session';
    ENV.APP.kohaSearchURL = 'https://koha-lab-intra.ub.gu.se/cgi-bin/koha/catalogue/search.pl?q=';
  }
  else if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';
    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }
  else if (environment === 'production') {
    ENV.APP.serviceURL = 'https://fjarrkontrollen-server.ub.gu.se';
    ENV.APP.authenticationBaseURL = 'https://fjarrkontrollen-server.ub.gu.se/session';
    ENV.APP.kohaSearchURL = 'https://koha-intra.ub.gu.se/cgi-bin/koha/catalogue/search.pl?q=';
  }
  else if (environment === 'staging') {
    ENV.APP.serviceURL = 'https://fjarrkontrollen-server-staging.ub.gu.se';
    ENV.APP.authenticationBaseURL = 'https://fjarrkontrollen-server-staging.ub.gu.se/session';
    ENV.APP.kohaSearchURL = 'https://koha-staging-intra.ub.gu.se/cgi-bin/koha/catalogue/search.pl?q=';
  }
  else if (environment === 'lab') {
    ENV.APP.serviceURL = 'https://fjarrkontrollen-server-lab.ub.gu.se';
    ENV.APP.authenticationBaseURL = 'https://fjarrkontrollen-server-lab.ub.gu.se/session';
    ENV.APP.kohaSearchURL = 'https://koha-lab-intra.ub.gu.se/cgi-bin/koha/catalogue/search.pl?q=';
  }

  return ENV;
};
