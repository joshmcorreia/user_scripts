// ==UserScript==
// @name         eBay Display Total Price
// @description  Easily see the total price of your order including shipping.
// @author       joshmcorreia
// @match        https://www.ebay.com/itm/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @version      1.0.0
// @namespace    https://greasyfork.org/users/1220845
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

// TODO: Support active bids breaking the price of the item.

const shipping_element_selector = ".d-shipping-minview";
const price_element_selector = ".x-price-section";
const BIN_price_element_selector = ".x-bin-price"
const bid_price_element_selector = ".x-bid-price"

/**
 * @param {String} input_string
 * @returns {*}
 */
function get_dollar_amount_from_string(input_string) {
	// We can't check if the string is exactly equal to "Free" because sometimes
	// it will be "Free delivery - Arrives before Christmas"
	if (input_string.includes("Free")) {
		return 0;
	}
	input_string = input_string.replace(/,/g, ''); // remove the commas from large numbers
	const number_regex = /[+-]?\d+(\.\d+)?/;
	try {
		let regex_match = input_string.match(number_regex).map(function(v) { return parseFloat(v); });
		if (regex_match != null) {
			return regex_match[0];
		}
		return null;
	} catch (err) {
		return null;
	}
}

/**
 * @param {String} input_string
 * @returns {String}
 */
