import Movie from "../models/movie";
import {AbstractRepository} from "sqite-base";

export default class MovieRepository extends AbstractRepository<Movie> {
    constructor() {
        super('movie', Movie)
    }
}
