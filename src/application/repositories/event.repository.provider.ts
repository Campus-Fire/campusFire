import { Document } from 'mongodb';
import { Event } from '../models/event.model';

interface EventDocument extends Document, Omit<Event, 'id'> {}

const toEventObject = (event: EventDocument): Event => {
  return {
    id: event._id.toHexString(),
    ownerId: event.ownerId,
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    city: event.city,
    province: event.province,
    country: event.country,
    description: event.description,
    isVerified: event.isVerified,
    isUserUploaded: event.isUserUploaded,
    meetUpLocation: event.meetUpLocation,
    attendance: event.attendance,
    cost: event.cost,
    category: event.category,
  };
};

export { EventDocument, toEventObject };
