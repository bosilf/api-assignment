async function fetchQuote() {
    try {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();

        document.getElementById("quote-text").innerText = `${data.content}`;

        const authorResponse = await fetch(`https://api.quotable.io/authors?slug=${data.authorSlug}`);
        const authorData = await authorResponse.json();

        if (authorData.results.length > 0) {
            const author = authorData.results[0];

            let authorLink = author.link ? author.link : `https://en.wikipedia.org/wiki/${data.author.replace(/ /g, "_")}`;
            document.getElementById("author-link").href = authorLink;
            document.getElementById("author-link").innerText = `- ${author.name}`;

            document.getElementById("author-description").innerText = author.description || "No description available.";

            document.getElementById("author-image").src = author.image || "./assets/default-author.png";
            document.getElementById("author-image").alt = `Image of ${author.name}`;
        } else {
            console.warn("No author details found for slug:", data.authorSlug);
            document.getElementById("author-description").innerText = "No description available.";
        }

    } catch (error) {
        console.error("Error fetching quote:", error);
    }
}

document.getElementById("get-quote-button").addEventListener("click", fetchQuote);

fetchQuote();
