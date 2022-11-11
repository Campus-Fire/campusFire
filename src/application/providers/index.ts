import { setupDb } from '../database';

import { AccountProvider } from './providers/account.provider';
import { InstituteProvider } from './providers/institute.provider';
import { PreferenceProvider } from './providers/preference.provider';
import { ProfileProvider } from './providers/profile.provider';

const db = setupDb();

const profileProvider = new ProfileProvider(db.collection('profiles'));
const preferenceProvider = new PreferenceProvider(db.collection('preferences'));
const instituteProvider = new InstituteProvider(db.collection('institutes'));
const accountProvider = new AccountProvider(db.collection('accounts'));

export { profileProvider, preferenceProvider, instituteProvider, accountProvider };
