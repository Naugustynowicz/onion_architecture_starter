import { differenceInDays, differenceInHours } from "date-fns"
import { User } from "./user-entity"

type ConferenceProps = {
    id: string
    organizerId: string
    title: string
    startDate: Date
    endDate: Date
    seats: number
}

const MIN_SEATS = 20
const MAX_SEATS = 1000

const MAX_HOURS_DURATION = 3

export class Conference{
    constructor(
        public props: ConferenceProps
    ){}

    isTooClose(now: Date){
        return differenceInDays(this.props.startDate, now) < 3
    }

    hasNotEnoughSeats(){
        return this.props.seats < MIN_SEATS
    }

    hasTooManySeats(){
        return this.props.seats > MAX_SEATS
    }

    isTooLong(){
        return differenceInHours(this.props.endDate, this.props.startDate) > MAX_HOURS_DURATION
    }

    update(data: Partial<ConferenceProps>){
        this.props = { ...this.props, ...data }
    }

    isTheOrganizer(user: User){
        return this.props.organizerId === user.props.id
    }

    isOverbooked(nbBookings: number){
        return nbBookings >= this.props.seats
    }
}