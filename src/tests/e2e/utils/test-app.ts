import express, { Application } from "express";
import mongoose from "mongoose";
import { errorHandlerMiddleware } from "../../../app/middlewares/error-handler.middleware";
import { jsonResponseMiddleware } from "../../../app/middlewares/json-response.middleware";
import { ConferenceRoutes } from "../../../app/routes/conference.routes";
import { container, resolveDependency } from "../../../infrastructure/config/dependency-injection";
import { IFixture } from "./fixture.interface";

export class TestApp{
    private app: Application
    private container: resolveDependency

    constructor(){
        this.app = express()
        this.container = container
    }

    async setup(){
        await mongoose.connect('mongodb://admin:qwerty@localhost:3702/conference?authSource=admin')

        this.app.use(express.json())
        this.app.use(express.urlencoded({extended: true}))
        this.app.use(jsonResponseMiddleware)
        this.app.use(ConferenceRoutes)
        this.app.use(errorHandlerMiddleware)
    }

    async loadFixtures(fixtures: IFixture[]){
        return Promise.all(fixtures.map(fixture => fixture.load(this.container)))
    }

    async tearDown(){
        await mongoose.connection.close()
    }

    get expressApp(){
        return this.app
    }
}