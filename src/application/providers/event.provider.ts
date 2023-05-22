import { Collection, ObjectId } from 'mongodb';
import { CFError } from '../../lib/errors-handler';
import { Event } from '../models/event.model';
import { EventDocument, toEventObject } from '../repositories/event.repository.provider';

class EventProvider {
  constructor(private collection: Collection<EventDocument>) {}

  public async getAllEvents(): Promise<Event[]> {
    const events = await this.collection.find().toArray();

    return events.map(toEventObject);
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
}

export { EventProvider };
