#!/usr/bin/env node

'use strict';

const http = require('http');
const url = require('url');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const minimist = require('minimist');

var argv = minimist(process.argv.slice(2));

var port = 9593;

if('p' in argv){
    port = argv.p;
}

http.createServer(async (req, res) => {
    var q = url.parse(req.url, true);

    if(q.pathname == '/probe'){
        var target = q.query.target;
        var data = [];

        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

        data.push('# HELP lighthouse_exporter_info Exporter Info');
        data.push('# TYPE lighthouse_exporter_info gauge');
        data.push(`lighthouse_exporter_info{version="0.2.0",chrome_version="${await browser.version()}",node_version="${process.version}"} 1`);

        await lighthouse(target, {
            port: url.parse(browser.wsEndpoint()).port,
            output: 'json'
        })
            .then(results => {
                data.push('# HELP lighthouse_score The Score per Category');
                data.push('# TYPE lighthouse_score gauge');

                for(var category in results.lhr.categories){
                    var item = results.lhr.categories[category];

                    data.push(`lighthouse_score{category="${category}"} ${item.score * 100}`);
                }

                var audits = results.lhr.audits;

                data.push('# HELP lighthouse_timings Audit timings in ms');
                data.push('# TYPE lighthouse_timings gauge');

                data.push(`lighthouse_timings{audit="first-contentful-paint"} ${Math.round(audits["first-contentful-paint"].numericValue)}`);
                data.push(`lighthouse_timings{audit="first-meaningful-paint"} ${Math.round(audits["first-meaningful-paint"].numericValue)}`);
                data.push(`lighthouse_timings{audit="speed-index"} ${Math.round(audits["speed-index"].numericValue)}`);
                data.push(`lighthouse_timings{audit="first-cpu-idle"} ${Math.round(audits["first-cpu-idle"].numericValue)}`);
                data.push(`lighthouse_timings{audit="interactive"} ${Math.round(audits["interactive"].numericValue)}`);
                data.push(`lighthouse_timings{audit="estimated-input-latency"} ${Math.round(audits["estimated-input-latency"].numericValue)}`);
            });

        await browser.close();

        res.writeHead(200, {"Content-Type": "text/plain"});
        res.write(data.join("\n"));
    } else{
        res.writeHead(404);
    }

    res.end();
}).listen(port);
