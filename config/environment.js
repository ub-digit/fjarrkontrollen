/* eslint-env node */
'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'fjarrkontrollen',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },
    APP: {
      librisFjarrlanURL: 'http://iller.libris.kb.se/librisfjarrlan/lf.php?action=request&type=user&id='
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    torii: {
      sessionServiceName: 'session',
      providers: {
        'gub-oauth2': {
          apiKey: process.env.GUB_OAUTH2_CLIENT_ID,
          scope: 'user'
        }
      }
    },
    //@TODO: is this used?
    'simple-auth': {
      authorizer: 'authorizer:gub',
      //crossOriginWhitelist: ['http://localhost:4000/'],
    },
    'ember-toastr':  {
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
    }
  };

  let frontendBaseURL = null;

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.APP.serviceURL = `http://localhost:${process.env.BACKEND_SERVICE_PORT}`;
    frontendBaseURL = `http://localhost:${process.env.FRONTEND_PORT}`;
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
    ENV.APP.serviceURL = `https://${process.env.BACKEND_SERVICE_HOSTNAME}`;
    frontendBaseURL = `http://localhost:${process.env.FRONTEND_HOSTNAME}`;
    ENV.APP.kohaSearchURL = process.env.KOHA_SEARCH_URL;
  }
  if (environment !== 'test') {
    ENV.APP.authenticationBaseURL = ENV.APP.serviceURL + '/session';
    ENV.torii.providers['gub-oauth2'].tokenExchangeUri = ENV.APP.authenticationBaseURL;
    ENV.torii.providers['gub-oauth2'].redirectUri = `${frontendBaseURL}/torii/redirect.html`;
    ENV.APP['gub-oauth2'].authorizeUri = process.env.GUB_OAUTH2_AUTHORIZE_ENDPOINT;
  }

  return ENV;
};
