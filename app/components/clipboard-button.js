import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Clipboard from 'clipboard';
import { debounce } from '@ember/runloop';


export default class ClipboardTextComponent extends Component {
  clipboard = null;
  @tracked iconClass = 'far fa-copy'

  @action
  setupClipboard(element) {
    // Initialize Clipboard with the element that will trigger the copy action
    this.clipboard = new Clipboard(element, {
      text: () => {
        this.iconClass = 'fas fa-check';
        debounce(this, () => {
          this.iconClass = 'far fa-copy';
	}, 3000);
        return this.args.copyText || 'No text provided';
      }
    });

    // Optionally, you can handle success or error callbacks
    this.clipboard.on('success', (e) => {
      console.log('Text copied to clipboard:', e.text);
      e.clearSelection(); // deselects the text
    });

    this.clipboard.on('error', (e) => {
      console.error('Copy failed:', e);
    });
  }

  @action
  destroyClipboard(element) {
    // Destroy the clipboard instance to prevent memory leaks
    if (this.clipboard) {
      this.clipboard.destroy();
    }
  }
}
