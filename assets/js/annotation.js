"use strict";

class DrawerManager {
    constructor() {
	this.drawers = new Map();
    }

    newDrawer(drawerElement) {
	const drawer = new Drawer(drawerElement, this);
	this.drawers.set(drawer.name, drawer);
    }
    renderAllHTML() {
	for (let [name, drawer] of this.drawers) {
	    drawer.renderHTML(drawer);
	}
	// console.log("Rendered Drawer HTMLs")
    }
}
function getPreviousParagraph(elem) {
    let prevElem = elem.previousElementSibling;
    while (prevElem && prevElem.tagName != 'P'){
	prevElem = prevElem.previousElementSibling;
    }
    return prevElem;
}
class Drawer {
    constructor(drawerElement, drawerManager) {
	this.drawerElement = drawerElement;
	this.headerHTML = '<div class="annotation drawerHeader">+</div>';
	this.drawerItems = new Map();
	this.drawerOpenItems = [];
	this.name = formatNoteReferenceText(drawerElement.getAttribute("data-v"));
	this.manager = drawerManager;
	this.topLevelHandlerElem = null;
	
	const annotations = getAnnotationsBySectionName(
	    formatNoteReferenceText(this.drawerElement.getAttribute("data-v")));
	for (let annotation of annotations) {
	    const drawerItem = new DrawerItem(annotation, this);
	    this.drawerItems.set(drawerItem.name, drawerItem);
	}
	this.drawerElement.insertAdjacentHTML('beforebegin', '<div class="annotation sectionDivider">~~</div>')
	if (this.drawerItems.has("~")) {
	    const sectionDividerElem = this.drawerElement.previousElementSibling;
	    sectionDividerElem.insertAdjacentHTML('beforebegin', '<span class="annotation topLevelDrawerItemHandle" data-v="~">↳</span>');
	    this.topLevelHandlerElem = sectionDividerElem.previousElementSibling;
	    //const paraElem = getPreviousParagraph(this.drawerElement);
	    //paraElem.insertAdjacentHTML('beforeend', '<span class="annotation topLevelDrawerItemHandle" data-v="~">!</span>');
	    // const topLevelHandlerElem = paraElem.lastChild;
	    this.topLevelHandlerElem.drawerItemReference = new DrawerItemReference(this.topLevelHandlerElem, this)
	    this.topLevelHandlerElem.addEventListener("click", this.onClickNote);
	}
    }
    
    renderHTML(self) {
	let htmlBuilder = "";
	// if (this.drawerItems.has("~")) {
	//     htmlBuilder = `<div class="annotation topLevelDrawerItemHandle">?</div>`;
	// }
	htmlBuilder = htmlBuilder + self.drawerOpenItems.reduceRight(
	    (acc, item) => acc+"\n"+item.toHTML(),
	    self.headerHTML);

	self.drawerElement.innerHTML = htmlBuilder;
	// console.log(self.drawerElement.innerHTML)
	this.linkRefnsInsideDrawerItem(null);
	for (const closeButtonElem of
	     self.drawerElement.querySelectorAll(".annotation.drawerItemHeaderClose")) {
	    closeButtonElem.addEventListener("click", this.onClickDrawerItemCloseButton);
	    closeButtonElem.drawer = this;
	}
    }
    onClickDrawerItemCloseButton(event) {
	const target = event.currentTarget;
	const drawer = target.drawer;
	console.log(target.parentElement.parentElement);
	
	for (const drawerItem of drawer.drawerOpenItems) {
	    if (drawerItem.address === target.getAttribute("data-v")) {
		drawer.closeItem(drawer, drawerItem);
		if (drawerItem.address === `${drawer.name}/~`) {
		    drawer.topLevelHandlerElem.style.visibility = "visible";
		}
	    }
	}
	drawer.renderHTML(drawer);
    }
    openItem(self, drawerItem) {
	if (self.drawerOpenItems.includes(drawerItem)) {
	    self.closeItem(self, drawerItem);
	}
	self.drawerOpenItems.push(drawerItem);
    }

    closeItem(self, drawerItem) {
	self.drawerOpenItems = self.drawerOpenItems.filter(
	    item => item !== drawerItem);

    }
    isItemOpen(self, drawerItem) {
	return self.drawerOpenItems.includes(drawerItem);
    }
    
