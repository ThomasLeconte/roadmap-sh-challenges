#!/usr/bin/env node
import GithubClient from "./github-client.js";
import { Logger } from "./utils/Logger.js";
import { groupBy } from "./utils/group-by.js";
const argv = process.argv.slice(2);
handleCommand(argv);
/**
 *
 * @param {string[]} args
 */
function handleCommand(args) {
    try {
        validateArgs(args);
        const username = args[0];
        GithubClient.fetchUserEvents(username).then((response) => {
            const eventsByRepo = groupBy("repo.name", response);
            Array.from(eventsByRepo.keys()).forEach(repo => {
                const eventsOfRepo = eventsByRepo.get(repo);
                const eventsByType = groupBy("type", eventsOfRepo);
                console.log(`# --- ${repo} ---`);
                Array.from(eventsByType.keys()).forEach(type => {
                    const events = eventsByType.get(type);
                    switch (type) {
                        case "ReleaseEvent":
                            console.log(`Published ${events?.length} versions of project`);
                        case "PullRequestEvent":
                            const eventsByAction = groupBy("payload.action", events);
                            Array.from(eventsByAction.keys()).forEach(action => {
                                console.log(`${action} ${eventsByAction.get(action)?.length} pull requests`);
                            });
                            break;
                        case "PullRequestReviewEvent":
                            console.log(`Reviewed ${events?.length} pull requests`);
                            break;
                        case "IssuesEvent":
                            console.log(`Reported ${events?.length} issues`);
                            break;
                        case "IssueCommentEvent":
                            console.log(`Commented ${events?.length} times on project issues`);
                            break;
                        case "CreateEvent":
                            const eventsByType = groupBy("payload.ref_type", events);
                            Array.from(eventsByType.keys()).forEach(ref_type => {
                                console.log(`Created ${eventsByType.get(ref_type)?.length} ${ref_type}`);
                            });
                            break;
                        case "PushEvent":
                            console.log(`Pushed ${events?.length} time(s)`);
                            break;
                        case "WatchEvent":
                            console.log(`Watching it`);
                            break;
                    }
                });
                console.log(`# ----${'-'.repeat(repo.length)}----\n`);
            });
        });
    }
    catch (err) {
        Logger.error(err.message);
    }
}
function groupEventsByRepository(events) {
    const eventsByRepo = new Map();
    events.forEach(e => {
        if (!eventsByRepo.has(e.repo.name)) {
            eventsByRepo.set(e.repo.name, []);
        }
        eventsByRepo.get(e.repo.name)?.push(e);
    });
    return eventsByRepo;
}
/**
 * @throws {Error} args are not valid.
 * @param {string[]} args
 */
function validateArgs(args) {
    if (!args || args.length === 0) {
        throw new Error(`You must provide at least a github username !`);
    }
    else if (args.length > 1) {
        throw new Error("You just need to provide a github username !");
    }
}
