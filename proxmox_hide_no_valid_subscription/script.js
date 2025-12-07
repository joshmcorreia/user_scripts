// ==UserScript==
// @name        Hide Proxmox "No valid subscription" popup
// @namespace   Violentmonkey Scripts
// @match       https://*:8006/*
// @grant       none
// @version     1.0.0
// @author      joshmcorreia
// @description Hides the Proxmox "No valid subscription" popup after logging in.
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

// This is a fork of the https://greasyfork.org/en/scripts/426091-proxmox-autologin userscript, I changed it to
// no longer log in and use a MutationObserver instead of setInterval.

var SubscriptionDialogText = "No valid subscription";
var SubscriptionButtonText = "OK";

function findElementbyText(Elements, Text) {
	for (let Element of Elements) {
		if (Element.textContent == Text && window.getComputedStyle(Element).visibility != "hidden") {
			return Element;
		}
	}
}

function findElementbyTextoverParent(ParentElements, Text) {
	for (let Element of ParentElements) {
		var ElementStyle = window.getComputedStyle(Element);
		if (ElementStyle.display !== 'none') {
			var ElementChildren = Element.querySelectorAll("span");
			for (let ElementChild of ElementChildren) {
				if (ElementChild.textContent == Text) {
					return Element;
				}
			}
		}
	}
}

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
	var divTags = document.getElementsByTagName("div");
	var SubscriptionDialog = findElementbyText(divTags, SubscriptionDialogText);

	if (SubscriptionDialog != null) {
		var SubscriptionButton = findElementbyTextoverParent(SubscriptionDialog.parentElement.getElementsByTagName("a"), SubscriptionButtonText);
		if (SubscriptionButton != null) {
			SubscriptionButton.click();
		} else {
			findElementbyTextoverParent(SubscriptionDialog.parentElement.parentElement.parentElement.parentElement.nextElementSibling.getElementsByTagName("a"), SubscriptionButtonText).click();
		}
	}
}
