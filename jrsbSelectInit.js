//	jrsbSelectInit.js
//	Copyright 2022  James Rhodes
//	Copyright 2020, 2021, 2022  Pacific Northwest University of Health Sciences

//	jrsbSelectInit.js is a component of the "Slide Box" part of "Multifocal-plane Virtual Microscope"
//		(also "Multifocal-plane Virtual Microscope System"),
//		which is an internet web-based program that displays digitally-scanned microscopic specimens.
//	The "Multifocal-plane Virtual Microscope" consists of two modules:
//		-- "SlideBox", which searches and displays a list of available slides
//		-- "Viewer", which displays the selected slide
//	Both components of the "Multifocal-plane Virtual Microscope System":  the "Viewer" and "SlideBox"
//		are free software:  you can redistribute it and/or modify it under the terms of
//		the GNU General Public License as published by the Free Software Foundation, either version 3
//		of the License, or any later version.  See <https://www.gnu.org/licenses/gpl-3.0.html>
// 	"Multifocal-plane Virtual Microscope System" ("Viewer" and "Slide Box") is distributed in the hope 
//		that it will be useful, but WITHOUT ANY WARRANTY; without even the 
//		implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
//		See the GNU Public License for more details.
//	jrsbSelectInit.js is part of the "SlideBox"
//	Currently, the "slide box" part of "Multifocal-plane Virtual Microscope" consists of 
//		11 principal files and other supplementary files:
//		- one HTML file
//		- one cascading style sheet 
//		- eight javascript files (including this file)
//		- one PHP file.
//	Questions concerning the "Multifocal-plane Virtual Microscope" may be directed to:
//		James Rhodes, PhD.
//		1923 S. 44th Avenue
//		Yakima, WA  98903

// jrsbSelectInit.js contains =>
//		initialization functions that are called when the slide box is initialized or resized
//	this file was created on 11/12/21 by splitting jrsbSelect.js (created on 5/25/20) into two files:
//		this file (jrsbSelectInit.js) and jrsbSelectAction.js


// *********************************************************
// ******           initialization functions          ******
// ******          build boxes for search page        ******
// *********************************************************
 

	// prgInitSldBox is called when the program is loaded.  It initializes variables
	//		and centers boxes.  It then calls initBuildLeft to build the left-side of the
	//		"slide selection" page
function prgInitSldBox() {
	var i;
		// institution-specific intialization
	var tmpNode = null;
			// add title to document head
	if ((glbInSTitle != null) && (glbInSTitle != "")) {
		tmpNode = document.getElementsByTagName("TITLE")[0];
		if (tmpNode == null) {
			alert("prgInitSldBox(): could not get node for <title>.\n\nPlease report this error");
			}
		else { tmpNode.text = glbInSTitle; }
		}
			// add favicon to document head
	if ((glbInSFavIco != null) && (glbInSFavIco != "")) {
		tmpNode = document.createElement("LINK");
		if (tmpNode == null) {
			alert("prgInitSldBox(): could not create <link> for \"favicon\" (\"" + glbInSpFavIco 
					+ "\").\n\nPlease report this error");
			}
		else {
			tmpNode.rel = "icon";
			tmpNode.type = "image/png";
			tmpNode.href = glbInSFavIco;
			document.head.appendChild(tmpNode);
			if (document.head.appendChild(tmpNode) == null) {
				alert("prgInitSldBox(): could not append node for \"favicon\" <link> (\"" + glbInSpFavIco 
						+ "\") to the document head.\n\nPlease report this error");
				}
			}
		}
	else {
		alert("prgInSpInit(): no \"favicon\" was found.\n\nPlease report this error");
		}
			// add institution-specific logo to "special" buttons
	const btnLogoLst = document.getElementsByClassName("menuBtnLogoClass");
	if ((glbInSBtnLogo != null) && (glbInSBtnLogo != "")) {
		for (i = 0; i < btnLogoLst.length; i++) {
			btnLogoLst[i].src = glbInSBtnLogo;
			if (glbInSBtnBkgClr != null) { btnLogoLst[i].style.backgroundColor = glbInSBtnBkgClr; }
			}
		}
	prgBuildAbtMnu();   // build "About" menu
	tchInitMainMenu();  // adds touchEvent eventListeners to main menu
		// 2/02/22 call to tchGlbClrInit() replaces EventListener that calls tchTestMus()
		//	(document.addEventListener("touchstart",function(){tchTestMus()});)
		//	tchTestMus(), which called tchGlbClrInit(), also is deleted.
	tchGlbClrInit(); // adds touch, onmousedown/up event listeners to background, instruction, & title nodes
		// add touch events to "aboutBoxMv" button
		//	probably can clean this up ... derived from more general 'infoBox move' scenario in viewer
		//		and there is only one info box in SlideBox
	var btnNode = document.getElementById("aboutBoxMv");
	if (btnNode == null) {
		alert("prgInitSldBox(): cannot get node for the button that moves the \"About\" information box; "
					+ "this prevents moving these boxes on a touchscreen device.\n\nPlease report this error.");
		}
	else {
		btnNode.addEventListener("touchstart",function() {aboutBxTchStrt(event,this);});	
		btnNode.addEventListener("touchmove",function() {aboutBxTchMv(event);});
		btnNode.addEventListener("touchend",function() {aboutBxTchUp(event,this);});
		btnNode.addEventListener("touchcancel",function() {aboutBxTchUp(event,this);});	
		}
			// get window parameters
	prgGetScrlWdth();
	prgGetNumCol();
		// build left-side & menu of "search page"
	initBuildLeft();
	menuBuildSrtBy();
			// center box
	srchSldBoxCenter();
		// build right-side of first ("search") page
	prgInitRghtSide();
	return;
	}

	// the right side of the search page contains institution-specific text & logo
	//	prgInitRghtSide() is called by prgInitSldBox() to initialize this part of the
	//	search page using data from jrsbInSpcGlobal.js
