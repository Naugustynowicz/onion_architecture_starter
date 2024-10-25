import { InMemoryBookingRepository } from "../in-memory/in-memory-booking-repository"
import { InMemoryConferenceRepository } from "../in-memory/in-memory-conference-repository"
import { testConferences } from "./seeds/seeds-conference"
import { testUsers } from "./seeds/seeds-user"

describe('Usercase: change number of seats', () => {
    let usecase: BookSeat
    let conferenceRepository: InMemoryConferenceRepository
    let bookingRepository: InMemoryBookingRepository
    

    beforeEach(async () => {
        conferenceRepository = new InMemoryConferenceRepository() 
        bookingRepository = new InMemoryBookingRepository()
        await conferenceRepository.create(testConferences.conference)
        usecase = new BookSeat(conferenceRepository, bookingRepository)
    })

    describe('Scenario: Happy path', () => {
        //setup
        const payload = {
            conferenceId: testConferences.conference.props.id,
            user: testUsers.bob
        }

        //tests
        it('should update conference seats', async () => {
            await usecase.execute(payload)
    
            const fetchedConference = await conferenceRepository.findById(testConferences.conference.props.id)
            expect(fetchedConference).toBeDefined()

            const fetchedBooking = await bookingRepository.findByConferenceId(testConferences.conference.props.id)
            expect(fetchedBooking).toBeDefined()
            expect(fetchedBooking).toContain({
                conferenceId: testConferences.conference.props.id,
                userId: testUsers.bob.props.id
            })
        })
    })
})