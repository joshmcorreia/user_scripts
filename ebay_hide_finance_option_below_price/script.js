// ==UserScript==
// @name        eBay Hide Finance Options Below Price
// @namespace   Violentmonkey Scripts
// @match       https://www.ebay.com/itm/*
// @grant       none
// @version     1.0.0
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

function observe_finance_info_under_price(changes, observer) {
	if(document.querySelector(financing_details_selector)) {
		observer.disconnect();
		remove_finance_info_under_price();
	}
}
