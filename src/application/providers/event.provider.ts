import { Collection, ObjectId } from 'mongodb';
import { CFError } from '../../lib/errors-handler';
import { CreateEventInput, Event } from '../models/event.model';
import { EventDocument, toEventObject } from '../repositories/event.repository.provider';

class EventProvider {
  constructor(private collection: Collection<EventDocument>) {}

  public async getAllEvents(profileId: ObjectId): Promise<Event[]> {
    const events = await this.collection.find().toArray();

    return events.map(toEventObject).filter((event) => event.attendance.find((profile) => profile.id === profileId));
  }

  public async getEventById(eventId: ObjectId): Promise<Event | null> {
    const data = await this.collection.findOne({
      id: eventId,
    });

    if (data) {
      throw new CFError('EVENT_NOT_FOUND');
    }

    return data ? toEventObject(data) : null;
  }

  public async createEvent(input: CreateEventInput): Promise<ObjectId> {
    const data = await this.collection.insertOne({
      _id: new ObjectId(),
      name: input.name,
      date: input.date,
      city: input.city,
      province: input.province,
      country: input.country,
      description: input.description,
      isVerified: input.isVerified ?? undefined,
      isUserUploaded: input.isUserUploaded,
      meetUpLocation: input.meetUpLocation,
      attendance: [],
    });

    return data.insertedId;
  }
}

export { EventProvider };
