/**
 * APG-official — Architectural Showcase Gallery JavaScript
 * Handles dynamic rendering, responsive card generation, horizon backdrop split alignment, and live search.
 */

'use strict';

/**
 * Registry of showcase websites.
 * Real project data, URLs, and local preview screenshots preserved.
 */
const websites = [
  {
    id: 'urjoydrop',
    title: 'URjoydrop',
    domain: 'wishdrop-six.vercel.app',
    url: 'https://wishdrop-six.vercel.app/',
    description: 'Create and share personalized interactive digital surprises and celebratory greeting experiences.',
    thumbnail: 'assets/urjoydrop.png'
  },
  {
    id: 'cineportal',
    title: 'cineportal',
    domain: 'cineportal.online',
    url: 'https://cineportal.online/',
    description: 'Discover movie, anime, manga, and global entertainment streaming platforms worldwide.',
    thumbnail: 'assets/cineportal.png'
  },
  {
    id: 'promp-ts',
    title: 'promp-ts',
    domain: 'prompts-pearl.vercel.app',
    url: 'https://prompts-pearl.vercel.app/',
    description: 'Explore a curated visual discovery gallery of AI image prompts, reel modes, and artistic styles.',
    thumbnail: 'assets/promp-ts.png'
  }
];

// DOM Element References
const galleryGrid = document.getElementById('gallery-grid');
const searchInput = document.getElementById('search-input');
const searchClearBtn = document.getElementById('search-clear');
const emptyState = document.getElementById('empty-state');
const emptyClearBtn = document.getElementById('empty-clear-btn');
const resultsCount = document.getElementById('results-count');

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} str 
 * @returns {string}
 */
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Updates the horizon split point in CSS so the backdrop split sits
 * cleanly behind the vertical midpoint of the project cards.
 */
function updateBackdropHorizon() {
  const firstCard = document.querySelector('.gallery-grid .card');
  if (firstCard && !firstCard.hidden && firstCard.offsetParent !== null) {
    const rect = firstCard.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const cardMidpoint = rect.top + scrollTop + (rect.height / 2);
    document.documentElement.style.setProperty('--split-point', `${Math.round(cardMidpoint)}px`);
  }
}

/**
 * Renders fallback UI for an image that fails to load.
 * @param {HTMLImageElement} imgElement 
 * @param {string} title 
 */
function handleImageError(imgElement, title) {
  const container = imgElement.parentElement;
  if (!container) return;
  
  imgElement.style.display = 'none';
  
  const fallback = document.createElement('div');
  fallback.className = 'card-thumbnail-fallback';
  fallback.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
      <path d="m21 15-5-5L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>${escapeHTML(title)}</span>
  `;
  container.appendChild(fallback);
}

/**
 * Creates an individual architectural website card DOM element.
 * @param {Object} site 
 * @returns {HTMLElement}
 */
function createCardElement(site) {
  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('data-id', site.id);

  // 1. 16:10 Aspect-ratio preview frame
  const thumbnailWrap = document.createElement('div');
  thumbnailWrap.className = 'card-thumbnail-wrap';

  const img = document.createElement('img');
  img.className = 'card-thumbnail';
  img.src = site.thumbnail;
  img.alt = `${site.title} website desktop preview`;
  img.loading = 'lazy';
  img.width = 640;
  img.height = 400;

  img.onload = () => {
    updateBackdropHorizon();
  };

  img.onerror = () => {
    handleImageError(img, site.title);
  };

  thumbnailWrap.appendChild(img);
  card.appendChild(thumbnailWrap);

  // Card Body Frame
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  // 2. Project Title
  const titleEl = document.createElement('h2');
  titleEl.className = 'card-title';
  titleEl.textContent = site.title;
  cardBody.appendChild(titleEl);

  // 3. Domain Line with globe icon
  const domainEl = document.createElement('p');
  domainEl.className = 'card-domain';
  domainEl.innerHTML = `
    <svg class="card-domain-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" stroke-width="1.3"/>
      <path d="M1.75 8h12.5M8 1.75a9.5 9.5 0 0 1 0 12.5M8 1.75a9.5 9.5 0 0 0 0 12.5" stroke="currentColor" stroke-width="1.3"/>
    </svg>
    <span>${escapeHTML(site.domain)}</span>
  `;
  cardBody.appendChild(domainEl);

  // 4. Short Description (Clamped to 2 lines)
  const descEl = document.createElement('p');
  descEl.className = 'card-desc';
  descEl.textContent = site.description;
  cardBody.appendChild(descEl);

  // 5. CTA Button with clean arrow-up-right icon
  const cardFooter = document.createElement('div');
  cardFooter.className = 'card-footer';

  const ctaBtn = document.createElement('a');
  ctaBtn.className = 'card-cta';
  ctaBtn.href = site.url;
  ctaBtn.target = '_blank';
  ctaBtn.rel = 'noopener noreferrer';
  ctaBtn.setAttribute('aria-label', `Visit ${site.title} (opens in a new tab)`);
  ctaBtn.innerHTML = `
    <span>Visit Website</span>
    <svg class="cta-arrow-svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  cardFooter.appendChild(ctaBtn);
  cardBody.appendChild(cardFooter);
  card.appendChild(cardBody);

  return card;
}

