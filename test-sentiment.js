import Sentiment from 'sentiment';
const sentiment = new Sentiment();

const cases = [
    { name: 'Simple Positive', text: 'I love this!' },
    { name: 'Negation', text: 'I do not love this.' },
    { name: 'Emoji Positive', text: 'This is great 😃' },
    { name: 'Emoji Negative', text: 'This is bad 😠' },
    { name: 'Non-English (Telugu)', text: 'ఈ చిత్రం చాలా బాగుంది' },
    { name: 'Mixed', text: 'I do not like it 😠' }
];

cases.forEach(c => {
    const result = sentiment.analyze(c.text);
    console.log(`--- ${c.name} ---`);
    console.log(`Text: ${c.text}`);
    console.log(`Score: ${result.score}`);
    console.log(`Comparative: ${result.comparative}`);
    console.log(`Words: ${JSON.stringify(result.words)}`);
    console.log(`Positive: ${JSON.stringify(result.positive)}`);
    console.log(`Negative: ${JSON.stringify(result.negative)}`);
    console.log();
});
