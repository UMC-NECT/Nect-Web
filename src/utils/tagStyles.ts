export const getTagStyle = (tag: string): string => {
    const tagName = tag.split(' ')[0].toLowerCase();

    const styles: Record<string, string> = {
        'design': 'bg-tag-pink',
        'frontend': 'bg-tag-green',
        'backend': 'bg-tag-blue',
        'server': 'bg-tag-orange',
        'data': 'bg-tag-yellow',
        'video': 'bg-tag-green',
        'music': 'bg-tag-blue',
        'pm': 'bg-tag-yellow',
    };

    return styles[tagName] || 'bg-tag-none';

};
