import { Booking } from "../domain/entities/booking-entities";

export interface IBookSeat {
    execute(booking: Booking): Promise<void>
}