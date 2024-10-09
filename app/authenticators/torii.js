import { inject } from '@ember/service';
import ToriiAuthenticator  from 'ember-simple-auth/authenticators/torii';
import config from 'fjarrkontrollen/config/environment';
import { run } from '@ember/runloop';

export default ToriiAuthenticator.extend({
  torii: inject(),

  authenticate() {
    const ajax = this.get('ajax');
    const tokenExchangeUri = config.torii.providers['gub-oauth2'].tokenExchangeUri;

    return this._super(...arguments).then((data) => {
      return new Promise((resolve, reject) => {
        fetch(tokenExchangeUri, {
          method: 'POST',
          mode: 'cors',
          headers: { //TODO: Need this?
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code: data.authorizationCode
          })
        })
        .then((response) => {
            if (response.ok) {
              return response.json();
            }
            else {
              throw response;
            }
        })
        .then((responseData) => {
          run(() => {
            resolve({
              token: responseData.access_token,
              userManagingGroupId: responseData.user.managing_group_id,
              userPickupLocationId: responseData.user.pickup_location_id,
              username: responseData.user.xkonto,
              userid: responseData.user.id,
              name: responseData.user.name,
              provider: data.provider
            });
          });
        }).catch((error) => {
          let message;
          if ('status' in error && error.status == 401) {
            message = 'Inloggningen misslyckades, Användare hittades ej';
          }
          else {
            message = 'Inloggningen misslyckades på grund av ett oväntat serverfel';
          }
          run(null, reject, message);
        });
      });
    });
  }
});
