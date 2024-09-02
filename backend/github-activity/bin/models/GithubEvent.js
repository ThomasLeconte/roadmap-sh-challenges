export default class GithubEvent {
    constructor(id, type, actor, repo, payload, isPublic, created_at) {
        this.id = id;
        this.type = type;
        this.actor = actor;
        this.repo = repo;
        this.payload = payload;
        this.public = isPublic;
        this.created_at = created_at;
    }
    static deserialize(data) {
        return new GithubEvent(data?.id, data?.type, data?.actor, data?.repo, data?.payload, data?.public, data?.created_at);
    }
}
