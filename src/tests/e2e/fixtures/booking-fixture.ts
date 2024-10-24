import { Booking } from "../../../domain/entities/booking-entities";
import { resolveDependency } from "../../../infrastructure/config/dependency-injection";
import { IFixture } from "../utils/fixture.interface";

export class BookingFixture implements IFixture{
    constructor(public entity: Booking){}

    async load(container: resolveDependency): Promise<void> {
        const bookingRepository = container('bookingRepository')
        await bookingRepository.create(this.entity)
    }
}