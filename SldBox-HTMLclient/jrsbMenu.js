// jrsbMenu.js
//	Copyright 2022  James Rhodes
//	Copyright 2020, 2022  Pacific Northwest University of Health Sciences
    
//	jrsbMenu.js is is a component of the "Slide Box" part of "Multifocal-plane Virtual Microscope"
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
//	jrsbMenu.js is part of the "SlideBox"
//	Currently, the "Slide Box" part of "Multifocal-plane Virtual Microscope" consists of 
//		11 principal files and other supplementary files:
//		- one HTML file
//		- one cascading style sheet
//		- eight javascript files (including this file)
//		- one PHP file.
//	Questions concerning the "Multifocal-plane Virtual Microscope" may be directed to:
//		James Rhodes, PhD.
//		1923 S. 44th Avenue
//		Yakima, WA  98903

// jrsbMenu.js contains =>
//		initialization functions that are involved in managing the menus
//	this file was initially created on 6/03/20



// **************************************************************
// ******     drop-down menu 'hover' display functions     ******
// **************************************************************

	// Prior to 2/06/22, display of the main-menu's drop-down submenus
	//	was handled by the CSS 'hover' option.  Once 'locking' of the
	//	criterion boxes' sidemenus was implemented, the 'hover' method
	//	for main-menu drop-down boxes was no longer viable.  Cicking on
	//	the criterion box or its submenus 'locked' that menu open
	//	(i.e., node.style.display = "block") until the mouse was clicked
	//	clicked on another element in SlideBox.  Since the main-menu's 
	//	drop-down boxes would overlap the criterion box's side-menus
	//	if both were open simultaneously, we needed to suppress display of 
	//	the main-menu submenus when a criterion-box's submenus were 'locked'
	//	open, and that couldn't be done with a CSS 'hover' command.  Instead
	//	onmouseover and onmouseout event handlers needed to be attached to the
	//	main-menu items.   tchInitMainMenu() is used to attach the
	//	event handlers.

	// menuMusOvr() is called by a mouseover or mouseout event (evt) on the 
	//	'big' container (musNode; className = "menuDrpDwnContnrClass")	
function menuMusOvr(musNode,evt) {
	evt.preventDefault();
	evt.stopPropagation();
	var evtType = evt.type;
	var cntrNode = null; // this is the 'little' container ("menuDrpDwnContentClass")
	var nodeLst = musNode.children;
	var nodeLstSz = nodeLst.length;
	for (i=0; i<nodeLstSz; i++) {
		if (nodeLst[i].className.includes("menuDrpDwnContentClass")) { break; }
		}
	if (i >= nodeLstSz) {
		alert("menuMusOvr(): could not find the container item (className = "
					+ "\"menuDrpDwnContentClass\") drop-down menu on which the \""+ evtType 
					+ "\" event occurred.  This menu cannot be displayed correctly."
					+ "\n\nPlease report this error.");
		return;
		}
	else { cntrNode = nodeLst[i]; }
			// don't need main-menu item since color is still handled by the CSS 'hover' status
			// determine if a criterion-box menu is 'locked' open
	var isCrtLock = false;
	if (glbOpnDDLst.length > 0) { isCrtLock = true; }
			// get node for the menu-locked warning box.
	var wrnBxNode = null;
	var crtI;
	var wrnStr = "";
	if (isCrtLock) {
		wrnBxNode = document.getElementById("lockWarnBox");
		if (wrnBxNode == null) {
			alert("menuMusOvr(): cannot find the \'menu-is-locked\' warning box.  "
						+ "The menu cannot respond to the \"" + evtType 
						+ "\" event on one of the items  (\"" + itmNode.id 
						+ "\") on the main-menu.\n\nPlease report this error");
			return;
			}
		}
	if (evtType == "mouseover") {
		if (isCrtLock) { //there is criterion-box menu 'locked' open
					// get name of locked criterion box

			crtI = srchIdToI(glbOpnDDLst[0].bxNode.id.slice(0,3),glbSrchMainArr);
			if (Number.isNaN(crtI)) {
				alert("menuMusOvr(): cannot find \"" + glbOpnDDLst[0].bxNode.id 
							+ "\" in glbSrchMainArr[].  The menu cannot respond to the \"" 
							+ evtType + "\" event.\n\nPlease report this error");
				return;
				}
					// display 'locked menu' warning
			wrnStr = "The drop-down menus associated with the main-menu cannot be displayed ";
			wrnStr += "because the menu for limiting slides by \"" + glbSrchMainArr[crtI].txtNm;
			wrnStr += "\" is \'locked\' open.&nbsp; Click anywhere on SlideBox ";
			wrnStr += "(<span style='font-size:80%'>except on a criterion box or its ";
			wrnStr += "side-menus</span>) to unlock the \'locked\" menu.";
			wrnBxNode.innerHTML = wrnStr;
			wrnBxNode.style.display = "block";
			return;
			}
		else { // display drop-down menu
			cntrNode.style.display = "block";
			return;
			}
		} // end mouseover event
			// for onmouseout, don't need to worry about whether menus are locked.
			//	Just close everything
	else if (evtType == "mouseout") {
		if (isCrtLock) { wrnBxNode.style.display = "none"; }
				// I don't think that we need to push windows that were opened by mouse events through
				//	tsrchOpMnuPush() to push the container through node.style.display = "none" to
				//	node.style.display = ""
		cntrNode.style.display = "";
//		cntrNode.style.display = "none";  // do we need to push through glbMnuOpn[]?
				// call to tsrchOpMnuPush() is needed to get main-menu item color to reset when 
				//	mouse is moved off drop-down menu after the main-menu drop-down item was 
				//	'locked' by a mousedown or touchstart 
		tsrchOpMnuPush(null,cntrNode,null);
		return;
		}
	else {
		alert("menuMusOvr(): does not know how to handle a \"" + evtType 
						+ "\" event.\n\nPlease report this error.");
		return;
		}
	return;
	}


