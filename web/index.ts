import { ParsedRequest, Theme, FileType } from '../api/_lib/types';
const { H, R, copee } = (window as any);
let timeout = -1;

interface ImagePreviewProps {
    src: string;
    onclick: () => void;
    onload: () => void;
    onerror: () => void;
    loading: boolean;
}

const ImagePreview = ({ src, onclick, onload, onerror, loading }: ImagePreviewProps) => {
    const style = {
        filter: loading ? 'blur(5px)' : '',
        opacity: loading ? 0.1 : 1,
    };
    const title = 'Click to copy image URL to clipboard';
    return H('a',
        { className: 'image-wrapper', href: src, onclick },
        H('img',
            { src, onload, onerror, style, title }
        )
    );
}

interface DropdownOption {
    text: string;
    value: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onchange: (val: string) => void;
    small: boolean;
}

const Dropdown = ({ options, value, onchange, small }: DropdownProps) => {
    const wrapper = small ? 'select-wrapper small' : 'select-wrapper';
    const arrow = small ? 'select-arrow small' : 'select-arrow';
    return H('div',
        { className: wrapper },
        H('select',
            { onchange: (e: any) => onchange(e.target.value) },
            options.map(o =>
                H('option',
                    { value: o.value, selected: value === o.value },
                    o.text
                )
            )
        ),
        H('div',
            { className: arrow },
            '▼'
        )
    );
}

interface TextInputProps {
    value: string;
    oninput: (val: string) => void;
}

const TextInput = ({ value, oninput }: TextInputProps) => {
    return H('div',
        { className: 'input-outer-wrapper' },
        H('div',
            { className: 'input-inner-wrapper' },
            H('input',
                { type: 'text', value, oninput: (e: any) => oninput(e.target.value) }
            )
        )
    );
}

// interface ButtonProps {
//     label: string;
//     onclick: () => void;
// }

// const Button = ({ label, onclick }: ButtonProps) => {
//     return H('button', { onclick }, label);
// }

interface FieldProps {
    label: string;
    input: any;
}

const Field = ({ label, input }: FieldProps) => {
    return H('div',
        { className: 'field' },
        H('label', 
            H('div', {className: 'field-label'}, label),
            H('div', { className: 'field-value' }, input),
        ),
    );
}

interface ToastProps {
    show: boolean;
    message: string;
}

const Toast = ({ show, message }: ToastProps) => {
    const style = { transform:  show ? 'translate3d(0,-0px,-0px) scale(1)' : '' };
    return H('div',
        { className: 'toast-area' },
        H('div',
            { className: 'toast-outer', style },
            H('div',
                { className: 'toast-inner' },
                H('div',
                    { className: 'toast-message'},
                    message
                )
            )
        ),
    );
}

const themeOptions: DropdownOption[] = [
    { text: 'Light', value: 'light' },
    { text: 'Dark', value: 'dark' },
];

const fileTypeOptions: DropdownOption[] = [
    { text: 'PNG', value: 'png' },
    { text: 'JPEG', value: 'jpeg' },
];

const fontSizeOptions: DropdownOption[] = Array
    .from({ length: 10 })
    .map((_, i) => i * 25)
    .filter(n => n > 0)
    .map(n => ({ text: n + 'px', value: n + 'px' }));

const markdownOptions: DropdownOption[] = [
    { text: 'Plain Text', value: '0' },
    { text: 'Markdown', value: '1' },
];

// const imageLightOptions: DropdownOption[] = [
//     { text: 'Vercel', value: 'https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-black.svg' },
//     { text: 'Next.js', value: 'https://assets.vercel.com/image/upload/front/assets/design/nextjs-black-logo.svg' },
//     { text: 'Hyper', value: 'https://assets.vercel.com/image/upload/front/assets/design/hyper-color-logo.svg' },
// ];

// const imageDarkOptions: DropdownOption[] = [

//     { text: 'Vercel', value: 'https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-white.svg' },
//     { text: 'Next.js', value: 'https://assets.vercel.com/image/upload/front/assets/design/nextjs-white-logo.svg' },
//     { text: 'Hyper', value: 'https://assets.vercel.com/image/upload/front/assets/design/hyper-bw-logo.svg' },
// ];

const widthOptions = [
    { text: 'width', value: 'auto' },
    { text: '50', value: '50' },
    { text: '100', value: '100' },
    { text: '150', value: '150' },
    { text: '200', value: '200' },
    { text: '250', value: '250' },
    { text: '300', value: '300' },
    { text: '350', value: '350' },
];

const heightOptions = [
    { text: 'height', value: 'auto' },
    { text: '50', value: '50' },
    { text: '100', value: '100' },
    { text: '150', value: '150' },
    { text: '200', value: '200' },
    { text: '250', value: '250' },
    { text: '300', value: '300' },
    { text: '350', value: '350' },
];

