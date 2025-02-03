const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const utils = require('./modules/utils');
const messages = require('./lang/messages/en/en');

const port = process.env.PORT || 5000;
const filePath = path.join(__dirname, 'file.txt');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname.toLowerCase() === "/getdate" || parsedUrl.pathname.toLowerCase() === "/getdate/") {
        const name = (parsedUrl.query.name || "Guest").replace(/\/+$/, "");
        const currentDate = utils.getDate();
        let message = messages.greeting
            .replace("%name%", name)
            .replace("%datetime%", currentDate);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`<p style="color:blue;">${message}</p>`);
    } else if (parsedUrl.pathname.toLowerCase() === "/writefile" || parsedUrl.pathname.toLowerCase() === "/writefile/") {

        const text = parsedUrl.query.text || "Default Text";
        
        fs.appendFile(filePath, text + "\n", (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/html" });
                return res.end("<h3>Error writing to file</h3>");
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end("<h3>File written successfully</h3>");
        });
    } else if (parsedUrl.pathname.toLowerCase() === "/readfile" || parsedUrl.pathname.toLowerCase() === "/readfile/") {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/html" });
                return res.end(`<h3>404 Error: ${filePath} not found</h3>`);
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`<pre>${data}</pre>`);
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h3>404 Not Found</h3>");
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
