// ==UserScript==
// @name        WatchCartoonOnline select highest quality
// @namespace   Violentmonkey Scripts
// @match       https://www.watchcartoononline.com/*
// @grant       none
// @version     1.0.0
// @author      joshmcorreia
// @license     MIT
// @description Selects the highest video quality for WatchCartoonOnline
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

const desired_quality = "FHD";

const quality_button_selector = ".vjs-quality-dropdown";

function set_quality() {
	var quality_button = document.querySelector(quality_button_selector);
	var li_elements = quality_button.getElementsByTagName("a");
	for (li_element of li_elements) {
		if (li_element.innerText == desired_quality) {
			console.log(`Selecting quality \`${desired_quality}\`...`)
			li_element.click();
			// hide the list now that we selected the quality
			quality_button.classList.remove("show");
		}
	}
}

function check_video_quality(changes, observer) {
	if(document.querySelector(quality_button_selector)) {
		observer.disconnect();
		set_quality();
	}
}

var old_changeVideo = window.changeVideo;
window.changeVideo = function() {
	var res = old_changeVideo.apply(this, arguments);
	// Add a mutation observer to set the quality once the new video frame exists, otherwise
	// set_quality() would be called before the new video element actually exists.
	(new MutationObserver(check_video_quality)).observe(document, {childList: true, subtree: true});
	return res;
}
