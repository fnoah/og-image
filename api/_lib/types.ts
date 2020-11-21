export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    fileType: FileType;
    text: string;
    theme: Theme;
    md: boolean;
    color: string;
    subtitle: string;
    image: string;
    width: string;
    height: string;
    backgroundImage: string;
}
