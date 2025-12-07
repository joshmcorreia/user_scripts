// ==UserScript==
// @name        eBay Hide Finance Options Below Price
// @namespace   Violentmonkey Scripts
// @match       https://www.ebay.com/itm/*
// @run-at      document-start
// @grant       none
// @version     1.0.1
// @author      joshmcorreia
// @license     MIT
// @description Hides the Finance options below the price.
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

const financing_details_selector = ".x-financing-details";

function remove_finance_info_under_price() {
	var finance_info_element = document.querySelector(financing_details_selector);
	finance_info_element.remove();
	console.log("eBay Hide Finance Options - User Script - Removed finance info under price.")
}

if (window.location.href.indexOf("ebay.com/itm/") != -1) {
	(new MutationObserver(observe_finance_info_under_price)).observe(document, {childList: true, subtree: true});
}

var num_times_triggered = 0;
function observe_finance_info_under_price(changes, observer) {
	if(document.querySelector(financing_details_selector)) {
		num_times_triggered += 1;
		remove_finance_info_under_price();
		// The finance info comes up twice for some reason, so we need to remove both
		// before disconnecting the observer.
		if (num_times_triggered == 2) {
			observer.disconnect();
		}
	}
}
