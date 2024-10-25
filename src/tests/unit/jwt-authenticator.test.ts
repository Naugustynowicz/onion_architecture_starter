import { JwtAuthenticator } from "../../infrastructure/authenticators/jwt-authenticator"
import { InMemoryUserRepository } from "../in-memory/in-memory-user-repository"
import { testUsers } from "./seeds/seeds-user"

describe('Authenticator', () => {
    let userRepository: InMemoryUserRepository
    let authenticator: JwtAuthenticator
     
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        await userRepository.create(testUsers.johnDoe)

        authenticator = new JwtAuthenticator(userRepository)
    })

    describe('Scenario: token is valid', () => {
        const payload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwicGFzc3dvcmQiOiJxd2VydHkifQ.0fz20ShOf1wmIYS6UqUd2mkjUaQp5NudAfi3hsHT53U'

        it('should authenticate a user', async () => {
            const user = await authenticator.authenticate(payload)
    
            expect(user!.props).toEqual({
                id:'johnDoe',
                email: 'johndoe@gmail.com',
                password: 'qwerty'
            })
        })
    })

    describe('Scenario: token is not valid', () => {
        const payload = 'NotAValidToken'

        it('should throw an error', async () => {
            await expect(authenticator.authenticate(payload)).rejects.toThrow("Invalid token specified: missing part #2")
        })
    })
    
    describe('Scenario: user is not valid', () => {
        const payload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVudmFsaWRFbWFpbCIsInBhc3N3b3JkIjoicXdlcnR5In0.0hRWuuKBOqGJeXv1LwiIiOHT4apJ2V5vggXEj3JgSEc'

        it('should throw an error', async () => {
            await expect(authenticator.authenticate(payload)).rejects.toThrow('Wrong credentials.')
        })
    })

    describe('Scenario: password is not valid', () => {
        const payload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwicGFzc3dvcmQiOiJ1bnZhbGlkUGFzc3dvcmQifQ.pT4rQe8OP5CK3nNenuk5xbrJFQ0PygIxnQm9OgWAWzY'

        it('should throw an error', async () => {
            await expect(authenticator.authenticate(payload)).rejects.toThrow('Wrong credentials.')
        })
    })
    
})