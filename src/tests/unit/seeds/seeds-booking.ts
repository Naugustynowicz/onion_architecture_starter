import { Booking } from "../../../domain/entities/booking-entities";
import { testConferences } from "./seeds-conference";
import { testUsers } from "./seeds-user";

export const testBookings = {
    aliceBooking: new Booking({
        conferenceId: testConferences.conference.props.id,
        userId: testUsers.alice.props.id
    }),

    aliceBookingSpam1: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam2: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam3: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam4: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam5: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam6: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam7: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam8: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam9: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam10: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam11: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam12: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam13: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam14: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam15: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam16: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam17: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam18: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam19: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam20: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam21: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam22: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam23: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam24: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    }),
    aliceBookingSpam25: new Booking({
        conferenceId: testConferences.overBookedConference.props.id,
        userId: testUsers.alice.props.id
    })
    
}