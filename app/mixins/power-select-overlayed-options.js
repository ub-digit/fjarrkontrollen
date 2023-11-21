import Mixin from '@ember/object/mixin';
import { computed, defineProperty } from '@ember/object';
import { A } from '@ember/array'; // Needed?
import { assert } from '@ember/debug';

function buildOptions(settings) {
  //@each??
  return computed(settings['source'], function() {
    let modelRecords = this.get(settings['source']);
    let options = A([]);
    if (settings['noneLabel']) {
      options.pushObject({
        value: null,
        label: settings['noneLabel'],
      });
    }
    modelRecords.forEach((record) => {
      let option = {
        value: record.get(settings['valueProperty']),
        label: record.get(settings['labelProperty'])
      };
      if (settings['disabledProperty']) {
        option['disabled'] = record.get(settings['disabledProperty']);
      }
      options.pushObject(option);
    });
    return options;
  });
}

const powerSelectOverlayedOptions = Mixin.create({
  init() {
    this._super(...arguments);
    //TODO: Better message, and check type??
    assert('powerSelectOverlayedOptions must be set', this.powerSelectOverlayedOptions);

    this.powerSelectOverlayedOptions.forEach((settings) => {
      defineProperty(
        this,
        settings['target'],
        buildOptions(settings)
      );
    });
  },
});

export default powerSelectOverlayedOptions;
