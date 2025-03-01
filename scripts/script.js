async function fetchQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching quote:', error);
        return null;
    }
}

async function fetchAuthorImage(author) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        const callbackName = `jsonp_callback_${Date.now()}`;

        window[callbackName] = (data) => {
            if (data.query?.pages) {
                const pages = data.query.pages;
                const pageId = Object.keys(pages)[0];
                const imageUrl = pages[pageId].thumbnail?.source;
                resolve(imageUrl || null);
            } else {
                resolve(null);
            }
            document.body.removeChild(script);
            delete window[callbackName];
        };

        script.src = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${encodeURIComponent(author)}&pithumbsize=200&callback=${callbackName}`;
        script.onerror = () => reject(null);

        document.body.appendChild(script);
    });
}

async function fetchAuthorDetails(authorSlug) {
    try {
        const response = await fetch(`https://api.quotable.io/authors?slug=${authorSlug}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();
        return data.results[0];
    } catch (error) {
        console.error('Error fetching author details:', error);
        return null;
    }
}

async function displayQuote(quote) {
    const quoteText = document.getElementById('quote-text');
    const authorLink = document.getElementById('author-link');
    const authorImage = document.getElementById('author-image');
    const authorDescription = document.getElementById('author-description');

    quoteText.textContent = `"${quote.content}"`;
    authorLink.textContent = `— ${quote.author}`;
    authorLink.href = `https://google.com/search?q=${encodeURIComponent(quote.author)}`;

    const imageUrl = await fetchAuthorImage(quote.author);
    if (imageUrl) {
        authorImage.src = imageUrl;
        authorImage.style.display = 'block';
    } else {
        authorImage.style.display = 'none';
    }

    const authorDetails = await fetchAuthorDetails(quote.authorSlug);
    if (authorDetails) {
        authorDescription.textContent = authorDetails.description || 'No description available.';
        authorDescription.style.display = 'block';
    } else {
        authorDescription.style.display = 'none';
    }
}

document.getElementById('get-quote-button').addEventListener('click', async () => {
    const quote = await fetchQuote();
    if (quote) {
        await displayQuote(quote);
    } else {
        alert('Failed to fetch a quote. Please try again.');
    }
});

window.onload = async () => {
    const quote = await fetchQuote();
    if (quote) {
        await displayQuote(quote);
    }
};