//       ***************************************************************
//       ***************      list menu functions      *****************
//       ***************************************************************

//  functions building the list-menu are in jrsbList.js

	// menuBuildSrtBy() creates the drop-down items for the 'sort-by'
	//	items on the search-page drop-down menu
function menuBuildSrtBy() {
	var i;
	var chldNode
	var parNode = document.getElementById("menuDDSrtByContent");
	if (parNode == null) {
		alert("menuBuildSrtBy(): could not find \"content\" node for the \"sort-by\" "
					+ "drop-down menu.  Can\'t build the \"sort-by\" menu."
					+ "\n\n  Please report this error."); 
		return;
		}
	var nxtNode = document.getElementById("menuSrtByDivider");
	if (nxtNode == null) {
		alert("menuBuildSrtBy(): could not find child node (\"divider\") for the "
					+ "\"sort-by\" drop-down menu.  Can\'t build the \"sort-by\" menu."
					+ "\n\n  Please report this error."); 
		return;
		}
	var arrSz = glbMenuSrtByArr.length;
	for (i = 0; i < arrSz; i++) {
		chldNode = menuBuildSrtByItm(i);
		if (chldNode == null) { return; } // menuBuildSrtByItm() generates the error message
		parNode.insertBefore(chldNode,nxtNode);
		}
	return;
	}

	// menuBuildSrtByItm() builds a node for an item in glbMenuSrtByArr[].
	//	It returns the node.  On error, it returns null
function menuBuildSrtByItm(arrI) {
	if ((arrI < 0) || (arrI > glbMenuSrtByArr.length)){
		alert("menuBuildSrtByItm(): illegal value for index into glbMenuSrtBy[]." 
				+ "Can\'t build \"Sort-by\" menu item.\n\n  Please report this error.");
		return(null);
		}
	var itmNode = document.createElement("div");
	if (itmNode == null) {
		alert("menuBuildSrtByItm(): Can\'t create a node for the \"" 
				+ glbMenuSrtByArr[arrI].txtNm.toLowerCase() 
				+ "\" node in the menu.\n\n  Please report this error.");
		return(null);
		}
	itmNode.className = "menuDrpDwnSubItem menuDrpDwnShort menuClickable";
	itmNode.id = "menuSrtBy_" + glbMenuSrtByArr[arrI].id;
	itmNode.innerHTML = "&nbsp; &nbsp;" + glbMenuSrtByArr[arrI].txtNm;
	itmNode.onclick = function(){menuSetSrtByItm(this.id.slice(10));};
	itmNode.addEventListener("touchstart",function(){tchMenuClcked(this,event)});
	itmNode.addEventListener("touchend",function(){tchMenuClcked(this,event)});
	itmNode.addEventListener("touchcancel",function(){tchMenuClcked(this,event)});
	return(itmNode);
	}


	// menuSetSrtByItm() is called when user clicks on one of the field-options in the
	//	"Sort-by" drop-down menu on the search-page.  It sets the value of glbMenuSrtVar
	//	to the item clicked by the user and then calls menuWrtSrtByVal() to update the
	//	infoBox in the search-page menu.
