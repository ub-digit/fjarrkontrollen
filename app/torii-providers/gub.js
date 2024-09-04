import Oauth2 from 'torii/providers/oauth2-code';
import { configurable } from 'torii/configuration';
import { inject } from '@ember/service';
import config from 'fjarrkontrollen/config/environment';

export default Oauth2.extend({
  session: inject(),

  name: 'gub-oauth2',
  baseUrl: config.APP['gub-oauth2'].authorizeUri,
  responseParams: ['code', 'state'],

  redirectUri: configurable('redirectUri', function(){
    // A hack that allows redirectUri to be configurable
    // but default to the superclass
    return this._super();
  }),

  fetch(data) {
    return fetch(`${config.APP.authenticationBaseURL}/${data.token}`)
      .then(response => response.json())
      .then((responseData) => {
        return {
          token: responseData.access_token,
          userManagingGroupId: responseData.user.managing_group_id,
          userPickupLocationId: responseData.user.pickup_location_id,
          username: responseData.user.xkonto,
          userid: responseData.user.id,
          name: responseData.user.name,
          provider: data.provider
        };
      })
      .catch((error) => {
        this.session.invalidate();
      });
  }

});
