// ==UserScript==
// @name         eBay Display Total Price
// @description  Easily see the total price of your order including shipping.
// @author       joshmcorreia
// @match        https://www.ebay.com/itm/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @version      0.0.2
// @namespace    https://greasyfork.org/users/1220845
// @noframes
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

// It's awful to try to hook the document at document-start since eBay does a bunch
// of dynamic page rewriting, so I use document-end instead. This does make the total
// price element show up while the page is loading, but it beats trying to undo all of
// eBay's element changes.

const bid_price_element_selector = ".x-bid-price .x-price-primary .ux-textspans";

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
	if (item_price === undefined) {
		return undefined;
	}
	let total_price = item_price + shipping_price;
	total_price = (Math.round(total_price * 100) / 100).toFixed(2); // always show 2 decimals
	total_price = add_comma_to_dollar_amount(total_price);
	return total_price;
}

/**
 * @param {String} total_bid_price
 * @return {}
 */
function add_total_bid_price_to_page(total_bid_price) {
	let total_bid_price_div = document.createElement('div');
	total_bid_price_div.style = "color:DodgerBlue";
	total_bid_price_div.className = "x-price-primary";
	total_bid_price_div.id = "total_bid_price";
	total_bid_price_div.textContent = `US $${total_bid_price}`;
	document.querySelector(".x-price-section").prepend(total_bid_price_div);
	return;
}

function update_total_bid_price(total_bid_price) {
	let total_bid_price_element = document.querySelector('#total_bid_price');
	total_bid_price_element.textContent = `US $${total_bid_price}`;
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
	total_BIN_price_div.textContent = `US $${total_BIN_price}`;
	document.querySelector(".x-bin-price__content").prepend(document.createElement('br'));
	document.querySelector(".x-bin-price__content").prepend(total_BIN_price_div);
	return;
}

/**
 * @returns {}
 */
function add_total_price_to_page() {
	let primary_BIN_price = get_primary_BIN_price()
	let primary_bid_price = get_primary_bid_price()

	let total_BIN_price = get_total_price(primary_BIN_price, shipping_price);
	let total_bid_price = get_total_price(primary_bid_price, shipping_price);

	if (total_BIN_price !== undefined) {
		add_total_BIN_price_to_page(total_BIN_price)
	}
	if (total_bid_price !== undefined) {
		add_total_bid_price_to_page(total_bid_price)
	}
}

function document_observer(changes, observer) {
	if(document.querySelector(bid_price_element_selector)) {
		// wait for the bid section to load
		observer.disconnect();

		const bid_observer = new MutationObserver(function(mutationsList) {
			for (const mutation of mutationsList) {
				if (mutation.type == "characterData") {
					let primary_bid_price = get_primary_bid_price();
					let total_bid_price = get_total_price(primary_bid_price, shipping_price);
					if (total_bid_price !== undefined) {
						update_total_bid_price(total_bid_price);
					}
				}
			}
		});
		// We need to observe the parent of the prices in order to detect that the nodes are removed
		bid_observer.observe(document.querySelector(bid_price_element_selector), config = { characterData: true, attributes: true, childList: true, subtree: true });
	}
}

let shipping_price = get_shipping_price();
add_total_price_to_page();
(new MutationObserver(document_observer)).observe(document, config = { childList: true, subtree: true });
