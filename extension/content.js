// content.js v2.0.0

// This script now uses a MutationObserver to be extremely patient.

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractSavedPosts') {
        observeAndExtract()
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep the message channel open for the async response
    }
});

function observeAndExtract() {
    return new Promise((resolve, reject) => {
        const postSelector = 'li.reusable-search__result-container';
        let observer;
        
        // Timeout to prevent the observer from running forever
        const timeout = setTimeout(() => {
            observer.disconnect();
            reject(new Error('Extraction timed out. Could not find any posts. Please try reloading the page.'));
        }, 20000); // 20-second timeout

        const observerCallback = (mutations, obs) => {
            if (document.querySelector(postSelector)) {
                // As soon as we see the first post, we know the content is loading.
                clearTimeout(timeout);
                obs.disconnect(); // Stop observing
                
                // Now that we know posts exist, scroll to load them all
                scrollToBottom().then(() => {
                    const data = extractData();
                    resolve(data);
                });
            }
        };

        observer = new MutationObserver(observerCallback);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also check if the content is already there, just in case
        if (document.querySelector(postSelector)) {
            clearTimeout(timeout);
            observer.disconnect();
            scrollToBottom().then(() => {
                const data = extractData();
                resolve(data);
            });
        }
    });
}

async function scrollToBottom() {
    const container = document.querySelector('div.scaffold-finite-scroll__content') || document.documentElement;
    let lastHeight = 0;
    let newHeight = container.scrollHeight;
    while (lastHeight < newHeight) {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, 2000));
        lastHeight = newHeight;
        newHeight = container.scrollHeight;
    }
}

function extractData() {
    const postSelector = 'li.reusable-search__result-container.artdeco-card';
    const postElements = document.querySelectorAll(postSelector);
    
    return Array.from(postElements).map(post => {
        const postLinkElement = post.querySelector('a[href*="/feed/update/urn:li:activity:"]');
        const postUrl = postLinkElement ? postLinkElement.href : 'N/A';

        const actorInfoElement = post.querySelector('div.entity-result__primary-subtitle');
        const actorName = actorInfoElement ? actorInfoElement.innerText.split('•')[0].trim() : 'N/A';

        const postTextElement = post.querySelector('div.entity-result__summary');
        let postText = postTextElement ? postTextElement.innerText.trim() : 'N/A';
        if (postText.endsWith('…see more')) {
            postText = postText.slice(0, -10).trim();
        }

        return { postUrl, actorName, postText, timestamp: 'N/A' };
    });
}