function prgInitRghtSide() {
	const logoPad = 10;  // padding for institution logo
	var titleNode = document.getElementById("srchPageTitle");
	if (titleNode == null) {
		alert("prgInitRghtSide(): cannot get node for title box; cannot set program title to: \"" 
				+ glbInSIntroTitle.replace(/nbsp;/g," ") + "\n\nPlease report this error.");
		return;}
	else if ((glbInSIntroTitle != null) && (glbInSIntroTitle != "")){ 
		titleNode.innerHTML = glbInSIntroTitle;
		}
			// initialize instructions at top of right-side
	var instrTopNode = document.getElementById("srchInstrTop");
	if (instrTopNode == null) {
		alert("prgInitRghtSide(): cannot get node for \"search\"-page instruction box.&nbsp; "
				+ "The right-side of the \'search\' page cannot be displayed."
				+ "\n\nPlease report this error.");
		return;
		}
	else if ((glbInSInstrTxt != null) && (glbInSInstrTxt != "")){ 
		instrTopNode.innerHTML = glbInSInstrTxt;
		}
			// initialize copyright statement at bottom of right-side
	var instrBotNode = document.getElementById("srchInstrBot");
	if (instrBotNode == null) {
		alert("prgInitRghtSide(): cannot get node for \"search\"-page copyright box.&nbsp; "
				+ "The right-side of the \'search\' page cannot be displayed."
				+ "\n\nPlease report this error.");
		return;
		}
	else if ((glbInSInstrCpyRt != null) && (glbInSInstrCpyRt != "")){ 
		instrBotNode.innerHTML = glbInSInstrCpyRt;
		}
			// insert & resize institution-specific logo
		// rghtSideWd be 400px as set by jrsbStyleMain.css → srchRightClass
		//	but using .clientWidth automatically corrects for changes in jrsbStyleMain.css
	var rghtSideWd = instrTopNode.clientWidth;
		// get nodes for logo box & logo image
	var logoBxNode = document.getElementById("srchLogo");  // this is the <DIV> that holds the logo image, NOT the image
	if (logoBxNode == null) {
		alert("prgInitSldBox(): cannot get node for logo box; cannot adjust size of right side of search page."
					+ "\n\nPlease report this error");
		return;
		}
	var logoImgNode = document.getElementById("srchLogoImg");
	if (logoImgNode == null) {
		alert("prgInitSldBox(): cannot get node for logo image.  The logo size cannot be adjusted "
					+ "and the logo cannot be replaced with the appropriate institution-specific logo."
					+ "\n\nPlease report this error");
		return;
		}
	logoImgNode.src = glbInSIntroLogo;
			// origLogoDblCntr is the width of the original (unadjusted) logo + offside space if logo is off-center
	var origLogoDblCntr = glbInSLogoCntr * 2;
	if (origLogoDblCntr < glbInSLogoWdth) { origLogoDblCntr = (glbInSLogoWdth - glbInSLogoCntr) * 2;}
			// set height of logo box
	var logoBxHt = document.getElementById("srchLeftSide").offsetHeight
					- titleNode.offsetHeight
					- instrTopNode.offsetHeight
					- instrBotNode.offsetHeight
//					- 1  // not clear why we need this (srchRightClass does NOT have a border), but may need it in some instances
// With Chrome: PNWU-specific right-side has correct height without subtracting the mysterious pixel for both monitors
//		Chipmunk right-side is too long (by one pixel) if we don't subtract mysterious pixel for both monitors
// With FireFox: PNWU is correct on both monitors without subtracting pixel
//		Chipmunk right side is too long for laptop monitor, and correct for extra monitor (after reloading) without subtracting
					;  // NOTE: this semicolon belongs to definition of logoBxHt
	logoBxNode.style.height = logoBxHt + "px";
			// if logoWd is small enough, use logoHt as basis for resizing logo
	var logoHt = logoBxHt - (2 * logoPad);
	var logoDblCntr = Math.round(logoHt * (origLogoDblCntr/glbInSLogoHt));  // logo + offside space after adjusting new logoHt
	var logoWd = Math.round(logoHt * (glbInSLogoWdth/glbInSLogoHt));
	var logoLft;
	if ((logoWd + (2 * logoPad)) < rghtSideWd) { // use logoHt for sizing logo; logo can be offcenter
		logoImgNode.style.height = logoHt + "px";
		logoImgNode.style.width = logoWd + "px";
		logoImgNode.style.top = logoPad + "px";
				// if there is room && logo is off-center, center image on glbInSLogoCntr (adjusted for scaling)
		if ((logoDblCntr + (2 * logoPad)) < rghtSideWd) {
			logoLft = Math.floor((rghtSideWd-logoDblCntr)/2);
			if ((glbInSLogoCntr * 2) < origLogoDblCntr) { logoLft += logoDblCntr - logoWd; }
			}
		else { // not enough room to center on glbInSLogoCntr, center logo & then shift off-center.
			logoLft = Math.floor((rghtSideWd-logoWd)/2);
			if (((glbInSLogoCntr * 2) < origLogoDblCntr) && (logoLft > logoPad)) {
				logoLft += Math.round((logoLft - logoPad)/2);
				} 
			else if (((glbInSLogoCntr * 2) > origLogoDblCntr) && (logoLft > logoPad)) {
				logoLft -= Math.round((logoLft - logoPad)/2);
				}
			}
		logoImgNode.style.left = logoLft + "px";
		}
		// if logo is too wide => recalculate logo size using logoDblCntr as the image width
	else {
		logoDblCntr = rghtSideWd - (2 * logoPad);
		logoHt = Math.round(logoDblCntr * (glbInSLogoHt/origLogoDblCntr));
		logoWd = Math.round(logoDblCntr * (glbInSLogoWdth/origLogoDblCntr));
		if ((glbInSLogoCntr * 2) < origLogoDblCntr) { logoLft = logoPad + logoDblCntr - logoWd; }
		else { logoLft = logoPad; }
		logoImgNode.style.height = logoHt + "px";
		logoImgNode.style.width = logoWd + "px";
		logoImgNode.style.left = logoLft + "px";
		logoImgNode.style.top = (Math.floor((logoBxHt-logoHt)/2)) + "px";
		}
	return;
	}

		// Added 5/08/22
		// Uses glbInSAbtLst[] to build the "About" drop-down menu
function prgBuildAbtMnu() {
	var i;
	var mnuNode = document.getElementById("menuDrpDwnAbout");
	if (mnuNode == null) {
		alert("prgBuildAbtMnu():  Cannot get the node for \"About\" menu content.  The \"About\" drop-down menu cannot be created."
				+ "\n\nPlease report this error.");
		return;
		}
	if ((glbInSAbtLst == null) || (glbInSAbtLst.length == 0)) {
				// no "About" menu items, hide "About" button
		mnuNode = mnuNode.parentNode;  // get node for menu drop-down container
		if ((mnuNode == null) || !(mnuNode.className.includes("menuDrpDwnContainer"))) {
			alert("prgBuildAbtMnu():  Cannot get the node for the \"About\" menu container.  "
					+ "There are no items in the \"About\" drop-down menu, but this menu will still be displayed."
					+ "\n\nPlease report this error.");
			return;
			}
		else {
			mnuNode.style.display = "none";
			alert("This version of the Slide Box is missing the \"About\" menu, "
					+ "which should have included copyright and license information.  "
					+ "Please notify the website administrator of this deficiency.  "
					+ "The copyright and license notice is embedded within the underlying HTML code and "
					+ "can be viewed using your browser\'s \"Web Developer's Tools\".")
			return;
			}
		}
	var lstSz = glbInSAbtLst.length;
	var itmNode = null;
				// loop through list of "About" menu items
	for (i = 0; i < lstSz; i++) {
				// create menu item & append to "About" menu content
		itmNode = document.createElement("DIV");
		if (itmNode == null) {
			alert("prgBuildAbtMnu():  could not create <DIV> for \"About\" menu item #" + i 
					+ ".  No further items will be added to the \"About\" menu.\n\nPlease report this error.");
			return;
			}
		if ((glbInSAbtLst[i].mnuId != null) && (glbInSAbtLst[i].mnuId != "")){
			itmNode.id = glbInSAbtLst[i].mnuId;
			}
		itmNode.className = glbInSAbtLst[i].mnuCls;
		itmNode.innerHTML = glbInSAbtLst[i].mnuTxt;
		if (glbInSAbtLst[i].mnuClk != null) { itmNode.onclick = glbInSAbtLst[i].mnuClk; }
				// touchevent handler added by tchInitMainMenu()
		if (mnuNode.appendChild(itmNode) == null) {
			alert("prgBuildAbtMnu():  Cannot append node for item #" + i 
						+ " to the \"About\" menu. No further items will be added to the \"About\" menu."
						+ "\n\nPlease report this error.");
			return;
			}
		}
	return;
	}		





	// prgResizeSldBox() is called when the window receives an "onResize" event
function prgResizeSldBox() {
	var lstWdth;
	var wndHt;  // height of window
	var boxSpc;  // height of space in window that is available for lstBox
	var boxHt;  // height of lstBox
	var pageTop;  // top of lstPage
	var boxTop;  // offset of top of lstBox
	if (document.getElementById("lstPage").style.display == "block") {
				// center list-page horizontally but do NOT change number of columns
		lstWdth = (glbSldItmWdth * glbColNum) + (glbSldItmHMrg * (glbColNum -1)) + 2;
		if (glbIsLstVScrl && !Number.isNaN(glbScrlWdth)) { lstWdth += glbScrlWdth; }
		lstWndHCenter(lstWdth);
			// if no Y-axis scroll bar, the broswer provides the main window with
			//	a vertical scrollbar (if needed), and there is no need to adjust
			//	the list-box (lstWnd) within the list page (lstPage).  However,
			//	we need to handle situation where list-box has a vertical scroll-bar
		if (glbIsLstVScrl) {
			wndHt = window.innerHeight; 
			boxTop = lstGetBoxTop();
			boxSpc = wndHt - boxTop - 4;
			boxHt = lstBoxHt();
			if (boxHt > boxSpc) {  // list is bigger than space
				document.getElementById("lstPage").style.height = "100%";
				document.getElementById("lstWnd").style.height = boxSpc + "px";
				document.getElementById("lstPage").style.top = "0px";
				}
			else {  // more space than needed, shorten lstPage height
				document.getElementById("lstPage").style.height = (boxTop + boxHt) + "px";
				pageTop = boxSpc - boxHt;
				if (pageTop > 20) { pageTop = 20; }
				else if (pageTop < 0) { pageTop = 0; }
				document.getElementById("lstPage").style.top = pageTop + "px";
				}
			}  // end "if VScrl"
		}  // end "if lstPage displayed"
	else if (document.getElementById("srchPage").style.display != "none") {
		srchSldBoxCenter();
		prgGetNumCol();   // recalculate the number of columns
		}
	else {
		alert("prgResizeSldBox(): There doesn\'t seem to be anything displayed."
					+ "\n\n  Please report this error.");
		}
	return;
	}

	// scroll-width (glbScrlWth) is needed to calculate the number of columns, we only want
	//	to get the scroll-width once, since we need hide windows in order to get the scroll-width.
	//	prgGetScrlWdth() will be called on loading; srchPage will initially be hidden and will be
	//  	used to calculate scroll width. After saving scroll-width as a global variable,
	//		prgGetScrlWdth will set srchPage.style.visibility to "visible".

