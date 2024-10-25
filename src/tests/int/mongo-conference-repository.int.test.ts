import { Model } from "mongoose"
import { MongoConference } from "../../infrastructure/database/mongo/mongo-conference"
import { MongoConferenceRepository } from "../../infrastructure/database/mongo/mongo-conference-repository"
import { TestApp } from "../e2e/utils/test-app"
import { testUsers } from "../unit/seeds/seeds-user"

describe('MongoUserRepository Integration', () => {
    let app: TestApp
    let model: Model<MongoConference.ConferenceDocument>
    let repository: MongoConferenceRepository

    beforeEach(async () =>{
        app = new TestApp()
        await app.setup()

        model = MongoConference.ConferenceDocument
        await model.deleteMany({})
        repository = new MongoConferenceRepository(model)

        //WIP
        const record =  new model({
            _id: testUsers.alice.props.id,
            email: testUsers.alice.props.email,
            password: testUsers.alice.props.password
        })

        await record.save()
    })

    afterAll(async () => {
        await app.tearDown()
    })

    describe('findByEmail', () => {
        it('should return an user corresponding to the email', async () => {
            const user = await repository.findByEmail(testUsers.alice.props.email)

            expect(user!.props).toEqual(testUsers.alice.props)
        })
    })

    describe('findById', () => {
        it('should return an user corresponding to the id', async () => {
            const user = await repository.findByEmail(testUsers.alice.props.id)
    
            expect(user!.props).toEqual(testUsers.alice.props)
        })
    })

    describe('create', () => {
        it('should insert an user in the collection', async () => {
            await repository.create(testUsers.bob)
            const foundUser =  await model.findOne({_id: testUsers.bob.props.id})

            expect(foundUser!.toObject()).toEqual({
                _id: testUsers.bob.props.id,
                email: testUsers.bob.props.email,
                password: testUsers.bob.props.password,
                __v: 0
            })
        })
    })
})