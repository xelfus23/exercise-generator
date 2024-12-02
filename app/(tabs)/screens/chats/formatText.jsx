const formatText = (text) => {
    // Remove unwanted asterisks at the beginning of bullet points
    const regex = /(\*\*(.*?)\*\*)|(\*(.*?))/g;
    const parts = [];
    let lastIndex = 0;

    console.log(JSON.stringify(text));
    text.replace(regex, (match, bold, boldText, bullet, bulletText, index) => {
        if (index > lastIndex) {
            parts.push({
                text: text.slice(lastIndex, index),
            });
        }
        if (bold) {
            parts.push({ text: boldText, bold: true });
        } else if (bullet) {
            parts.push({ text: `• ${bulletText}`, bullet: true });
        }

        lastIndex = index + match.length;
        return match;
    });

    if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex) });
    }

    return parts;
};

export default formatText;