function prgGetScrlWdth() {
	wndNode = document.getElementById("srchPage");
	if (wndNode == null) {
		alert("prgGetScrlWdth():  unable to get node for \"srchPage\".  This is a lethal error"
					+ "\n\n  Please report this error.");
		return;
		}
	wndNode.style.visibility = "hidden";
	wndNode.style.display = "block";
			// get width of scroll bar
	wndNode.style.overflowY = "hidden";
	glbScrlWdth = wndNode.clientWidth;
	wndNode.style.overflowY = "scroll";
	glbScrlWdth -= wndNode.clientWidth;
	wndNode.style.overflowY = "";
	wndNode.style.visibility = "visible";
	return;
	}

function prgGetNumCol(){
	var colWdth = glbSldItmWdth + glbSldItmHMrg;
	var wndWdth = window.innerWidth - glbScrlWdth - 4;  // assume scroll bar is present + margins are 2px
	glbColNum = Math.floor(wndWdth/colWdth);
	if (glbColNum <= 0) { glbColNum = 1; }
	return;	
	}


	// re-written 1/02/22 - 1/??/22 to handle multiple drop-down side-menus and to re-position sidemenus if
	//	they drop off the bottom of the window.  Currently, srchSldBoxCenter() does NOT left-position
	//	subsidiary side-menus if they extend past the right-side of the window; instead, it resets the width of
	//	of sbBkgrd, which adds a scroll-bar to sbBkgrd.
	// NOTE: whenever lstPage is displayed, the width and height of sbBkgrd MUST be reset to "", since lstPage
	//	assumes that sbBkgrd has height = 100% and width = 100% (the default values specifid in jrsbStyleMain.css) 
	// srchSldBoxCenter():
	//	 - gets the window size and the height of srchPage without drop-down menus, and keeps track of the maximum
	//		height of srchPage plus drop-down menus
	//	 - reiteratively for each set of drop-down menu's
	//		 - calculates the top and height of menu.
	//		 - if bottom of menu extends below bottom of window and below bottom of srchPage, the top of the menu is
	//			repositioned so that it's bottom is opposite it's parent menu-item
	//		 - if bottom is below current maxPageNMenu, resets maxPageNMenu
	
	// boxWdth = srchLeftSide (386px) + (number of side menus (3) * width of menu (260px)) = 1166

function srchSldBoxCenter() {
			// get nodes for background <div> & search page
	var ndBkg = document.getElementById("sbBkgrd");
	if (ndBkg == null) {
		alert("srchSldBoxCenter(): could not get node for \"background\".  "
				+ "Cannot adjust SlideBox\'s size & position.\n\nPlease report this error");
		return;
		}
	var ndBox = document.getElementById("srchPage");
	if (ndBox == null) {
		alert("srchSldBoxCenter(): could not get node for \"srchPage\".  "
				+ "Cannot adjust SlideBox\'s size & position.\n\nPlease report this error");
		return;
		}
			// center search page+menus. 
			//	If search page+menus is bigger than browser's window, set width of background <div> so
			//	there is a scroll-bar that allows the user to scroll the search page to the left.
	const boxWdth = 1140;  // srchLeftSide (386px) + (number of side menus (3) * width of menu (250px)) + borders
	var wndWdth = window.innerWidth;
	var wndHt = window.innerHeight;
	var boxLeft;
	var boxHt = ndBox.clientHeight;
	if (wndHt < boxHt) { wndWdth -= glbScrlWdth; }  // make room for scrollbar
	if (wndWdth < boxWdth) {
		ndBkg.style.width = boxWdth + "px";
		boxLeft = 0;
		wndHt -= glbScrlWdth;  // make room for scrollbar
		}
	else {
		ndBkg.style.width = "";
		boxLeft = Math.floor((wndWdth - boxWdth)/2);
		}
			// get maxHt (& possibly adjust submenu positions)
	var i;
	var arrSz = glbSrchMainArr.length;
	const headerHt = 51; // main menu = 45px, spacer = 4px, offset of dropdown menu = 2px
	var maxHt = boxHt;  // maximum height of search page+menus
	var curHt;
	var curNode;
	for (i = 0; i < arrSz; i++) {
		curNode = document.getElementById(glbSrchMainArr[i].txtId + "CrtMain");
		if (curNode == null) {
			alert("srchSldBoxCenter(): cannot get node for \"" + glbSrchMainArr[i].txtNm
					+ "\" criterion box. Cannot adjust SlideBox\'s size & position.\n\nPlease report this error");
			return;
			}
		curHt = srchDrpDwnCenter(glbSrchMainArr[i].sdArr, curNode.offsetTop + headerHt, wndHt, boxHt);
		if (curHt == null) { return; }  // srchDrpDwnCenter() already has issued error message
		if (curHt > maxHt) { maxHt = curHt; }
		}
	
	var boxTop = 0;
	curHt = wndHt - maxHt;
	if (curHt > 80) { boxTop = 40; }
	else if (curHt > 0 ) { boxTop = Math.floor(curHt/2); }
	ndBox.style.left = boxLeft + "px";
	ndBox.style.top = boxTop + "px";
	return;	
	}

	// srchDrpDwnCenter() is called reiteratively (initially by srchSldBoxCenter()
	//	to get the height and, potentially, adjust the position of each side-submenu
	// The function is passed:
	//	 - the array corresponding to the submenu, 
	//	 - the top (in pixels) of the item (in the parent menu) that opens the submenu,
	//		relative to the absolute top of SlideBox's search page. If the menu isn't too long, 
	//		this top value corresponds to the top of the menu.
	//	 - the height of the browser's window.  Passing this variable seemed more efficient than
	//		recalculating it with each iteration.
	//	 - the height of SlideBox's search page without any menus
	// The function:
	//	 - gets the nodes corresponding to the menu's drop-down box & container.
	//	 - sets the top of the dropdown menu.  If the menu fits within the browser's window, this
	//		is the default value (-2px relative to item in the parent menu).  If the menu would
	//		extend past the bottom of the browser's window, the menu is 'flipped-up' so the bottom
	//		of the menu aligns with the bottom of the item in the parent menu.  The function
	//		currently DOES NOT CHECK to see if the menu would extend above the top of the search page.
	//	 - keeps track of the maximum height of the search page + menus.
	// The function returns the maximum height of the search page + menus.  On error it returns null.
function srchDrpDwnCenter(subArr, itmTop, wndHt, boxHt) {
	var i;
	var arrSz = subArr.length;
	var maxHt = boxHt;
			  // get node for drop-down menu box
	var ddNode = document.getElementById("sdItm_" + subArr[0].txtId).parentNode;  // get node for drop-down menu box
	if (ddNode == null) {
		alert("srchDrpDwnCenter(): could not find parent node for \"" + subArr[0].txtId 
				+ "\".  Cannot adjust SlideBox\'s size & position.\n\nPlease report this error");
		return(null); 
		}
	if ((ddNode.className != "crtSbMnuBoxClass") 
			&& (ddNode.className != "crtDropDownBoxClass crt1ColDropDownBoxClass")) {
		ddNode = ddNode.parentNode;
		if (ddNode.className != "crtDropDownBoxClass crt2ColDropDownBoxClass") {
			alert("srchDrpDwnCenter(): parent node for \"" + subArr[0].txtId + "\" is not a drop-down menu.  "
					+ "Cannot adjust SlideBox\'s size & position.\n\nPlease report this error");
			return(null); 
			}
		}
			  // get node for drop-down menu container
	var contNode = ddNode.parentNode;  // get node for drop-down menu box
	if (contNode == null) {
		alert("srchDrpDwnCenter(): could not find container node for \"" + subArr[0].txtId 
				+ "\".  Cannot adjust SlideBox\'s size & position.\n\nPlease report this error");
		return(null); 
		}
	if ((contNode.className != "crtSbMnuContainerClass") 
			&& (contNode.className != "crtSideContainerClass crt2ColSideContainerClass")
			&& (contNode.className != "crtSideContainerClass crt1ColSideContainerClass")) {
		alert("srchDrpDwnCenter(): container node for \"" + subArr[0].txtId + "\" is not a drop-down menu.  "
				+ "Cannot adjust SlideBox\'s size & position.\n\nPlease report this error");
		return(null); 
		}
	contNode.style.visibility = "hidden";
	contNode.style.display = "block";

			// set drop-down menu position
	var ddHt = ddNode.offsetHeight;
	var ddTop = itmTop;
	var curHt = ddTop + ddHt;
	if ((curHt > wndHt) && (curHt > boxHt)) {  // menu is too long, flip menu up
		ddTop = 30 - ddHt;
		contNode.style.top = ddTop + "px";
		ddTop += itmTop
		}
	else {
		contNode.style.top = "";
		if (curHt > maxHt) { maxHt = curHt; }
		}
			// 'center' any sub-arrays and include sub-arrays in maxHT
	var subNode;
	var subTop;
	for (i = 0; i < arrSz; i++) {
		if (subArr[i].arrSub == null) { continue; }
		subNode = document.getElementById("sdItm_" + subArr[i].txtId);
		if (subNode == null) {
			alert("srchDrpDwnCenter(): could not find node for \"" + subArr[i].txtNm 
						+ "\".  Cannot adjust SlideBox\'s size & position."
						+ "\n\nPlease report this error");
			return(null); 
			}
		subTop = subNode.offsetTop + ddTop;
		curHt = srchDrpDwnCenter(subArr[i].arrSub, subTop, wndHt, boxHt);
		if (curHt == null) { return(null); }  // error occured in reiterative call to srchDrpDwnCenter()
		if (curHt > maxHt) { maxHt = curHt; }
		}
	contNode.style.display = "";
	contNode.style.visibility = "";
	return(maxHt);
	}


	// initBuildLeft() reiteratively calls initBuildCrtNode() to create crtMain boxes for each
	//	entry in glbSrchMainArr, and then inserts these nodes into the left side of the srch window
