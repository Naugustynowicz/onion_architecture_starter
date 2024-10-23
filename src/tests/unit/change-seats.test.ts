import { ChangeSeats } from "../../usecases/change-seats"
import { InMemoryConferenceRepository } from "../in-memory/in-memory-conference-repository"
import { testConferences } from "./seeds/seeds-conference"
import { testUsers } from "./seeds/seeds-user"

describe('Usercase: change number of seats', () => {
    let usecase: ChangeSeats
    let repository: InMemoryConferenceRepository
    

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository() 
        // conference = await new OrganizeConference(repository, new FixedIdGenerator(), new FixedDateGenerator()).execute({
        //     user: new User({id: 'John Doe'}),
        //     title: "Nouvelle conference",
        //     startDate: new Date('2024-01-04T10:00:00.000Z'),
        //     endDate: new Date('2024-01-04T11:00:00.000Z'),
        //     seats: 50
        // })
        await repository.create(testConferences.conference)
        usecase = new ChangeSeats(repository)
        
    })

    describe('Scenario: Happy path', () => {
        //setup
        const payload = {
            conferenceId: testConferences.conference.props.id, 
            //conferenceId: conference.id,
            seats: 100,
            user: testUsers.johnDoe
        }

        //tests
        it('should update conference seats', async () => {
            await usecase.execute(payload)
    
            //expect(repository.database[0].props.seats).toEqual(payload.newSeats)
            const fetchedConference = await repository.findById(testConferences.conference.props.id)
            
            expect(fetchedConference).toBeDefined()
            expect(fetchedConference!.props.seats).toEqual(100)
        })

        it('should not insert or delete conference in db', async () => {
            await usecase.execute(payload)

            expect(repository.database).toHaveLength(1)
        })

        it('conference object should still be here', async () => {
            await usecase.execute(payload)
    
            expect(repository.database[0].props.id).toEqual(payload.conferenceId)
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
})