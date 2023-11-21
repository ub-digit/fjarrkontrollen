import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject } from '@ember/service';
import ResetScroll from "../../../mixins/reset-scroll";

export default Route.extend(ResetScroll, {
  session: inject('session'),

  beforeModel(/* transition */) {
    this.transitionTo('admin.settings.templates');
  }
  
});