function menuSetSrtByItm(itmId) {
	glbMenuSrtVar = itmId;
	menuWrtSrtByVal();
	return;
	}

function menuSetSrtByDir(srtDir) {
	glbMenuSrtDir = srtDir
	menuWrtSrtByVal();
	return;
	}

function menuWrtSrtByVal() {
	var txtStr;
	var arrI = menuGetSrtByArrI();
	if (Number.isNaN(arrI)) {
		document.getElementById("menuSrtByBox").innerHTML = "&nbsp;";
		return;
		}
	txtStr = glbMenuSrtByArr[arrI].txtNm.toLowerCase() + "&nbsp;";
	if (glbMenuSrtDir < 0) { txtStr += "&uarr;"; }
	else { txtStr += "&darr;"; }
	document.getElementById("menuSrtByBox").innerHTML = txtStr;
	return;
	}

	//menuGetSrtByArrI() loops through glbMenuSrtByArr[] to find element whose
	//	.id matches glbMenuSrtVar.  It returns the index (within glbMenuSrtByArr[])
	//	of the element.  On error, it returns NaN
function menuGetSrtByArrI(){
	var i;
	var arrSz = glbMenuSrtByArr.length;
	for (i = 0; i < arrSz; i++){
		if (glbMenuSrtByArr[i].id == glbMenuSrtVar) { break; }
		}
	if (i < arrSz) {return(i);}
	alert("menuGetSrtByArrI():  Can\'t find \"" + glbMenuSrtVar 
				+ "\" in glbMenuSrtByArr[].  Can\'t sort list of slides."
				+ "\n\n  Please report this error.");
	return(Number.NaN);
	}



//       ***************************************************************
//       ***************       infoBox functions       *****************
//       ***************   general display functions   *****************
//       ***************************************************************

	//  aboutBox is a generic infoBox used to display various information relative to the probram & project.
	//		Each menu element that utilizes this box generates the title and body text, and then passes
	//		these formatted strings to aboutDispBx(), formats the box abd inserts the title & body texts
	//		into the box.
	//	(1)	adjusts the width, top, & left of this box.  If not specified, default values are used.
	//	(2)	by default the box utilizes a "min-height = 150px" statement to set the height of this
	//			"postiion: fixed" box.  This meains that the height of the box will automatically increase
	//			to adjust to the amount of text in the body of the box.  If a lot of text is included
	//			(e.g., possibly "About our sponsors", the style of the box should be adjusted to a fixed 
	//			amount and display should be set to "auto".  NOTE:  this means that all other functions that
	//			open the box should specify "height: initial" to avoid uncexpected results if the aboutBox is
	//			is used multiple times during a session.
	//	(3)	give the title of the box, in a text string containing standard HTML code as innerHTML for 
	//			"aboutBoxHdrTitle" (which is a <span> element).  This section was rewritten (with an ugly
	//			set of nested <span> elements on 12/20/19 to allow for adjusting size of text so that 
	//			the title fits even if Arial is used (by the iPad) rather than Calibri for the title font
	//	(4)	enter into innerHTML for "aboutBoxText" (which is a <div> element) the contents of the body of 
	//			the aboutBox as a string containing standard HTML code.

	// aboutDispBx() was written on 12/20/19 to handle the steps in formatting & displaying the aboutBox
	//		that are common to all aboutBoxes.  This function is called by the aboutXXXXOpen() functions
	//		that now just create the title and body formatted text strings.
