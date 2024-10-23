import { v4 as uuid4 } from "uuid";
import { IIdGenerator } from "../../interfaces/id-generator.interface";

export class RandomIdGenerator implements IIdGenerator{
    generate(): string {
        return uuid4();
    }
}