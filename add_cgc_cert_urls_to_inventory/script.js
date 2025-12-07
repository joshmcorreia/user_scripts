// ==UserScript==
// @name         Add CGC Cert URLs to Inventory
// @description  Adds URLs to CGC certs on the inventory page.
// @author       joshmcorreia
// @match        https://www.cgccards.com/registry/trading-cards/profile/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @version      1.0.0
// @namespace    https://greasyfork.org/users/1220845
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

function add_links() {
	const cert_numbers = document.querySelectorAll(".collectible-listing td.collectible-listing-cert");

	cert_numbers.forEach(function(cert) {
		var cert_number = cert.innerText;
		var a_link = document.createElement('a');
		a_link.setAttribute('href', `https://www.cgccards.com/certlookup/${cert_number}`);
		a_link.innerHTML = cert_number;
		a_link.target="_blank"; // open in a new tab
		cert.innerHTML = "";
		cert.appendChild(a_link);
	})
}

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
	if(document.querySelector('.collectible-listing td.collectible-listing-cert')) {
		observer.disconnect();
		add_links();
	}
}
