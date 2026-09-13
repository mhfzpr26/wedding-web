async function run() {
  const urls = [
    'https://rafli-fitri.diginvit.com/assets/index-CZCjYMcv.js',
    'https://rafli-fitri.diginvit.com/assets/index-Cy9_oeH9.js',
    'https://rafli-fitri.diginvit.com/assets/button-rnJR9bV6.js',
  ];

  for (const url of urls) {
    const res = await fetch(url);
    const text = await res.text();
    console.log(url, 'length:', text.length);

    // Look for JSX / texts
    const words = text.match(
      /(wedding|fitri|rafli|coming\s+soon|chapter|rumah\s+kayu|romance|sliceoflife|guest)/gi,
    );
    console.log('Matches in', url, words ? [...new Set(words)] : 'none');
  }
}

run();
