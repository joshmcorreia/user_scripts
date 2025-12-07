// ==UserScript==
// @name        Hide GitLab "GitLab Duo Core Off" Sidebar Widget
// @namespace   Violentmonkey Scripts
// @match       https://gitlab.*/*
// @grant       none
// @version     1.0.0
// @author      joshmcorreia
// @license     MIT
// @description Hides the GitLab "GitLab Duo Core Off" widget on the sidebar. GitLab introduced this garbage in 18.3
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

const duo_core_off_widget = "#duo-agent-platform-sidebar-widget";

function remove_duo_core_off_widget() {
	var duo_core_off_widget_selector = document.querySelector(duo_core_off_widget);
	duo_core_off_widget_selector.remove();
}

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
	if(document.querySelector(duo_core_off_widget)) {
		observer.disconnect();
		remove_duo_core_off_widget();
	}
}
