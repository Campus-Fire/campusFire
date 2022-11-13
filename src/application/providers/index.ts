import { setupDb } from '../database';

import { AccountProvider } from './account/account.provider';
import { InstituteProvider } from './institute/institute.provider';
import { PreferenceProvider } from './preference/preference.provider';
import { ProfileProvider } from './profile/profile.provider';

const db = setupDb();

const profileProvider = new ProfileProvider(db.collection('profiles'));
const preferenceProvider = new PreferenceProvider(db.collection('preferences'));
const instituteProvider = new InstituteProvider(db.collection('institutes'));
const accountProvider = new AccountProvider(db.collection('accounts'));

export { profileProvider, preferenceProvider, instituteProvider, accountProvider };
