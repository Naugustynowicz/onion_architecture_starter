import { Booking } from "../domain/entities/booking-entities";

export interface IBookingRepository {
    create(booking: Booking): Promise<void>
    findByConferenceId(id: String): Promise<Booking[]>
    findByUserIdConferenceId(booking: Booking): Promise<Booking[]>
}