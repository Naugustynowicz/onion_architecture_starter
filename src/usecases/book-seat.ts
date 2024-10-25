import { User } from "../domain/entities/user-entity"
import { IBookingRepository } from "../interfaces/booking-repository.interface"
import { IConferenceRepository } from "../interfaces/conference-repository.interface"

type BookSeatRequest = {
    user: User
    conferenceId: string
}

type BookSeatResponse = void

export class BookSeat{
    constructor(
        private readonly conferenceRepository: IConferenceRepository,
        private readonly bookingRepository: IBookingRepository
    ){}

    async execute({user, conferenceId}:BookSeatRequest): Promise<BookSeatResponse> {
        const conference = await this.conferenceRepository.findById(conferenceId)
        if(!conference) throw new Error('Conference not found.')
        if(!conference.isTheOrganizer(user)) throw new Error('You are not allowed to change this conference.')

        const bookings = await this.bookingRepository.findByUserIdConferenceId({conferenceId: conferenceId, userId: user.props.id})
        if(conference.isOverbooked(bookings.length)) throw new Error(`Conference already have ${bookings.length} bookings, cannot go below.`)

        conference.update({seats: seats})
        if(conference.hasTooManySeats()) throw new Error('Conference has too many seats.')
        if(conference.hasNotEnoughSeats()) throw new Error('Conference has not enough seats.')

        

        await this.conferenceRepository.update(conference)
    }
}