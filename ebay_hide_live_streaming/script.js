// ==UserScript==
// @name        eBay Hide Live Streaming
// @namespace   Violentmonkey Scripts
// @match       https://www.ebay.com/itm/*
// @grant       none
// @version     1.0.0
// @author      joshmcorreia
// @license     MIT
// @description Hides the "Live Streaming Now" widget at the top of the page.
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

const live_streaming_now_element_selector = ".x-ebay-live-banner";

function remove_live_streaming_now_widget() {
	var live_streaming_element = document.querySelector(live_streaming_now_element_selector);
	live_streaming_element.remove();
}

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
	if(document.querySelector(live_streaming_now_element_selector)) {
		observer.disconnect();
		remove_live_streaming_now_widget();
	}
}
