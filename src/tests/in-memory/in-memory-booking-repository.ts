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
}