function initBuildLeft() {
	var i;
	var mainSz = glbSrchMainArr.length;
	var mainNode;
	var leftNode = document.getElementById("srchLeftSide");
	if (leftNode == null) {
		alert("initBuildLeft(): can\'t get node for left side.  Can\'t create \"selection\" part of window, "
					+ "so you can\'t limit what slides are displayed.\n\n  Please report this error.");
		return;
		}
	for (i = 0; i < mainSz; i++) {
		mainNode = initBuildCrtNode(i);
		if (mainNode == null) { return; }  // initBuildCrtNode() will generate error message
		leftNode.appendChild(mainNode);
		}
	return;
	}

	// initBuildCrtNode() creates a crtMain node using the data in glbSrchMainArr[arrI]
	//	It returns the newly created node.  On error, it returns null
function initBuildCrtNode(arrI) {
	if ((arrI < 0) || (arrI >= glbSrchMainArr.length)) {  // illegal value for arrI
		alert("initBuildCrtNode(): an index into glsSrchMainArr[] must be between 0 and "  
				+ (glbSrchMainArr.length -1) + ".  The value for arrI (\"" + arrI 
				+ "\") is illegal.  Can\'t create this \"limit search\" entry."
				+ "\n\n  Please report this error.");
		return(null);
		}
			// create main node (crtMainBoxClass)
	var mainNode = document.createElement("div");
	if (mainNode == null) {
		alert("initBuildCrtNode(): could not create a node for the \"" +  
				+ glbSrchMainArr[arrI].txtNm.toLowerCase() + "\" entry in the \"selection\" window, " 
				+ "so you can\'t limit what slides are displayed.\n\n  Please report this error.");
		return(null);
		}
	mainNode.className = "crtMainBoxClass";
	mainNode.id = glbSrchMainArr[arrI].txtId + "CrtMain";
		// add event handlers
	mainNode.addEventListener("touchstart",function() {tsrchCrtMainDwn(this,event)});
	mainNode.addEventListener("touchend",function() {tsrchCrtMainUp(this,event)});
	mainNode.addEventListener("touchcancel",function() {tsrchCrtMainUp(this,event)});
	mainNode.onmousedown = function(){tsrchCrtMainDwn(this,event)};
	mainNode.onclick = function(){tsrchCrtMainUp(this,event)};
		// added 2/04/22
	mainNode.onmouseover = function(){srchMusOvrMainCrt(this);}
	mainNode.onmouseout = function(){srchMusOutMainCrt(this);}
			// add first line & drop-down menu
	var tmpNode = initBuildContainer(arrI);
	if (tmpNode == null) { return(null); }  // error message created by initBuildContainer
	mainNode.appendChild(tmpNode);
			// add second line
	if (glbSrchMainArr[arrI].isTxt) { tmpNode = initBuildTwoTxt(arrI); }  // 2nd line is text input
	else { tmpNode = initBuildLineTwo(arrI); }  // 2nd line is startVal and endVal boxes
	if (tmpNode == null) { return(null); }  // error message created by initBuildLineTwo
	mainNode.appendChild(tmpNode);

	return(mainNode);
	}

		// initBuildContainer() creates the first line of the "selection criteria" box, and (via
		//		a call to initBuildDrpDwn()) the associated menu.  The function is passed an
		//		an index into glbSrchMainArr[] indicating which selection-criterion is being built.
		//	Function returns node to drop-down container element.  On error, it returns null
function initBuildContainer(arrI){
	var i;
	var cntrNode = document.createElement("div");
	if (cntrNode == null) {
		alert("initBuildContainer(): could not create a node for drop-down container for the \"" +  
				+ glbSrchMainArr[arrI].txtNm.toLowerCase() + "\" entry in the \"selection\" window, " 
				+ "so you can\'t limit what slides are displayed.\n\n  Please report this error.");
		return(null);
		}
	cntrNode.className = "crtDrpDwnContainerClass";
		// tried to add cntrNode.onmouseover = srchHideArrows() & cntrNode.onmouseout=srchShowArrows()
		//	here, but the mouseout call on 1st line (cntrNode) conflicted with onmouseover call to the
		//	drop-down menu (crtSideContainerClass).  It would be complicated and not worthwhile to try
		//	make other criterion box arrows disappear before the mouse moves over the drop-down menu.
		//	11/21/20
			// create side-menu
	var tmpNode = initBuildDrpDwn(arrI);
	if (tmpNode == null) { return; } // intitBuildDrpDwn() or subsidiary fxn handle error message
	cntrNode.appendChild(tmpNode);
			// create name, arrow & shwVal nodes
	for (i=0; i < 3; i++) {
		tmpNode = document.createElement("div"); 
		if (tmpNode == null) {
			alert("initBuildContainer(): could not create one of the first-line nodes for the \"" +  
					+ glbSrchMainArr[arrI].txtNm.toLowerCase() 
					+ "\" entry in the \"selection\" window.\n\n  Please report this error");
			return(null);
			}
				// create name node
		if (i == 0) {
			tmpNode.className = "crtNameClass";
			tmpNode.innerHTML = glbSrchMainArr[arrI].txtNm + ":";
			}
				// create arrow node
		else if (i == 1) {
			tmpNode.className = "crtArrowClass";
			tmpNode.innerHTML = "&#10132;&#10148; ";
			tmpNode.id = glbSrchMainArr[arrI].txtId + "Arrow";
			}
				// create shwVal node
		else if (i == 2) {
			tmpNode.className = "crtShwValClass";
			tmpNode.id = glbSrchMainArr[arrI].txtId + "ShwVal";
			tmpNode.innerHTML = "any slide";  // initial value for valStrg = "(-1,-1)"
			}
		else {
			alert("initBuildContainer(): illegal value (i = " + i 
					+ " in loop when creating the first-line of the \"" +  
					+ glbSrchMainArr[arrI].txtNm.toLowerCase() 
					+ "\" entry in the \"selection\" window.\n\n  Please report this error");
			return(null);
			}
		cntrNode.appendChild(tmpNode);
		}
	return(cntrNode);
	}


		// initBuildLineTwo() is passed an index to glbSrchMainArr[].  It builds a node (class=crtRowTwoClass)
		//		for the criterion listed in glbSrchMainArr[arrI] (class=crtRowTwoClass) that contains the
		//		text-edit boxes for entering a specific range of values.  
		//	The function returns the node to the second-line of the criteria box.  On error it returns null
