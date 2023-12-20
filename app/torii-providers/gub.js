import Oauth2 from 'torii/providers/oauth2-code';
import { configurable } from 'torii/configuration';
import { inject } from '@ember/service';

export default Oauth2.extend({
  session: inject(),

  name: 'gub-oauth2',
  baseUrl: 'https://github.com/login/oauth/authorize',
  responseParams: ['code', 'state'],

  redirectUri: configurable('redirectUri', function(){
    // A hack that allows redirectUri to be configurable
    // but default to the superclass
    return this._super();
  }),

  fetch(data) {
    fetch(`${ENV.APP.authenticationBaseURL}/${data.token}`)
    .then(response => response.json())
    .then((_responseData) => {
      return data;
    })
    .catch((error) => {
      console.log('error', error);
      this.session.invalidate(); //TODO: This the correct way of doing it?
    });
  }
});
