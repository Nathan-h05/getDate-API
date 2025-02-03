const http = require('http');
const url = require('url');
const utils = require('./modules/utils');
const messages = require('./lang/messages/en/en');

const port = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname.toLowerCase() === "/getdate" || parsedUrl.pathname.toLowerCase() === "/getdate/") {
        console.log("✅ Route matched!");

        const name = (parsedUrl.query.name || "Guest").replace(/\/+$/, "");
        const currentDate = utils.getDate();
        let message = messages.greeting
            .replace("%name%", name)
            .replace("%datetime%", currentDate);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`<p style="color:blue;">${message}</p>`);
    } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h3>404 Not Found</h3>");
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
