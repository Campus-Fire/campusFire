import { Collection, ObjectId } from 'mongodb';

import {
  validateCategory,
  validateCountryInput,
  validateNameInput,
  validateProvinceInput,
  validateStringInputs,
} from '../../helpers/validator';
import { CFError } from '../../lib/errors-handler';
import {
  Category,
  CreateEventInput,
  Event,
  UpdateAttendanceInput,
  UpdateEventDetailsInput,
  UpdateVerificationInput,
} from '../models/event.model';
import { Profile } from '../models/profile.model';
import { EventDocument, toEventObject } from '../repositories/event.repository.provider';

class EventProvider {
  constructor(private collection: Collection<EventDocument>) {}

  public async getAllEvents(profileId: ObjectId): Promise<Event[]> {
    const events = await this.collection.find().toArray();

    return events.map(toEventObject).filter((event) => {
      if (
        event.attendance.length > 0 &&
        event.attendance.find((profile) => profile.id.toString() === profileId.toString())
      ) {
        return false;
      }

      return event.ownerId.toString() != profileId.toString() && !event.isDeleted;
    });
  }

  public async getAllPersonalEvents(profileId: ObjectId): Promise<Event[]> {
    const events = await this.collection.find().toArray();

    return events
      .map(toEventObject)
      .filter(
        (event) =>
          (event.attendance.find((profile) => profile.id.toString() === profileId.toString()) ||
            event.ownerId.toString() === profileId.toString()) &&
          !event.isDeleted
      );
  }

  public async getEventById(eventId: ObjectId): Promise<Event | null> {
    const data = await this.collection.findOne({
      _id: eventId,
    });

    if (!data) {
      throw new CFError('EVENT_NOT_FOUND');
    }

    return data ? toEventObject(data) : null;
  }

  public async createEvent(attendance: Profile[], ownerId: ObjectId, input: CreateEventInput): Promise<ObjectId> {
    const eventCount = await this.collection.countDocuments({
      name: input.name,
    });

    Object.keys(input).forEach((key) => {
      if (input[key as keyof CreateEventInput] === undefined) {
        throw new CFError('INVALID_USER_INPUT');
      }
    });

    if (eventCount > 0) {
      throw new CFError('EVENT_NAME_ALREADY_EXISTS');
    }

    validateNameInput(input.name);
    validateStringInputs(input.startDate.toString());
    validateStringInputs(input.endDate.toString());
    validateStringInputs(input.city);
    validateStringInputs(input.city);
    validateProvinceInput(input.province);
    validateCountryInput(input.country);
    validateStringInputs(input.description);
    validateStringInputs(input.meetUpLocation);
    validateCategory(input.category);

    const data = await this.collection.insertOne({
      _id: new ObjectId(),
      ownerId,
      name: input.name,
      startDate: input.startDate,
      endDate: input.endDate,
      city: input.city,
      province: input.province,
      country: input.country,
      description: input.description,
      isVerified: input.isVerified ?? undefined,
      isUserUploaded: input.isUserUploaded,
      meetUpLocation: input.meetUpLocation,
      attendance,
      cost: input.cost,
      category: input.category,
      isDeleted: false,
    });

    return data.insertedId;
  }

  public async updateEventDetails(input: UpdateEventDetailsInput): Promise<Boolean> {
    const checkEventOwner = await this.collection.findOne({
      _id: new ObjectId(input.eventId),
    });

    if (checkEventOwner && checkEventOwner.ownerId.toString() !== input.ownerId.toString()) {
      throw new CFError('UPDATE_EVENT_ACCESS_DENIED');
    }

    const data = await this.collection.updateOne(
      {
        _id: new ObjectId(input.eventId),
      },
      {
        $set: {
          ...(input.name && { name: input.name }),
          ...(input.startDate && { startDate: input.startDate }),
          ...(input.endDate && { endDate: input.endDate }),
          ...(input.city && { city: input.city }),
          ...(input.province && { province: input.province }),
          ...(input.country && { country: input.country }),
          ...(input.description && { description: input.description }),
          ...(input.meetUpLocation && { meetUpLocation: input.meetUpLocation }),
          ...(input.cost && { cost: input.cost }),
          ...(input.category && { category: input.category }),
        },
      }
    );

    if (!data.modifiedCount) {
      throw new CFError('EVENT_NOT_FOUND');
    }

    return true;
  }

  public async updateVerification(input: UpdateVerificationInput): Promise<Boolean> {
    const eventId = new ObjectId(input.eventId);
    const data = await this.collection.updateOne(
      {
        _id: eventId,
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
    const eventId = new ObjectId(input.eventId);

    if (input.isAttending) {
      data = await this.collection.updateOne(
        {
          _id: eventId,
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
          _id: eventId,
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

  public async deleteEvent(ownerId: ObjectId, eventId: ObjectId): Promise<Boolean> {
    const checkEventOwner = await this.collection.findOne({
      _id: eventId,
    });

    if (checkEventOwner && checkEventOwner.ownerId.toString() !== ownerId.toString()) {
      throw new CFError('UPDATE_EVENT_ACCESS_DENIED');
    }

    const data = await this.collection.updateOne(
      {
        _id: eventId,
      },
      {
        $set: {
          isDeleted: true,
        },
      }
    );

    if (!data.modifiedCount) {
      throw new CFError('EVENT_NOT_FOUND');
    }

    return true;
  }

  public getCategories(): string[] {
    return Object.values(Category);
  }
}

export { EventProvider };