function initBuildLineTwo(arrI) {
	var i;
	var lineNode = document.createElement("div");
	if (lineNode == null) {
		alert("initBuildLineTwo(): could not create a node for the second-line of the \"" +  
				+ glbSrchMainArr[arrI].txtNm.toLowerCase() + "\" entry in the \"selection\" window." 
				+ "\n\n  Please report this error.");
		return(null);
		}
	lineNode.className = "crtRowTwoClass";
	lineNode.id = glbSrchMainArr[arrI].txtId + "RowTwo";
	var tmpNode;
	for (i = 0; i < 4; i++) {
		if ((i%2) == 0) { tmpNode = document.createElement("span"); } // even-numbered elements are "span"
		else { tmpNode = document.createElement("input"); }  // text-input boxes
		if (tmpNode == null) {
			alert("initBuildLineTwo(): could not create one of the nodes for the second line of the \""  
					+ glbSrchMainArr[arrI].txtNm.toLowerCase() 
					+ "\" entry in the \"selection\" window.\n\n  Please report this error");
			return(null);
			}
		if (i == 0) { tmpNode.innerHTML = "start number:&nbsp;&nbsp;"; }  // fill-in first span
		else if (i == 2) { tmpNode.innerHTML = "&nbsp;&nbsp;end number:&nbsp;&nbsp;"; }  // fill-in 2nd span
				// create input
		else if ((i == 1) || (i ==3)) { // create text-input boxes
			tmpNode.setAttribute("type","text");
			tmpNode.className = "crtStEndValClass";
			if (i == 1) {
				tmpNode.id = glbSrchMainArr[arrI].txtId + "StrtVal";
				tmpNode.value = 0;
				}
			else {
				tmpNode.id = glbSrchMainArr[arrI].txtId + "EndVal";
				tmpNode.value = "maximum";
				}
			tmpNode.onblur = function() { srchLoseFocus(this); };  // added 1/22/22
			tmpNode.onfocus = function() { srchSetGlbPrevFocus(this) };  // added 1/22/22
			tmpNode.onchange = function(){srchTxtInp(this);};
				// 1/27/22 added touchevents to text-input boxes and event.stopPropagaction to 
				//	tsrchCrtMainDwn/Up() => touchevents on these text-input now occur directly
				//	on these boxes rather than on the parent main-criterion box
				//	Focus is now provided from within tsrchCrtMainDwn/Up(), rather than from
				//	an ontouchstart =  = function (){this.focus(); event handler
			tmpNode.ontouchstart = function (){tsrchCrtMainDwn(this,event); };  // added 1/27/22
			tmpNode.ontouchend = function (){tsrchCrtMainUp(this,event); };  // added 1/27/22
			tmpNode.ontouchcancel = function (){tsrchCrtMainUp(this,event); };  // added 1/27/22
// START HERE 2/08/22
			tmpNode.onmousedown = function (){srchTxtMusEvt(this,event); };  // added 2/08/22
			tmpNode.onclick = function (){srchTxtMusEvt(this,event); };  // added 2/08/22
// END HERE 2/08/22
			}
		else {
			alert("initLineTwo(): illegal value (i = " + i 
					+ " in loop when creating the second-line of the \"" +  
					+ glbSrchMainArr[arrI].txtNm.toLowerCase() 
					+ "\" entry in the \"selection\" window.\n\n  Please report this error");
			return(null);
			}
		lineNode.appendChild(tmpNode);
		}
	return(lineNode);
	}

	// initBuildTwoTxt() created 11/10/21
	// initBuildTwoTxt() builds the 2nd line of the criterion box for criteria that use text searching
	//	The function is passed an integer corresponding to the index of the criterion box in glbSrchMainArr[]
	//	The function returns the node to the second-line of the criteria box.  On error it returns null
function initBuildTwoTxt(arrI) {
	var lineNode = document.createElement("div");
	if (lineNode == null) {
		alert("initBuildTwoTxt(): could not create a node for the second-line of the \"" +  
				+ glbSrchMainArr[arrI].txtNm.toLowerCase() + "\" entry in the \"selection\" window." 
				+ "\n\n  Please report this error.");
		return(null);
		}
	lineNode.className = "crtRowTwoClass";
	lineNode.id = glbSrchMainArr[arrI].txtId + "RowTwo";
	var tmpNode;
	   // create <span> to hold identifier string
	tmpNode = document.createElement("span");
	if (tmpNode == null) {
		alert("initBuildTwoTxt(): could not create the node for the text-string in the second line of \""   
				+ glbSrchMainArr[arrI].txtNm.toLowerCase() 
				+ "\" entry in the \"selection\" window.\n\n  Please report this error");
		return(null);
		}
	lineNode.appendChild(tmpNode);
	   // create text-input box to hold search string entered by user
	tmpNode.innerHTML = "text:&nbsp;&nbsp;";
	tmpNode = document.createElement("input");
	if (tmpNode == null) {
		alert("initBuildTwoTxt(): could not create the node for the text-input box in the second line of the \""  
				+ glbSrchMainArr[arrI].txtNm.toLowerCase() 
				+ "\" entry in the \"selection\" window.\n\n  Please report this error");
		return(null);
		}
	tmpNode.setAttribute("type","text");
	tmpNode.className = "crtSrchTxtClass";
	tmpNode.id = glbSrchMainArr[arrI].txtId + "SrchText";
	tmpNode.value = "";
	tmpNode.onblur = function() { srchLoseFocus(this); };  // added 1/22/22
	tmpNode.onfocus = function() { srchSetGlbPrevFocus(this) };  // added 1/22/22
	tmpNode.onchange = function(){ srchTxtSrchValidate(this); };
			// 1/27/22 added touchevents to text-input boxes and event.stopPropagaction to 
			//	tsrchCrtMainDwn/Up() => touchevents on these text-input now occur directly
			//	on these boxes rather than on the parent main-criterion box
			//	Focus is now provided from within tsrchCrtMainDwn/Up(), rather than from
			//	an ontouchstart =  = function (){this.focus(); event handler
	tmpNode.ontouchstart = function (){tsrchCrtMainDwn(this,event); };  // added 1/27/22
	tmpNode.ontouchend = function (){tsrchCrtMainUp(this,event); };  // replaces call to main criterion box
	tmpNode.ontouchcancel = function (){tsrchCrtMainUp(this,event); };  // replaces call to main criterion box
// START HERE 2/08/22
	tmpNode.onmousedown = function (){srchTxtMusEvt(this,event); };  // added 2/08/22
	tmpNode.onclick = function (){srchTxtMusEvt(this,event); };  // added 2/08/22
// END HERE 2/08/22
	lineNode.appendChild(tmpNode);
	return(lineNode);
	}

	// initBuildDrpDwn() builds the side menu for a criterion box on the srch ("selection") page.
	//	It is passed an index into glbSrchMainArr[] corresponding to the current criterion box.
	//	It returns a node to the newly created side-menu (including the side-container <div>).
	//		On error, it returns null.
function initBuildDrpDwn(mainI) {
	var i;
		// contNode is a container that holds the side-menu box.  It overlaps the right edge of the 
		//		left-side (i.e., the rest of the criterion box) to ensure that the side menu displays
		//		correctly when the mouse moves from hovering over the first-line of criterion box
		//		to hovering over side menu
	var contNode = document.createElement("div");
	if (contNode == null) {
		alert("initBuildDrpDwn(): could not create the container for the drop-down side-menu for \"" +  
				+ glbSrchMainArr[mainI].txtNm.toLowerCase() + "\" entry in the \"selection\" window." 
				+ "\n\n  Please report this error.");
		return(null);
		}
		// 11/21/20 added code for two columns
	var is2Col = false;
	if (glbSrchMainArr[mainI].numCol == 2) { is2Col = true; } 
	if (is2Col) {
		contNode.className = "crtSideContainerClass crt2ColSideContainerClass";
		}
	else {
		contNode.className = "crtSideContainerClass crt1ColSideContainerClass";
		}
	contNode.id = "crtSdCntr_"+ glbSrchMainArr[mainI].txtId;
		// added 11/21/20 => shows/hides other arrows
	contNode.onmouseover = function(){srchHideArrows(mainI)};
//	contNode.onmouseover.bubbles = true;  // commented out 2/04/22; this does nothing .bubbles is read-only
	contNode.onmouseout = function(){srchShowArrows()};  // show ALL arrows; don't need mainI
//	contNode.onmouseout.bubbles = true;  // commented out 2/04/22; this does nothing .bubbles is read-only
	
		// ddBoxNode is the side-menu box
	var ddBoxNode = document.createElement("div");
	if (ddBoxNode == null) {
		alert("initBuildDrpDwn(): could not create a node for the drop-down side-menu for \"" +  
				+ glbSrchMainArr[mainI].txtNm.toLowerCase() + "\" entry in the \"selection\" window." 
				+ "\n\n  Please report this error.");
		return(null);
		}
		// two parts to side-menu class; second part (width) depends on number of columns.
//	ddBoxNode.className = "crtDropDownBoxClass";
	if (is2Col) {
		ddBoxNode.className = "crtDropDownBoxClass crt2ColDropDownBoxClass";
		}
	else {
		ddBoxNode.className = "crtDropDownBoxClass crt1ColDropDownBoxClass";
		}
	contNode.appendChild(ddBoxNode);
		// get sidemenu array
	var sdArr = glbSrchMainArr[mainI].sdArr;  // 11/07/21 replaces switch statement assigning sdArr on basis of mainTxtId
	var sdArrSz = sdArr.length;
	var itmNode;  // node for holding single item in side menu
	var extNode;  // extra node to hold two columns
	var sdHalfArrSz = Math.floor((sdArrSz - 1)/2);
	var j = sdHalfArrSz;  // index for item in right column
	if (is2Col) {
		extNode = document.createElement("div");
		if (extNode == null) {
			alert("initBuildDrpDwn(): could not create the extra node for the two column "
				+ "drop-down side-menu for \"" + glbSrchMainArr[mainI].txtNm.toLowerCase() 
				+ "\" entry in the \"selection\" window." 
				+ "\n\n  Please report this error.");
			return(null);
			}
		for (i = 0; j < sdArrSz; i++) {
					// create node[i]
			itmNode = initAddSdItm(sdArr[i],false);
			if (itmNode == null) { return(null); } // initAddSdItm() already displayed error message
			j = i + sdHalfArrSz;
			if (i == 0) { extNode.appendChild(itmNode); }
			else if ((i > 0) && (j < sdArrSz)) {
					// add node[i] to left column
				itmNode.style.width = "50%";
				itmNode.style.cssFloat = "left";
				itmNode.style.borderRight = "1px solid black";
				extNode.appendChild(itmNode);
					// create node[j]  and add to right column
				itmNode = initAddSdItm(sdArr[j],false);
				if (itmNode == null) { return(null); } // initAddSdItm() already displayed error message
				itmNode.style.width = "50%";
				itmNode.style.cssFloat = "right";
				itmNode.style.borderLeft = "1px solid black";
				extNode.appendChild(itmNode);
				}
			else {  // node[sdArrSz-1] ("specific range") still left; add full width at bottom
				j = sdArrSz -1;
				itmNode = initAddSdItm(sdArr[j],false);
				if (itmNode == null) { return(null); } // initAddSdItm() already displayed error message
				extNode.appendChild(itmNode);
				}
			j++;
			}
		extNode.style.width = "100%"
		extNode.style.height = (i*28) + "px";
		ddBoxNode.appendChild(extNode);
		}
	else {  // choices are listed in order as a single column
		for (i=0; i < sdArrSz; i++) {
			itmNode = initAddSdItm(sdArr[i],false);
				// START HERE  - 12/09/21
				// need to release memory associated with contNode if error occurs.
				//  I think the correct way to handle this is contNode.remove() before return(null)
				//	Debug this AFTER we get the sub-sidemenus & text search working.
				//	This problem/error also occurs earlier in this function
			if (itmNode == null) { return(null); } // initAddSdItm() already displayed error message
			ddBoxNode.appendChild(itmNode);
			}
		}
	return(contNode);
	}

	// initAddSdItm() is passed an object consisting of one entry from one of the global
	//		side array menus and a boolean variable (isFirst).  If (isFirst == true),
	//		"any " is inserted before sdArrObj.txtNm in the item name field
	//	The function builds the corresponding <div> for the side-menu.
	//	The function returns the newly created side-item node.  On error, it returns null.		
	// 12/07/21 => function changed to accommodate sub-sidemenus.
	//	The function now tests to see if there is a sub-sidemenu (sdArrObj.arrSub == null).
	//	 - if there is no sub-sidemenu, the function attaches the onClick & touchEvent handlers
	//		to the drop-down menu-item.
	// 	 - if there is a sub-sidemenu, the function calls initAddSubMenu() to build the sub-sidemenu.
