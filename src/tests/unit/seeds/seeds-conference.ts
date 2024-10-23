import { endOfDay } from "date-fns";
import { Conference } from "../../../domain/entities/conference-entity";
import { testUsers } from "./seeds-user";

export const testConferences = {
    conference: new Conference({
        id: 'id-1',
        organizerId: testUsers.johnDoe.props.id,
        title: 'Nouvelle Conference',
        startDate: new Date(),
        endDate: new Date(),
        seats: 50
    })
}