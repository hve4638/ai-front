export function copyToClipboard(text: string) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;

    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999);

    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
};