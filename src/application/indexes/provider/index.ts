import { setupDb } from '../../../database';

import { AccountProvider } from '../../providers/account/account.provider';
import { InstituteProvider } from '../../providers/institute/institute.provider';
import { PreferenceProvider } from '../../providers/preference/preference.provider';
import { ProfileProvider } from '../../providers/profile/profile.provider';
import { ImageProvider } from '../../providers/image/image.provider';
import { ConversationProvider } from '../../providers/conversation/conversation.provider';
import { ConversationParticipantProvider } from '../../providers/conversation/conversation-participant.provider';
import { MessageProvider } from '../../providers/message/message.provider';

const db = setupDb();

const profileProvider = new ProfileProvider(db.collection('profiles'));
const preferenceProvider = new PreferenceProvider(db.collection('preferences'));
const instituteProvider = new InstituteProvider(db.collection('institutes'));
const accountProvider = new AccountProvider(db.collection('accounts'));
const imageProvider = new ImageProvider(db.collection('images'));
const conversationProvider = new ConversationProvider(db.collection('conversations'));
const conversationParticipantProvider = new ConversationParticipantProvider(db.collection('conversation-participants'));
const messageProvider = new MessageProvider(db.collection('messages'));

export {
  profileProvider,
  conversationProvider,
  conversationParticipantProvider,
  messageProvider,
  preferenceProvider,
  instituteProvider,
  accountProvider,
  imageProvider,
};
