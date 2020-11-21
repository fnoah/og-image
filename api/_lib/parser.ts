import { IncomingMessage } from 'http';
import { parse } from 'url';
import querystring from 'querystring';
import { ParsedRequest } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    
    const { pathname, query } = parse(req.url || '/');
    const parsedQuery = querystring.parse(decodeURIComponent(query || ""))

    const { subtitle, color, image, width, height, theme, md, backgroundImage } = (parsedQuery || {});

    if (Array.isArray(subtitle)) {
        throw new Error('Expected a single subtitle');
    }
    if (Array.isArray(color)) {
        throw new Error('Expected a single accent color');
    }
    if (Array.isArray(theme)) {
        throw new Error('Expected a single theme');
    }
    if (Array.isArray(image)) {
        throw new Error('Expected a single image');
    }
    if (Array.isArray(width)) {
        throw new Error('Expected a single image width');
    }
    if (Array.isArray(height)) {
        throw new Error('Expected a single image height');
    }
    if (Array.isArray(backgroundImage)) {
        throw new Error('Expected a single background image');
    }
    
    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        theme: theme === 'dark' ? 'dark' : 'light',
        md: md === '1' || md === 'true',
        color: color.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/) ? color : '#f6416c',
        subtitle,
        image,
        width,
        height,
        backgroundImage
    };
    
    return parsedRequest;
}