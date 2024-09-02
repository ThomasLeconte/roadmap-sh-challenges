import GithubEvent from "./models/GithubEvent.js";
export default class GithubClient {
    static fetchUserEvents(username) {
        return fetch(`https://api.github.com/users/${username}/events`)
            .then((response) => response.json())
            .then((json) => json.map(item => GithubEvent.deserialize(item)));
    }
}
