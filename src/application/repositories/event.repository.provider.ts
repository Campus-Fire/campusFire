import { Document } from 'mongodb';
import { Event } from '../models/event.model';

interface EventDocument extends Document, Omit<Event, 'id'> {}

const toEventObject = (event: EventDocument): Event => {
  return {
    id: event._id.toHexString(),
    name: event.name,
    date: event.date,
    city: event.city,
    province: event.province,
    country: event.country,
    description: event.description,
    isVerified: event.isVerified,
    isUserUploaded: event.isUserUploaded,
    meetUpLocation: event.meetUpLocation,
    attendance: event.attendance,
  };
};

export { EventDocument, toEventObject };