function aboutDispBx(abtTitle,abtBody) {
	var txtTrans = "";
	var boxWidth = parseInt(document.getElementById("aboutBox").style.width);
	var btnWidth = 140;
	var btnLeft = (boxWidth - btnWidth)/2;
	document.getElementById("aboutCloseBtn").style.left = btnLeft +"px";
	document.getElementById("aboutCloseDiv").style.width = boxWidth - 2 + "px";
			// set text in Header & Body
	var titleNode = document.getElementById("aboutBoxHdrTitle");
	titleNode.innerHTML = abtTitle;  // set header
	document.getElementById("aboutBoxText").innerHTML = abtBody;     // set body
			// display aboutBox
	aboutBoxInitPos();  // centers box
	document.getElementById("aboutBox").style.display = "block";
			// check for title fitting => must do after displaying box
	var mvBtnWdth = 45;  // width of infoMvBtn
	var titleMarg = 10;   // extra margin between move button and title
	var titleWdth = titleNode.offsetWidth;
	var txtRatio =  (boxWidth - (2 * (mvBtnWdth + titleMarg))) / titleWdth;
		// tried to use the "transform:scale(x,y)" style statement, but it wouldn't work
		//	so I decreased font size instead.
	if (txtRatio < 1) {  // decrease character width to fit
		txtTrans = "font-size: " + Math.round((txtRatio * 32)) + "px";
		titleNode.innerHTML = "<span style='" + txtTrans + "'>" + abtTitle + "</span>";
		}
		// at some point, may also want/need to test offsetHeight on "aboutBoxText" and
		//	use a scroll-bar if the body of the text extends past the bottom of the window
	return;
	}

	// aboutBxInit() is called by the function that responds when the subItem in the "About" menu is clicked
	//  The function positions the "About" 
function aboutBoxInitPos() {
	var scrWidth = parseInt(window.innerWidth);  // width of screeen less 2px border
	var boxNode = document.getElementById("aboutBox");  // node of infoBox;
	var boxWdth = 700;
			// set position of infoBox
	var left = Math.round((scrWidth - boxWdth)/2);
	if (left < 0) { left = 10; }  // if left is off the screen, set left side of box to 10px
	boxNode.style.top = glbInfoBxDefTop + "px";
	boxNode.style.left = left + "px";
	return;
	}



//       ***************************************************************
//       ***************       infoBox functions       *****************
//       ***************      specific ABOUT boxes     *****************
//       ***************************************************************

	// As of 5/08/22, the "About" menu infoBoxes are created by prgBuildAbtMnu() in jrsbSelectInit.js
	//	using text & other institution-specific data located in jrsbInSpcGlobal.js

//       **************************************************************
//       ***************      aboutBox functions      *****************
//       ***************        MOVE functions        *****************
//       **************************************************************


	// aboutBxTchStrt() is called by a touchstart event on the move-button of an infoBox
	//	tchEvt is the TouchEvent object belong to this event
	//	mvBtnNode is the move-button that was touched.
	// aboutBxTchStrt() sets glbAboutBxVal.x/y and then calls aboutBxMvStrt() to finish setting-up
	//		glbAboutBxVal for the move
function aboutBxTchStrt(tchEvt,mvBtnNode) {
	tchEvt.preventDefault();
	tchEvt.stopPropagation();
			// check for another moving info box
	if (!Number.isNaN(glbAboutBxVal.x) 
			|| !Number.isNaN(glbAboutBxVal.y)) { // glbAboutBxVal is in use
		alert("aboutBxTchStrt(): Cannot move two info boxes simultaneously");
		return;
		}
			// check for valid touchevent
	if (tchEvt.target != mvBtnNode) {
		warnBoxCall(false,"Touch error","<b>aboutBxTchStrt():</b> &nbsp;The button being touched (\""
				+ tchEvt.target.id + "\") is different from the responding button (\""
				+ mvBtnNode.id + "\").<br> Please report this error.");
		}
	var tchTot = tchEvt.targetTouches;
	var tchTotSz = tchTot.length;
	if (tchTotSz < 1) {
		alert("aboutBxTchStrt(): Nothing is touching the infoBox move-button (\""
				+ mvBtnNode.id + "\").  Cannot move the box.");
		return;
		}
	if (tchTotSz > 1) {
		warnBoxCall(false,"Too many fingers","<b>aboutBxTchStrt():</b> &nbsp;More than one finger ("
				+ tchTotSz + ") is touching the move-button (\""
				+ mvBtnNode.id +"\").  This probably is an error.");
		}
			// set newX,Y
	glbAboutBxVal.x = tchTot[0].clientX;
	glbAboutBxVal.y = tchTot[0].clientY;
	mvBtnNode.innerHTML = "Drag finger to move";  
	aboutBxMvStrt(mvBtnNode);
	return;
	}

	// infoBoxMvDown() is called when the mouse is depressed on an info-box's move-button
	// It is passed the pointer to the button and the Event object.
	//	It sets glbAboutBxVal.x,y and then calls infoBxMvStrt() to finish setting-up
	//		glbAboutBxVal for the move 
