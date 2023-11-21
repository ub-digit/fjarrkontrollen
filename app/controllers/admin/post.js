import { reads } from '@ember/object/computed';
import Controller from '@ember/controller';
import OrderValidations from '../../validations/order';
import MessageValidations from '../../validations/message';
import NoteValidations from '../../validations/note';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import { inject } from '@ember/service';
import ENV from '../../config/environment';
import RSVP from 'rsvp';

export default Controller.extend({
  OrderValidations,
  MessageValidations,
  NoteValidations,

  session: inject(),
  userId: reads('session.data.authenticated.userid'),

  isEditing: false,
  isCreatingMessage: false,
  isCreatingNote: false,
  errors: null,
  messageErrors: null,
  noteErrors: null,
  message: null,
  showAllValidations: false,

  messageLanguage: 'sv',
  emailTemplateId: null,
  addBiblioInfo: true,

  lastOrderViewed: null, //TODO: Seems like this can be removed/is unused

  printOrderUrl: computed('order.id', function() {
    return ENV.APP.serviceURL +
      '/orders/' +
      this.get('order.id') +
      '.pdf?token=' +
      this.get('session.data.authenticated.token');
  }),

  printDeliveryNoteUrl: computed('order.id', function() {
     return ENV.APP.serviceURL +
       "/orders/" +
       this.get("order.id") +
       ".pdf?token=" +
       this.get('session.data.authenticated.token')
       + "&layout=delivery_note";
  }),

  messageLanguageOption: computed('messageLanguage', function() {
    return this.messageLanguageOptions.findBy('language', this.messageLanguage);
  }),

  emailTemplateOptions: computed('emailTemplates', function() {
    return this.emailTemplates.rejectBy('disabled');
  }),

  emailTemplate: computed('emailTemplateId', function() {
    return this.emailTemplateOptions.findBy('id', this.emailTemplateId);
  }),

  emailTemplateSubject: computed('messageLanguageOption', 'emailTemplate', function() {
    let option = this.messageLanguageOption;
    let template = this.emailTemplate;
    return template ? template.get(option['subjectProperty']) : null;
  }),

  emailTemplateBody: computed('messageLanguageOption', 'emailTemplate', 'addBiblioInfo', function() {
    let option = this.messageLanguageOption;
    let template = this.emailTemplate;
    let emailTemplateBody = '';
    if (template) {
      emailTemplateBody = template.get(option['bodyProperty']);
      if (this.addBiblioInfo) {
        emailTemplateBody += this.biblioInfo;
      }
      return emailTemplateBody;
    }
    else {
      if (this.addBiblioInfo) {
        emailTemplateBody += this.biblioInfo;
        return emailTemplateBody;
      }
      return null;
    }
  }),

  init() {
    this._super(...arguments);
    this.set('messageLanguageOptions', A([{
      label: 'Svenska',
      language: 'sv',
      subjectProperty: 'subjectSv',
      bodyProperty: 'bodySv'
    }, {
      label: 'Engelska',
      language: 'en',
      subjectProperty: 'subjectEn',
      bodyProperty: 'bodyEn'
    }]));
  },

  biblioInfo: computed(
    'order.name',
    'order.title',
    'order.orderNumber',
    'order.authors',
    'order.journalTitle',
    'messageLanguage',
    function () {
      let messageLanguage = this.messageLanguage;
      let properties = A([
        {
          key: 'orderNumber',
          en: 'Ordernumber',
          sv: 'Ordernummer'
        }, {
          key: 'name',
          en: 'Patron',
          sv: 'Låntagare'
        }, {
          key: 'title',
          en: 'Title',
          sv: 'Titel'
        }, {
          key: 'authors',
          en: 'Author',
          sv: 'Författare'
        }, {
          key: 'journalTitle',
          en: 'Journal title',
          sv: 'Tidskriftstitel'
        }
      ]);

      let order = this.order;
      let message = properties.map((item) => {
        let value = order.get(item.key);
        if (!isBlank(value)) {
          return item[messageLanguage] + ': ' +  order.get(item.key);
        }
        return false;
      })
        .filter((item) => { return !!item; })
        .join("\n") + "\n";
      let separator = '------------------------- \n';
      return "\n\n" + separator + message +  separator;
  }),

  actions: {
    /** Order **/
    saveOrder(changeset) {
      return new RSVP.Promise((resolve, reject) => {
        changeset.save().then(() => {
          this.notes.update().then(() => {
            this.set('isEditing', false);
            resolve();
          }).catch((error) => {
            //How avoid multiple error handlers
            console.dir(error);
            reject(error);
          });
        }).catch((error) => {
          //TODO: format of error??? Probably an object, produce error and test
          this.set('messageErrors', error);
          reject(error);
        });
      });
    },
    //TODO: inconsistent naming
    editOrder() {
      this.set('showAllValidations', false);
      this.set('isEditing', true);
    },
    cancelEditOrder(changeset) {
      this.set('isEditing', false);
      this.set('errors', null);
      changeset.rollback();
    },
    /** Message **/
    showCreateMessage() {
      // Need to reset these since not part of changeset
      this.set('messageLanguage', 'sv');
      this.set('emailTemplateId', null);
      this.set('addBiblioInfo', true);

      var bibInfo = '';
      if (this.addBiblioInfo) {
        var bibInfo = this.biblioInfo;
      }

      this.set('message',
        this.store.createRecord(
          'note',
          { isEmail: true, noteTypeId: this.noteTypes.findBy('label', 'email').id, userId: this.userId, orderId: this.get('order.id'), message: bibInfo }
        )
      );
      this.set('isCreatingMessage', true);
    },
    cancelCreateMessage() {
      this.set('isCreatingMessage', false);
    },
    saveMessage(changeset) {
       return new RSVP.Promise((resolve, reject) => {
        changeset.save().then(() => {
          this.notes.update().then(() => {
            this.set('isCreatingMessage', false);
            resolve();
          }).catch((error) => {
            //How avoid multiple error handlers
            console.dir(error);
            reject(error);
          });
        }).catch((error) => {
          //TODO: format of error??? Probably an object, produce error and test
          this.set('messageErrors', error);
          reject(error);
        });
      });
    },
    messageInvalid(changeset) {
      this.set('messageErrors', changeset.get('errors').map((error) => {
        return error['validation'];
      }));
    },
    /** Note **/
    showCreateNote(note) {
      if (note) {
        this.set('note', note);
      }
      else {
        this.set('note',
          this.store.createRecord(
            'note',
            { isEmail: false, noteTypeId: this.noteTypes.findBy('label', 'user').id, userId: this.userId, orderId: this.get('order.id') }
          )
        );
      }
      this.set('isCreatingNote', true);
    },
    cancelCreateNote() {
      this.set('isCreatingNote', false);
    },

    saveNote(changeset) {
      return new RSVP.Promise((resolve, reject) => {
        changeset.save().then(() => {
          this.notes.update().then(() => {
            this.set('isCreatingNote', false);
            resolve();
          }).catch((error) => {
            //How avoid multiple error handlers
            console.dir(error);
            reject(error);
          });
        }).catch((error) => {
          //TODO: format of error??? Probably an object, produce error and test
          this.set('noteErrors', error);
          reject(error);
        });
      });
    },
    noteInvalid(changeset) {
      this.set('noteErrors', changeset.get('errors').map((error) => {
        return error['validation'];
      }));
    },
    onTemplatePropertyChange(changeset, property, value) {
      if (this.emailTemplate) {
        if (
            !isBlank(changeset.get('subject')) &&
            changeset.get('subject') != this.emailTemplateSubject ||
            !isBlank(changeset.get('message')) &&
            changeset.get('message') != this.emailTemplateBody
        ) {
          if (!confirm("Gjorda ändringar kommer att gå förlorade, tryck OK för att fortsätta.")) {
            return;
          }
        }
      }
      this.set(property, value);
      changeset.set('subject', this.emailTemplateSubject);
      changeset.set('message', this.emailTemplateBody);
      changeset.set('emailTemplateLabel', this.get('emailTemplate.label'));
    },

    onAddBiblioInfoChange(changeset, addBiblioInfo) {
      let message = changeset.get('message') || '';
      if(addBiblioInfo) {
        changeset.set(
          'message',
          message + this.biblioInfo
        );
      }
      else {
        changeset.set(
          'message',
          message.replace(this.biblioInfo, '')
        );
      }
      this.set('addBiblioInfo', addBiblioInfo);
    },

    deleteNote(noteId) {
      if (confirm('Är du säker på att du vill ta bort denna notering?')) {
        this.store.findRecord('note', noteId, {reload: true}).then(function(post) {
          post.destroyRecord();
        });
      }
    },

    /** Sticky note **/
    toggleStickyNote(noteId) {
      let order = this.order;
      order.set(
        'stickyNoteId',
        order.get('stickyNoteId') == noteId ? null : noteId
      );
      order.save().catch((error) => {
        //TODO: proper error handling
        // should be task!
        console.dir(error);
      })
    }
  }
});
