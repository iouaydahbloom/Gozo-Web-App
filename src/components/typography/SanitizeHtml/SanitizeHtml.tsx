import sanitizeHtml from 'sanitize-html';

interface Props {
    html: any,
    options?: any
}

const SanitizeHtml: React.FC<Props> = ({ html, options }) => {
    const defaultOptions = {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p'],
        allowedAttributes: {
            'a': ['href']
        },
        allowedIframeHostnames: ['www.youtube.com']
    };

    const sanitize = (dirty: any, options: any) => ({
        __html: sanitizeHtml(
            dirty,
            { ...defaultOptions, ...options }
        )
    });

    return (
        <div dangerouslySetInnerHTML={sanitize(html, options)} />
    );
}

export default SanitizeHtml;