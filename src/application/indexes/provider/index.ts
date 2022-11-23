import { setupDb } from '../../database';

import { AccountProvider } from '../../providers/account/account.provider';
import { InstituteProvider } from '../../providers/institute/institute.provider';
import { MessageProvider } from '../../providers/message/message.provider';
import { PreferenceProvider } from '../../providers/preference/preference.provider';
import { ProfileProvider } from '../../providers/profile/profile.provider';

const db = setupDb();

const profileProvider = new ProfileProvider(db.collection('profiles'));
const preferenceProvider = new PreferenceProvider(db.collection('preferences'));
const instituteProvider = new InstituteProvider(db.collection('institutes'));
const accountProvider = new AccountProvider(db.collection('accounts'));
const messageProvider = new MessageProvider(db.collection('messages'));

export { profileProvider, preferenceProvider, instituteProvider, accountProvider, messageProvider };
