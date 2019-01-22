import { IncomingMessage } from 'http';
import { parse } from 'url';

interface ParsedRequest {
    type: ScreenshotType;
    text: string;
    fontWeight: FontWeight;
    fontSize: string;
    images: string[];
};

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname = '/', query = {} } = parse(req.url || '', true);
    const { fontWeight, fontSize, images } = query;
    if (Array.isArray(fontWeight)) {
        throw new Error('Expected a single fontWeight');
    }
    if (Array.isArray(fontSize)) {
        throw new Error('Expected a single fontSize');
    }
    const arr = pathname.slice(1).split('.');
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
        type: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        fontWeight: fontWeight as FontWeight || 'bold',
        fontSize: fontSize || '75px',
        images: Array.isArray(images) && images.length > 0
            ? images
            : ['https://assets.zeit.co/image/upload/front/assets/design/now-black.svg'],
    };
    return parsedRequest;
}