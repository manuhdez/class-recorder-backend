# Stream video class recorder

## Descripion

The base idea was to have a tool that can generate a video recording of an online class programatically,
so in the case you can't attend to a certain class you can set the date and time the class will take place
and it will be recorded automatically for you.

## Tools

For accessing the class the main tool is going to be used is [`puppeteer`](https://github.com/puppeteer/puppeteer) and the plugin [`puppeteer-stream`](https://www.npmjs.com/package/puppeteer-stream) that will enable the real-time screen recording of the browser tab.
