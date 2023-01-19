import { setupDb } from '../../database';
import { AccountProvider } from '../providers/account.provider';
import { ConversationParticipantProvider } from '../providers/conversation-participant.provider';
import { ConversationProvider } from '../providers/conversation.provider';
import { ImageProvider } from '../providers/image.provider';
import { InstituteProvider } from '../providers/institute.provider';
import { MessageProvider } from '../providers/message.provider';
import { ProfileProvider } from '../providers/profile.provider';

const db = setupDb();

const profileProvider = new ProfileProvider(db.collection('profiles'));
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
  instituteProvider,
  accountProvider,
  imageProvider,
};