function add_comma_to_dollar_amount(input_string) {
	if (input_string === undefined) {
		return undefined;
	}
	// Taken from https://stackoverflow.com/a/2901298
	return input_string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * @returns {Number}
 */
function get_primary_BIN_price() {
	let primary_BIN_price = document.querySelector(".x-bin-price .x-price-primary")?.textContent;
	let approximate_primary_BIN_price = document.querySelector(".x-bin-price .x-price-approx__price")?.textContent;
	let BIN_price = approximate_primary_BIN_price || primary_BIN_price;
	if (BIN_price) {
		BIN_price = get_dollar_amount_from_string(BIN_price);
	}
	return BIN_price;
}

/**
 * @returns {Number}
 */
function get_primary_bid_price() {
	// We have to get the last instance of the price since we add our own element containing the price
	// and eBay's weird dynamic element creation ends up copying the attributes of our element
	let bid_price_elements = document.querySelectorAll(".x-bid-price .x-price-primary");
	let primary_bid_price = bid_price_elements[bid_price_elements.length - 1]?.textContent;
	let approximate_primary_bid_price = document.querySelector(".x-bid-price .x-price-approx__price")?.textContent;
	let bid_price = approximate_primary_bid_price || primary_bid_price;
	if (bid_price) {
		bid_price = get_dollar_amount_from_string(bid_price);
	}
	return bid_price;
}

/**
 * @returns {Number}
 */
function get_shipping_price() {
	let primary_shipping_price = document.querySelector(".d-shipping-minview .ux-labels-values--shipping .ux-labels-values__values .ux-textspans")?.textContent;
	let primary_shipping_price_approximate = document.querySelector(".d-shipping-minview .ux-labels-values--shipping .ux-labels-values__values .ux-textspans--SECONDARY.ux-textspans--BOLD")?.textContent;
	let shipping_price = primary_shipping_price_approximate || primary_shipping_price;
	if (shipping_price != null) {
		return get_dollar_amount_from_string(shipping_price);
	}
	// Local pickup only
	return 0;
}

/**
 * @param {Number} item_price
 * @param {Number} shipping_price
 * @returns {String}
 */
function get_total_price(item_price, shipping_price) {
	let total_price = item_price + shipping_price;
	total_price = (Math.round(total_price * 100) / 100).toFixed(2); // always show 2 decimals
	total_price = add_comma_to_dollar_amount(total_price);
	return total_price;
}

/**
 * @param {String} shipping_price
 * @return {}
 */
function add_total_bid_price_to_page(shipping_price) {
	let primary_bid_price = get_primary_bid_price();
	let total_bid_price = get_total_price(primary_bid_price, shipping_price);
	if (total_bid_price === undefined) {
		return;
	}

	// Only add the total bid if the element doesn't already exist
	let bid_price_divs = document.querySelectorAll(".x-bid-price .x-price-primary");
	if (bid_price_divs.length >= 2) {
		console.log(`Too many bid price divs already exist.`);
		return;
	}

	let total_bid_price_div = document.createElement('div');
	total_bid_price_div.style = "color:DodgerBlue";
	total_bid_price_div.className = "x-price-primary";
	total_bid_price_div.id = "total_bid_price";
	total_bid_price_div.innerHTML = `<span class="ux-textspans">US $${total_bid_price}</span>`
	let bid_price_div = document.querySelector(".x-bid-price");
	bid_price_div.prepend(document.createElement('br'));
	bid_price_div.prepend(document.createElement('br'));
	bid_price_div.prepend(total_bid_price_div);
	console.log("Added total bid price to page.")
	return;
}

/**
 * @param {String} total_BIN_price
 * @return {}
 */
function add_total_BIN_price_to_page(total_BIN_price) {
	let total_BIN_price_div = document.createElement('div');
	total_BIN_price_div.style = "color:green";
	total_BIN_price_div.className = "x-price-primary";
	total_BIN_price_div.id = "total_BIN_price";
	total_BIN_price_div.innerHTML = `<span class="ux-textspans">US $${total_BIN_price}</span>`
	let BIN_price_div = document.querySelector(".x-bin-price__content");
	BIN_price_div.prepend(document.createElement('br'));
	BIN_price_div.prepend(total_BIN_price_div);
	console.log("Added total BIN price to page.")
	return;
}

// Found at https://www.reddit.com/r/GreaseMonkey/comments/undlw2/need_to_monitor_changes_to_a_specific_element_on/
const observeDOM = (fn, e = document.documentElement, config = { attributes: true, childList: true, subtree: true }) => {
	console.log("Created observer");
	const observer = new MutationObserver(fn);
	observer.observe(e, config);
	return () => observer.disconnect();
};

let num_BIN_rewrites = 0;
let max_BIN_rewrites = 3;
function rewrite_BIN_section(total_BIN_price_html_after_edit) {
	num_BIN_rewrites += 1;
	if (num_BIN_rewrites > max_BIN_rewrites) {
		console.log("Max num BIN rewrites exceeded!")
		return;
	}

	let before_edit_BIN_price_html = document.querySelector(BIN_price_element_selector).innerHTML;
	if (before_edit_BIN_price_html !== total_BIN_price_html_after_edit) {
		document.querySelector(BIN_price_element_selector).innerHTML = total_BIN_price_html_after_edit;
		console.log(`Rewrote the BIN section\n\n${before_edit_BIN_price_html}\n\n${total_BIN_price_html_after_edit}`)
	}
}

let total_BIN_price_html_after_edit = "";
function observe_price_loading(changes, observer) {
	if(document.querySelector(price_element_selector) && document.querySelector(shipping_element_selector)) {
		observer.disconnect();

		// The shipping price doesn't change so we can get it up front
		let shipping_price = get_shipping_price();

		if (document.querySelector(BIN_price_element_selector)) {
			let primary_BIN_price = get_primary_BIN_price();
			let total_BIN_price = get_total_price(primary_BIN_price, shipping_price);
			add_total_BIN_price_to_page(total_BIN_price);

			// Now that we edited the BIN price, we need to save a copy of the HTML so we
			// can overwrite eBay changing the page
			total_BIN_price_html_after_edit = document.querySelector(BIN_price_element_selector).innerHTML;

			// eBay has some code in place that dynamically re-writes the price elements multiple times
			// when the page loads and it ends up cloning the price element... That means that when I try
			// to change the color and add ids, the original price element ends up getting them too...
			// eBay appears to be using a templating language (you'll notice things like <!-- F/ -->) that
			// gets replaced as it retrieves information from the API. More information can be found at
			// https://innovation.ebayinc.com/stories/async-fragments-rediscovering-progressive-html-rendering-with-marko
			observeDOM(() => rewrite_BIN_section(total_BIN_price_html_after_edit), document.querySelector(BIN_price_element_selector));
		}

		if (document.querySelector(bid_price_element_selector)) {
			// Add the total bid price the first time - be warned that eBay will remove
			// this element shortly after it's added
			add_total_bid_price_to_page(shipping_price);

			// Now that we added the total bid price to the page, we need to detect when eBay removes it
			const ebay_removal_observer = new MutationObserver(function(mutationsList) {
				for (const mutation of mutationsList) {
					if (mutation.removedNodes.length != 0) {
						// if eBay removes our total price entry then we need to re-add it
						if (mutation.removedNodes[0].className == "x-price-primary") {
							console.log("eBay removed our entry!")
							add_total_bid_price_to_page(shipping_price);
						}
					}
				}
			});
			// We need to observe the parent of the prices in order to detect that the nodes are removed
			ebay_removal_observer.observe(document.querySelector(".x-bid-price"), config = { characterData: true, attributes: true, childList: true, subtree: true });
		}
	}
}

(new MutationObserver(observe_price_loading)).observe(document, {childList: true, subtree: true});
