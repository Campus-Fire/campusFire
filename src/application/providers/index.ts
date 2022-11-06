import { setupDb } from '../database';

import { ProfileProvider } from './profile.provider';
import { PreferenceProvider } from './preference.provider';
import { InstituteProvider } from './institute.provider';

const db = setupDb();

const profileProvider = new ProfileProvider(db.collection('profiles'));
const preferenceProvider = new PreferenceProvider(db.collection('preferences'));
const instituteProvider = new InstituteProvider(db.collection('institutes'));

export { profileProvider, preferenceProvider, instituteProvider };
