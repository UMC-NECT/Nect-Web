export const getTagStyle = (tag: string): string => {
    const tagName = tag.split(' ')[0].toLowerCase();

    const styles: Record<string, string> = {
        'design': 'bg-roletag-pink',
        'frontend': 'bg-roletag-green',
        'backend': 'bg-roletag-blue',
        'server': 'bg-roletag-orange',
        'data': 'bg-roletag-yellow',
        'video': 'bg-roletag-green',
        'music': 'bg-roletag-blue',
        'pm': 'bg-roletag-yellow',
    };

    return styles[tagName] || 'bg-roletag-none';

};
