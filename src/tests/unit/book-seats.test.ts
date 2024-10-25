import { Booking } from "../../domain/entities/booking-entities"
import { BookSeat } from "../../usecases/book-seat"
import { InMemoryBookingRepository } from "../in-memory/in-memory-booking-repository"
import { InMemoryConferenceRepository } from "../in-memory/in-memory-conference-repository"
import { InMemoryMailer } from "../in-memory/in-memory-mailer"
import { InMemoryUserRepository } from "../in-memory/in-memory-user-repository"
import { testBookings } from "./seeds/seeds-booking"
import { testConferences } from "./seeds/seeds-conference"
import { testUsers } from "./seeds/seeds-user"

describe('Usercase: change number of seats', () => {
    let usecase: BookSeat
    let conferenceRepository: InMemoryConferenceRepository
    let bookingRepository: InMemoryBookingRepository
    let userRepository: InMemoryUserRepository
    let mailer: InMemoryMailer
    

    beforeEach(async () => {
        conferenceRepository = new InMemoryConferenceRepository() 
        bookingRepository = new InMemoryBookingRepository()
        userRepository = new InMemoryUserRepository()
        mailer = new InMemoryMailer()
        await userRepository.create(testUsers.johnDoe)
        await userRepository.create(testUsers.bob)
        await userRepository.create(testUsers.alice)
        await conferenceRepository.create(testConferences.conference)
        await conferenceRepository.create(testConferences.overBookedConference)
        usecase = new BookSeat(conferenceRepository, bookingRepository, userRepository, mailer)
    })

    describe('Scenario: Happy path', () => {
        //setup
        const payload = {
            conferenceId: testConferences.conference.props.id,
            user: testUsers.alice
        }

        //tests
        it('should update conference seats', async () => {
            await usecase.execute(payload)
    
            const fetchedConference = await conferenceRepository.findById(testConferences.conference.props.id)
            expect(fetchedConference).toBeDefined()

            const fetchedBooking = await bookingRepository.findByConferenceId(testConferences.conference.props.id)
            expect(fetchedBooking).toBeDefined()
            expect(fetchedBooking).toContainEqual({"props": {
                conferenceId: testConferences.conference.props.id,
                userId: testUsers.alice.props.id
            }})
        })

        it('should send email to participants', async () => {
            await usecase.execute(payload)

            expect(mailer.sentEmails).toHaveLength(2)
            expect(mailer.sentEmails[0]).toEqual({
                from: 'TEDx Conference',
                to: testUsers.alice.props.email,
                subject: 'New conference booked',
                body: `Your registration at the conference ${testConferences.conference.props.id} has been successful.`
            })
            expect(mailer.sentEmails[1]).toEqual({
                from: 'TEDx Conference',
                to: testUsers.johnDoe.props.email,
                subject: 'New registration to your conference',
                body: `User ${testUsers.alice.props.id} has been registered to your conference ${testConferences.conference.props.id}.`
            })
        })
    })

    describe('Scenario: No seat available', () => {
        //setup
        const payload = {
            conferenceId: testConferences.overBookedConference.props.id,
            user: testUsers.bob
        }

        //tests
        it('should throw an error', async () => {
            await bookingRepository.create(testBookings.aliceBookingSpam1)
            await bookingRepository.create(testBookings.aliceBookingSpam2)
            await bookingRepository.create(testBookings.aliceBookingSpam3)
            await bookingRepository.create(testBookings.aliceBookingSpam4)
            await bookingRepository.create(testBookings.aliceBookingSpam5)
            await bookingRepository.create(testBookings.aliceBookingSpam6)
            await bookingRepository.create(testBookings.aliceBookingSpam7)
            await bookingRepository.create(testBookings.aliceBookingSpam8)
            await bookingRepository.create(testBookings.aliceBookingSpam9)
            await bookingRepository.create(testBookings.aliceBookingSpam10)
            await bookingRepository.create(testBookings.aliceBookingSpam11)
            await bookingRepository.create(testBookings.aliceBookingSpam12)
            await bookingRepository.create(testBookings.aliceBookingSpam13)
            await bookingRepository.create(testBookings.aliceBookingSpam14)
            await bookingRepository.create(testBookings.aliceBookingSpam15)
            await bookingRepository.create(testBookings.aliceBookingSpam16)
            await bookingRepository.create(testBookings.aliceBookingSpam17)
            await bookingRepository.create(testBookings.aliceBookingSpam18)
            await bookingRepository.create(testBookings.aliceBookingSpam19)
            await bookingRepository.create(testBookings.aliceBookingSpam20)
            await bookingRepository.create(testBookings.aliceBookingSpam21)
            await bookingRepository.create(testBookings.aliceBookingSpam22)
            await bookingRepository.create(testBookings.aliceBookingSpam23)
            await bookingRepository.create(testBookings.aliceBookingSpam24)
            await bookingRepository.create(testBookings.aliceBookingSpam25)

            await expect(usecase.execute(payload)).rejects.toThrow('No seat available for this conference.')

            const fetchedConference = await conferenceRepository.findById(testConferences.overBookedConference.props.id)
            expect(fetchedConference).toBeDefined()

            const fetchedBooking = await bookingRepository.findByUserIdConferenceId(new Booking({userId: testUsers.bob.props.id, conferenceId: testConferences.overBookedConference.props.id}))
            expect(fetchedBooking).toEqual([])

            expect(mailer.sentEmails).toHaveLength(0)
        })
    })

    describe('Scenario: already registered to this conference', () => {
        //setup
        const payload = {
            conferenceId: testConferences.conference.props.id,
            user: testUsers.alice
        }

        //tests
        it('should throw an error', async () => {
            await bookingRepository.create(testBookings.aliceBooking)
            await expect(usecase.execute(payload)).rejects.toThrow('Conference already booked.')

            const fetchedConference = await conferenceRepository.findById(testConferences.conference.props.id)
            expect(fetchedConference).toBeDefined()

            const fetchedBooking = await bookingRepository.findByConferenceId(testConferences.conference.props.id)
            expect(fetchedBooking).toHaveLength(1)

            expect(mailer.sentEmails).toHaveLength(0)
        })
    })
})