function initAddSdItm(sdArrObj,isFirst) {
	const itmTxtWd = 238;  //item text box is 250pixel with 5px left/right padding
	const itmArrWd = 26;  // width of arrow?
	var txtNmStr = sdArrObj.txtNm;
	var tmpNode = null;  // node to hold elements within itmNode
	var errStr = "";
	var i;
	var itmNode = document.createElement("div");
	if (itmNode == null) {
		alert("initAddSdItm(): could not create node for an item in the side-menu item (id = \"" 
				+ sdArrObj.txtId + "\") for one of the \"Limit slides by ...\" boxes." 
				+ "\n\n  Please report this error.");
		return(null);
		}
	itmNode.className = "crtSideItmClass";
	itmNode.id = "sdItm_" + sdArrObj.txtId;
	if (sdArrObj.arrSub == null) { // no sub-menu, selection is made by clicking this item.
		if (isFirst) {
			txtNmStr = "any " + sdArrObj.txtNm.toLowerCase().replace(/\bgi\b/g,"GI");
			}
		itmNode.innerHTML = initReszTxt(txtNmStr,itmTxtWd);
				// 2/06/22: for onclick event, added call to tsrchStripDDLst() before
				//	calling srchMenuInp(); this saves having to write a separate
				//	function for the onclick event
		itmNode.onclick = function(){srchMenuInp(this,event);} ;
		itmNode.onmousedown = function() {event.stopPropagation(); };  // added 2/05/22
		itmNode.addEventListener("touchstart",function() {tsrchSdBtnDwn(this,event)});
		itmNode.addEventListener("touchend",function() {tsrchSdBtnUp(this,event)});
		itmNode.addEventListener("touchcancel",function() {tsrchSdBtnUp(this,event)});
		} 
	else { // build sub-sidemenu
				// call initBuildSbMnu() to create container for sub-sidemenu.
		tmpNode = initBuildSbMnu(sdArrObj.arrSub);  // tmpNode currently is the container node for the sub-menu
		if (tmpNode == null) {
				// initBuildSbMnu() already issued error message
				// treat this entry as a "no submenu" entry
			if (isFirst) {
				txtNmStr = "any " + sdArrObj.txtNm.toLowerCase().replace(/\bgi\b/g,"GI");
				}
			itmNode.innerHTML = initReszTxt(txtNmStr,itmTxtWd);
			itmNode.onclick = function(){srchMenuInp(this,event);} ;
			itmNode.onmousedown = function() {event.stopPropagation(); };  // added 2/05/22
			itmNode.addEventListener("touchstart",function() {tsrchSdBtnDwn(this,event)});
			itmNode.addEventListener("touchend",function() {tsrchSdBtnUp(this,event)});
			itmNode.addEventListener("touchcancel",function() {tsrchSdBtnUp(this,event)});
			} 
		else {
				// add submenu container node to itmNode	
			itmNode.appendChild(tmpNode);
			itmNode.onclick = function() {tsrchArrBtnUp(this,event);} ;
			itmNode.onmousedown = function(){srchMusDwnSdArr(this,event);} ;
			itmNode.onmouseover	= function(){srchSbMnuDisp(this, event);} ;		
			itmNode.onmouseout	= function(){srchSbMnuDisp(this, event);} ;		
			itmNode.addEventListener("touchstart",function() {tsrchArrBtnDwn(this,event);});
			itmNode.addEventListener("touchend",function() {tsrchArrBtnUp(this,event);});
			itmNode.addEventListener("touchcancel",function() {tsrchArrBtnUp(this,event);});
				// add text & arrow to item in current drop-down menu.
			for (i = 0; i < 2; i++) {
				tmpNode = document.createElement("div");
						// if tmpNode cannot be created, the program does NOT abort.  Instead, it creates the
						//	entry without the missing "name" or "arrow" component.
				if (tmpNode == null) {
					errStr = "initAddSdItm(): could not create ";
					if (i == 0) { errStr += "text-"; }
					else if (i == 1) { errStr += "arrow-"; }
					else { errStr += "unknown "; }
					errStr += "node for the \"" + sdArrObj.txtId.toLowerCase();
					errStr += "\" side-menu entry in the \"selection\" window.\n\n  Please report this error.";
					alert(errStr);
					break;
					}
				if (i == 0) {  // text field ... don't need id.
					tmpNode.className = "crtSbMnuNameClass";
					if (isFirst) {
						txtNmStr = "any " + sdArrObj.txtNm.toLowerCase().replace(/\bgi\b/g,"GI");
						}
					tmpNode.innerHTML = initReszTxt(txtNmStr,itmTxtWd - itmArrWd);
					}
				else if (i == 1) {
					tmpNode.className = "crtSbMnuArrowClass";
					tmpNode.innerHTML = "&#10132;&#10148; ";
//					tmpNode.innerHTML = "&#10132;&#10148;&nbsp;&nbsp;&nbsp;&nbsp;";
					tmpNode.id = sdArrObj.txtId + "Arrow";
					}
				else {  // i can only be 0 or 1
					errStr = "initAddSdItm(): illegal value (i=" + i + ") in \"for\" loop.";
					errStr += "\n\n  Please report this error."
					}
				itmNode.appendChild(tmpNode);			
				}  // end for loop adding txtNm & arrow to principal menu item
			} // end else "container node NOT null"
		
		}  // end else "item has submenu => build submenu
	return(itmNode);
	}

	// initReszTxt() is passed a text-string (to be formated for a side-menu item), and an integer indicating
	//	the string's maximum length in pixels.  initReszTxt() writes the string to <div id=resizeTxtBox> to 
	//	get its offsetWidth.  If the string is shorter than the specified maximum length, initReszTxt() returns
	//	the original string.  If the string is longer than the specified size, the function uses a
	//	<span style='font-size:xx%> tag to force the text into the specified space, and returns the <span>'d
	//	string.  On error it returns an empty string.

