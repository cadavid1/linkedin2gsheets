// extractor.js

async function extractPosts() {
    const postSelector = 'li:has(div[data-chameleon-result-urn])';
    
    const waitForFirstPost = (timeout = 15000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                if (document.querySelector(postSelector)) {
                    clearInterval(interval);
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error("Timed out waiting for posts to appear. Please ensure you have saved posts."));
                }
            }, 300);
        });
    };

    try {
        await waitForFirstPost();
    } catch (e) {
        console.error(e.message);
        return [];
    }

    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    // NEW: More robust scrolling logic to handle hundreds of posts.
    let postCount = 0;
    let newPostCount = document.querySelectorAll(postSelector).length;
    let scrollAttempts = 0;
    const maxScrollAttempts = 50; // Prevents infinite loops

    while (newPostCount > postCount && scrollAttempts < maxScrollAttempts) {
        postCount = newPostCount;
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, 2500)); // Wait for posts to load
        newPostCount = document.querySelectorAll(postSelector).length;
        scrollAttempts++;
        console.log(`Found ${newPostCount} posts so far...`);
    }
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    const postElements = document.querySelectorAll(postSelector);
    if (postElements.length === 0) return [];

    const data = Array.from(postElements).map(post => {
        const urnElement = post.querySelector('div[data-chameleon-result-urn]');
        const urn = urnElement ? urnElement.getAttribute('data-chameleon-result-urn') : null;
        const postUrl = urn ? `https://www.linkedin.com/feed/update/${urn}/` : 'N/A';
        const actorInfoElement = post.querySelector('div.entity-result__content-actor a');
        const actorName = actorInfoElement ? actorInfoElement.innerText.trim() : 'N/A';
        const postTextElement = post.querySelector('p.entity-result__content-summary');
        let postText = postTextElement ? postTextElement.innerText.trim() : 'N/A';
        if (postText.endsWith('…see more')) {
            postText = postText.slice(0, -10).trim();
        }
        let timeText = 'N/A';
        try {
            const timeElement = post.querySelector('p.t-12.t-black--light');
            if (timeElement && timeElement.innerText.includes('•')) {
                timeText = timeElement.innerText.split('•')[0].trim();
            }
        } catch (e) {
            console.error("Could not parse timestamp for a post, defaulting to N/A.", e);
            timeText = 'N/A';
        }
        return { postUrl, actorName, postText, timestamp: timeText };
    });

    return data;
}

extractPosts();