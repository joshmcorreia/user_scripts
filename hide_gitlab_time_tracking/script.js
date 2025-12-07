// ==UserScript==
// @name        Hide GitLab time tracking
// @namespace   Violentmonkey Scripts
// @match       https://gitlab.example.com/*/*/-/merge_requests/*
// @grant       none
// @version     1.0.0
// @author      joshmcorreia
// @license     MIT
// @description Hide GitLab time tracking
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

const time_tracking_block_selector = ".time-tracking";

function remove_time_tracking_block() {
	var time_tracking_block = document.querySelector(time_tracking_block_selector);
	time_tracking_block.remove();
}

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
	if(document.querySelector(time_tracking_block_selector)) {
		observer.disconnect();
		remove_time_tracking_block();
	}
}
