import express from "express";
import Cache from "./cache.js";
import { Logger } from "./utils/Logger.js";
export function startServer(port, host) {
    // Start the server
    const app = express();
    // Initialize the cache
    const cache = Cache.getInstance();
    app.use((req, res, next) => {
        const key = host + req.url;
        const cachedResponse = cache.get(key);
        if (cachedResponse) {
            Logger.info("Cache hit");
            res.setHeader("X-Cache", "HIT");
            res.send(cachedResponse);
            next();
        }
        else {
            fetch(key, { method: req.method })
                .then(response => response.text())
                .then(text => {
                cache.set(key, text);
                res.setHeader("X-Cache", "MISS");
                res.send(text);
                next();
            });
        }
    });
    app.listen(port, () => {
        Logger.info(`Server is running on port ${port}`);
    });
}
