export default class GithubEvent {
    id: string;
    type: string;
    actor: any;
    repo: any;
    payload: any;
    public: boolean;
    created_at: Date;


    constructor(id: string, type: string, actor: any, repo: any, payload: any, isPublic: boolean, created_at: Date) {
        this.id = id;
        this.type = type;
        this.actor = actor;
        this.repo = repo;
        this.payload = payload;
        this.public = isPublic;
        this.created_at = created_at;
    }


    static deserialize(data: any) {
        return new GithubEvent(data?.id, data?.type, data?.actor, data?.repo, data?.payload, data?.public, data?.created_at);
    }
}