/**
 * Renders the list of websites to the gallery grid.
 * @param {Array<Object>} items 
 */
function renderGallery(items) {
  galleryGrid.innerHTML = '';

  if (items.length === 0) {
    emptyState.hidden = false;
    galleryGrid.hidden = true;
    if (resultsCount) {
      resultsCount.textContent = 'No matching websites found.';
    }
  } else {
    emptyState.hidden = true;
    galleryGrid.hidden = false;

    const fragment = document.createDocumentFragment();
    items.forEach(site => {
      fragment.appendChild(createCardElement(site));
    });
    galleryGrid.appendChild(fragment);

    if (resultsCount) {
      resultsCount.textContent = `Showing ${items.length} ${items.length === 1 ? 'website' : 'websites'}.`;
    }
  }

  // Update horizon split whenever cards change
  requestAnimationFrame(() => {
    updateBackdropHorizon();
  });
}

/**
 * Filters the websites based on user input.
 * Searches case-insensitively across title, domain, and description.
 * @param {string} rawQuery 
 */
function filterWebsites(rawQuery) {
  const query = rawQuery.trim().toLowerCase();

  // Manage visibility of the clear (×) button
  if (query.length > 0) {
    searchClearBtn.hidden = false;
  } else {
    searchClearBtn.hidden = true;
  }

  if (!query) {
    renderGallery(websites);
    return;
  }

  const filtered = websites.filter(site => {
    const titleMatch = site.title.toLowerCase().includes(query);
    const domainMatch = site.domain.toLowerCase().includes(query);
    const descMatch = site.description.toLowerCase().includes(query);
    return titleMatch || domainMatch || descMatch;
  });

  renderGallery(filtered);
}

/**
 * Clears the active search query and resets focus.
 */
function resetSearch() {
  searchInput.value = '';
  searchClearBtn.hidden = true;
  renderGallery(websites);
  searchInput.focus();
}

/**
 * Event Listeners Initialization
 */
function initApp() {
  // Initial render
  renderGallery(websites);

  // Live search input listener
  searchInput.addEventListener('input', (e) => {
    filterWebsites(e.target.value);
  });

  // Clear button inside search input
  searchClearBtn.addEventListener('click', () => {
    resetSearch();
  });

  // Clear button in empty state card
  emptyClearBtn.addEventListener('click', () => {
    resetSearch();
  });

  // Allow Esc key to quickly clear search input
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchInput.value) {
      resetSearch();
    }
  });

  // Keep horizon split aligned on window resize & orientation change
  window.addEventListener('resize', () => {
    updateBackdropHorizon();
  });
  window.addEventListener('orientationchange', () => {
    updateBackdropHorizon();
  });
}

// Bootstrap on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
