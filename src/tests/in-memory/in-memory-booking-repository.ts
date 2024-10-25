import { Booking } from "../../domain/entities/booking-entities";
import { IBookingRepository } from "../../interfaces/booking-repository.interface";

export class InMemoryBookingRepository implements IBookingRepository {
    public database: Booking[] = []

    async create(booking: Booking): Promise<void> {
        this.database.push(booking)
    }

    async findByConferenceId(id: String): Promise<Booking[]> {
        return this.database.filter(booking => booking.props.conferenceId === id)
    }

    async findByUserIdConferenceId(booking: Booking): Promise<Booking[]> {
        return this.database.filter(booking => {
            booking.props.userId === booking.props.userId || booking.props.conferenceId === booking.props.conferenceId
        })
    }
}