function initReszTxt(strOrig, intSz) {
	var strTxt = strOrig;
	var pctSz;
	var nodeTestBox = document.getElementById("resizeTestBox");
	if (nodeTestBox == null) {
		alert("initReszTxt() could not find \"resizeTestBox\", so the name of the item \"" + strTxt 
				+ "\" cannot be displayed in the drop-down side menu.\n\nPlease report this error.");
		return("");		
		}
	nodeTestBox.style.display = "block";
	var nodeTxtBox = document.getElementById("resizeTxtBox");
	if (nodeTxtBox == null) {
		alert("initReszTxt() could not find \"resizeTxtBox\", so the name of the item \"" + strTxt 
				+ "\" cannot be displayed in the drop-down side menu.\n\nPlease report this error.");
		return("");		
		}
	nodeTxtBox.innerHTML = strTxt;
	var strWd = nodeTxtBox.offsetWidth;
	if (strWd > intSz) {
		pctSz = Math.floor(100*intSz/strWd);
		strTxt = "<span style='font-size:" + pctSz + "%'>" + strOrig + "</span>";
		}	
	nodeTestBox.style.display = "none";
	return(strTxt);
	}

	// initBuildSbMnu(sbMnuArr) is passed the array that will be used to create the sub-sidemenu.
	// 	The first element in the passed array (sbMnuArr[0] corresponds to selecting "any slide in this group",
	//		so sbMnuArr[0].txtName.toLowerCase() is the name of the principal menu item.
	// initBuildSbMnu() 
	//	- creates a container node that overlaps on the left (by a couple of pixels only) the right side of 
	//		the principal drop-down menu (to ensure that we don't "lose" the menu when the user moves the cursor).
	//		NOTE:  this will need to be revised when slidebox handles smeall monitor-screens by putting side
	//			menus on the left.
	//	- creates ddBox node which holds box for new sideMenu.
	//	- repetitively calls initAddSdItm(sdArrObj) to populate ddBox.  Note: be careful with reiterative calls
	//		here since initAddSdItm() may call initBuildSbMenu().
	//		Remember to and "any" to beginning of txtName for sbMnuArr[0]
	// On error, delete container node (contNode.remove()), if it exists (to free memory) and return null. 

function initBuildSbMnu(sbMnuArr) {
	var i;
			// BUILD CONTAINER
		// contNode is a container that holds the side-menu box.  It overlaps the right edge of the 
		//		left-side (i.e., the rest of the criterion box) to ensure that the side menu displays
		//		correctly when the mouse moves from hovering over the first-line of criterion box
		//		to hovering over side menu
	var contNode = document.createElement("div");
	if (contNode == null) {
		alert("initBuildSbMnu(): could not create the container for the drop-down submenu for \"" +  
				+ sbMnuArr[0].txtNm.toLowerCase() + "\" entry in the \"selection\" window." 
				+ "\n\n  Please report this error.");
		return(null);
		}
		// for now, the sub-sidemenu must be a single column.  Except for the added
		//	code complexity, there is no reason why a submenu couldn't be 2-column
	contNode.className = "crtSbMnuContainerClass";
		  // z-index increases with increasing number of submenus; rnk determines depth of submenu
	contNode.style.zIndex = sbMnuArr[0].rnk;
		// strip "any" out of txtId for sbMnuArr[0].
		//	container Id will be "crtSdCntr_" + txtId for sbMnuArr[0] without the "any";
		//		most likely the first character after "crtSdCntr_" will be a capital letter 
	contNode.id = "crtSdCntr_" + sbMnuArr[0].txtId.slice(3);
		// BUILD SIDEMENU BOX:  ddBoxNode is the side-menu box
	var ddBoxNode = document.createElement("div");
	if (ddBoxNode == null) {
		alert("initBuildSbMnu(): could not create a node for the drop-down submenu for the \"" +  
				+ sbMnuArr[0].txtNm.toLowerCase() + "\" entry in the \"selection\" window." 
				+ "\n\n  Please report this error.");
		contNode.remove();
		return(null);
		}
	ddBoxNode.className = "crtSbMnuBoxClass";

	contNode.appendChild(ddBoxNode);
	var arrSz = sbMnuArr.length;
	var itmNode;
	for (i=0; i < arrSz; i++) {
		if (i == 0) { itmNode = initAddSdItm(sbMnuArr[i],true); }
		else { itmNode = initAddSdItm(sbMnuArr[i],false); }
		if (itmNode == null) {  // initAddSdItm() already displayed error message
			contNode.remove();
			return(null);
			}
		ddBoxNode.appendChild(itmNode);
		}
	return(contNode);
	}


// *************************************************************************
// ******                      display functions                      ******
// ******  handles onmouseover & onmouseout display of sub-sidemenus  ******
// *************************************************************************

	// srchSbMnuDisp() called by an event handler for mouseover or mouseout
	//	events on a side menu item that has a submenu attached.
	// The function finds the node for the submenu container and either displays
	//	the container (style="block") or restores the container to the default
	//	(style="")
	// 2/06/22 modified to deal with 'locked' menus:
	//	 - get ddObj and ddRnk = ddObj.rnk of itmNode
	//	 - if ddObj.rnk >= glbOpnDDLst.length:
	//		 > switches contNode.style.display between "block" and "none"
	//		 > uses srchSibArrowVis() to toggle sibling arrows on/off
	//	 - if ddObj.rnk < glbOpnDDLst
	//		 > if glbOpnDDLst[ddRnk].bxNode == 

function srchSbMnuDisp(musNode,evt) {
	evt.preventDefault();
//	evt.stopPropagation();  // has to propagate to keep ancestor containers visible
		// check that itmNode is valid menu item.
//	var itmNode = musNode;
	var itmNode = tchGetNodeByClass(musNode,"crtSideItmClass");
	if (itmNode == null) {
		alert("srchSbMnuDisp(): cannot find item node for \"" + musNode.id 
					+ "\"; cannot display/hide submenu.\n\nPlease report this error.");
		return;
		}
	var itmId = itmNode.id;
	var contNode = null;  // node holding container for itmNode's side-menu
	var i;
	var ddLstSz = glbOpnDDLst.length;
	var itmDDObj = null;  // element from glbSrchMainArr[] (& children) corresponding to itmNode
	var itmRnk = Number.NaN;  // rank of itmNode (from itmDDObj)
	var lckNode = null;  // node of 'locked' menu item of rank = itmRnk
	var lckDDObj = null;  // element from glbSrchMainArr[] (& children) corresponding to lckNode
	var isFree = true;  // if true, itmNode is not subject to 'locked' menu
	var isLock = false;  // if true, itmNode is 'locked' open
	var wrnStr = "";
	var wrnBxNode = null;
			// if menu is locked (ddLstSz > 0), get data about locked items
			// only bother with getting itmDDObj if there is a 'locked' menu
	if (ddLstSz > 0) {
			// get data from glbSrchMainArr[] or its children about itmNode
		itmDDObj = tsrchSdObjFromItmId(itmId);
		if (itmDDObj == null) {
			alert("srchSbMnuDisp(): cannot find \"" + itmId + "\" in glbSrchMainArr[].  "
						+ "The menu cannot respond to the \"" + tevt.type 
						+ "\" event.\n\nPlease report this error");
			return;
			}
		itmRnk = itmDDObj.rnk;
			// if ddLstSz > itmRnk, itmNode is either:
			//	 - the item that is 'locked' (isLock == true), or
			//	 - a sibling of the 'locked' item (isFree == false && isLock == false)
			// get data from glbSrchMainArr[] or its children about itmNode
		if (ddLstSz > itmRnk) {  // item is on 'locked' part of menu
			if (glbOpnDDLst[itmRnk].rnk != itmRnk) {
				alert("srchSbMnuDisp(): the rank (" + itmRnk + ") of \"" + itmNode.id 
							+ "\" does not match glbOpnDDLst[" + itmRnk + "].rnk (" 
							+ glbOpnDDLst[itmRnk].rnk + ").  The menu cannot respond to the \"" 
							+ tevt.type + "\" event on \"" + itmDDObj.txtNm 
							+ "\".\n\nPlease report this error");
				return;
				}
			isFree = false;
			lckNode = glbOpnDDLst[itmRnk].bxNode
			if (lckNode == itmNode) {  // itmNode is the locked item
				isLock = true;
				lckDDObj = itmDDObj;
				}
			else {  // itmNode is sibling of lckNode
				lckDDObj = tsrchSdObjFromItmId(lckNode.id)
				if (lckDDObj == null) {
					alert("srchSbMnuDisp(): cannot find the \'locked\' menu item (\"" 
								+ lckNode.id + "\") in glbSrchMainArr[].  "
								+ "The menu cannot respond to the \"" + tevt.type 
								+ "\" event on \"" + itmDDObj.txtNm 
								+ "\".\n\nPlease report this error");
					return;
					}  // end if lckDDObj == null
				wrnBxNode = document.getElementById("lockWarnBox");
				if (wrnBxNode == null) {
					alert("srchSbMnuDisp(): cannot find the \'menu-is-locked\' warning box.  "
								+ "The menu cannot respond to the \"" + tevt.type 
								+ "\" event on \"" + itmDDObj.txtNm 
								+ "\".\n\nPlease report this error");
					return;
					}
				}  // end else itmNode is sibling of lckNode
			}  // end if item is on 'locked' part of menu
		}  // end if menu is locked

	if (isLock) {  // don't do anything; ancestors don't need to do anything
//		evt.stopPropagation();
		return;
		}
			// find container node that is child of this item node	
	var nodeLst = itmNode.children;
	var nodeLstSz = nodeLst.length;
	for (i=0; i<nodeLstSz; i++) {
		if (nodeLst[i].className == "crtSbMnuContainerClass") { break; }
		}
		
	if (i >= nodeLstSz) {
		alert("srchSbMnuDisp(): item (id = \"" + itmNode.id 
					+ "\) does not have a container for a submenu and cannot display/hide a submenu."
					+ "\n\nPlease report this error");
		return;
		}
	else { contNode = nodeLst[i]; }
				// respond to event
	switch (evt.type) {
		case "mouseover" :  
							if (isFree) {  // on part of menu that is not locked
								contNode.style.display = "block"; 
								srchSibArrowVis(itmNode,false,"black");
								}
							else {  // sibling of 'locked' item: !isFree && !isLocked
									// I don't think we need: contNode.style.display = "" ?
								srchSibArrowVis(lckNode,true,"rgb(208,190,190)");  // gray arrows "rgb(232,200,200)"
								wrnStr = "The submenu for limiting \"<b>";
								wrnStr += itmDDObj.txtNm.toLowerCase().replace(/\bgi\b/g,"GI");
								wrnStr += "</b>\" slides cannot be displayed because the menu for \"";
								wrnStr += lckDDObj.txtNm + "\" is \'locked\' open.&nbsp; Click on \"";
								wrnStr += itmDDObj.txtNm + "\" to \'lock\' on this choice, or click ";
								wrnStr += "anywhere on SlideBox (<span style='font-size:80%'>";
								wrnStr += "except on a criterion box or menu</span>) to unlock the menu.";
								wrnBxNode.innerHTML = wrnStr;
								wrnBxNode.style.display = "block";
//								evt.stopPropagation();
								}
							break;
		case "mouseout" : 	if (isFree) {  // on part of menu that is not locked
								contNode.style.display = "";
								srchSibArrowVis(itmNode,true,"black");
								}
							else {  // sibling of 'locked' item: !isFree && !isLocked
									// I don't think we need: contNode.style.display = "" ?
								srchSibArrowVis(lckNode,false,"black");
								wrnBxNode.style.display = "none";
								evt.stopPropagation();
								}
							break;
		default : alert("srchSbMnuDisp(): cannot handle the event (\"" + evt.type 
					+ "\") that occured (on item node \"" + musNode.id 
					+ "\"); cannot display/hide submenu.\n\nPlease report this error.");
		}
	return;
	}

	// 2/06/22 added arrClr to variables passed to the function
	//	arrClr specifies the color of the arrows (when visible)
	//	of the items that are not selected.  All arrows are resset
	//	to "black" when they are hidden
