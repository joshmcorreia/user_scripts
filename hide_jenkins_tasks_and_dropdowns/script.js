// ==UserScript==
// @name        Hide Jenkins tasks and dropdowns
// @namespace   Violentmonkey Scripts
// @match       https://jenkins.example.com/job/*/*
// @match       https://jenkins.example.com/
// @grant       none
// @version     1.0.0
// @author      joshmcorreia
// @license     MIT
// @description Hide Jenkins tasks and dropdowns by matching text
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/user_scripts

const side_panel_tasks_selector = "#tasks";
const tasks_selector = ".task";
const task_inner_text_selector = ".task-link-text";

const jenkins_dropdown_selector = ".jenkins-dropdown";
const jenkins_dropdown_item_selector = ".jenkins-dropdown__item";

// CONFIGURE ME
const excluded_tasks = [
	"Changes",
	"Timings",
	"Git Build Data",
	"Lockable resources",
	"Open Blue Ocean",
	"Restart from Stage",
	"Pipeline Steps"
];

function remove_excluded_tasks() {
	console.log("Removing excluded tasks...");
	var tasks = document.querySelectorAll(tasks_selector);
	for (const task of tasks) {
		var task_text = task.querySelector(task_inner_text_selector);
		if (task_text !== null && excluded_tasks.includes(task_text.textContent)) {
			task.remove();
			// console.log(`Removed excluded task \`${task_text.textContent}\``)
		}
	}
}

function remove_excluded_jenkins_dropdowns() {
	console.log("Removing excluded dropdowns...");
	var jenkins_dropdown_items = document.querySelectorAll(jenkins_dropdown_item_selector);
	for (const jenkins_dropdown_item of jenkins_dropdown_items) {
		var jenkins_dropdown_text = jenkins_dropdown_item.textContent.trim();
		if (excluded_tasks.includes(jenkins_dropdown_text)) {
			jenkins_dropdown_item.remove();
			// console.log(`Removed excluded task \`${jenkins_dropdown_text}\``)
		}
	}
}


(new MutationObserver(check_tasks)).observe(document, {childList: true, subtree: true});

function check_tasks(changes, observer) {
	if(document.querySelector(side_panel_tasks_selector)) {
		observer.disconnect();
		remove_excluded_tasks();
	}
}

(new MutationObserver(check_dropdowns)).observe(document, {childList: true, subtree: true});

function check_dropdowns(changes, observer) {
	if(document.querySelector(jenkins_dropdown_selector)) {
		remove_excluded_jenkins_dropdowns();
	}
}
