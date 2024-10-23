import { asClass, asFunction, createContainer } from "awilix";
import { IAuthenticator } from "../../interfaces/authenticator.interface";
import { IDateGenerator } from "../../interfaces/date-generator.interface";
import { IIdGenerator } from "../../interfaces/id-generator.interface";
import { CurrentDateGenerator } from "../../shared/utils/current-date-generator";
import { RandomIdGenerator } from "../../shared/utils/random-id-generator";
import { InMemoryConferenceRepository } from "../../tests/in-memory/in-memory-conference-repository";
import { InMemoryUserRepository } from "../../tests/in-memory/in-memory-user-repository";
import { ChangeSeats } from "../../usecases/change-seats";
import { OrganizeConference } from "../../usecases/organize-conference";
import { BasicAuthenticator } from "../authenticators/basic-authenticator";

export interface Dependencies {
    conferenceRepository: InMemoryConferenceRepository
    userRepository: InMemoryUserRepository
    idGenerator: IIdGenerator
    dateGenerator: IDateGenerator
    authenticator: IAuthenticator
    organizeConferenceUsecase: OrganizeConference
    changeSeatsUsecase: ChangeSeats
}

const container = createContainer<Dependencies>()

container.register({
    conferenceRepository: asClass(InMemoryConferenceRepository).singleton(),
    userRepository: asClass(InMemoryUserRepository).singleton(),
    idGenerator: asClass(RandomIdGenerator).singleton(),
    dateGenerator: asClass(CurrentDateGenerator).singleton(),

    authenticator: asFunction(
        ({userRepository}) => new BasicAuthenticator(userRepository)
    ).singleton(),

    organizeConferenceUsecase: asFunction(
        ({conferenceRepository, idGenerator, dateGenerator}) => new OrganizeConference(conferenceRepository, idGenerator, dateGenerator)
    ).singleton(), 
    changeSeatsUsecase: asFunction(
        ({conferenceRepository}) => new ChangeSeats(conferenceRepository)
    ).singleton()
})

export type resolveDependency = <K extends keyof Dependencies>(key: K) => Dependencies[K] 

const resolveDependency = <K extends keyof Dependencies>(key: K): Dependencies[K] => {
    return container.resolve<K>(key)
}

export { resolveDependency as container };