function srchSibArrowVis(actItmNode,makeVisible,arrClr) {
	var i;
	var j;
	var curItmNode;
	var arrowNode;
	var chldLst = actItmNode.parentNode.children;
	var chldLstSz = chldLst.length;
	var subLst;
	var subLstSz;
	var errStr = "";
	if (chldLstSz <= 0) {
		errStr = "srchSbArrowVis(): parent node of item (\"" + actItmNode.id;
		errStr += "\") has no children.  Cannot ";
		if (!makeVisible) { errStr += "hide"; }
		else {errStr += "display"; }
		errStr += "arrows.\n\nPlease report this error";
		alert(errStr);
		}
	for (i = 0; i < chldLstSz; i++ ) {
		arrowNode = null;  // initialize arrowNode for curItm
		curItmNode = chldLst[i];
		if (curItmNode.className != "crtSideItmClass") { break; }
		subLst = curItmNode.children;
		subLstSz = subLst.length;
		if (subLstSz == 0) { continue; }
		for (j = 0; j < subLstSz; j++) {
			if (subLst[j].className == "crtSbMnuArrowClass") {
				arrowNode = subLst[j];
				break; }
			}
		if (arrowNode == null) { continue; }
		if (!makeVisible && (curItmNode != actItmNode)) {
			arrowNode.style.visibility = "hidden";
			arrowNode.style.color = "black";
			}
		else {
			if (curItmNode == actItmNode) { arrowNode.style.color = "black"; }
			else { arrowNode.style.color = arrClr; }
			arrowNode.style.visibility = "visible";
			}
		}
	return;
	}


// *********************************************************
// ******           initialization functions          ******
// ******    reset values on return from list page    ******
// *********************************************************


function srchBackFromLst(isShftKey) {
		// reinitialize search variables/boxes
	if (glbOpnDDLst.length > 0) { tsrchStripDDLst(); }
	tsrchOpMnuPush(null,null,null);  // reset background color of formerly open criterion boxes.
	srchResetSel(isShftKey);
		// hide list-page & show search-page
	var lstNode = document.getElementById("lstPage");
	if (lstNode == null) {
		alert("srchBackFromLst(): Can\'t get node for list page.  "
					+ "This is a fatal error.\n\n  Please report this error.");
		return;
		}
	lstNode.style.display = "none";
	document.getElementById("srchPage").style.display = "block";
		// in case window-size changed need to re-center srchPage
		//		and need re-calculate number of columns for lstPage
	srchSldBoxCenter();
	prgGetNumCol();   // recalculate the number of columns
		// re-initialize list page
	lstResetMenu();  // reset list-page menu
	var chldNode;
	if (glbSldItmArr.length > 0) {
		chldNode = document.getElementById("lstWnd");
		if (chldNode == null) {
			alert("srchBackFromLst():  Cannot find node for list-window.  Cannot create a new search.  "
					+ " You can choose a slide from the old list of slides, but you will have to leave "
					+ "and restart the Virtual Slide Box to start a new search.\n\n  Please report this error.");
			return;
			}
			// remove list-box from list page
		if (lstNode.removeChild(chldNode) != chldNode) {
			alert("srchBackFromLst(): removal of the old search list failed. "
					+ " This probably is a fatal error, and probably should close and reopen the "
					+ "Virtual Slide Box if you want to do a new search.\n\n  Please report this error.");
			document.getElementById("srchPage").style.display = "none";
			lstNode.style.display = "block";
			}
		}
	document.getElementById("startBtn").style.visibility="visible" ;
	return;
	}

function srchResetSel(doInit) {
	var i;
	var arrSz = glbSrchMainArr.length;
	var subArr;
	var strtBxId;
	var endBxId;
	var bxId;
	var txtId;
	for (i = 0; i < arrSz; i++) {
		txtId = glbSrchMainArr[i].txtId;
		if (doInit) {  // re-iniitalize glbSrchMainArr[] if shift-key was down
			subArr = glbSrchMainArr[i].sdArr;
					// reset glbSrchMainArr[] values
			glbSrchMainArr[i].valStrg = subArr[0].valStrg;
			glbSrchMainArr[i].valEnd = Number.NaN;
			if (glbSrchMainArr[i].isTxt) { glbSrchMainArr[i].valStrt = 0; }
			else { glbSrchMainArr[i].valStrt = Number.NaN; }
					// reset criterion box values
			bxId = txtId + "ShwVal";
			document.getElementById(bxId).innerHTML = subArr[0].txtNm;
			bxId = txtId + "RowTwo";
			document.getElementById(bxId).style.visibility = "hidden";
			}  // end of if(doInit)
				// reset values in "start number" & "end number" boxes
					// set "end number" boxes using .valEnd
		if (glbSrchMainArr[i].isTxt) {  // criterion is a search-text criterion
			bxId = txtId + "SrchText";
				// for text-search criterion (glbSrchMainArr[].isTxt == true) items
				// 	.valStrg contains search before editting escape sequences.
			document.getElementById(bxId).value = glbSrchMainArr[i].valStrg;
			document.getElementById(bxId).style.backgroundColor = "white";			
			}
		else {   // criterion is a StrtVal/EndVal criterion
			bxId = txtId + "EndVal";
			if (glbSrchMainArr[i].valEnd < 0) { glbSrchMainArr[i].valEnd = Number.NaN; }
			if (Number.isNaN(glbSrchMainArr[i].valEnd)) {
				document.getElementById(bxId).value = "maximum";
				}
			else { document.getElementById(bxId).value = glbSrchMainArr[i].valEnd; }
			document.getElementById(bxId).style.backgroundColor = "white";
					// set "start number" boxes using .valEnd
			bxId = txtId + "StrtVal";
			if (glbSrchMainArr[i].valStrt < 0) { glbSrchMainArr[i].valStrt = Number.NaN; }
			if (Number.isNaN(glbSrchMainArr[i].valStrt)) {
				document.getElementById(bxId).value = "0";
				}
			else { document.getElementById(bxId).value = glbSrchMainArr[i].valStrt; }
			document.getElementById(bxId).style.backgroundColor = "white";
			}  // end of if StrtVal/EndVal
		}  // end of for(items in glbSrchMainArr[]
	return;
	}

