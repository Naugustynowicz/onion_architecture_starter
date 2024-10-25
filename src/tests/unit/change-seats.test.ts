import { ChangeSeats } from "../../usecases/change-seats"
import { InMemoryBookingRepository } from "../in-memory/in-memory-booking-repository"
import { InMemoryConferenceRepository } from "../in-memory/in-memory-conference-repository"
import { testBookings } from "./seeds/seeds-booking"
import { testConferences } from "./seeds/seeds-conference"
import { testUsers } from "./seeds/seeds-user"

describe('Usercase: change number of seats', () => {
    let usecase: ChangeSeats
    let conferenceRepository: InMemoryConferenceRepository
    let bookingRepository: InMemoryBookingRepository
    

    beforeEach(async () => {
        conferenceRepository = new InMemoryConferenceRepository() 
        bookingRepository = new InMemoryBookingRepository()
        await conferenceRepository.create(testConferences.conference)
        usecase = new ChangeSeats(conferenceRepository, bookingRepository)
    })

    describe('Scenario: Happy path', () => {
        //setup
        const payload = {
            conferenceId: testConferences.conference.props.id, 
            seats: 100,
            user: testUsers.johnDoe
        }

        //tests
        it('should update conference seats', async () => {
            await usecase.execute(payload)
    
            //expect(repository.database[0].props.seats).toEqual(payload.newSeats)
            const fetchedConference = await conferenceRepository.findById(testConferences.conference.props.id)
            
            expect(fetchedConference).toBeDefined()
            expect(fetchedConference!.props.seats).toEqual(100)
        })

        it('should not insert or delete conference in db', async () => {
            await usecase.execute(payload)

            expect(conferenceRepository.database).toHaveLength(1)
        })

        it('conference object should still be here', async () => {
            await usecase.execute(payload)
    
            expect(conferenceRepository.database[0].props.id).toEqual(payload.conferenceId)
        })

        
    })

    describe('Scenario : Conference does not exist', () => {
        //setup
        const payload = {
            conferenceId: 'no-existing-id', 
            seats: 100,
            user: testUsers.johnDoe
        }

        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow('Conference not found.')
        })
    })

    describe('Scenario : Conference has too many seats', () => {
        //setup
        const payload = {
            conferenceId: testConferences.conference.props.id, 
            //conferenceId: conference.id,
            seats: 1001,
            user: testUsers.johnDoe
        }

        //tests
        it('should update conference seats', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow('Conference has too many seats.')
        })
    })

    describe('Scenario : Conference has not enough seats', () => {
        //setup
        const payload = {
            conferenceId: testConferences.conference.props.id, 
            //conferenceId: conference.id,
            seats: 10,
            user: testUsers.johnDoe
        }

        //tests
        it('should update conference seats', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow('Conference has not enough seats.')
        })
    })

    describe('Scenario : Change conference seats of someone else', () => {
        //setup
        const payload = {
            conferenceId: testConferences.conference.props.id, 
            //conferenceId: conference.id,
            seats: 100,
            user: testUsers.bob
        }

        //tests
        it('should update conference seats', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow('You are not allowed to change this conference.')
        })
    })

    describe('Scenario: Never less the number of booking already done', () => {
        //setup
        const payload = {
            conferenceId: testConferences.overBookedConference.props.id, 
            seats: 21,
            user: testUsers.johnDoe
        }

        //test
        it('should throw an error', async () => {
            await conferenceRepository.create(testConferences.overBookedConference)
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

            await expect(usecase.execute(payload)).rejects.toThrow('Conference already have 25 bookings, cannot go below.')
        })
    })
})