import { Collection, ObjectId } from 'mongodb';
import {
  validateCountryInput,
  validateNameInput,
  validateProvinceInput,
  validateStringInputs,
} from 'src/helpers/validator';
import { CFError } from '../../lib/errors-handler';
import {
  CreateEventInput,
  Event,
  UpdateAttendanceInput,
  UpdateEventDetailsInput,
  UpdateVerificationInput,
} from '../models/event.model';
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
    const eventCount = await this.collection.countDocuments({
      name: input.name,
    });

    Object.keys(input).forEach((key) => {
      if (!input[key as keyof CreateEventInput]) {
        throw new CFError('INVALID_USER_INPUT');
      }
    });

    if (eventCount > 0) {
      throw new CFError('EVENT_NAME_ALREADY_EXISTS');
    }

    validateNameInput(input.name);
    validateStringInputs(input.date.toString());
    validateStringInputs(input.city);
    validateStringInputs(input.city);
    validateProvinceInput(input.province);
    validateCountryInput(input.country);
    validateStringInputs(input.description);
    validateStringInputs(input.meetUpLocation);

    const data = await this.collection.insertOne({
      _id: new ObjectId(),
      ownerId: input.ownerId,
      name: input.name,
      date: input.date,
      city: input.city,
      province: input.province,
      country: input.country,
      description: input.description,
      isVerified: input.isVerified ?? undefined,
      isUserUploaded: input.isUserUploaded,
      meetUpLocation: input.meetUpLocation,
      attendance: input.attendance,
    });

    return data.insertedId;
  }

  public async updateEventDetails(input: UpdateEventDetailsInput): Promise<Boolean> {
    const checkEventOwner = await this.collection.findOne({
      id: input.eventId,
    });

    if (checkEventOwner && checkEventOwner.ownerId !== input.ownerId) {
      throw new CFError('UPDATE_EVENT_ACCESS_DENIED');
    }

    const data = await this.collection.updateOne(
      {
        id: input.eventId,
      },
      {
        $set: {
          ...(input.name && { name: input.name }),
          ...(input.date && { date: input.date }),
          ...(input.city && { city: input.city }),
          ...(input.province && { province: input.province }),
          ...(input.country && { country: input.country }),
          ...(input.description && { description: input.description }),
          ...(input.meetUpLocation && { meetUpLocation: input.meetUpLocation }),
        },
      }
    );

    if (!data.modifiedCount) {
      throw new CFError('EVENT_NOT_FOUND');
    }

    return true;
  }

  public async updateVerification(input: UpdateVerificationInput): Promise<Boolean> {
    const data = await this.collection.updateOne(
      {
        id: input.eventId,
      },
      {
        $set: {
          isVerified: input.isVerified,
        },
      }
    );

    if (!data.modifiedCount) {
      throw new CFError('EVENT_NOT_FOUND');
    }

    return true;
  }

  public async updateAttendance(input: UpdateAttendanceInput): Promise<Boolean> {
    let data;

    if (input.isAttending) {
      data = await this.collection.updateOne(
        {
          id: input.eventId,
        },
        {
          $push: {
            attendance: input.userProfile,
          },
        }
      );
    } else {
      data = await this.collection.updateOne(
        {
          id: input.eventId,
        },
        {
          $pull: {
            attendance: input.userProfile,
          },
        }
      );
    }

    if (!data.modifiedCount) {
      throw new CFError('EVENT_NOT_FOUND');
    }

    return true;
  }

  public async deleteEvent(eventId: ObjectId): Promise<Boolean> {
    await this.collection.updateOne(
      {
        id: eventId,
      },
      {
        $set: {
          isDeleted: true,
        },
      }
    );

    return true;
  }
}

export { EventProvider };
