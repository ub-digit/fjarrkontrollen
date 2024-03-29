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
    ENV.APP.serviceURL = 'http://localhost:'  + process.env.BACKEND_SERVICE_PORT;
    ENV.contentSecurityPolicyHeader = 'Disabled-Content-Security-Policy';
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
  else {
    ENV.APP.serviceURL = 'https://' + process.env.BACKEND_SERVICE_HOSTNAME;
    ENV.APP.kohaSearchURL = process.env.KOHA_SEARCH_URL;
  }
  if (ENV.APP.serviceURL) {
    ENV.APP.authenticationBaseURL = ENV.APP.serviceURL + '/session';
  }

  return ENV;
};
