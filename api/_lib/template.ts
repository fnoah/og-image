
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml, sanitizeUrl } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string, backgroundImage: string, color: string) {
    console.log(backgroundImage)
    let foreground = 'white';
    let background = '#10202C';

    if (theme === 'light') {
        foreground = 'black';
        background = 'white';
    }

    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    html, body {
        height: 100vh;
        margin: 0;
    }

    body {
        background: ${background};
        background-image: url(${sanitizeUrl(backgroundImage)})
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .wrapper {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        width: 100%;
        height: 100%;
        border-top: 140px solid ${sanitizeHtml(color)};
        display: flex;
        padding: 40px;
        align-items: center;
        justify-content: space-between;
    }

    .footer-wrapper {
        display: flex;
        justify-content: flex-end;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Inter', sans-serif;
        font-size: 100px;
        font-style: normal;
        color: ${foreground};
        line-height: 1.5;
    }

    .subheading {
        font-family: 'Inter', sans-serif;
        font-size: 50px;
        font-style: normal;
        color: ${foreground};
    }
    
    .text{
        margin-left: 50px;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, subtitle, color, theme, md, image, backgroundImage, width, height } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, backgroundImage, color)}
    </style>
    <body>
        <div class="wrapper">
            <div class="text">
                <div class="heading">
                ${emojify(
                    md ? marked(text) : sanitizeHtml(text)
                )}
                </div>
                <div class="subheading">
                    ${emojify(
                        md ? marked(subtitle) : sanitizeHtml(subtitle)
                    )}
                </div>
            </div>
            <div class="footer-wrapper">
                ${getImage(image, width, height)}
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '450') {
    if(!src) return null

    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}