function aboutBxMusDwn(mvBtnNode,musEvt) {
	musEvt.stopPropagation();
			// check for another moving info box
	if (!Number.isNaN(glbAboutBxVal.x) 
			|| !Number.isNaN(glbAboutBxVal.y)) { // glbAboutBxVal is in use
		alert("aboutBxMusDwn(): Cannot move two info boxes simultaneously");
		return;
		}
			// check that event and move-box are congruent
	if (musEvt.target != mvBtnNode) {
		warnBoxCall(false,"Wrong button",
				"<b>aboutBxMusDwn():</b> &nbsp;The button that the mouse is depressing  (\""
				+ musEvt.target.id + "\") is different from the responding button (\""
				+ mvBtnNode.id + "\").<br> Please report this error.");
		}
	mvBtnNode.style.cursor = "move";
	mvBtnNode.onmousemove = aboutBxMusMv;
	mvBtnNode.innerHTML = "Drag mouse to move";  // this isn't really appropriate for touchscreens
	glbAboutBxVal.x = musEvt.clientX;
	glbAboutBxVal.y = musEvt.clientY;
	aboutBxMvStrt(mvBtnNode);
	return;
	}

	// infoBxMvStrt() receives from aboutBxTchStrt() or aboutBxMusDwn() the move-button node 
	//		of the info box that is being moved.  Except for x,y (which are set by the 
	//		calling function), infoBxMvStrt populates glbAboutBxVal, sets color & text
	//		of the move-button, and positions the move-box.
function aboutBxMvStrt() {
	var mvBtnNode = document.getElementById("aboutBoxMv");
	var scrWidth = parseInt(window.innerWidth) - 4;  // width of screeen less 2px border
	var scrHeight = parseInt(window.innerHeight) - 10; // height of screen less bottom margin
	var boxNode = document.getElementById("aboutBox");  // node of infoBox;
			// set glbAboutBxVal values
	glbAboutBxVal.left = parseInt(boxNode.style.left);
	glbAboutBxVal.top = parseInt(boxNode.style.top);
			// set mvBtnNode properties
	mvBtnNode.style.backgroundColor = "rgb(128,128,192)";
	mvBtnNode.style.color = "white";
	return;
	}

	// aboutBxMusMv() is called by an onMouseMove event on an infoBox move-button
	//	it extracts clientX,Y from the event and calls aboutBxMv() to move the infoBox
function aboutBxMusMv(musEvt) {
	musEvt.stopPropagation();
	aboutBxMv(musEvt.clientX,musEvt.clientY);
	return;
	}

	// aboutBxTchMv() is called by a touchmove event on an infoBox move-button
	//	it extracts clientX,Y from the event and calls aboutBxMv() to move the infoBox
function aboutBxTchMv(tchEvt) {
	tchEvt.preventDefault();
	tchEvt.stopPropagation();
	var tchTot = tchEvt.targetTouches;
	var tchTotSz = tchTot.length;
	var targetId = tchEvt.target.id
	if (tchTotSz < 1) {
		alert("aboutBxTchMv(): Nothing is touching the infoBox move-button (\""
				+ targetId + "\").  Cannot move the box.");
		return;
		}
	if (tchTotSz > 1) {
		warnBoxCall(false,"Too many fingers","<b>aboutBxTchMv():</b> &nbsp;More than one finger ("
				+ tchTotSz + ") is touching the move-button (\""
				+ targetId +"\").  This probably is an error.");
		}
	aboutBxMv(tchTot[0].clientX,tchTot[0].clientY);
	return;
	}


