// ==UserScript==
// @name        eBay Hide Live Streaming
// @namespace   Violentmonkey Scripts
// @match       https://www.ebay.com/itm/*
// @match       https://www.ebay.com/sch/*
// @run-at      document-start
// @grant       none
// @version     1.0.3
// @author      joshmcorreia
// @license     MIT
// @description Hides the "Live Streaming Now" widget at the top of the page.
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

const live_streaming_now_element_selector = ".x-ebay-live-banner";
const ebay_live_seller_card_selector = ".x-ebay-live-seller-card";
const shop_ebay_live_element_selector = ".srp-river-answer--EBAY_LIVE_ENTRY";

function remove_live_streaming_now_widget() {
	var live_streaming_element = document.querySelector(live_streaming_now_element_selector);
	live_streaming_element.remove();
	console.log("Removed live streaming now widget");
}

function remove_show_ebay_live_widget() {
	var show_ebay_live_element = document.querySelector(shop_ebay_live_element_selector);
	show_ebay_live_element.remove();
	console.log("Removed show ebay live widget");
}

function remove_ebay_live_seller_card() {
	var ebay_live_seller_card_element = document.querySelector(ebay_live_seller_card_selector);
	ebay_live_seller_card_element.remove();
	console.log("Removed ebay live seller card")
}

if (window.location.href.indexOf("ebay.com/itm/") != -1) {
	(new MutationObserver(observe_live_streaming_now)).observe(document, {childList: true, subtree: true});
	(new MutationObserver(observe_ebay_live_seller_card)).observe(document, {childList: true, subtree: true});
}
if (window.location.href.indexOf("ebay.com/sch/") != -1) {
	(new MutationObserver(observe_shop_ebay_live_element)).observe(document, {childList: true, subtree: true});
}

var num_times_triggered_observe_live_streaming_now = 0;
function observe_live_streaming_now(changes, observer) {
	if(document.querySelector(live_streaming_now_element_selector)) {
		num_times_triggered_observe_live_streaming_now += 1;
		remove_live_streaming_now_widget();
		// The live steaming popup comes up twice for some reason, so we need to remove both
		// before disconnecting the observer.
		if (num_times_triggered_observe_live_streaming_now >= 2) {
			observer.disconnect();
		}
	}
}

function observe_shop_ebay_live_element(changes, observer) {
	if(document.querySelector(shop_ebay_live_element_selector)) {
		observer.disconnect();
		remove_show_ebay_live_widget();
	}
}

var num_times_triggered_observe_ebay_live_seller_card = 0;
function observe_ebay_live_seller_card(changes, observer) {
	if(document.querySelector(ebay_live_seller_card_selector)) {
		num_times_triggered_observe_ebay_live_seller_card += 1;
		remove_ebay_live_seller_card();

		// The eBay live seller card pops up twice for some reason
		if (num_times_triggered_observe_ebay_live_seller_card >= 2) {
			observer.disconnect();
		}
	}
}