    onClickNote(event) {
	const drawerItemReference = event.currentTarget.drawerItemReference;
	const drawer = drawerItemReference.parentDrawer;
	drawer.openItem(drawer, drawerItemReference.drawerItem);
	//if (drawer.isItemOpen(drawer, drawerItemReference.drawerItem)) {
	    //drawer.closeItem(drawer, drawerItemReference.drawerItem);
	    //drawerItemReference.noteElement.classList.remove("noteIsOpened");
	//} else {
	    //drawerItemReference.noteElement.classList.add("noteIsOpened");
	//}
	if (drawerItemReference.noteIDRaw === '~') {
	    drawer.topLevelHandlerElem.style.visibility = "hidden";
	}
	drawer.renderHTML(drawer);
	//console.log(drawerItemReference.noteElement);
    }
    registerNoteReference(note) {
	note.drawerItemReference = new DrawerItemReference(note, this)
    }
    registerExternalReference(refn) {
	refn.drawerItemReference = new DrawerItemReference(refn, this)
    }

    linkRefnsInsideDrawerItem(drawerManager) {
	const refns = this.drawerElement.querySelectorAll(".annotation.refn");
	for (let refn of refns) {
	    this.registerExternalReference(refn);
	}
    }
}

function formatNoteReferenceText(plainTextReference) { 
    return plainTextReference.replaceAll(" ", "-").toLowerCase();
}
function deformatNoteReferenceText(plainTextReference) { 
    return plainTextReference.replaceAll("-", " ");
}
class DrawerItem {
    constructor(annotation, drawer) {
	this.content = annotation.content;
	this.name = annotation.name;
	this.drawer = drawer;
	this.address = `${this.drawer.name}/${this.name}`;
    }
    toHTML() {
	let headerTitle = '';
	if (this.name === '~') {
	    headerTitle = '';
	} else {
	    headerTitle = deformatNoteReferenceText(this.name);
	}
	return `<div class="annotation drawerItem">
<table class="annotation drawerItemHeader">
<tr>
<th class="annotation drawerItemHeaderTitle">${headerTitle}</th>
<th class="annotation drawerItemHeaderClose" data-v=${this.address}>•</div>
</tr>
</table>
${this.content.reduce((acc, elem) => acc+"\n"+elem.outerHTML, "")}
</div>`;
    }
}

class DrawerItemReference {
    constructor(noteElement, parentDrawer) {
	this.noteElement = noteElement;
	this.parentDrawer = parentDrawer;
	this.referencedDrawer = parentDrawer;
	this.noteIDRaw = this.noteElement.getAttribute("data-v");
	
	if (this.noteIDRaw === "*") {
	    this.noteID = formatNoteReferenceText(this.noteElement.innerText);
	}
	else if (this.noteIDRaw.includes("/")) {
	    let [drawerID, noteIDRawSplit] = this.noteIDRaw.split("/");
	    drawerID = formatNoteReferenceText(drawerID);
	    this.noteID = formatNoteReferenceText(noteIDRawSplit);
	    this.referencedDrawer = this.parentDrawer.manager.drawers.get(drawerID);
	}
	else {
	    this.noteID = formatNoteReferenceText(this.noteIDRaw);
	}
	
	this.drawerItem = this.referencedDrawer.drawerItems.get(this.noteID);
	this.noteElement.addEventListener("click", this.parentDrawer.onClickNote);
    }
}

class Scheduler {
    constructor() {
	this.queue = [];
	this.delay = 100;
	this.environment = {};
    }
    add(envTag, item) {
	this.queue.push([envTag, item]);
    }
    static run(scheduler) {
	if (scheduler.queue.length != 0) {
	    let [envTag, nextFun] = scheduler.queue.shift();
	    setTimeout(function () {
		scheduler.environment[envTag] = nextFun(scheduler);
		Scheduler.run(scheduler);
	    }, scheduler.delay);

	}
    } 
}

