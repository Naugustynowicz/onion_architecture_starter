import { OrganizeConference } from "../../usecases/organize-conference";
import { FixedDateGenerator } from "../fixed/fixed-date-generator";
import { FixedIdGenerator } from "../fixed/fixed-id-generator";
import { InMemoryConferenceRepository } from "../in-memory/in-memory-conference-repository";
import { InMemoryPublisher } from "../in-memory/in-memory-publisher";
import { testConferences } from "./seeds/seeds-conference";
import { testUsers } from "./seeds/seeds-user";

describe('Usercase: Organize a conference', () => {
    let repository: InMemoryConferenceRepository
    let idGenerator: FixedIdGenerator
    let dateGenerator: FixedDateGenerator
    let messageBroker: InMemoryPublisher
    let usecase: OrganizeConference

    beforeEach(() => {
        repository = new InMemoryConferenceRepository() 
        idGenerator = new FixedIdGenerator()
        dateGenerator = new FixedDateGenerator()
        messageBroker: new InMemoryPublisher()
        usecase = new OrganizeConference(repository, idGenerator, dateGenerator, messageBroker)
    })

    describe('Scenario: Happy path', () => {
        //setup
        const payload = {
            user: testUsers.johnDoe,
            title: "Nouvelle conference",
            startDate: new Date('2024-01-04T10:00:00.000Z'),
            endDate: new Date('2024-01-04T11:00:00.000Z'),
            seats: 50
        }

        //tests
        it('should return id', async () => {
            const result = await usecase.execute(payload)
    
            expect(result.id).toEqual('id-1')
        })

        it('should insert conference in db', async () => {
            await usecase.execute(payload)
            const fetchedConference = repository.database[0]

            expect(repository.database).toHaveLength(1)
            expect(repository.database[0].props.title).toEqual('Nouvelle conference')
        })

        it('should publish a message', async () => {
            await usecase.execute(payload)

            const publishedMessages = messageBroker.getPublishedMessages('conference_created')
            expect(publishedMessages).toHaveLength(1)
            expect(publishedMessages[0]).toEqual({
                conferenceId: expect.any(String),
                organizerEmail: testUsers.johnDoe.props.email,
                title: testConferences.conference.props.title,
                seats: testConferences.conference.props.seats
            })
        })
    })

    describe('Scenario:  Conference happens too soon', () => {
        //setup
        const payload = {
            user: testUsers.johnDoe,
            title: "Nouvelle conference",
            startDate: new Date('2024-01-02T10:00:00.000Z'),
            endDate: new Date('2024-01-02T11:00:00.000Z'),
            seats: 50
        }

        //tests
        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow('Conference must happen in at least 3 days')
        })

        it('should not create a conference', async () => {
            try{
                await usecase.execute(payload)
            } catch(e){
                //OSEF, it's normal, see above one it
            }
            
            expect(repository.database).toHaveLength(0)
        })
    })

    describe('Scenario: Conference has not enough seats', () => {
        //setup
        const payload = {
            user: testUsers.johnDoe,
            title: "Nouvelle conference",
            startDate: new Date('2024-01-04T10:00:00.000Z'),
            endDate: new Date('2024-01-04T11:00:00.000Z'),
            seats: 15
        }

        //tests
        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow('Conference has not enough seats.')
        })

        it('should not create a conference', async () => {
            try{
                await usecase.execute(payload)
            } catch(e){
                //OSEF, it's normal, see above one it
            }
            
            expect(repository.database).toHaveLength(0)
        })
    })

    describe('Scenario: Conference has too many seats', () => {
        //setup
        const payload = {
            user: testUsers.johnDoe,
            title: "Nouvelle conference",
            startDate: new Date('2024-01-04T10:00:00.000Z'),
            endDate: new Date('2024-01-04T11:00:00.000Z'),
            seats: 1001
        }

        //tests
        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow('Conference has too many seats.')
        })

        it('should not create a conference', async () => {
            try{
                await usecase.execute(payload)
            } catch(e){
                //OSEF, it's normal, see above one it
            }
            
            expect(repository.database).toHaveLength(0)
        })
    })

    describe('Scenario: Conference is too long', () => {
        //setup
        const payload = {
            user: testUsers.johnDoe,
            title: "Nouvelle conference",
            startDate: new Date('2024-01-04T10:00:00.000Z'),
            endDate: new Date('2024-01-04T14:00:00.000Z'),
            seats: 50
        }

        //tests
        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow('Conference is too long.')
        })

        it('should not create a conference', async () => {
            try{
                await usecase.execute(payload)
            } catch(e){
                //OSEF, it's normal, see above one it
            }
            
            expect(repository.database).toHaveLength(0)
        })
    })

})