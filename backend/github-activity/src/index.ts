#!/usr/bin/env node

import { stringify } from "querystring";
import GithubClient from "./github-client.js";
import GithubEvent from "./models/GithubEvent.js";
import { Logger } from "./utils/Logger.js";

const argv = process.argv.slice(2);
handleCommand(argv);

/**
 *
 * @param {string[]} args
 */
function handleCommand(args: string[]) {
    try {
        validateArgs(args);
        const username = args[0];
        GithubClient.fetchUserEvents(username).then((response) => {
            const eventsByRepo = groupEventsByRepository(response);

            Array.from(eventsByRepo.keys()).forEach(repo => {
                const eventsOfRepo = eventsByRepo.get(repo);
                const eventsByType = new Map<string, GithubEvent[]>();
                eventsOfRepo?.forEach(e => {
                    if(!eventsByType.has(e.type)) eventsByType.set(e.type, [])

                    eventsByType.get(e.type)?.push(e);
                })


                console.log(`# --- ${repo} ---`)

                Array.from(eventsByType.keys()).forEach(type => {
                    const events = eventsByType.get(type);
                    switch(type) {
                        case "PullRequestEvent":
                            const eventsByAction = new Map<string, GithubEvent[]>();
                            events?.forEach(e => {
                                if(!eventsByAction.has(e.payload.action)) eventsByAction.set(e.payload.action, []);
                                eventsByAction.get(e.payload.action)?.push(e);
                            })

                            Array.from(eventsByAction.keys()).forEach(action => {
                                console.log(`${action} ${eventsByAction.get(action)?.length} pull requests`)
                            })

                            break;
                        case "PullRequestReviewEvent":
                            console.log(`Reviewed ${events?.length} pull requests`)
                            break;
                        case "IssuesEvent":
                            console.log(`Reported ${events?.length} issues`)
                            break;
                        case "IssueCommentEvent":
                            console.log(`Commented ${events?.length} times on project issues`)
                            break;
                        case "CreateEvent":
                            const eventsByType = new Map<string, GithubEvent[]>();
                            events?.forEach(e => {
                                if(!eventsByType.has(e.payload.ref_type)) eventsByType.set(e.payload.ref_type, []);
                                eventsByType.get(e.payload.ref_type)?.push(e);
                            })

                            Array.from(eventsByType.keys()).forEach(ref_type => {
                                console.log(`Created ${eventsByType.get(ref_type)?.length} ${ref_type}`)
                            })
                            break;
                        case "PushEvent":
                            console.log(`Pushed ${events?.length} time(s)`)
                            break;
                        case "WatchEvent":
                            console.log(`Watching it`)
                            break;   
                    }
                })

                console.log(`# ----${'-'.repeat(repo.length)}----\n`)
            })
        });
    } catch (err: any) {
        Logger.error(err.message);
    }
}

function groupEventsByRepository(events: GithubEvent[]) {
    const eventsByRepo = new Map<string, GithubEvent[]>();

    events.forEach(e => {
        if(!eventsByRepo.has(e.repo.name)) {
            eventsByRepo.set(e.repo.name, []);
        }

        eventsByRepo.get(e.repo.name)?.push(e);
    })

    return eventsByRepo;
}


/**
 * @throws {Error} args are not valid.
 * @param {string[]} args
 */
function validateArgs(args: string[]) {
    if(!args || args.length === 0) {
        throw new Error(`You must provide at least a github username !`)
    } else if(args.length > 1) {
        throw new Error("You just need to provide a github username !")
    }
}

