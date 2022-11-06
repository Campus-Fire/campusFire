import { setupDb } from '../database';

import { ProfileProvider } from './profile.provider';
import { PreferenceProvider } from './preference.provider';
import { InstituteProvider } from './institute.provider';
import { AccountProvider } from './account.provider';

const db = setupDb();

const profileProvider = new ProfileProvider(db.collection('profiles'));
const preferenceProvider = new PreferenceProvider(db.collection('preferences'));
const instituteProvider = new InstituteProvider(db.collection('institutes'));
const accountProvider = new AccountProvider(db.collection('accounts'));

export { profileProvider, preferenceProvider, instituteProvider, accountProvider };
