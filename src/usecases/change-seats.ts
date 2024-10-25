import { User } from "../domain/entities/user-entity";
import { IBookingRepository } from "../interfaces/booking-repository.interface";
import { IConferenceRepository } from "../interfaces/conference-repository.interface";

type ChangeSeatsRequest = {
    user: User
    conferenceId: string
    seats: number
}

type ChangeSeatsResponse = void

export class ChangeSeats{
    constructor(
        private readonly conferenceRepository: IConferenceRepository,
        private readonly bookingRepository: IBookingRepository
    ){}

    async execute({user, conferenceId, seats}:ChangeSeatsRequest): Promise<ChangeSeatsResponse> {
        const conference = await this.conferenceRepository.findById(conferenceId)
        if(!conference) throw new Error('Conference not found.')
        if(!conference.isTheOrganizer(user)) throw new Error('You are not allowed to change this conference.')

        conference.update({seats: seats})
        if(conference.hasTooManySeats()) throw new Error('Conference has too many seats.')
        if(conference.hasNotEnoughSeats()) throw new Error('Conference has not enough seats.')

        const bookings = await this.bookingRepository.findByConferenceId(conferenceId)
        if(conference.isOverbooked(bookings.length)) throw new Error(`Conference already have ${bookings.length} bookings, cannot go below.`)

        await this.conferenceRepository.update(conference)
    }
}