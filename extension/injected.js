// Injected script to access LinkedIn's internal APIs
// This script runs in the page context and can access LinkedIn's internal functions

(function() {
    'use strict';
    
    console.log('LinkedIn API injected script loaded');
    
    // LinkedIn API endpoints and configuration
    const LINKEDIN_API = {
        baseUrl: 'https://www.linkedin.com/voyager/api',
        graphqlUrl: 'https://www.linkedin.com/voyager/api/graphql',
        savedItemsEndpoint: '/identity/profiles/{profileId}/savedItems',
        searchEndpoint: '/search/blended'
    };
    
    // Store for extracted data
    window.linkedInExtractorData = {
        savedPosts: [],
        isExtracting: false,
        totalExtracted: 0,
        currentProfileId: null,
        csrfToken: null
    };
    
    // Function to get current user's profile ID
    function getCurrentProfileId() {
        try {
            // Try to get from window object
            if (window.lio && window.lio.me && window.lio.me.miniProfile) {
                return window.lio.me.miniProfile.entityUrn.split(':').pop();
            }
            
            // Try to get from localStorage
            const voyagerCurrentProfile = localStorage.getItem('voyager:current-profile');
            if (voyagerCurrentProfile) {
                const profile = JSON.parse(voyagerCurrentProfile);
                if (profile.entityUrn) {
                    return profile.entityUrn.split(':').pop();
                }
            }
            
            // Try to extract from page URL or elements
            const profileLinks = document.querySelectorAll('a[href*="/in/"]');
            for (const link of profileLinks) {
                const match = link.href.match(/\/in\/([^\/]+)/);
                if (match) {
                    return match[1];
                }
            }
            
            return null;
        } catch (error) {
            console.error('Error getting profile ID:', error);
            return null;
        }
    }
    
    // Function to get CSRF token from LinkedIn
    function getCSRFToken() {
        try {
            // Try multiple methods to get CSRF token
            
            // Method 1: From cookies
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'JSESSIONID') {
                    return value.replace(/"/g, '');
                }
            }
            
            // Method 2: From meta tag
            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            if (csrfMeta) {
                return csrfMeta.getAttribute('content');
            }
            
            // Method 3: From window object
            if (window.lio && window.lio.csrfToken) {
                return window.lio.csrfToken;
            }
            
            // Method 4: From localStorage
            const csrfFromStorage = localStorage.getItem('csrf-token');
            if (csrfFromStorage) {
                return csrfFromStorage;
            }
            
            return null;
        } catch (error) {
            console.error('Error getting CSRF token:', error);
            return null;
        }
    }
    
    // Function to make authenticated requests to LinkedIn API
    async function makeLinkedInAPIRequest(url, options = {}) {
        const csrfToken = getCSRFToken();
        
        const defaultHeaders = {
            'accept': 'application/vnd.linkedin.normalized+json+2.1',
            'content-type': 'application/json',
            'x-restli-protocol-version': '2.0.0',
            'x-li-lang': 'en_US',
            'x-li-track': JSON.stringify({
                'clientVersion': '1.0.0',
                'osName': 'web',
                'timezoneOffset': new Date().getTimezoneOffset(),
                'deviceFormFactor': 'DESKTOP'
            })
        };
        
        if (csrfToken) {
            defaultHeaders['csrf-token'] = csrfToken;
        }
        
        const requestOptions = {
            method: 'GET',
            credentials: 'include',
            headers: { ...defaultHeaders, ...options.headers },
            ...options
        };
        
        try {
            console.log('Making LinkedIn API request to:', url);
            const response = await fetch(url, requestOptions);
            
            if (!response.ok) {
                throw new Error(`LinkedIn API request failed: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('LinkedIn API response received:', data);
            return data;
        } catch (error) {
            console.error('LinkedIn API request error:', error);
            throw error;
        }
    }
    
    // Function to extract saved posts using LinkedIn's API
    async function extractSavedPostsViaAPI() {
        console.log('Starting API-based extraction...');
        
        try {
            const profileId = getCurrentProfileId();
            if (!profileId) {
                throw new Error('Could not determine current profile ID');
            }
            
            console.log('Using profile ID:', profileId);
            
            const savedPosts = [];
            let start = 0;
            const count = 20;
            let hasMore = true;
            let attempts = 0;
            const maxAttempts = 10;
            
            while (hasMore && attempts < maxAttempts) {
                try {
                    // Try different API endpoints
                    const endpoints = [
                        // Saved items endpoint
                        `${LINKEDIN_API.baseUrl}/identity/profiles/${profileId}/savedItems?start=${start}&count=${count}`,
                        
                        // Search endpoint for saved items
                        `${LINKEDIN_API.baseUrl}/search/blended?decorationId=com.linkedin.voyager.dash.deco.search.SearchClusterCollection-165&start=${start}&count=${count}&q=all&query=(flagshipSearchIntent:SAVED_ITEMS)`,
                        
                        // My items endpoint
                        `${LINKEDIN_API.baseUrl}/identity/profiles/${profileId}/myItems?itemType=SAVED_POST&start=${start}&count=${count}`,
                        
                        // Feed endpoint for saved posts
                        `${LINKEDIN_API.baseUrl}/feed/savedPosts?start=${start}&count=${count}`
                    ];
                    
                    let data = null;
                    let usedEndpoint = null;
                    
                    for (const endpoint of endpoints) {
                        try {
                            data = await makeLinkedInAPIRequest(endpoint);
                            usedEndpoint = endpoint;
                            console.log(`Successfully used endpoint: ${endpoint}`);
                            break;
                        } catch (endpointError) {
                            console.warn(`Endpoint failed: ${endpoint}`, endpointError);
                            continue;
                        }
                    }
                    
                    if (!data) {
                        throw new Error('All API endpoints failed');
                    }
                    
                    // Extract posts from API response
                    const posts = extractPostsFromAPIResponse(data);
                    
                    if (posts.length === 0) {
                        console.log('No more posts found, stopping extraction');
                        hasMore = false;
                    } else {
                        savedPosts.push(...posts);
                        console.log(`Extracted ${posts.length} posts from API (total: ${savedPosts.length})`);
                        
                        // Check if we got fewer posts than requested (indicates end)
                        if (posts.length < count) {
                            hasMore = false;
                        }
                    }
                    
                    start += count;
                    attempts++;
                    
                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (error) {
                    console.error(`Error fetching saved posts page ${attempts + 1}:`, error);
                    attempts++;
                    
                    if (attempts >= maxAttempts) {
                        hasMore = false;
                    } else {
                        // Wait longer before retrying
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
            }
            
            window.linkedInExtractorData.savedPosts = savedPosts;
            window.linkedInExtractorData.totalExtracted = savedPosts.length;
            
            console.log(`API extraction completed: ${savedPosts.length} posts`);
            return savedPosts;
            
        } catch (error) {
            console.error('API extraction failed:', error);
            throw error;
        }
    }
    
    // Function to extract posts from API response
    function extractPostsFromAPIResponse(data) {
        const posts = [];
        
        try {
            // Handle different response structures
            if (data.elements) {
                // Standard elements array
                data.elements.forEach(item => {
                    const post = extractPostFromAPIItem(item);
                    if (post) posts.push(post);
                });
            } else if (data.included) {
                // Included array (common in LinkedIn responses)
                data.included.forEach(item => {
                    if (item.entityUrn && (
                        item.entityUrn.includes('savedItem') || 
                        item.entityUrn.includes('post') ||
                        item.entityUrn.includes('share')
                    )) {
                        const post = extractPostFromAPIItem(item);
                        if (post) posts.push(post);
                    }
                });
            } else if (data.data && Array.isArray(data.data)) {
                // Data array
                data.data.forEach(item => {
                    const post = extractPostFromAPIItem(item);
                    if (post) posts.push(post);
                });
            } else if (data.paging && data.paging.elements) {
                // Paged response
                data.paging.elements.forEach(item => {
                    const post = extractPostFromAPIItem(item);
                    if (post) posts.push(post);
                });
            }
            
        } catch (error) {
            console.error('Error extracting posts from API response:', error);
        }
        
        return posts;
    }
    
    // Function to extract post data from API item
    function extractPostFromAPIItem(item) {
        try {
            const post = {
                id: item.entityUrn || item.trackingUrn || `api_post_${Date.now()}_${Math.random()}`,
                trackingUrn: item.trackingUrn || item.entityUrn,
                title: '',
                description: '',
                url: '',
                author: '',
                authorProfile: '',
                publishedAt: '',
                savedAt: new Date().toISOString(),
                mediaType: 'text',
                hasImage: false,
                hasVideo: false,
                engagement: {
                    likes: 0,
                    comments: 0,
                    shares: 0
                },
                extractionMethod: 'api'
            };
            
            // Extract content text
            if (item.summary && item.summary.text) {
                post.description = item.summary.text;
                post.title = item.summary.text.substring(0, 100) + (item.summary.text.length > 100 ? '...' : '');
            } else if (item.text) {
                post.description = item.text;
                post.title = item.text.substring(0, 100) + (item.text.length > 100 ? '...' : '');
            } else if (item.commentary && item.commentary.text) {
                post.description = item.commentary.text;
                post.title = item.commentary.text.substring(0, 100) + (item.commentary.text.length > 100 ? '...' : '');
            }
            
            // Extract URL
            if (item.navigationUrl) {
                post.url = item.navigationUrl;
            } else if (item.permalink) {
                post.url = item.permalink;
            } else if (item.shareUrl) {
                post.url = item.shareUrl;
            }
            
            // Extract author information
            if (item.actor) {
                post.author = item.actor.name || '';
                post.authorProfile = item.actor.navigationUrl || '';
            } else if (item.author) {
                post.author = item.author.name || '';
                post.authorProfile = item.author.profileUrl || '';
            }
            
            // Extract timestamps
            if (item.createdAt) {
                post.publishedAt = new Date(item.createdAt).toISOString();
            } else if (item.publishedAt) {
                post.publishedAt = new Date(item.publishedAt).toISOString();
            }
            
            if (item.savedAt) {
                post.savedAt = new Date(item.savedAt).toISOString();
            }
            
            // Extract media information
            if (item.content) {
                if (item.content.images && item.content.images.length > 0) {
                    post.hasImage = true;
                    post.mediaType = 'image';
                }
                
                if (item.content.video) {
                    post.hasVideo = true;
                    post.mediaType = 'video';
                }
            }
            
            // Extract engagement data
            if (item.socialDetail) {
                const counts = item.socialDetail.totalSocialActivityCounts;
                if (counts) {
                    post.engagement.likes = counts.numLikes || 0;
                    post.engagement.comments = counts.numComments || 0;
                    post.engagement.shares = counts.numShares || 0;
                }
            }
            
            // Only return post if it has meaningful content
            if (post.description || post.url || post.author) {
                return post;
            }
            
            return null;
            
        } catch (error) {
            console.error('Error extracting post from API item:', error);
            return null;
        }
    }
    
    // Function to get saved posts (fallback to DOM scraping)
    function extractSavedPostsFromDOM() {
        console.log('Falling back to DOM extraction...');
        
        const posts = [];
        const selectors = [
            '[data-test-id="saved-item"]',
            '.saved-item',
            '.feed-shared-update-v2',
            '.occludable-update',
            '[data-urn*="savedItem"]'
        ];
        
        let postElements = [];
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                postElements = Array.from(elements);
                break;
            }
        }
        
        postElements.forEach((element, index) => {
            try {
                const post = {
                    id: `dom_post_${index}_${Date.now()}`,
                    title: '',
                    description: '',
                    url: '',
                    author: '',
                    extractedAt: new Date().toISOString(),
                    extractionMethod: 'dom'
                };
                
                // Extract text content
                const textElement = element.querySelector('.feed-shared-text__text-view, .attributed-text-segment-list__content, .break-words');
                if (textElement) {
                    post.description = textElement.textContent.trim();
                    post.title = post.description.substring(0, 100) + (post.description.length > 100 ? '...' : '');
                }
                
                // Extract author
                const authorElement = element.querySelector('.feed-shared-actor__name, .update-components-actor__name');
                if (authorElement) {
                    post.author = authorElement.textContent.trim();
                }
                
                // Extract URL
                const linkElement = element.querySelector('a[href*="/posts/"], a[href*="/feed/update/"]');
                if (linkElement) {
                    post.url = linkElement.href;
                }
                
                if (post.description || post.url) {
                    posts.push(post);
                }
                
            } catch (error) {
                console.error('Error extracting DOM post:', error);
            }
        });
        
        return posts;
    }
    
    // Main extraction function
    window.extractLinkedInSavedPosts = async function() {
        if (window.linkedInExtractorData.isExtracting) {
            console.log('Extraction already in progress...');
            return window.linkedInExtractorData.savedPosts;
        }
        
        window.linkedInExtractorData.isExtracting = true;
        
        try {
            // Try API extraction first
            let posts = [];
            
            try {
                posts = await extractSavedPostsViaAPI();
            } catch (apiError) {
                console.warn('API extraction failed:', apiError);
                
                // Fall back to DOM extraction
                console.log('Falling back to DOM extraction...');
                posts = extractSavedPostsFromDOM();
            }
            
            window.linkedInExtractorData.savedPosts = posts;
            window.linkedInExtractorData.totalExtracted = posts.length;
            
            // Dispatch custom event to notify content script
            window.dispatchEvent(new CustomEvent('linkedInDataExtracted', {
                detail: { posts, count: posts.length }
            }));
            
            return posts;
            
        } catch (error) {
            console.error('Error during extraction:', error);
            
            // Send error message
            window.postMessage({
                type: 'EXTRACTION_ERROR',
                error: error.message
            }, '*');
            
            return [];
        } finally {
            window.linkedInExtractorData.isExtracting = false;
        }
    };
    
    // Listen for extraction requests from content script
    window.addEventListener('message', function(event) {
        if (event.source !== window) return;
        
        if (event.data.type === 'EXTRACT_SAVED_POSTS') {
            console.log('Received extraction request from content script');
            
            window.extractLinkedInSavedPosts().then(posts => {
                window.postMessage({
                    type: 'SAVED_POSTS_EXTRACTED',
                    posts: posts
                }, '*');
            }).catch(error => {
                window.postMessage({
                    type: 'EXTRACTION_ERROR',
                    error: error.message
                }, '*');
            });
        }
    });
    
    // Initialize
    window.linkedInExtractorData.currentProfileId = getCurrentProfileId();
    window.linkedInExtractorData.csrfToken = getCSRFToken();
    
    console.log('LinkedIn extractor functions initialized', {
        profileId: window.linkedInExtractorData.currentProfileId,
        hasCSRF: !!window.linkedInExtractorData.csrfToken
    });
    
})();

