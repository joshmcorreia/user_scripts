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

// NOTE: Does not support "Local pickup only" by design. If you want to pick items up locally you probably shouldn't be using eBay.

// TODO: Support active bids breaking the price of the item.

const price_element_selector = ".x-price-section";
const BIN_price_element_selector = ".x-bin-price"

/**
 * @param {String} input_string
 * @returns {*}
 */
function get_dollar_amount_from_string(input_string) {
	if (input_string == "Free") {
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
	let primary_bid_price = document.querySelector(".x-bid-price .x-price-primary")?.textContent;
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
	shipping_price = get_dollar_amount_from_string(shipping_price);
	return shipping_price;
}

/**
 * @param {Number} item_price
 * @param {Number} shipping_price
 * @returns {String}
 */
function get_total_price(item_price, shipping_price) {
	if (item_price === undefined) {
		return undefined;
	}
	let total_price = item_price + shipping_price;
	total_price = (Math.round(total_price * 100) / 100).toFixed(2); // always show 2 decimals
	total_price = add_comma_to_dollar_amount(total_price);
	return total_price;
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
	if(document.querySelector(price_element_selector)) {
		observer.disconnect();

		let primary_BIN_price = get_primary_BIN_price();
		let shipping_price = get_shipping_price();
		let total_BIN_price = get_total_price(primary_BIN_price, shipping_price);
		if (total_BIN_price !== undefined) {
			add_total_BIN_price_to_page(total_BIN_price);

			// Now that we edited the BIN price, we need to save a copy of the HTML so we
			// can overwrite eBay changing the page
			total_BIN_price_html_after_edit = document.querySelector(BIN_price_element_selector).innerHTML;

			// eBay has some code in place that re-writes the price multiple times for some reason. I
			// originally thought it was to prevent scripts from editing the price on the page but
			// they're re-written regardless of if the element is edited or not.
			observeDOM(() => rewrite_BIN_section(total_BIN_price_html_after_edit), document.querySelector(BIN_price_element_selector));
		}
	}
}

(new MutationObserver(observe_price_loading)).observe(document, {childList: true, subtree: true});
