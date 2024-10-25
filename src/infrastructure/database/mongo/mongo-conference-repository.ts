import { Model } from "mongoose";
import { Conference } from "../../../domain/entities/conference-entity";
import { IConferenceRepository } from "../../../interfaces/conference-repository.interface";
import { MongoConference } from "./mongo-conference";

class ConferenceMapper {
    static toCore(document: MongoConference.ConferenceDocument): Conference {
        return new Conference({
            id: document._id,
            organizerId: document.organizerId,
            title: document.title,
            startDate: document.startDate,
            endDate: document.endDate,
            seats: document.seats
        })
    }

    static toPersistence(conference: Conference): MongoConference.ConferenceDocument {
        return new MongoConference.ConferenceModel({
            id: conference.props.id,
            organizerId: conference.props.organizerId,
            title: conference.props.title,
            startDate: conference.props.startDate,
            endDate: conference.props.endDate,
            seats: conference.props.seats
        })
    }
}

export class MongoConferenceRepository implements IConferenceRepository{
    constructor(
        private readonly model: Model<MongoConference.ConferenceDocument>
    ){}

    async findById(id: string): Promise<Conference | null> {
        const document = await this.model.findById(id)

        if(!document) return null

        return ConferenceMapper.toCore(document)
    }

    async create(conference: Conference): Promise<void> {
        const record = new this.model({
            _id: conference.props.id,
            organizerId: conference.props.organizerId,
            title: conference.props.title,
            startDate: conference.props.startDate,
            endDate: conference.props.endDate,
            seats: conference.props.seats
        })

        await ConferenceMapper.toPersistence(conference).save()
    }

    async update(conference: Conference): Promise<void>{
        let document = await this.model.findById(conference.props.id)

        document = {...document, ...conference.props}

        await ConferenceMapper.toPersistence(document).save()
    }
}