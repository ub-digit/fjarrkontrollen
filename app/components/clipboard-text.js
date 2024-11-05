import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
  cancel,
  debounce
} from '@ember/runloop';

export default class ClipboardTextComponent extends Component {
  // Tracked??
  @tracked copyButtonIsVisible = false;

  @action
  setupEventHandlers(element) {
    let mouseOutEvent = null;

    element.mouseoverListener = () => {
      if (mouseOutEvent) {
        cancel(mouseOutEvent);
      }
      this.copyButtonIsVisible = true;
    };
    element.mouseoutListener = () => {
      mouseOutEvent = debounce(this, () => {
        this.copyButtonIsVisible = false;
      }, 200);
    };

    element.addEventListener('mouseover', element.mouseoverListener);
    element.addEventListener('mouseout', element.mouseoutListener);
  }

  @action
  removeEventHandlers(element) {
    element.removeEventListener('mouseover', element.mouseoverListener);
    element.removeEventListener('mouseout', element.mouseoutListener);
  }

}
