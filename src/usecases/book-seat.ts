import { Booking } from "../domain/entities/booking-entities"
import { User } from "../domain/entities/user-entity"
import { IBookingRepository } from "../interfaces/booking-repository.interface"
import { IConferenceRepository } from "../interfaces/conference-repository.interface"
import { IMailer } from "../interfaces/mailer.interface"
import { IUserRepository } from "../interfaces/user-repository.interface"

type BookSeatRequest = {
    user: User
    conferenceId: string
}

type BookSeatResponse = void

export class BookSeat{
    constructor(
        private readonly conferenceRepository: IConferenceRepository,
        private readonly bookingRepository: IBookingRepository,
        private readonly userRepository: IUserRepository,
        private readonly mailer: IMailer
    ){}

    async execute({user, conferenceId}:BookSeatRequest): Promise<BookSeatResponse> {
        const conference = await this.conferenceRepository.findById(conferenceId)
        if(!conference) throw new Error('Conference not found.')

        const currentBookings = await this.bookingRepository.findByConferenceId(conferenceId)
        if(conference.isOverbooked(currentBookings.length)) throw new Error('No seat available for this conference.')

        const newBooking = new Booking({conferenceId, userId: user.props.id})
        const myCurrentBookings = await this.bookingRepository.findByUserIdConferenceId(newBooking)
        if(myCurrentBookings.length > 0) throw new Error('Conference already booked.')

        await this.bookingRepository.create(newBooking)

        this.mailer.send({
            from: 'TEDx Conference',
            to: user.props.email,
            subject: 'New conference booked',
            body: `Your registration at the conference ${conferenceId} has been successful.`
        })

        const conferenceOrganizer = await this.userRepository.findById(conference.props.organizerId)
        this.mailer.send({
            from: 'TEDx Conference',
            to: conferenceOrganizer!.props.email,
            subject: 'New registration to your conference',
            body: `User ${user.props.id} has been registered to your conference ${conferenceId}.`
        })
    }
}