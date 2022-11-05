import { setupDb } from '../database';

import { ProfileProvider } from './profile.provider';

const db = setupDb();

const profileProvider = new ProfileProvider(db.collection('profiles'));

export { profileProvider };
