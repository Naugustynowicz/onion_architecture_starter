import { OrganizeConference } from "../../usecases/organize-conference";
import { FixedIdGenerator } from "../fixed/fixed-id-generator";
import { InMemoryConferenceRepository } from "../in-memory/in-memory-conference-repository";
import { IIdGenerator } from "../../interfaces/id-generator.interface";
import { FixedDateGenerator } from "../fixed/fixed-date-generator";
import { User } from "../../domain/entities/user-entity";
import { testUsers } from "./seeds/seeds-user";

describe('Usercase: Organize a conference', () => {
    let repository: InMemoryConferenceRepository
    let idGenerator: FixedIdGenerator
    let dateGenerator: FixedDateGenerator
    let usecase: OrganizeConference

    beforeEach(() => {
        repository = new InMemoryConferenceRepository() 
        idGenerator = new FixedIdGenerator()
        dateGenerator = new FixedDateGenerator()
        usecase = new OrganizeConference(repository, idGenerator, dateGenerator)
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