import { setupDb } from '../database';

import { ProfileProvider } from './profile.provider';
import { PreferenceProvider } from './preference.provider';

const db = setupDb();

const profileProvider = new ProfileProvider(db.collection('profiles'));
const preferenceProvider = new PreferenceProvider(db.collection('preferences'));

export { profileProvider, preferenceProvider };