function aboutBxMv(newX,newY) {
			// check for validity of glbAboutBxVal object
	if (Number.isNaN(glbAboutBxVal.x) 
				|| Number.isNaN(glbAboutBxVal.y) 
				|| Number.isNaN(glbAboutBxVal.left) 
				|| Number.isNaN(glbAboutBxVal.top)) {   // mouse is NOT down
		alert("aboutBxMv():  glbAboutBxVal has not been initialized.\n Cannot move the infoBox");
		return; 
		}
	var boxNode = document.getElementById("aboutBox");
	var left = glbAboutBxVal.left;
	var top = glbAboutBxVal.top;
	left += newX - glbAboutBxVal.x;
	top += newY - glbAboutBxVal.y;
	boxNode.style.left = left + "px";
	boxNode.style.top = top + "px";
	glbAboutBxVal.x = newX;
	glbAboutBxVal.y = newY;
	glbAboutBxVal.left = left;
	glbAboutBxVal.top = top;
	return;
	}
	
	// aboutBxMusUp() is called & passed a pointer to the mouse event pointer
	//    if a mouse-button was released (button up) while on the infoMvBtn button
	// if the mouse-button had been depressed while on the infoMvBtn button,
	//   so glbAboutBxVal has been initialized (see infBoxMvBtnDown(), see above), then
	//   aboutBxMusUp() resets infoMvBtn style and sets glbAboutBxVal to null/NaN values.
function aboutBxMusUp(btnNode) {
			// reset glbAboutBxVal
	glbAboutBxVal.x = Number.NaN;
	glbAboutBxVal.y = Number.NaN;
	glbAboutBxVal.left = Number.NaN;
	glbAboutBxVal.top = Number.NaN;
			// reset move-button
	btnNode.onmousemove = "";
	btnNode.style.cursor = "";
	btnNode.style.backgroundColor = "";
	btnNode.style.color = "";
	btnNode.innerHTML = "Mouse down to move";
	return;
	}

	// infoBoxMvBtnOut() is called whenever the mouse mouse off the the infoMvBtn button;
	//    it is passed a pointer to the infoMvBtn DOM node.
	// This function attempts to fix two 'bugs' in HTML.
	//	(1) Movement of the infoBox is so slow that it is possible for the depressed mouse to 'out-run'
	//		the infoMvBtn button, and thus move off of the infoBox while trying to move it.  In this case,
	//		the function treats the mouse-out event as a mouse-up event and resets glbAboutBxVal (see
	//		aboutBxMusUp(), above).
	//	(2)	If the mouse is depressed & released on the infoMvBtn, the text in the infoMvBtn button is not
	//		automatically restored to the default value when the (now released) mouse moves off the button,
	//		so this function must explicitly reset the button's innerHTML contents.
function aboutBxMusOut(btnNode) {
			// reset glbAboutBxVal
	glbAboutBxVal.x = Number.NaN;
	glbAboutBxVal.y = Number.NaN;
	glbAboutBxVal.left = Number.NaN;
	glbAboutBxVal.top = Number.NaN;
			// reset move-button
	btnNode.onmousemove = "";
	btnNode.style.cursor = "";
	btnNode.style.backgroundColor = "";
	btnNode.style.color = "";
	btnNode.innerHTML = "Press here to move";
	return;
	}
	

function aboutBxTchUp(tchEvt,btnNode) {
	tchEvt.preventDefault();
	tchEvt.stopPropagation();
			// check for valid touchevent
	if (tchEvt.target != btnNode) {
		warnBoxCall(false,"Touch error","<b>aboutBxTchUp():</b> &nbsp;The button being touched (\""
				+ tchEvt.target.id + "\") is different from the responding button (\""
				+ btnNode.id + "\").<br> Please report this error.");
		}
			// reset glbAboutBxVal
	glbAboutBxVal.x = Number.NaN;
	glbAboutBxVal.y = Number.NaN;
	glbAboutBxVal.left = Number.NaN;
	glbAboutBxVal.top = Number.NaN;
			// reset move-button
	btnNode.style.backgroundColor = "rgb(232,232,248)";
	btnNode.style.color = "black";
	btnNode.innerHTML = "Press here to move";
	return;
	}

