import { Booking } from "../../../domain/entities/booking-entities";
import { BookingFixture } from "../fixtures/booking-fixture";
import { e2eConferences } from "./conference-e2e-seed";
import { e2eUsers } from "./user-e2e-seed";

export const e2eBooking = {
    aliceBooking:  new BookingFixture(
        new Booking({
            conferenceId: e2eConferences.conference.entity.props.id,
            userId: e2eUsers.alice.entity.props.id
        })
    )
}