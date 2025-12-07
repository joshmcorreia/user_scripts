// ==UserScript==
// @name        eBay Hide Live Streaming
// @namespace   Violentmonkey Scripts
// @match       https://www.ebay.com/itm/*
// @match       https://www.ebay.com/sch/*
// @grant       none
// @version     1.0.1
// @author      joshmcorreia
// @license     MIT
// @description Hides the "Live Streaming Now" widget at the top of the page.
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

const live_streaming_now_element_selector = ".x-ebay-live-banner";
const shop_ebay_live_element_selector = ".srp-river-answer--EBAY_LIVE_ENTRY";

function remove_live_streaming_now_widget() {
	var live_streaming_element = document.querySelector(live_streaming_now_element_selector);
	live_streaming_element.remove();
}

function remove_show_ebay_live_widget() {
	var show_ebay_live_element = document.querySelector(shop_ebay_live_element_selector);
	show_ebay_live_element.remove();
}

if (window.location.href.indexOf("ebay.com/itm/") != -1) {
	(new MutationObserver(observe_live_streaming_now)).observe(document, {childList: true, subtree: true});
}
if (window.location.href.indexOf("ebay.com/sch/") != -1) {
	(new MutationObserver(observe_shop_ebay_live_element)).observe(document, {childList: true, subtree: true});
}

function observe_live_streaming_now(changes, observer) {
	if(document.querySelector(live_streaming_now_element_selector)) {
		observer.disconnect();
		remove_live_streaming_now_widget();
	}
}

function observe_shop_ebay_live_element(changes, observer) {
	if(document.querySelector(shop_ebay_live_element_selector)) {
		observer.disconnect();
		remove_show_ebay_live_widget();
	}
}
