export function htmlDecode(input: string): string {
    if (typeof window === 'undefined') {
        // Use a simple decoding logic for Node.js or server-side environments
        return input.replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/&nbsp;/g, ' ');
    }

    // Client-side: Use the DOM to decode
    const textarea = document.createElement('textarea');
    textarea.innerHTML = input;
    return textarea.value;
}