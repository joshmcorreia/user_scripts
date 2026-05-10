// ==UserScript==
// @name        eBay Hide Live Streaming
// @namespace   Violentmonkey Scripts
// @match       https://www.ebay.com/itm/*
// @match       https://www.ebay.com/sch/*
// @run-at      document-start
// @grant       none
// @version     1.0.4
// @author      joshmcorreia
// @license     MIT
// @description Hides the "Live Streaming Now" widget at the top of the page.
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

const selectors = {
	xPdaPlacements: "[data-testid='x-pda-placements']",
	liveBanner: "[data-testid='x-ebay-live-banner']",
	sellerCard: ".x-ebay-live-seller-card",
	searchLive: ".srp-river-answer--EBAY_LIVE_ENTRY"
};

function removeElements(selector) {
	const elements = document.querySelectorAll(selector);

	if (!elements.length) return;

	elements.forEach(el => el.remove());
	console.log(`Removed ${elements.length} ${selector}`);
}

function observePage() {
	const observer = new MutationObserver(() => {
		removeElements(selectors.xPdaPlacements);
		removeElements(selectors.liveBanner);
		removeElements(selectors.sellerCard);
		removeElements(selectors.searchLive);
	});

	observer.observe(document.documentElement, {
		childList: true,
		subtree: true
	});
}

observePage();
