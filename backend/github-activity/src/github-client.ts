import GithubEvent from "./models/GithubEvent.js";

export default class GithubClient {
    static fetchUserEvents(username: string) {
        return fetch(`https://api.github.com/users/${username}/events`)
            .then((response) => response.json())
            .then((json: any[]) => json.map(item => GithubEvent.deserialize(item)))
    }
}