import { addDays, addHours } from "date-fns"
import { Application } from "express"
import request from "supertest"
import { container } from "../../infrastructure/config/dependency-injection"
import { e2eBooking } from "./seeds/booking-e2e-seed"
import { e2eConferences } from "./seeds/conference-e2e-seed"
import { e2eUsers } from "./seeds/user-e2e-seed"
import { TestApp } from "./utils/test-app"

describe('Usercase: Change dates', () => {
    const conferenceRepository = container('conferenceRepository')
    const mailer = container('mailer')

    let testApp: TestApp
    let app: Application

    beforeEach(async () => {
        testApp = new TestApp()
        await testApp.setup()
        await testApp.loadFixtures([
            e2eConferences.conference,
            e2eUsers.johnDoe,
            e2eUsers.alice,
            e2eBooking.aliceBooking
        ])
        app = testApp.expressApp
    })

    it('should change the dates', async () => {
        // const token = Buffer.from(`${testUsers.johnDoe.props.email}:${testUsers.johnDoe.props.password}`).toString('base64')
        const startDate = addDays(new Date(), 6)
        const endDate = addDays(addHours(new Date(), 2), 6)

        const response = await request(app)
            .patch(`/conference/${e2eConferences.conference.entity.props.id}/dates`)
            .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
            .send({
                startDate, endDate
            })
        
        expect(response.status).toEqual(200)

        const fetchedConference =  await conferenceRepository.findById(e2eConferences.conference.entity.props.id)

        expect(fetchedConference).toBeDefined()
        expect(fetchedConference!.props.startDate).toEqual(startDate)
        expect(fetchedConference!.props.endDate).toEqual(endDate)

        expect(mailer.sentEmails).toHaveLength(1)
        expect(mailer.sentEmails[0]).toEqual({
            from: 'TEDx Conference',
            to: e2eUsers.alice.entity.props.email,
            subject: 'Conference dates where updated',
            body: `The conference with title: ${e2eConferences.conference.entity.props.title} has updated its dates`
        })
    })
})