interface AppState extends ParsedRequest {
    loading: boolean;
    showToast: boolean;
    messageToast: string;
    width: string;
    height: string;
    image: string;
    backgroundImage: string;
    overrideUrl: URL | null;
}

type SetState = (state: Partial<AppState>) => void;

const App = (_: any, state: AppState, setState: SetState) => {
    const setLoadingState = (newState: Partial<AppState>) => {
        window.clearTimeout(timeout);
        if (state.overrideUrl && state.overrideUrl !== newState.overrideUrl) {
            newState.overrideUrl = state.overrideUrl;
        }
        if (newState.overrideUrl) {
            timeout = window.setTimeout(() => setState({ overrideUrl: null }), 200);
        }

        setState({ ...newState, loading: true });
    };
    const {
        fileType = 'png',
        fontSize = '100px',
        theme = 'light',
        md = true,
        text = '**Hello** World',
        image = 'https://cdn.jsdelivr.net/gh/remojansen/logo.ts@master/ts.svg',
        width = null,
        height = null,
        showToast = false,
        messageToast = '',
        loading = true,
        overrideUrl = null,
        backgroundImage = null,
    } = state;
    const mdValue = md ? '1' : '0';
    const url = new URL(window.location.origin);
    url.pathname = `${encodeURIComponent(text)}.${fileType}`;
    url.searchParams.append('theme', theme);
    url.searchParams.append('md', mdValue);
    url.searchParams.append('fontSize', fontSize);
    url.searchParams.append('image', image);
    if(backgroundImage && backgroundImage.length != 0) url.searchParams.append('backgroundImage', backgroundImage);
    if(width) url.searchParams.append('width', width);
    if(height) url.searchParams.append('height', height);

    return H('div',
        { className: 'split' },
        H('div',
            { className: 'pull-left' },
            H('div',
                H(Field, {
                    label: 'Theme',
                    input: H(Dropdown, {
                        options: themeOptions,
                        value: theme,
                        onchange: (val: Theme) => setLoadingState({ theme: val })
                    })
                }),
                H(Field, {
                    label: 'File Type',
                    input: H(Dropdown, {
                        options: fileTypeOptions,
                        value: fileType,
                        onchange: (val: FileType) => setLoadingState({ fileType: val })
                    })
                }),
                H(Field, {
                    label: 'Font Size',
                    input: H(Dropdown, {
                        options: fontSizeOptions,
                        value: fontSize,
                        onchange: (val: string) => setLoadingState({ fontSize: val })
                    })
                }),
                H(Field, {
                    label: 'Text Type',
                    input: H(Dropdown, {
                        options: markdownOptions,
                        value: mdValue,
                        onchange: (val: string) => setLoadingState({ md: val === '1' })
                    })
                }),
                H(Field, {
                    label: 'Text Input',
                    input: H(TextInput, {
                        value: text,
                        oninput: (val: string) => {
                            setLoadingState({ text: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'Background image',
                    input: H(TextInput, {
                        value: backgroundImage,
                        oninput: (val: string) => {
                            setLoadingState({ backgroundImage: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'Image',
                    input: H('div',
                        H(TextInput, {
                            value: image,
                            oninput: (val: string) => {
                                setLoadingState({ image: val, overrideUrl: url });
                            }
                        }),
                        H('div',
                            { className: 'field-flex' },
                            H(Dropdown, {
                                options: widthOptions,
                                value: width,
                                small: true,
                                onchange: (val: string) =>  {
                                    setLoadingState({ width: val });
                                }
                            }),
                            H(Dropdown, {
                                options: heightOptions,
                                value: height,
                                small: true,
                                onchange: (val: string) =>  {
                                    setLoadingState({ height: val });
                                }
                            })
                        )
                    ),
                }),
            )
        ),
        H('div',
            { className: 'pull-right' },
            H(ImagePreview, {
                src: overrideUrl ? overrideUrl.href : url.href,
                loading: loading,
                onload: () => setState({ loading: false }),
                onerror: () => {
                    setState({ showToast: true, messageToast: 'Oops, an error occurred' });
                    setTimeout(() => setState({ showToast: false }), 2000);
                },
                onclick: (e: Event) => {
                    e.preventDefault();
                    const success = copee.toClipboard(url.href);
                    if (success) {
                        setState({ showToast: true, messageToast: 'Copied image URL to clipboard' });
                        setTimeout(() => setState({ showToast: false }), 3000);
                    } else {
                        window.open(url.href, '_blank');
                    }
                    return false;
                }
            })
        ),
        H(Toast, {
            message: messageToast,
            show: showToast,
        })
    );
};

R(H(App), document.getElementById('app'));
