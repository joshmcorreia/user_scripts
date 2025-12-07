// ==UserScript==
// @name         eBay Highlight Low Feedback
// @description  Easily highlight sellers with low feedback.
// @author       joshmcorreia
// @match        https://www.ebay.com/itm/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @version      1.0.0
// @namespace    https://greasyfork.org/users/1220845
// @noframes
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

const feedback_selector = ".x-sellercard-atf_main";

var RED_FEEDBACK_THRESHHOLD=0;
var ORANGE_FEEDBACK_THRESHHOLD=10;

function get_feedback_number() {
	let feedback_number_string = document.querySelector(".x-sellercard-atf .x-sellercard-atf__info__about-seller .x-sellercard-atf__about-seller .ux-textspans")?.textContent;
	let int_regex = /\d+/;
	let feedback_number = feedback_number_string.match(int_regex);
	return feedback_number;
}

function highlight_seller_with_color(color) {
	let seller_card_div = document.querySelector(".x-sellercard-atf_main");
	seller_card_div.style = `background: ${color}`;
}

function check_feedback() {
	let feedback_number = get_feedback_number();
	if (feedback_number <= RED_FEEDBACK_THRESHHOLD) {
		highlight_seller_with_color("#d11d1d");
	}
	else if (feedback_number <= ORANGE_FEEDBACK_THRESHHOLD) {
		highlight_seller_with_color("#F28C28");
	}
}

(new MutationObserver(observe_feedback_element)).observe(document, {childList: true, subtree: true});

function observe_feedback_element(changes, observer) {
	if(document.querySelector(feedback_selector)) {
		observer.disconnect();
		check_feedback();
	}
}
