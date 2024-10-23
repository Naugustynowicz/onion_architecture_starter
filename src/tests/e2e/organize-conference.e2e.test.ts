import { addDays, addHours } from "date-fns"
import { Application } from "express"
import request from "supertest"
import { InMemoryUserRepository } from "../in-memory/in-memory-user-repository"
import { e2eUsers } from "./seeds/user-e2e-seed"
import { TestApp } from "./utils/test-app"

describe('Usercase: Organize Conference', () => {
    let userRepository: InMemoryUserRepository
    let testApp: TestApp
    let app: Application

    beforeEach(async () => {
        testApp = new TestApp()
        await testApp.setup()
        await testApp.loadFixtures([e2eUsers.johnDoe])
        app = testApp.expressApp
    })

    it('should organize a conference', async () => {
        // jest.spyOn(BasicAuthenticator.prototype, 'authenticate').mockResolvedValue(testUsers.johnDoe)

        const response = await request(app)
            .post('/conference')
            .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
            .send({
                title: "Ma nouvelle conference",
                seats: 100,
                startDate: addDays(new Date(), 4).toISOString(),
                endDate: addHours(addDays(new Date(), 4), 2).toISOString()
            })
        
        expect(response.status).toEqual(201)
        expect(response.body.data).toEqual({id: expect.any(String)})
    })
})