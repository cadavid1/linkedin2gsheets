// popup.js v2.1.0

console.log('LinkedIn to Sheets - Popup vFinal');

// --- DOM ELEMENTS ---
const elements = {
    statusCard: document.getElementById('statusCard'),
    statusMessage: document.getElementById('statusMessage'),
    extractBtn: document.getElementById('extractBtn'),
    exportBtn: document.getElementById('exportBtn'),
    progressContainer: document.getElementById('progressContainer'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    postsCount: document.getElementById('postsCount'),
    exportCount: document.getElementById('exportCount'),
    statsGrid: document.getElementById('statsGrid'),
    linkedinStatus: document.getElementById('linkedinStatus'),
    linkedinStatusText: document.getElementById('linkedinStatusText'),
};

// --- APP STATE ---
let state = {
    isExtracting: false,
    isExporting: false,
    extractedPosts: [],
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    elements.extractBtn.addEventListener('click', handleExtract);
    elements.exportBtn.addEventListener('click', handleExport);
    checkConnection();
});

// --- CORE FUNCTIONS ---

async function handleExtract() {
    if (state.isExtracting) return;
    setUIState('extracting');

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab.id || !tab.url?.includes('linkedin.com')) {
            throw new Error('Please navigate to a LinkedIn page.');
        }

        const savedPostsUrl = 'https://www.linkedin.com/my-items/saved-posts/';
        if (!tab.url.startsWith(savedPostsUrl)) {
            updateProgress(15, 'Navigating to Saved Posts...');
            await navigateTab(tab.id, savedPostsUrl);
            await new Promise(resolve => setTimeout(resolve, 5000)); 
        }

        updateProgress(30, 'Finding content on page...');
        const contentFrame = await findMainContentFrame(tab.id);
        if (!contentFrame) {
            throw new Error('Could not find saved posts on this page. Try reloading.');
        }

        updateProgress(50, 'Extracting posts (this may take a moment)...');
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id, frameIds: [contentFrame.frameId] },
            files: ['extractor.js'],
        });

        if (!results || results.length === 0 || !results[0].result) {
            throw new Error('Extraction script failed to return data.');
        }
        
        state.extractedPosts = results[0].result;

        if (state.extractedPosts.length === 0) {
            throw new Error('No saved posts found. The page might be empty.');
        }

        updateProgress(100, 'Extraction Complete!');
        showStatus(`Found ${state.extractedPosts.length} saved posts.`, 'success');

    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        setUIState('idle');
    }
}

async function findMainContentFrame(tabId) {
    try {
        const frames = await chrome.webNavigation.getAllFrames({ tabId });
        for (const frame of frames) {
            try {
                const result = await chrome.scripting.executeScript({
                    target: { tabId, frameIds: [frame.frameId] },
                    func: () => !!document.querySelector('div.scaffold-finite-scroll__content'),
                });
                if (result[0].result) {
                    return frame;
                }
            } catch (e) {
                // Ignore errors from inaccessible frames
            }
        }
    } catch (e) {
        console.error("Error finding frames:", e);
    }
    return null;
}


async function handleExport() {
    if (state.isExporting || state.extractedPosts.length === 0) return;
    setUIState('exporting');
    try {
        updateProgress(10, 'Requesting Google Sheets access...');
        const response = await chrome.runtime.sendMessage({ action: 'exportToSheets', data: state.extractedPosts });
        if (!response.success) throw new Error(response.error || 'Export failed.');
        updateProgress(100, 'Export Successful!');
        showStatus(`Successfully exported ${response.result.rowsAdded} posts.`, 'success');
        addOpenSheetButton(response.result.url);
    } catch (error) {
        showStatus(`Export Error: ${error.message}`, 'error');
    } finally {
        setUIState('idle');
    }
}

// --- HELPERS ---
function setUIState(mode) {
    state.isExtracting = mode === 'extracting';
    state.isExporting = mode === 'exporting';
    elements.extractBtn.disabled = state.isExtracting || state.isExporting;
    elements.exportBtn.disabled = state.isExtracting || state.isExporting || state.extractedPosts.length === 0;
    elements.progressContainer.classList.toggle('show', state.isExtracting || state.isExporting);
    if (mode === 'idle') {
        elements.postsCount.textContent = state.extractedPosts.length;
        elements.statsGrid.style.display = state.extractedPosts.length > 0 ? 'grid' : 'none';
    }
}

function showStatus(message, type = 'info') {
    elements.statusMessage.textContent = message;
    elements.statusCard.className = `status-card show ${type}`;
}

function updateProgress(percentage, text) {
    elements.progressFill.style.width = `${percentage}%`;
    elements.progressText.textContent = text;
}

function addOpenSheetButton(sheetUrl) {
    let btn = document.getElementById('openSheetBtn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'openSheetBtn';
        btn.className = 'button secondary';
        btn.innerHTML = '🔗 Open Google Sheet';
        btn.onclick = () => chrome.tabs.create({ url: sheetUrl });
        elements.exportBtn.after(btn);
    }
}

async function checkConnection() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const isConnected = tab && tab.url?.includes('linkedin.com');
        elements.linkedinStatus.className = `linkedin-status ${isConnected ? 'connected' : 'disconnected'}`;
        elements.linkedinStatusText.textContent = isConnected ? 'Connected to LinkedIn' : 'Not on LinkedIn';
        elements.extractBtn.disabled = !isConnected;
    } catch (e) {
        elements.extractBtn.disabled = true;
    }
}

function navigateTab(tabId, url) {
    return new Promise(resolve => {
        chrome.tabs.update(tabId, { url }, () => {
            const listener = (id, changeInfo) => {
                if (id === tabId && changeInfo.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    resolve();
                }
            };
            chrome.tabs.onUpdated.addListener(listener);
        });
    });
}