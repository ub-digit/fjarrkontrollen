import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import ResetScroll from "../../../mixins/reset-scroll";

export default class SettingsRoute extends Route.extend(ResetScroll) {
  @service session;

  beforeModel(/* transition */) {
    this.transitionTo('admin.settings.templates');
  }
}