var drawerManager;
var scheduler;
function onPageLoad() {
    scheduler = new Scheduler();
    scheduler.add('nil',
		  sch => loadAnnotationData());
    scheduler.add('drawerMgr',
		  sch => setupAnnotationDrawers());
    scheduler.add('nil',
		  sch => sch.environment['drawerMgr']
		  .renderAllHTML());
    scheduler.add('nil',
		  sch => linkNotes(sch.environment['drawerMgr']))
    scheduler.add('nil',
		  sch => linkRootTextRefn(sch.environment['drawerMgr']))
    // scheduler.add('nil',
    // 		  sch => console.log("Completed Initialization."))
    Scheduler.run(scheduler);
}


function loadAnnotationData() {
    const annotation_div = document.querySelector(".annotation.annotationfile");
    const annotation_url = annotation_div.getAttribute('data-v') + '.html';
    fetch(annotation_url).then(function (response) {
	if (response.ok) {
	    return response.text();
	}
	console.error(`Failed to load annotation file {annotation_url}`);
    }).then((text) => annotation_div.innerHTML = text);
    // console.log("Loaded Annotation Data");
}

function linkElementtoDrawer(drawers, elements, registerElement){
    let currentDrawerIndex = 0;
    if (drawers.length == 0) {
	console.error('No Drawers in Document!');
	return;
    }
    for (let element of elements) {
	while (element.compareDocumentPosition(
	    drawers[currentDrawerIndex].drawerElement)
	       & Node.DOCUMENT_POSITION_PRECEDING) {
	    currentDrawerIndex++;
	    if (currentDrawerIndex >= drawers.length) {
		console.error(`Note has no associated drawer:\n ${element}`);
		return;
	    }
	}
	registerElement(drawers[currentDrawerIndex], element);
    }
}
function linkNotes(drawerManager) {
    linkElementtoDrawer(Array.from(drawerManager.drawers.values()),
			document.querySelectorAll(".annotation.n"),
			(drawer, element) =>
			drawer.registerNoteReference(element));
    // console.log("Linked Notes to Drawers");
}
		       
function linkRootTextRefn(drawerManager) {
    const annotation_div =
	  document.querySelector(".annotation.annotationfile");
    const refnElements = Array.from(
	document.querySelectorAll(".annotation.refn")).filter(
	    (item) => !(item.compareDocumentPosition(annotation_div) &
		    Node.DOCUMENT_POSITION_CONTAINS));
    linkElementtoDrawer(Array.from(drawerManager.drawers.values()),
			refnElements,
			(drawer, element) =>
			drawer.registerExternalReference(element));
    // console.log("Linked Refn to Drawers");
}

function linkAnnotationFileRefn() {
    const annotation_div =
	  document.querySelector(".annotation.annotationfile");
    const refnElements = Array.from(
	document.querySelectorAll(".annotation.refn").filter(
	    (item) => !(item.compareDocumentPosition(annotation_div) &
		    Node.DOCUMENT_POSITION_CONTAINS)));
    linkElementtoDrawer(drawerManager.values(),
			refnElements,
			(drawer, element) =>
			drawer.registerExternalReference(element));
    // console.log("Linked Refn to Drawers");
}

function getAnnotationsBySectionName(name) {
    const annotation_div = document.querySelector(
	".annotation.annotationfile");
    const section_heading = annotation_div.querySelector(`#${name}`);
    const annotations = []
    
    let elem = section_heading.nextElementSibling;
    let note = {"name": "~", "content": []};
    while (elem != null && elem.tagName.toLowerCase() !== "h1") {
	if (elem.tagName.toLowerCase() === "h2") {
	    if (note.content.length != 0) {
		annotations.push(note);
	    }
	    note = {"name": elem.id, "content": []};
	} else {
	    note.content.push(elem);
	}
	elem = elem.nextElementSibling;
    }
    if (note.content.length != 0) {
	annotations.push(note);
    }
    return annotations;
}

function setupAnnotationDrawers() {
    const drawerElements = document.querySelectorAll(".annotation.section");
    const drawerManager = new DrawerManager();
    for (let drawerElement of drawerElements) {
	drawerManager.newDrawer(drawerElement);
    }
    // console.log("Set Up Annotation Drawers");
    return drawerManager;
}
document.addEventListener("DOMContentLoaded", onPageLoad);
