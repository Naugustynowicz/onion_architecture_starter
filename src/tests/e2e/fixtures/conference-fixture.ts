import { Conference } from "../../../domain/entities/conference-entity";
import { resolveDependency } from "../../../infrastructure/config/dependency-injection";
import { IFixture } from "../utils/fixture.interface";

export class ConferenceFixture implements IFixture{
    constructor(public entity: Conference){}

    async load(container: resolveDependency): Promise<void> {
        const conferenceRepository = container('conferenceRepository')
        await conferenceRepository.create(this.entity)
    }
}