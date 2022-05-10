// jrsbTouch.js
//	Copyright 2022  James Rhodes
//	Copyright 2020, 2022  Pacific Northwest University of Health Sciences
    
//	jrsbTouch.js is a component of the "Slide Box" part of "Multifocal-plane Virtual Microscope"
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
//	jrsbTouch.js is part of the "SlideBox"
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


// jrsbTouch.js contains =>  Functions needed for to handle TouchEvents (for touch-screen devices) for 
//	the slide-box part of Multifocal-plane Virtual microscope.  This file was initially created on 6/07/20

//  On the search-page, there are two types of drop-down menus:  1) the side menu's attached to the
//		criterion-boxes, and 2) drop-down sub-menus from the main menu.

// Touching or clicking on an item on the main menu calls: tchMenuMainDwn().
//	Touching or clickin on an main-menu dropdown-menu item calls tchMenuClicked()
// Touching or clicking on a main criterion box calls tsrchCrtMainDwn().
//	Touching or clicking on a non-array (no submenu) criterion side-menu item calls tsrchSdBtnDwn()

// January 2022: we needed to add/rewrite touchEvent code to handle multiple side-menus.
//	A new global array glbOpnDDLst[] holds the data about any search-page left-side drop-down menus that
//		currently have been opened by touching or clicking on side-menu item.
//	glbTchMenuOpn and glbTchPrevOpn are replaced by glbMnuOpn[] and 
//		tsrchResetCntr() is replaced by tsrchOpMnuPush()

	// tchGlbClrPrev() and tchGlbClrInit() were written on 11/28/20 to deal with the problem
	//	that touching anywhere on the screen except on a menu would not close a currently open menu.
	//	As usually is the case for TouchEvents, implementation was really buggy, and to try 
	//	to keep time commitment reasonable, we ended up improvising.
	// Prior to 2/02/22, tchGlbClrInit() was called by tchTestMus() if glbHasTch != true in response 
	//	to to a touchstart event detected by an EventListener attached to the main HTML page by prgInitSldBox()
	//	(document.addEventListener("touchstart",function(){tchTestMus()}).  This byzantine approach was
	//	replaced by having prgInitSldBox() call tchGlbClrInit() directly and to add "mousedown" EventListeners
	//	to handle pushing node.style.display == "block" or node.style.display == "none" items through
	//	glbMnuOpn[] so that the menu nodes have node.style.display = "" and the CSS 'hover' actions work.
	
	
	// tchGlbClrInit() adds eventListeners to elements whose nameClass includes one of the
	//	text-strings in clsNmArr[].  I tried including the menu, and the menu drop-down containers
	//	stopped working even if I specifically trapped them and resent the tchMenuClcked() command ...
	//	so I dropped the menu from the list of elements that, if touched, would close an 
	//	open drop-down menu.  srchIntrClass didn't work until I added an ontouchend="..." to the 
	//	"startBtn" button in the *.htm files.  For now tchGlbClrInit() is called by  tchTestMus() 
	//	so the eventListeners are only after a touch-screen event has activated a menu.  This may
	//	cause bugs later, but seems to work right now.
	// BTW, adding the eventListener to "srchRightClass" did not seem to work, so I had to add the
	//	eventListeners to "srchInstrClass", and "srchLogoClass".  Bugs everywhere...
function tchGlbClrInit() {
	var nodeLst;  // holds nodeList array
	var clssNmArr = [
					"sbBkgrdClass",
					"srchPageTitleClass",
					"srchInstrClass",
					"srchLogoClass"
					];
	var i;
	var j;
	var lstSz
	for (i = 0; i < clssNmArr.length; i++) {
		nodeLst = document.getElementsByClassName(clssNmArr[i]);
		lstSz = nodeLst.length;
		for (j=0; j<lstSz; j++) {
			nodeLst[j].addEventListener("touchstart",function() {tchGlbClrPrev(this, event);});
			nodeLst[j].addEventListener("touchend",function() {tchGlbClrPrev(this, event);});
			nodeLst[j].addEventListener("touchcancel",function() {tchGlbClrPrev(this, event);});
				// 2/02/22 activate (remove comment-out slashes) when mouse-clicks on side-menu items
				//		is implemented (and the onmousedown/onmouseup functions can be tested
			nodeLst[j].addEventListener("mousedown",function() {tchGlbClrPrev(this, event);});
			nodeLst[j].addEventListener("mouseup",function() {tchGlbClrPrev(this, event);});
			}
		}
	return;
	}

	// tchGlbClrPrev() is called by eventListners added to the background and right-side elements
	//	by tchGlbClrInit() ... see above.  
	// If a criterion box had been selected (i.e. glbOpnDDLst[] is not empty), clicking on one 
	//	of the "empty" (non-clickable) spaces to which tchGlbClrInit() had added an eventListener, 
	//	causes tchGlbClrPrev() to call tsrchStripDDLst() to deselect the crtierion box (including
	//	closing any side-menus.
	// If a main-menu item is open, then glbMnuOpn[] will not be empty, and clicking on one of the 
	//	"empty" (non-clickable) spaces to which glbTchClrInit had added a eventListener will cause
	//	tchGlbClrPrev() to call tsrchOpMnuPush(), which will close the menu 
	// Since the criterion boxes have been deselected, this function also calls srchShowArrows() 
	//	to re-display the criterion box arrows.
function tchGlbClrPrev(tnode,tevt) {
	tevt.preventDefault();
		// if a criterion box is active, use tscrchStripDDLst() to close it
	if (glbOpnDDLst.length > 0) { tsrchStripDDLst(); }
		// if a main menu is open, use tsrchMnuOpnPush() to close it
	if (glbMnuOpn.length > 0) { tsrchOpMnuPush(null,null,null); }
	if (glbMusOvr.cnNode != null) { srchResetMusOvr(); }
	srchShowArrows();
	return;
	}

	
	// for the mouse main-menu drop-down menus are displayed through a CSS ;hover statement.
	//	For touchEvents, we have to add an eventListner.
	//	Similarly, "menuClickable" subItems need touchstart and touchend eventListeners
function tchInitMainMenu() {
	var i;
			// attach touchstart & mousedown eventListeners to main menu drop-down items
	var nodeLst = document.getElementsByClassName("menuDrpDwnItemClass");
	var lstSz = nodeLst.length;
	for (i = 0; i < lstSz; i++) {
		nodeLst[i].addEventListener("touchstart",function(){tchMenuMainDwn(this,event)});
		nodeLst[i].onmousedown = function(){tchMenuMainDwn(this,event)};
		}
			// attach touchstart and touchend eventListeners to menuClickable items
	nodeLst = document.getElementsByClassName("menuClickable");
	lstSz = nodeLst.length;
	for (i = 0; i < lstSz; i++) {
		nodeLst[i].addEventListener("touchstart",function(){tchMenuClcked(this,event)},false);
		nodeLst[i].addEventListener("touchend",function(){tchMenuClcked(this,event)},false);
		nodeLst[i].addEventListener("touchcancel",function(){tchMenuClcked(this,event)},false);
		}
			// attach mouseover & mouseout eventListeners to the 'big' menu containers
	nodeLst = document.getElementsByClassName("menuDrpDwnContnrClass");
	lstSz = nodeLst.length;
	for (i = 0; i < lstSz; i++) {
		nodeLst[i].onmouseover = function(){menuMusOvr(this,event);};
		nodeLst[i].onmouseout = function(){menuMusOvr(this,event);};
		}
	return;
	}


		//*************************************************
		//******   Main Criterion Box Touch Events   ******
		//*************************************************

	// tsrchCrtMainDwn() is called by a touchstart event on one of the criterion boxes.
	//
	//	11/21/20 - it also calls srchHideArrows() to hide the arrows on other criterion boxes
	//	1/09/22 - modified to handle side-dropdown submenus and onclick events.
function tsrchCrtMainDwn(tchdNode,tevt) {
//	tevt.preventDefault();  // 2/02/22 moved this down (see below) and made conditional 
	tevt.stopPropagation();
	var mainNode = tchGetNodeByClass(tchdNode,"crtMainBoxClass");
	if (mainNode == null) { return; } // tchGetNodeByClass() already issued error message
	var mainIdTxt = mainNode.id.slice(0,3);  // mainNode.id = glbSrchMainArr[].txtId + "CrtMain";
	var mainI = srchIdToI(mainIdTxt,glbSrchMainArr);  // index to criterion in glbSrchMainArr[]
	if (Number.isNaN(mainI)) { return; } // srechIdToI() already issued error message
		// 2/04/22 commented-out cntrNode since it is no longer referenced in tsrchCrtMainDwn()
		// cntrNode is the node for the side-menu container (i.e. glbMnuOpn[].subCnNode)
//	var cntrNode = document.getElementById("crtSdCntr_" + mainIdTxt);
//	if (cntrNode == null) {
//		alert("tsrchCrtMainDwn(): could not find node for container \"" + cntrId
//				+ "\"; cannot limit slides by \"" + glbSrchMainArr[mainI].txtNm 
//				+ "\".\n\nPlease report this error.");
//		return;
//		}
			// if a text-input box has focus, remove that focus
			//	- unless this text-input box is the tchdNode
	var focusNode = glbPrevFocus.bxNode;
	if ((focusNode != null) && (focusNode != tchdNode)) {
		focusNode.blur();
		glbPrevFocus.bxNode = null;
		glbPrevFocus.bxVal = "";
		}
			// determine if tchdNode is a text-input box
	var tchdType = tchdNode.id.slice(3);  // this is needed to determine if a text-box was touched.
	var isTchdTxt = false;  // true if tchdNode is a text-input box
	if ((tchdType == "StrtVal") || (tchdType == "EndVal") || (tchdType == "SrchText")) {
		isTchdTxt = true;
		}

		// 2/08/22 needed to make tevt.preventDefault() conditional so text 
		//	in text-input boxes could be selected
	if (!isTchdTxt) { tevt.preventDefault(); }  // since default onClick is nothing, this should be good onClick & Touch
		// a touchstart or mousedown on a criterion box should 'unlock' previously 'locked'
		//	menus, so glbMusOvr should be reset.  However, if the computer has both a 
		//	touchscreen and a mouse, it is possible to use the touchscreen to change the
		//	'locked' menu to mainNode while the mouse is over some other box. In this case
		//	resetting glbMusOvr would allow the menu the mouse was positioned over to be
		//	displayed simultaneously with mainNode (after mainNode is locked.  Consequently,
		//	I think that we only reset glbMusOvr if glbMusOvr.bxNode == mainNode
	var musOvrNode = glbMusOvr.bxNode;
	if (mainNode == musOvrNode) { srchResetMusOvr(); }
	else if ((musOvrNode != null) && (tevt.type == "mousedown")) {
		alert("tsrchCrtMainDwn(): according to glbMusOvr, the item that the mouse was over (\"" 
					+ musOvrNode.id + "\") is different from the item being clicked (\""
					+ mainNode.id + "\").  glbMusOvr is being reset.\n\nPlease report this error.");
		srchResetMusOvr();
		}
		// There are three cases:
		//	 - no criterion box previously selected (ddLstSz == 0).
		//	 - previously selected criterion box was touched again
		//	 - a box different from previous criterion box was touched
			// if a different criterion box had been chosen:
			//	 - close old criterion box's side menu's
			//	 - change old criterion box's background color to "rgb(240,224,224)"
			//	 - push old criterion box onto glbMnuOpn[] (with menuCnNode = null)
			//	 - set change glbOpnDDLst[0] from old criterion box to new criterion box.
			//		 > opening of new criterion box's 1st sidemenu is delayed until touchend/mouseup event
			//	 - change background color of new criterion box active background color ("rgb(216,168,168)")
			// 1/27/22 set mainNode background to active color
	var bkgClrObj = tsrchGetBkgClr(mainNode);  // get background colors for mainNode
	if (bkgClrObj != null) { mainNode.style.backgroundColor = bkgClrObj.actvClr; }
	else { mainNode.style.backgroundColor = "rgb(216,168,168)"; }  // 'active' color
			// get "old" values of glbOpnDDLst[0] for use later
	var oldCntrNode = null;  // container of previous selection's side menu
	var oldBxNode = null;  // node of previous selection
	var ddLstSz = glbOpnDDLst.length;
	if (ddLstSz > 0) {
		oldBxNode = glbOpnDDLst[0].bxNode;
		oldCntrNode = glbOpnDDLst[0].cnNode;  // OK if this is null; don't need to test
		if (oldBxNode == null) {
			alert("tsrchCrtMainDwn():  glbOpnDDLst[] is corrupted: previously-selected criterion box's node is null.  "
					+ "Selection-criterion side-menu cannot be closed.\n\nPlease report this error.");
			tsrchStripDDLst();
			ddLstSz = glbOpnDDLst.length;
			}
		}
	if ((ddLstSz > 0) && (oldBxNode != mainNode)) {
		tsrchClrDDLst(0);  // remove elements from glbOpnDDLst[]
		ddLstSz = glbOpnDDLst.length;  // recalculate size of glbOpnDDLst[]
				// check to make sure tsrchClrDDLst() correctly trimmed glbOpnDDLst[]
		if (ddLstSz < 1) {
			alert("tsrchCrtMainDwn(): after trimming side-menus from previously-selected criterion box (\"" 
						+ oldBoxNode.id + "\"), the size of glbOpnDDLst[] (" + ddLstSz + ") is too small (should be 1).  "
						+ "glbOpnDDLst[] is corrupted and selection-criterion cannot be closed properly."
						+ "\n\nPlease report this error.");
			tsrchStripDDLst();
			}
		else if (ddLstSz != 1) {
			alert("tsrchCrtMainDwn(): after trimming side-menus from previously-selected criterion box (\"" 
						+ oldBoxNode.id + "\"), the size of glbOpnDDLst[] (" + ddLstSz + ") is NOT 1.  "
						+ "glbOpnDDLst[] is corrupted and selection-criterion side menu cannot be closed."
						+ "\n\nPlease report this error.");
			tsrchStripDDLst();
			}
		else if (glbOpnDDLst[0].cnNode != null) {
			alert("tsrchCrtMainDwn(): after trimming side-menus from previously-selected criterion box (\"" 
						+ oldBoxNode.id + "\"), glbOpnDDLst[0].cnNode is NOT null.  "
						+ "glbOpnDDLst[] is corrupted and selection-criterion side menu cannot be closed."
						+ "\n\nPlease report this error.");
			tsrchStripDDLst();
			}
				// set values for newly-selected criterion box; mainNode background set at beginning of function
		glbOpnDDLst[0] = {bxNode: mainNode, cnNode: null, rnk: 0};
				// reset previously selected criterion box
				//	 - don't need to test for oldBxNode == null; we checked it when oldBxNode was assigned at 
				//		beginning of function and txrchGetBkgClr() will throw error message if something is wrong
		bkgClrObj = tsrchGetBkgClr(oldBxNode);
		if (bkgClrObj != null) { oldBxNode.style.backgroundColor = bkgClrObj.normClr; }
		else { oldBxNode.style.backgroundColor = "rgb(240,224,224)"; }
			// calling tsrchOpMnuPush() must come AFTER glbOpnDDLst[0] is changed to mainNode
			//	(so tsrchOpMnuPush() removes mainNode.bxNode from glbMnuOpn[]) 
		
		tsrchOpMnuPush(oldBxNode,null,oldCntrNode);
		return;
		}
			// user touched the previously selected criterion box
			//	 - if user did NOT touch a 2nd-line text-input box, don't do anything except change background color
			//		... which already has been done.
			//	 - if user touched a 2nd-line text-input box, remove any side-menus, but leave main-criterion box
			//		in place.
	else if ((ddLstSz > 0) && (oldBxNode == mainNode)) {
		if (isTchdTxt) {
			tsrchClrDDLst(0);
			ddLstSz = glbOpnDDLst.length;  // recalculate size of glbOpnDDLst[]
			if (ddLstSz != 1) {
				alert("tsrchCrtMainDwn():  after a text-input box (\"" + tchdNode.id 
						+ "\") was touched and tsrchClrDDLst() was called the size of glbOpnDDList[] (" 
						+ ddLstSz + ") is wrong (it should be 1).  The menu may not display correctly.  "
						+ "\n\nPlease report this error.");
				tsrchStripDDLst();
				glbOpenDDLst[0] = {bxNode: mainNode, cnNode: null, rank: 0};
				return;
				}
			if (glbOpnDDLst[0].cnNode != null) {
				alert("tsrchCrtMainDwn():  after a text-input box (\"" + tchdNode.id 
						+ "\") was touched and tsrchClrDDLst(0) failed to set glbOpnDDLst[0].cnNode to null.  "
						+ "The menu may not display correctly.\n\nPlease report this error.");
				glbOpnDDLst[0].cnNode = null;
				}
			if (oldCntrNode != null) {
				oldCntrNode.style.display = "none";
				tsrchOpMnuPush(null,null,oldCntrNode);
				}
			}
				// 1/27/22 - removed the "else - not isTchdTxt" clause, since setting background color
				//	is now done before the "if isTchdTxt" clause
		return;
		}  // end bxNode == mainNode
	if (ddLstSz < 0) { // this should never happen, but we'll check anyway
			alert("tsrchCrtMainDwn(): glbOpnDDLst[].length (" + ddLstSz + ") cannot be negative.  "
						+ "\n\nPlease report this error.");
		}
	glbOpnDDLst[0] = {bxNode: mainNode, cnNode: null, rnk: 0};
	bkgClrObj = tsrchGetBkgClr(mainNode);  // get background colors for mainNode
	if ((bkgClrObj != null) && (bkgClrObj.actvClr != "")) { mainNode.style.backgroundColor = bkgClrObj.actvClr; }
	else { mainNode.style.backgroundColor = "rgb(216,168,168)"; }  // active button color
		// calls to tsrchOpMnuPush() should be done after glbOpnDDLst[] has been updated
	if (glbMnuOpn.length > 0 ) { tsrchOpMnuPush(null,null,null); } // close any open main-menu drop-down boxes
	return;	
	}


	// tsrchCrtMainUp() was added 1/23/22 when tsrchCrtMainDwn() was changed to trim old side-menus but 
	//	NOT open new side menus.  After a touchstart event calls tsrchCrtMainDwn(), glbOpnDDLst[]
	//	has one of the following:
	//	 - a single entry (i.e. glbOpnDDLst.length == 1) if the touchstart occured on a previously
	//		non-selected criterion box.  In this case: glbOpnDDLst[0].bxNode == mainNode, 
	//		glbOpnDDLst[0].cnNode == null, and glbOpnDDLst[0].rnk == 0
	//	 - a single entry if touchstart occured on a text-input box on the 2nd line of the criterion
	//		box.  In this case: tchdNode.id == 3-letter-id + "StrtVal", "EndVal", or "SrchText", and 
	//		glbOpnDDLst[0].bxNode == mainNode, glbOpnDDLst[0].cnNode == null, and glbOpnDDLst[0].rnk == 0.
	//	 - one or more entries if touchstart occured on the previously-selected criterion box.  In
	//		this case, glbOpnDDLst[0].cnNode will not be null, unless tchdNode is a 2nd line text-input
	//		box (see above).
	// tsrchCrtMainUp():
	//	 - calls tsrchOpMnuPush() with all parameter null to push out any old (closed) menu items,
	//		but it does NOT add any non-null items to glbMnuOpn[].  Side-menu items are added to 
	//		glbMnuOpn[] only when background color is changed from 'hover' to 'normal' color or
	//		side-menu container display changes from "block" to "none".
	//	 - checks to make certain mainNode is valid & equal to glbOpnDDLst[0].bxNode, and gets cntrNode. 
	//	 - if glbOpnDDLst[0].cnNode != null (previously-selected criterion touched again), changes the 
	//		glbOpnDDLst[0].bxNode.style.background color and returns.
	//	 - if glbOpnDDLst[0].cnNode == null:
	//		> changes glbOpnDDLst[0].bxNode.style.background color to "hover" color
	//		> displays cntrNode (cntrNode.style.display = "block")
	//		> updates glbOpnDDLst[] (glbOpnDDLst[0].cnNode = cntrNode)
	//		> hides arrows in other criterion boxes. 
function tsrchCrtMainUp(tchdNode,tevt) {
	tevt.preventDefault();  // since default onClick is nothing, this should be good onClick & Touch
	tevt.stopPropagation();
	var mainNode = tchGetNodeByClass(tchdNode,"crtMainBoxClass");
	if (mainNode == null) { return; } // tchGetNodeByClass() already issued error message
	var mainIdTxt = mainNode.id.slice(0,3);  // mainNode.id = glbSrchMainArr[].txtId + "CrtMain";
	var mainI = srchIdToI(mainIdTxt,glbSrchMainArr);  // index to criterion in glbSrchMainArr[]
	if (Number.isNaN(mainI)) {
		alert("tsrchCrtMainUp():  cannot get the index into glbSrchMainArr[] for \"" 
					+ mainNode.id + "\"; cannot respond to the \"" + tevt.type 
					+ "\" event.\n\nPlease report this error.");
		return;
		}
			// check integrity of glbOpnDDLst
	var ddLstSz = glbOpnDDLst.length;
			// set mainNode background to 'hover' color
	var mainClrObj = tsrchGetBkgClr(mainNode);
	if (mainClrObj != null) { mainNode.style.backgroundColor = mainClrObj.hovrClr; }
	else { mainNode.style.backgroundColor = "rgb(232,200,200)"; } // 'hover' color
		// if mousedown is on text-input box, but corresponding mouseup is off text-input box
		//	but on criterion box, a "click" event is fired on the criterion box.
		//  we need to trap this.

//TEMPORARY
//if (glbTxtMusTrap.itmNode == mainNode) {
//glbTmpStr += "\n . tCrtUp: event = \"" + tevt.type + "\"\n .. mainNode = \"" + mainNode.id + "\"; glbTxtMusTrap.itmNode = "
//if (glbTxtMusTrap.itmNode == null) { glbTmpStr += "null"; }
//else {glbTmpStr += "\"" + glbTxtMusTrap.itmNode.id + "\""; }
//glbTmpStr += "\n ... targetNode = \"" + tevt.target.id + "\"; glbTxtMusTrap.txtNode = ";
//if (glbTxtMusTrap.txtNode == null) { glbTmpStr += "null"; }
//else {glbTmpStr += "\"" + glbTxtMusTrap.txtNode.id + "\""; }
// END TEMPORARY => UNCOMMENT-OUT THE NEXT LINE

// START HERE:  2/09/22 - originally, the TxtMusTrap was conditional on the menu being 'unlocked'
//	if ((ddLstSz < 1) && (glbTxtMusTrap.itmNode == mainNode)) {
// END HERE
			// originally (on 2/08/22), I only allowed the TxtMusTrap to work if the menu
			//	was NOT locked (i.e. ddLstSz < 1), but after we decided to collapse the
			//	'locked' menu if the text-input box was clicked/touched, I think that
			//	any mouse 'click' event that was misdirected to the parent node (the main
			//	criterion box) should be trapped and sent back to srchTxtMusEvt().
			//	> NOTE: if the depressed mouse drags a box other than the text-input box's
			//		own main-criterion box (i.e. TxtMusTrap.itmNode != mainNode), then 
			//		the 'click' will NOT be 'seen' and will NOT be executed, although it 
			//		may be detected (and a non-error warning issued) by tsrchOpMnuPush().
	if (glbTxtMusTrap.itmNode == mainNode) { // TxtMusTrap fires
		if ((glbTxtMusTrap.txtNode != null) && (tevt.type == "click")) {
			srchTxtMusEvt(glbTxtMusTrap.txtNode,tevt);
			} 
		else {
			if (glbTxtMusTrap.txtNode == null) {
				alert("tsrchCrtMainUp(): for the \"" + tevt.type + "\" event on the \"" + glbSrchMainArr[mainI].txtNm 
						+ "\" criterion box, glbTxtMusTrap.txtNode = null although glbTxtMusTrap.itmNode = \""
						+ glbTxtMusTrap.itmNode.id + "\" (glbOpnDDLst[] size = " + glbOpnDDLst.length 
						+ ").  The \"" + tevt.type + "\" event cannot be processed.\n\nPlease report this error.");
				}
			else {
				alert("tsrchCrtMainUp(): received a \"" + tevt.type + "\" event on the \"" + glbSrchMainArr[mainI].txtNm 
						+ "\" criterion box although glbOpnDDLst[] is empty (glbOpnDDLst[] size = " + glbOpnDDLst.length 
						+ "; glbTxtMusTrap.itmNode = \"" + glbTxtMusTrap.itmNode.id + "\"; glbTxtMusTrap.txtNode = \"" 
						+  glbTxtMusTrap.txtNode.id + "\".  The \"" + tevt.type 
						+ "\" event cannot be processed.\n\nPlease report this error.");
				}
			}
		glbTxtMusTrap.itmNode = null;
		glbTxtMusTrap.txtNode = null;
		return;
		}  // end TxtMusTrap
			// The call to tsrchCrtMainDwn() by a 'touchstart' event should guarantee that
			//	glbOpnDDLst[] is not empty (i.e. the menu is 'locked' when the touchend
			//	event calls tsrchCrtMainUp()) and that glbOpnDDLst[0].bxNode != null.
			// Similarly, except for mouse events text-input boxes on the 2nd line of the
			//	main criterion box (these mouse events are trapped & handled by srchTxtMusEvt()),
			//	'mousedown' events on the main criterion box are handled by a call to
			//	tsrchCrtMainDwn(), so mouse 'click' events on the main criterion box, 
			//	which (except for text-input boxes) are handled a call to this function 
			//	(tsrchCrtMainUp()) should be guaranteed to have glbOpnDDLst.length > 0
	if (ddLstSz < 1) {
		alert("tsrchCrtMainUp(): illegal size (" + ddLstSz + ") for glbOpnDDLst[].  "
					+ "The menu for limiting slides by \"" + glbSrchMainArr[mainI].txtNm 
					+ "\" cannot be displayed.\n\nPlease report this error.");
		return;
		}
	var bxNode = glbOpnDDLst[0].bxNode;
	if (bxNode == null) {  // this should never happen, but test anyway
		alert("tsrchCrtMainUp(): glbOpnDDLst[0].bxNode == null.  "
					+ "The menu for limiting slides by \"" + glbSrchMainArr[mainI].txtNm 
					+ "\" cannot be displayed.\n\nPlease report this error.");
		return;
		}
	if (mainNode != bxNode) {
		alert("tsrchCrtMainUp(): Finger-down on a different box (\"" + bxNode.id 
					+ "\") than finger-up (\"" + mainNode.id + "\").  "
					+ "The menu for limiting slides by \"" + glbSrchMainArr[mainI].txtNm 
					+ "\" cannot be displayed.\n\nPlease report this error.");
		return;
		}
		// 1/27/22: if tchdNode is a 2nd-line text-input box, need to set mainNode to 'hover' color.
		// 2/09/22:  srchTxtMusEvt() does NOT handle touchEvents (only mousedown & click);
		//		we need to leave this code here for touch events
	var tchdType = tchdNode.id.slice(3);  // this is needed to determine if a text-box was touched.
	if ((tchdType == "StrtVal") || (tchdType == "EndVal") || (tchdType == "SrchText")) {
		tchdNode.focus();

//	COMMENT-OUT 2/09/22
//		glbPrevFocus.bxNode = tchdNode;
//		glbPrevFocus.bxVal = tchdNode.value;
// END COMMENT-OUT 2/09/22

		return;
		}
			// get node for side-container
	var cntrNode = document.getElementById("crtSdCntr_" + mainIdTxt);
	if (cntrNode == null) {
		alert("tsrchCrtMainUp(): could not find node for container \"" + cntrId
				+ "\"; cannot limit slides by \"" + glbSrchMainArr[mainI].txtNm 
				+ "\".\n\nPlease report this error.");
		return;
		}
			// next = > steps to display side-menu
	var cnNode = glbOpnDDLst[0].cnNode;
			// side-menu already displayed if previously-selected criterion was touched again
	if (cnNode != null) {  // side-menu already displayed => change background color (already done) & return
		if (cnNode != cntrNode) {  // this should never happen, but test anyway
			alert("tsrchCrtMainUp():  the container (\"" + cntrNode.id + "\") for the menu for \"" 
						+ glbSrchMainArr[mainI].txtNm + "\" does not match the container (\"" + cnNode.id + 
						"\") for the current menu.  The menu may not display correctly.\n\nPlease report this error.");
			}
				// push-down any previously open menu items
		if (glbMnuOpn.length > 0 ) { tsrchOpMnuPush(null,null,null); }
		return;
		}
	if (ddLstSz > 1) { // this should not happen, but test anyway
		alert("tsrchCrtMainUp(): the size of glbOpnDDLst[] (" + ddLstSz + ") cannot be greater than one when "
				+ "glbOpnDDLst[0].cnNode is null; cannot limit slides by \"" + glbSrchMainArr[mainI].txtNm 
				+ "\".\n\nPlease report this error.");
		return;
		}
	cntrNode.style.display = "block";  // display side-menu
			// set values for glbOpnDDLst[0]
			//	- glbOpnDDLst[0].bxNode & glbOpnDDLst[0].rnk set by txrchCrtMainDwn()
	glbOpnDDLst[0].cnNode = cntrNode;
	srchHideArrows(mainI);  // hide arrows in other criterion boxes.
			// push-down any previously open menu items
			//	calls to tsrchOpMnPush() should happen AFTER glbOpnDDLst[] is updated
	if (glbMnuOpn.length > 0 ) { tsrchOpMnuPush(null,null,null); }
	return;
	}




		//**********************************************************
		//******   "Action" (non-array) button Touch Events   ******
		//**********************************************************

	// tsrchSdBtnDwn() is called by a touchstart event on a non-array side-menu item
	//	Once the drop-down menu (side-menu is displayed, 'clicking' (i.e., touchstart followed by touchend)
	//		an 'action' (non-array) element in the drop-down menu should cause the menu to be closed
	//		(display = none).  
	//	- The touchstart event should be the same as the mouse-button-down (i.e. "active" CSS state)
	//		... the color of the element should change.
function tsrchSdBtnDwn(tchdNode,tevt) {
	tevt.preventDefault();
	tevt.stopPropagation();
	var itmNode = tchGetNodeByClass(tchdNode,"crtSideItmClass");
	if (itmNode == null) { return; } // tchGetNodeByClass() already issued error message
	var ddObj = tsrchSdObjFromItmId(itmNode.id);
	if (ddObj == null) { return; }  // tsrchSdObjFromItmId() already issued error message
	var ddRnk = ddObj.rnk;  // this is the rank of itmNode
		// itmNode does not have a side-array cntrNode is NOT the container for a submenu
		//	In other words, cntrNode != glbOpnDDLst[ddRnk].cnNode
	var cntrNode;  // this is the node of the container that holds itmNode
	if (ddRnk == 1) { cntrNode = tchGetNodeByClass(itmNode,"crtSideContainerClass"); }
	else { cntrNode = tchGetNodeByClass(itmNode,"crtSbMnuContainerClass"); }
	if (cntrNode == null) { return; }  //tsrchGetSdItmNode() already issued error message
			// check glbOpnDDLst.length against rank of clicked entry
	var ddLstSz = glbOpnDDLst.length;
		// the availability of the clicked item requires that the item (itmNode) is one of the
		//	following:
		//	 > an 'action' item on the top-level menu.
		//		→ in this case: ddLstSz == ddRnk, and glbOpnDDLst[ddLstSz-1].cnNode is not null.
		//	 > a sibling of the previously-selected (array-type) item 
		//	 > the sibling of an ancestor (parent, grandparent, etc) of the previously 
		//			selected item.
		//	 - If the item is on the top-level menu: push it onto glbOpnDDLst[] with:
		//		bxNode = itmNode, cnNode = null, and rnk = ddRnk.  This will make ddLstSz = ddRnk + 1
		//	 - If the itmNode is the sibling of an ancestor, then we need to trim menu back to level 
		//		of the ancester/current item before changing the selected item in current menu.
		//	 - itmNode is guaranteed to NOT be the previously selected item (since a touchend event
		//		on a non-array sidemenu item closes the side menu and a touchstart on the previously
		//		selected item must be preceded by a touchend)
		//	 - (After trimming menu), change previously-selected sibling to normal background color
		//	 -  Set currently-selected itmNode to active background color
		//	 -	change shwVal window and glbSrchMainArr[] entries to values of currently selected item
	var oldNode;  // this holds the node of the previously-selected sibling of itmNode
	var oldSubCn;
	var bkgClrObj;  // will hold background colors returned by tsrchGetBkgClr()
	if (ddLstSz > ddRnk) { // an item in cntrNode (i.e. a sibling of itmNode is selected (or ancestor of selected)
		oldNode = glbOpnDDLst[ddRnk].bxNode;
		oldSubCn = glbOpnDDLst[ddRnk].cnNode;
		if (itmNode == oldNode) {
			alert("tsrchSdBtnDwn(): the item currently being selected (\"" + ddObj.txtNm + "\") already is selected.  "
					+ "This should not be possible since selecting this item should close the menu."
					+ "\n\nPlease report this error.");
			}
		else { // clear the previously selected item & its side-menus
			tsrchClrDDLst(ddRnk);  //  clear any submenus from sibling of itmNode
			ddLstSz = glbOpnDDLst.length;
				// set old item's background color
			bkgClrObj = tsrchGetBkgClr(oldNode);
			if (bkgClrObj != null) { oldNode.style.backgroundColor = bkgClrObj.normClr; }
			else { oldNode.style.backgroundColor = "rgb(240,224,224)"; }  //'normal' color
				// push oldNode onto glbMnuOpn[]; menuCnNode is null because this we don't 
				//	want to close the menu holding the currently-selected item
			tsrchOpMnuPush(oldNode, null, oldSubCn);
				// replace oldNode with itmNode in glbOpnDDLst[ddRnk].bxNode
			if (ddLstSz != ddRnk+1) {
				alert("tsrchSdBtnDwn(): after trimming the criterion box\'s side-menus to the rank of the \""
						+ ddObj.txtNm + "\" (rank = " + ddRnk + "), glbOpnDDLst[] has the wrong size (" + ddLstSz 
						+ ").  The menu will not display correctly.\n\nPlease report this error.");
					// don't try to correct the error; ontouchend tsrchSdBrnUp will close this menu.
				}
			else { glbOpnDDLst[ddRnk].bxNode = itmNode; }
			} // end oldNode != itmNode
		} // end ddLstSz > ddRnk
	else if (ddLstSz == ddRnk) {  // new selection in top-level menu
		if (cntrNode != glbOpnDDLst[ddLstSz-1].cnNode) {  // check to make sure that itmNode is in the top-level menu
			alert("tsrchSdBtnDwn(): for the size of glbOpnDDLst[] (" + ddLstSz + ") to be equal to the rank (" + ddRnk 
					+ ") of the selected item (\"" + ddObj.txtNm + "\"), glbOpnDDLst[" + (ddLstSz - 1) + "].cnNode (\"" 
					+ glbOpnDDLst[ddLstSz-1].cnNode.id + "\") must be the menu containing the selected item (\"" + cntrNode.id 
					+ "\").  The menu will not display correctly when these are different.\n\nPlease report this error.");
					// don't try to correct the error; ontouchend tsrchSdBrnUp will close this menu.
			}
				// push itmNode onto glbOpnDDLst[]
		glbOpnDDLst[ddRnk] = { bxNode: itmNode, cnNode: null, rnk: ddRnk };
		ddLstSz = glbOpnDDLst.length;
		}
	else {  // ddLstSz < ddRnk
		alert("tsrchSdBtnDwn(): The size of glbOpnDDLst[] (" + ddLstSz + ") cannot be less than the rank (" 
					+ ddRnk + ") of the selected item (\"" + ddObj.txtNm + "\").\n\nPlease report this error.");
		return;
		}
		// set itmNode to CSS :active state
	bkgClrObj = tsrchGetBkgClr(itmNode);
	if ((bkgClrObj != null) && (bkgClrObj.actvClr != "")) { itmNode.style.backgroundColor = bkgClrObj.actvClr; }
	else { itmNode.style.backgroundColor = "rgb(216,168,168)"; } // 'active' color
	srchMenuInp(itmNode,tevt);  // call \"onclick\" function to set the values in glbSrchMainArr[] and shwVal box
	return;
	}


	// tsrchSdBtnUp() handles the touchend and touchcancel events for criterion drop-down side-menu
	//	items that DO NOT have a subarray associated with it.  
	// This function was substantially changed on 1/09/22 to accommodate use glbOpnDDLst[] to track open subarrays.
	//	Since this function is only called by "action" criterion drop-down side-menu's that do NOT have
	//	subarrays, the onclick event is handled separately (by a call to srchMenuInp()), and the
	//	touchend/touchcancel events (besides calling srchMenuInp()) completely collapse the sidemenus.

	//	Once the drop-down menu (side-menu is displayed, 'clicking' (i.e., touchstart followed by touchend)
	//		an element in the drop-down menu should cause the menu to be closed (display = none).  
	//	- The touchend (or touchcancel) event should be the same as a mouse-click:
	//		1) the drop-down menu should disappear.  For a mouse-event, this involves first going to :hover,
	//			and then the menu disappearing when the mouse moves off the container; however, the finger
	//			lifting off the object is the same as moving off the container, so color should revert to
	//			'normal' or "" ... this is done by tsrchClrDDLst() 
	//		  11/21/20 - this also should restore other criterion box arrows - the call to srchShowArrows() 
	//			should go in this function (and in tchMenuMainDwn) rather than in tsrchClrDDLst()
	//		2) the action specified by the button should be done
function tsrchSdBtnUp(tchdNode,tevt) {
	tevt.preventDefault();
	tevt.stopPropagation();
	var itmNode = tchGetNodeByClass(tchdNode,"crtSideItmClass");
	if (itmNode == null) { return; } //tsrchGetSdItmNode() already issued error message
	var itmId = itmNode.id;
			// get entry in global search arrays corresponding to itmNode
	var ddObj = tsrchSdObjFromItmId(itmId);
	if (ddObj == null) {
		alert("tsrchSdBtnUp(): ddObj == null; cannot respond to " + tevtTyp + " event on \"" 
					+ itmId + "\".\n\nPlease report this error");
		return;
		}
	var ddRnk = ddObj.rnk;
			// collapse (node.style.display = "none" the enter set of sidemenus.
	var ddLstSz = glbOpnDDLst.length;
	if (ddRnk != ddLstSz - 1) {
		alert("tsrchSdBtnUp(): rank (" + ddRnk + ") of touched side-menu item (\"" 
				+ ddObj.txtNm + "\") does not match the size of glbOpnDDLst[] (" 
				+ ddLstSz + ").\n\nPlease report this error.");
		}
	var mainNode = glbOpnDDLst[0].bxNode;
	var mainSdCnNode = glbOpnDDLst[0].cnNode;
	var bkgClrObj = tsrchGetBkgClr(mainNode);  // background colors for itmNode
		// 2/07/22 NOTE: should tsrchClrDDLst(0); be replaced with tsrchStripDDLst(); ?
		//	On 2/07/22, I added call to tsrchStripDDLst() from srchMenuInp() which 
		//	probably makes the call to tsrchClrDDLst(0) (below) redundant
	tsrchClrDDLst(0);  // remove elements from glbOpnDDLst[]
	ddLstSz = glbOpnDDLst.length;
	if (ddLstSz != 1) {
		alert("tsrchSdBtnUp(): The size of glbOpnDDLst[] (" + ddLstSz + ") should be 1.  "
					+ "glbOpnDDLst[] is corrupted and selection-criterion items may not "
					+ "display correctly.\n\nPlease report this error.");
		}
			// if choice opens a text-input box on 2nd line of criterion box
			//	set background color of criterion box to 'hover' color
	var isTxtInp = false;  // set to true if a text-input box opens on 2nd line of criterion box
	var chId = itmId.slice(itmId.length-1);  // .charId for main-object in glbSrchMainArr[]
		// get indices into arrays
	var mainI = srchChToI(chId);  // index for main-object in glbSrchMainArr[]
	if (Number.isNaN(mainI)) { return; }  // srchChToI() already issued an error message
	if (mainI != srchIdToI(mainNode.id.slice(0,3),glbSrchMainArr)) {
		alert("tsrchSdBtnUp(): glbOpnDDLst[0].bxNode (\"" + mainNode.id 
				+ "\") is NOT the main criterion box for the item that was clicked (\"" 
				+ itmNode.id + "\").  Limiting slides by \"" + glbSrchMainArr[mainI].txtNm 
				+ "\" may not work correctly.\n\nPlease report this error.");
		}
	if ((glbSrchMainArr[mainI].isTxt) && (ddObj.valStrg > 0)) { isTxtInp = true; }
	else if (Number.isNaN(ddObj.valStrg)) { isTxtInp = true; }
	if (isTxtInp) {
		if (bkgClrObj != null) { mainNode.style.backgroundColor = bkgClrObj.hovrClr; }
		else { mainNode.style.backgroundColor = "rgb(232,200,200)"; }
		}
	else {
		if (bkgClrObj != null) { mainNode.style.backgroundColor = bkgClrObj.normClr; }
		else { mainNode.style.backgroundColor = "rgb(240,224,224)"; }
		tsrchStripDDLst();  // criterion box is no longer active.
		tsrchOpMnuPush(mainNode,null,mainSdCnNode);
		}
		// calling srchMenuInp() is redundant here, since tsrchSdBtnDwn() now calls
		//	this function, but we'll leave it here in case I'm missing something
	srchMenuInp(itmNode,tevt);  // call the \"onclick\" function
	return;
	}



		//*******************************************
		//******   Array button Touch Events   ******
		//*******************************************

	// tsrchArrBtnDwn() is called by a touchstart event on a criterion drop-down side-menu
	//	item (itmNode) that opens a submenu (i.e. is linked to separate search array).
	//	This menu item/button was created by initAddSdItm() with className = "crtSideItmClass"
	//	and id = "sdItm_" + sdArrObj.txtId.
	// A touchstart event an array-linked side-menu item should:
	//	 - if glbOpnDDLst[ddObj.rnk].bxNode != itmNode:
	//		 > call tsrchClrDDLst(ddObj.rnk) to trim the sidemenu tree down to the current item's rank-1
	//		 > push the item onto glbOpnDDLst[], with glbOpnDDLst[].cnNode = null (since the submenu hasn't
	//			been opened yet).  The tsrchArrBtnUp() will display the submenu
	//	 - if glbOpnDDLst[ddObj.rnk].bxNode == itmNode:
	//		 > call tsrchClrDDLst(ddObj.rnk+1) to trim the sidemenu tree down to the current item's rank
	//	 - call srchMenuInp(itmId) to set the main criterion values.  This is a temporary measure that
	//			provides the user with updated information during the action.  Because onmousedown does
	//			not call this function, tsrchArrBtnUp() also needs to call srchMenuInp().
	//	 - change itmNode.style.background color to "active"


function tsrchArrBtnDwn(tchdNode,tevt) {
	tevt.preventDefault();
	tevt.stopPropagation();
	var itmNode = tchGetNodeByClass(tchdNode,"crtSideItmClass");
	if (itmNode == null) { return; } // tchGetNodeByClass() already issued error message
	var itmId = itmNode.id;
			// get entry in global search arrays corresponding to itmNode
	var ddObj = tsrchSdObjFromItmId(itmId);
	if (ddObj == null) {
		alert("tsrchArrBtnDwn(): ddObj == null; cannot respond to " + tevtTyp + " event on \"" 
					+ itmId + "\".\n\nPlease report this error");
		return;
		}
	var ddRnk = ddObj.rnk;
	var bkgClrObj;
	var tmpItmNode;
	var tmpCnNode;
		// trim side menu's
	var opArrSz = glbOpnDDLst.length;
	if (opArrSz < ddRnk) { // this should never happen, but we need to test for it
			// if this happens, strip glbOpnDDLst[] and start over
		alert("tsrchArrBtnDwn(): the list of open side-menus is too small (" + opArrSz 
				+ ") for the rank (" + ddRnk + ") of the \"" + ddObj.txtNm 
				+ "\" button.  Cannot process the \'touchstart\' event."
				+ "\n\nPlease report this error.");
		tsrchStripDDLst();
		return;
		}
	if (opArrSz == ddRnk) {  // no item has been selected from this menu
		glbOpnDDLst[opArrSz] = { bxNode: itmNode, cnNode: null, rnk: ddObj.rnk };
		} // no item has been selected from this menu
	else {
		if (glbOpnDDLst[ddRnk].bxNode == itmNode) {  // clicked on item with open submenus
			if (opArrSz > (ddRnk + 1)) {
				tmpCnNode = glbOpnDDLst[ddRnk+1].cnNode;
				tmpItmNode = glbOpnDDLst[ddRnk+1].bxNode;
				}
			else {
				tmpCnNode = null;
				tmpItmNode = null;
				}
			tsrchClrDDLst(ddRnk+1); // trim menu back to itmNode's submenu, but leave this submenu open
					// change color of previously selected item of ddRnk+1 to background color
			if (tmpItmNode != null) {
				bkgClrObj = tsrchGetBkgClr(tmpItmNode);
				if (bkgClrObj != null) { tmpItmNode.style.backgroundColor = bkgClrObj.normClr; }
				else {tmpItmNode.style.backgroundColor = "rgb(240,224,224)"; }
				}
					// push previously selected item of ddRnk+1 onto glbMnuOpn[]
			tsrchOpMnuPush(tmpItmNode,null,tmpCnNode);
			}
			  // two items of the same rank must be on the same menu because only 
			  //	one side-menu of a given rank can be displayed at a given time.
		else { // clicked on item different from the one whose submenus were open
			tmpItmNode = glbOpnDDLst[ddRnk].bxNode;  // this is the previously-selected item
					// change previously-selected item's background color to 'normal' color
			if (tmpItmNode != null) {
				bkgClrObj = tsrchGetBkgClr(tmpItmNode);

				if (bkgClrObj != null) { tmpItmNode.style.backgroundColor = bkgClrObj.normClr; }
				else {tmpItmNode.style.backgroundColor = "rgb(240,224,224)"; }
				}
			tmpCnNode = glbOpnDDLst[ddRnk].cnNode;
			tsrchClrDDLst(ddRnk);  // remove any menu's attached to previously-selected item
					// push previously selected item of ddRnk+1 onto glbMnuOpn[]
			tsrchOpMnuPush(tmpItmNode,null,tmpCnNode);
			opArrSz = glbOpnDDLst.length;
			if (opArrSz != ddRnk + 1) {
						// if this happens, strip glbOpnDDLst[] and start over
				alert("tsrchArrBtnDwn(): error in removing submenus: size of glbOpnDDLst[] ("  
						+ opArrSz + ") does not equal rank (" + ddRnk + ") of the \""  
						+ ddObj.txtNm  + "\" button.  Cannot process the \'touchstart\' event."
						+ "\n\nPlease report this error.");
				tsrchStripDDLst();
				return;
				}
			glbOpnDDLst[ddRnk] = { bxNode: itmNode, cnNode: null, rnk: ddObj.rnk };
			}  // end else bxNode != itmNode
		} //  end else opArrSz != ddRnk
			// 'lock' has been shifted to the selected item (itmNode)
			//		remove (hide) locked-menu warning
	var wrnBxNode = document.getElementById("lockWarnBox");
	if (wrnBxNode == null) {
		alert("tsrchArrBtnDwn(): cannot find the \'menu-is-locked\' warning box.  "
					+ "This warning cannot be changed or removed in response to the \"" 
					+ tevt.type + "\" event on \"" + itmDDObj.txtNm 
					+ "\".\n\nPlease report this error");
		}
	else {wrnBxNode.style.display = "none"; }
			// set selected item's background color to 'active'
			//		this will be changed to 'hover' color by tsrchArrBtnUp()
	bkgClrObj = tsrchGetBkgClr(itmNode);
	if ((bkgClrObj != null) && (bkgClrObj.actvClr != "")) { itmNode.style.backgroundColor = bkgClrObj.actvClr; }
	else { itmNode.style.backgroundColor = "rgb(216,168,168)"; } // 'active' color
	srchSibArrowVis(itmNode,false,"black");  // hide arrows
			// call the \"onclick\" function to set values in glbSrchMainArr[] and in
			//	criterion's shwVal box. 
	srchMenuInp(itmNode,tevt);
	return;
	}


	// When the an array-associated criterion side-menu item is 'clicked', e.g., when a touchend event occurs:
	//	 - the background color is changed to the 'hover' color: "rgb(232,200,200)".  This is true for
	//		a mouse click, as well as for a touchend event, since we want the color (and menus) 
	//		'locked' in place until something else is clicked.
	//	 - the associated container needs cntrNode.style.display = "block";
	//	 - there already should be an entry in glbOpnDDLst[] corresponding to the item (this entry 
	//		was created by tsrchArrBtnDwn(), but:
	//		 > we need to check to make sure that glbOpnDDLst.bxNode == itmNode for the last 
	//			element in the array.
	//		 > glbOpnDDLst.cnNode, which should have been null, needs to be set to:
	//			glbOpnDDLst.cnNode = cntrNode reflect that the container is now displayed
	//			(cntrNode.style.display = "block")
	//	 - if we haven't done it already, srchMenuInp() needs to be called to copy the appropriate
	//		values into glbSrchMainArr[]
	// Unlike the case for touchstart/onmousedown in tsrchArrBtnDwn(), the node for the container 
	//	that is displayed when this item is 'clicked' (touchstart/touchend sequence) is needed for 
	//	tsrchArrBtnUp().  This submenu-container was created by initBuildSbMnu()
	//	with className = "crtSbMnuContainerClass" and id = "crtSdCntr_" + sbMnuArr[0].txtId.slice(3).
	//	There will be only one child of the item that has className == "crtSbMnuContainerClass".
function tsrchArrBtnUp(tchdNode,tevt) {
	tevt.preventDefault();
	tevt.stopPropagation();
	var i;
	var itmNode = tchGetNodeByClass(tchdNode,"crtSideItmClass");
	if (itmNode == null) { return; } // tchGetNodeByClass() already issued error message
	var itmId = itmNode.id;
			// get entry in global search arrays corresponding to itmNode
	var ddObj = tsrchSdObjFromItmId(itmId);
	if (ddObj == null) {
		alert("tsrchArrBtnUp(): ddObj == null; cannot respond to " + tevtTyp + " event on \"" 
					+ itmId + "\".\n\nPlease report this error");
		return;
		}
	var ddRnk = ddObj.rnk;
				// tscrchArrBtnDwn() already has called srchMenuInp() to
				//	set values in glbSrchMainArr[] and in criterion box
			// set button color to "hover" color
	var bkgClrObj = tsrchGetBkgClr(itmNode);
	if (bkgClrObj != null) { itmNode.style.backgroundColor = bkgClrObj.hovrClr; }
	else { itmNode.style.backgroundColor = "rgb(232,200,200)"; } // "hover" color
			// get container for associated side-array
	var cntrNode = srchGetSbMnuFromItm(itmNode);
	if (cntrNode == null) {
		alert("tsrchArrBtnUp(): cannot find the submenu belonging to \""
					+ ddObj.txtNm + "\" (\"" + itmId + "\").  This submenu cannot be displayed."
					+ "\n\nPlease report this error."); 
		return;
		}
				// tscrchArrBtnDwn() should already have entered itmNode into
				//	last element of glbOpnDDLst[]:
				//	 - glbOpnDDLst[].bxNode should be itmNode
				//	 - glbOpnDDLst[].cnNode should be null
	var ddOpLstSz = glbOpnDDLst.length;
	if (ddOpLstSz != (ddRnk + 1)) {
		if ((ddOpLstSz == ddRnk) && (glbOpnDDLst[ddOpLstSz - 1].bxNode != itmNode)) {
			alert("tsrchArrBtnUp(): \"" + ddObj.txtNm + "\" menu-item (\"" + itmNode.id 
					+ "\") is missing from list of displayed menu-items (glbOpnDDLst[]).  "
					+ "This item is being added to the list, but glbOpnDDLst[] may be corrupted and "
					+ "the menu may not display correctly.\n\nPlease report this error.");
			glbOpnDDLst[ddOpLstSz] = {bxNode: itmNode, cnNode: null, rnk: ddRnk};
			ddOpLstSz = glbOpnDDLst.length;
			srchMenuInp(itmNode,tevt);
			srchSibArrowVis(itmNode,false,"black");
			}
				// clicked on item of lower rank on locked menu
				// tsrchArrBtnDwn() calls srchMenuInp() to insert values
		else if ((ddRnk < ddOpLstSz -1) && (glbOpnDDLst[ddRnk].bxNode == itmNode)){
			tsrchClrDDLst(ddRnk);
			cntrNode.style.display = "block";
			glbOpnDDLst[ddRnk].cnNode = cntrNode;
			srchSibArrowVis(itmNode,false,"black");
			return;
			}
		else {
			alert("tsrchArrBtnUp(): \"" + ddObj.txtNm + "\" menu-item (\"" + itmNode.id 
					+ "\") is not last item in glbOpnDDLst[], and the size of glbOpnDDLst[] does "
					+ "not match the item's rank.  The side-menu for this selection cannot be "
					+ "displayed because glbOpnDDLst[] is corrupted.\n\nPlease report this error.");
			tsrchStripDDLst();
			return;
			}
		}
	if (glbOpnDDLst[ddOpLstSz-1].bxNode != itmNode) {
		alert("tsrchArrBtnUp(): \"" + ddObj.txtNm + "\" menu-item (\"" + itmNode.id 
				+ "\") is not last item in glbOpnDDLst[]).  The side-menu for this selection cannot "
				+ "be displayed because glbOpnDDLst[] is corrupted.\n\nPlease report this error.");
			tsrchStripDDLst();
			return;
		}
			// display side-container and enter it into glbOpnDDLst[]
	cntrNode.style.display = "block";
	glbOpnDDLst[ddRnk].cnNode = cntrNode;
			// color of itmNode already set to "hover" color, see above
			// tsrchArrBtnDwn() already used a call to srchMenuInp() to  enter values into 
			//		glbSrchMainArr[] and criterion box's shwVal box. 
	return;
	}


		//***********************************
		//******   Utility functions   ******
		//***********************************

	// tsrchStripDDLst() this function is called when we need to reset glbOpnDDLst[]
	//	and the criterion boxes to their "untouched" state (i.e., in case of an error
function tsrchStripDDLst() {
	var ddLstSz = glbOpnDDLst.length;
	var mainNode = null;
	var sideCnNode = null;
	var bkgClrObj;
	if (glbOpnDDLst.length > 0) {
		mainNode = glbOpnDDLst[0].bxNode;
		sideCnNode = glbOpnDDLst[0].cnNode;
		}
	tsrchClrDDLst(0);
	if (mainNode != null) {
		bkgClrObj = tsrchGetBkgClr(mainNode);
		if (bkgClrObj != null) { mainNode.style.backgroundColor = bkgClrObj.normClr; }
		else { mainNode.style.backgroundColor = "rgb(240,224,224)"; } // 'normal' color
		}
	if (sideCnNode != null) { sideCnNode.style.display = "none"; }
	glbOpnDDLst.splice(0);
	tsrchOpMnuPush(mainNode,null,sideCnNode);
	if (glbMusOvr.cnNode != null) { srchResetMusOvr(); }
	srchShowArrows();
	
	var wrnBxNode = document.getElementById("lockWarnBox");
	if (wrnBxNode == null) {
		alert("tsrchStripDDLst(): cannot find node for the \'menu-is-locked\' warning box.  "
					+ "This box cannot be closed.\n\nPlease report this error");
			}
	else { wrnBxNode.style.display = "none"; }
	return;
	}


	// tsrchSdObjFromItmId() is passed the node.id of a node corresponding to an item in one of 
	//	the criterion drop-down side-menus (ddNode).  It returns the entry (object) in the search arrays
	//	that corresponds to this ddNode.  On error it returns null.
function tsrchSdObjFromItmId(itmId) {
	var chId = itmId.slice(itmId.length - 1);
	var mainI = srchChToI(chId);
	if (Number.isNaN(mainI)) { return(null); }  // srchChToI() already issued an error message
	var txtId = itmId.slice(itmId.indexOf("_") + 1);
			// ddObj is the entry corresponding to itmNode.id in the global search arrays
	var ddObj = srchGtSdArrObj(glbSrchMainArr[mainI].sdArr,txtId);
	if (ddObj == null) {
		alert("tsrchSdObjFromItmId():  cannot find \"" + txtId + "\" in the \"" 
					+ glbSrchMainArr[mainI].txtNm +"\" (\'" + chId 
					+ "\') arrays.\n\nPlease report this error.");
		}
	return(ddObj);
	}

	//	6/8/20: I combined tsrchGetSdItmNode() and tsrchGetSdContr() into a single function:  
	//		tchGetNodeByClass().
	//	This function is passed a node(itmNode) and a string containing a className (clssNm).  
	//	The function looks at the className for the node and for up-to six generations of parent nodes 
	//		looking for a node whose className matches clssNm
	// Experience with the viewer indicated that the touchEvent sometimes occurs on a child of the
	//		expected node (e.g. <span> or <b> element).  If the touched-node (tchdNode) is not
	//		of the correct type (className == "crtSideItmClass"), tsrchGetSdItmNode() hunts through
	//		the parents up-to the 6th generation, looking for a parent with the correct className.
	//	The function returns the node whose className includes clssNm  It returns null on error.
function tchGetNodeByClass(itmNode,clssNm) {
	if (itmNode == null) {
		alert("tchGetNodeByClass(): node for item is null.  "
				+ "This probably is a fatal error.\n\n  Please report this error.");
		return(null);
		}
	if (itmNode.className.includes(clssNm)) { return(itmNode); }
	const parTop = document.body;
	var i;
	var parNode = itmNode.parentNode;
	for (i = 0; i < 6; i++) {
		if (parNode == parTop) { break; }
		if (parNode.className.includes(clssNm)) { return(parNode); } 
		parNode = parNode.parentNode;
		}
	alert("tchGetNodeByClass(): could not find the node whose className = \"" + clssNm
			+ "\" that is associated with current node (id = \"" + itmNode.id 
			+ "\", class = \"" + itmNode.className + "\").\n\n  Please report this error.");
	return(null);
	}

	// 1/22/22  tsrchClrDDLst() is passed an integer the rank (index) of the highest-ranking 
	//		side-menu that should remain displayed.  tsrchClrDDLst() removes any sidemenus of 
	//		rank (glbOpnDDLst[].rnk) > trmLimit by setting .cnNode.style.display == "none" or ""
	//		and adjusts glbOpnDDLst[] to reflect this change
	//	Beginning at the 'top' of the array and continuing while rnk > trmlimit, tsrchClrDDLst()
	//	 - removes (pops) the element from the array.
	//	 - sets bxNode.style.backgroundColor = "".
	//	 - sets cnNode.style.display = "".
	//	For rnk == trmLimit, tsrchClrDDLst():
	//	 - sets cnNode.style.display = "none".
	//	 - sets glbOpnDDLst[trmLimit].cnNode == NULL
	//   > NOTE: because of a potential issue with multiple calls to tsrchOpMnuPush(), 
	//		tscrhClrDDLst() DOES NOT push cnNode onto glbMnuOp[], even though it sets 
	//		glbOpnDDLst[ddRnk].cnNode = null!  THE CALLING FUNCTION MUST GET
	//		cnNode BEFORE CALLING tsrchClrDDLst() AND PUSH cnNode (possibly with bxNode)
	//		ONTO glbMnuOp[] by calling tsrchOpMnuPush().  This is a bad, unresolved,
	//		programming issue.
	// As of 1/23/22, tsrchClrDDLst() does NOT alter glbOpnDDLst[trmLimit].bxNode (or 
	//		glbOpnDDList[trmLimit].rnk).  CHANGES TO glbOpnDDLst[trmLimit].bxNode MUST
	//		BE DONE BY THE CALLING FUNCTION.
function tsrchClrDDLst(trmLimit) {
	var i;
	var curDD;  // object that is an element in glbOpnDDList[]
	var curRnk;  //	curDD.rnk
	var ddArrSz = glbOpnDDLst.length;
	var maxRnk = ddArrSz - 1;
			// limRnk => rank of top element of glbOpnDDList[] after trimming
			//		limRnk = glbOpnDDList[trmLimit].rnk == trmLimit
	var limRnk;  // glbOpnDDList[trmLimit].rnk 
			// check array size and get limRnk
	if (ddArrSz <= 0) {
		alert("tsrchClrDDLst(): glbOpnDDLst[] is empty; cannot trim the side-menus."
					+ "\n\nPlease report this error");
		return;
		}
			// 1/27/22 it is possible for trmLimit == ddArrSz if the top element in
			//	glbOpnDDLst[] has an open subMenu, i.e. if
			//	glbOpnDDLst[ddArrSz-1].cnNode != null.  In this case, we just need to
			//	close the open submenu.  NOTE:  THE CALLING FUNCTION MUST CALL tsrchOpMnuPush()
			//	TO PUSH THE subMenu onto glbMnuOpn[]
	var tmpCnNode = glbOpnDDLst[ddArrSz-1].cnNode;
	if ((ddArrSz == trmLimit) && (tmpCnNode != null)) {
		tmpCnNode.style.display = "none";
		glbOpnDDLst[ddArrSz-1].cnNode = null;
		return; 
		}
	if (ddArrSz <= trmLimit) {
		alert("tsrchClrDDLst(): glbOpnDDLst[] (" + ddArrSz 
					+ ") is smaller than the requested number of side-menus (" 
					+ trmLimit + " + 1).  Cannot trim the side-menus."
					+ "\n\nPlease report this error");
		return;
		}
	limRnk = glbOpnDDLst[trmLimit].rnk;
	if (trmLimit != limRnk) {
		alert("tsrchClrDDLst(): glbOpnDDLst[] index (" + trmLimit 
					+ ") does not match item rank (" + limRnk 
					+ ").\n\nPlease report this error");
		}
		// remove any sidemenus that are descendants of glbOpnDDLst[trmLimit].bxNode
	for (i = maxRnk; i >= trmLimit; i--) {
		ddArrSz = glbOpnDDLst.length;
		if (ddArrSz != (i+1)) {
			alert("tsrchClrDDLst():  current size of list of open menus (glbOpnDDLst.length = " 
						+ ddArrSz + ") does not match current rank (" + i 
						+ ").  Cannot remove side-menus.\n\nPlease report this error.");
			return;
			}
		curDD = glbOpnDDLst[i];
		if (curDD == null) {
			alert("tsrchClrDDList(): glbOpnDDList[" + i + "] == null (glbOpnDDLst.length = " 
						+ glbOpnDDLst.length + ".  Cannot remove side-menus.\n\nPlease report this error.");
			return;
			}
		if (curDD.bxNode == null) {
			alert("tsrchClrDDLst(): item node is null (glbOpnDDLst[" + i 
						+ "].bxNode == null).  Cannot remove side-menus.\n\nPlease report this error.");
			return;
			}
		curRnk = curDD.rnk;
		if (curRnk != i) {
			alert("tsrchClrDDLst(): index of glbOpnDDLst[] does not match item rank (glbOpnDDLst[" 
					+ i + "].rnk = " + curRnk + ").\n\nPlease report this error");
			return;
			}
				// curRnk > limRnk: remove these menus in their entirety
		if (curRnk > trmLimit) {
			glbOpnDDLst.splice(curRnk);  // remove element from array;
			curDD.bxNode.style.backgroundColor = "";
			srchSibArrowVis(curDD.bxNode,true,"black");
			if (curDD.cnNode == null) {
				if (curRnk < maxRnk) {
					alert("tsrchClrDDLst(): container node associated with \"" 
							+ curDD.bxNode.id + "\" is null (glbOpnDDLst[" + i 
							+ "].cnNode == null).  Cannot remove side-menus."
							+ "\n\nPlease report this error.");
					return;
					}
				} 
			else { curDD.cnNode.style.display = ""; }
			} // end if curRnk > trmLimit

			// remove the sidemenu belonging to glbOpnDDLst[trmLimit].bxNode, but 
			//	leave glbOpnDDLst[trmLimit].bxNode in glbOpnDDLst[]
		else if (curRnk == limRnk) {
			if (curRnk > 0) { srchSibArrowVis(curDD.bxNode,true,"black"); }
			else { srchShowArrows(); }
			if (curDD.cnNode == null) {
				if (curRnk < maxRnk) {
					alert("tsrchClrDDLst(): container node associated with \"" 
							+ curDD.bxNode.id + "\" is null (glbOpnDDLst[" + i 
							+ "].cnNode == null).  Cannot remove side-menus."
							+ "\n\nPlease report this error.");
					return;
					}
				} 
			else {
				curDD.cnNode.style.display = "none";  // still must push onto glbMnuOpn[]
					// NOTE: calling function MUST PUSH cnNode onto glbMnuOpn[]
					//	tsrchClrDDLst() does not push cnNode onto glbMnuOpn[] because
					//		this function doesn't know what to do with itmNode and
					//		we don't want two calls to tsrchOpnMnuPush() without
					//		first returning control to the browser.
				curDD.cnNode = null;  // the associated container is no longer displayed.
				}
			} // end if curRnk == limRnk
		
		else {
			alert("tsrchClrDDLst(): achieved impossible combination of values: curRnk = " 
					+ curRnk + "; limRnk = " + limRnk + ".\n\Please report this error.");
			return;
			}
		} // for loop through glbOpnDDLst[]
	return;
	}

	// tsrchOpMnuPush() was written 1/24/22 to replace tsrchResetCntr(), which has become 
	//	obsolete/troublesome with the introduction of multiple side menus.
	// tsrchOpMnuPush() is passed:
	//	 - step is an integer indicating what "level" of pushing is needed:
	//		 > step == 1 => the item being 'pushed' is a currently open menu (e.g., main 
	//			menu item) that is to be stored in glbCurMnuOpn.  
	//			 → itmNode.style.backgroundColor has already been set to a non-normal (e.g., 'hover' color).
	//			 → mnuCnNode.style.display already has been set to "block"
	//			 → if subCnNode != null, then subCnNode.style.display is either "block" or "none"
	//			In this case, tsrchOpMnuPush() will:
	//			 → push-out the object (if any) in glbPrevMnuOpn
	//			 → convert the object (if any) in glbCurMnuOpn into glbPrevMnuOpn
	//			 → add the item passed to it to glbCurMnuOpn

	// I think that we have to always push the new menu item onto glbCurMnuOpn, and then move it to glbPrevMnuOpn
	//	regardless of whether the new menu is being displayed ... I think handling the input becomes too 
	//	complicated otherwise.  Whether the menu is being displayed can be determined by the value of
	//	mnuCnNode.style.display.  Similarly, the status of itmNode can be determined by looking at 
	//	itmNode.style.backgroundColor.
	//
function tsrchOpMnuPush(newItmNode,newMnuCnNode,newSubCnNode) {
	var curItmNode;  // current glbMnuOpn[].itmNode
	var curMenuCnNode;
	var curSubCnNode;
	var curBkgClr;  // set to itmNode.style.backgroundColor
	var stdBkgClr;  // object with possible background colors for itmNode
	var curNodeDisp;  // valude of node.style.display
	var i;
		// 'push-down' items currently in glbMnuOpn[]
	for (i = glbMnuOpn.length - 1; i >= 0; i--) {
			// clean-up itmNode
		curItmNode = glbMnuOpn[i].itmNode;
			// remove element from glbMnuOpn[] if it is newItmNode
		if ((curItmNode != null) && (curItmNode == newItmNode)) {
			glbMnuOpn.splice(i,1);
			continue;
			}
			// remove itmNode from glbMnuOpn[] if itmNode is back in use
			//	this does NOT remove the element from glbOpnMnu, so container
			//	may continue to push down
		else if (tsrchIsItmInDDLst(curItmNode)) { glbMnuOpn[i].itmNode = null; }
			// push-down itmNode
		else if (curItmNode != null) {
			curBkgClr = curItmNode.style.backgroundColor.replace(/ /g,"");
			stdBkgClr = tsrchGetBkgClr(curItmNode);
			if (curBkgClr == stdBkgClr.hovrClr.replace(/ /g,"")) {
				curItmNode.style.backgroundColor = stdBkgClr.normClr;
				}
			else if (curBkgClr == stdBkgClr.normClr.replace(/ /g,"")) {
				curItmNode.style.backgroundColor = "";
				}
// START HERE 2/09/22
			else if ((glbTxtMusTrap.itmNode == curItmNode) 
							&& (stdBkgClr.actvClr != "") 
							&& (curBkgClr == stdBkgClr.actvClr.replace(/ /g,""))){
				alert("The mouse may have accidently slipped off the intended box while the "
							+ " mouse's button was down (and mouse's button may have been released "
							+ "\'off-target\').  You may need to repeat the previous action.");
				curItmNode.style.backgroundColor = stdBkgClr.hovrClr;
				}
// END HERE
			else if ( curBkgClr != "") {
				alert("tsrchOpMnuPush(): for glbMnuOpn[" + i + "].itmNode (\"" + curItmNode.id 
							+ "\"), the background color (\"" + curBkgClr + "\") did not match class (\"" 
							+ curItmNode.className + "\") background color (hover = \"" 
							+ stdBkgClr.hovrClr + "\"; normal = \"" + stdBkgClr.normClr 
							+ "\").  It may not be possible to reset "
							+ "the background color.\n\nPlease report this error.");
				curItmNode.style.backgroundColor = "";  // attempt to recover by forcing default value
				}
			}
			// clean-up menuCnNode
		curMenuCnNode = glbMnuOpn[i].menuCnNode;
			// remove element from glbMnuOpn[] if it is newItmNode
		if ((curMenuCnNode != null) && (curMenuCnNode == newMnuCnNode)) {
			glbMnuOpn.splice(i,1);
			continue;
			}
			// remove menuCnNode (but NOT entire element) from list if it is back in use;
		else if ( tsrchIsCnInDDLst(curMenuCnNode) ) { glbMnuOpn[i].menuCnNode = null; }
			// push-down menuCnNode
		else if (curMenuCnNode != null) {
			curNodeDisp = curMenuCnNode.style.display;
			if (curNodeDisp == "block") { curMenuCnNode.style.display = "none"; }
			else if (curNodeDisp == "none") { curMenuCnNode.style.display = ""; }
			else if (curNodeDisp != "") {
				alert("tsrchOpMnuPush(): for glbMnuOpn[" + i + "].menuCnNode (\"" + curMenuCnNode.id 
							+ "\"), an illegal value for \"display\" (\"" + curNodeDisp 
							+ "\") was encountered.  This menu may be displayed (or not displayed) "
							+ "inappropriately.\n\nPlease report this error.");
				curMenuCnNode.style.display = "";  // attempt to recover by forcing default value
				}
			}
		curSubCnNode = glbMnuOpn[i].subCnNode;
			// remove subCnNode from glbMnuOpn[] if it is back in use
		if ( tsrchIsCnInDDLst(curSubCnNode) ) { glbMnuOpn[i].subCnNode = null; }
			// push-down subCnNode
		else if (curSubCnNode != null) {
			curNodeDisp = curSubCnNode.style.display;
			if (curNodeDisp == "block") { curSubCnNode.style.display = "none"; }
			else if (curNodeDisp == "none") { curSubCnNode.style.display = ""; }
			else if (curNodeDisp != "") {
				alert("tsrchOpMnuPush(): for glbMnuOpn[" + i + "].subCnNode (\"" + curSubCnNode.id 
							+ "\"), an illegal value for \"display\" (\"" + curNodeDisp 
							+ "\") was encountered.  This menu may be displayed (or not displayed) "
							+ "inappropriately.\n\nPlease report this error.");
				curSubCnNode.style.display = "";  // attempt to recover by forcing default value
				}
			}  // end if curSubCnNode != null
		}  // end for loop to push-down current items
		// splice-out 'aged' menu items from glbMnuOpn[]
	i = 0;
	while (glbMnuOpn.length > i) {
		curItmNode = glbMnuOpn[i].itmNode;
		curMenuCnNode = glbMnuOpn[i].menuCnNode;
		curSubCnNode = glbMnuOpn[i].subCnNode;
		if (((curItmNode == null) || (curItmNode.style.backgroundColor == "")) 
				&& ((curMenuCnNode == null) || (curMenuCnNode.style.display == ""))
				&& ((curSubCnNode == null) || (curSubCnNode.style.display == ""))) {
			glbMnuOpn.splice(i,1);
			}
		else { i++; }
		}
		// add new object to top glbMnuOpn[]
	glbMnuOpn.push({itmNode: newItmNode, menuCnNode: newMnuCnNode, subCnNode: newSubCnNode});
	return;
	}


	// tsrchIsItmInDDLst() is passed a node to a menu-item.  Ths function reads through
	//	glbOpnDDLst[] looking for a match to the test-node in glbOpnDDLst[].bxNode.
	//	The function returns true if a match is found and false if no match is found.
function tsrchIsItmInDDLst(tstNode) {
	if (tstNode == null) { return(false); }
	var i;
	var ddLstSz = glbOpnDDLst.length;
	for (i = 0; i < ddLstSz; i++) {
		if (glbOpnDDLst[i].bxNode == tstNode) { return(true); }
		}
	return(false);
	}

function tsrchIsCnInDDLst(tstNode) {
	if (tstNode == null) { return(false); }
	var i;
	var ddLstSz = glbOpnDDLst.length;
	for (i = 0; i < ddLstSz; i++) {
		if (glbOpnDDLst[i].cnNode == tstNode) { return(true); }
		}
	return(false);
	}

	// tsrchGetBkgClr() is passed an item node belonging to either the main menu or
	//	to a criterion-box side menu.  tsrchGetBkgClr() determines the origin of
	//	the node and returns an object containing the background color for the 
	// 	active, hover, and normal modes of the item.  If the background color of the
	//	item does not change when active (i.e., active color == hover color), active
	//	color is "".  This allows the calling function to avoid unnecessary background
	//	color assignments.  On error, the function returns null.
function tsrchGetBkgClr(itmNode) {
	if (itmNode == null) {
		alert("tsrchGetBkgClr() was passed a null \"itmNode\".  The background color cannot be determined."
					+ "\n\nPlease report this error");
		return(null);
		}
	var itmClsNm = itmNode.className;
	if (itmClsNm.includes("menuDrpDwnItemClass")) {
		return({actvClr: "rgb(80,80,114)", hovrClr: "rgb(80,80,114)", normClr: "rgb(128,128,192)"});
		}
	else if (itmClsNm.includes("crtMainBoxClass")) {
		return({actvClr: "rgb(216,168,168)", hovrClr: "rgb(232,200,200)", normClr: "rgb(240,224,224)"});
		}
	else if (itmClsNm.includes("crtSideItmClass")) {
		return({actvClr: "rgb(216,168,168)", hovrClr: "rgb(232,200,200)", normClr: "rgb(240,224,224)"});
		}
	else {
		alert("tsrchGetBkgClr():  the className (\"" + itmClsNm + "\") is not in the switch-list.  "
				+ "The background color of \"" + itmNode.id 
				+ "\" could not be identified.\n\nPlease report this error."); 
		return(null);
		}
	return(null);
	}


		//****************************************
		//******   Main menu Touch Events   ******
		//****************************************

	// tchMenuDwn() is called when a touchstart event occurs on a main menu item
function tchMenuMainDwn(tchdNode,tevt) {
	tevt.preventDefault();
	var itmNode = null;  // node of object (menu item: "menuDrpDwnItemClass") on main menu
	var bigNode = null;  // node of menu container object ("menuDrpDwnContnrClass"
		// get nodes for menu
		// tchdNode could be the "big" container for the drop-down menu, the menu item, or
		//		a child of the menu item
	if (tchdNode.className.includes("menuDrpDwnContnrClass")) { bigNode = tchdNode; }
	else { itmNode = tchGetNodeByClass(tchdNode,"menuDrpDwnItemClass"); }
	if ((bigNode == null) && (itmNode == null)) {  // tchdNode is not a useable node
		alert("tchMenuMainDwn(): touched-element (id = \"" + tchdNode.id + "\"; class = \"" 
					+ tchdNode.className + "\") could not be identified.  No action taken."
					+ "\n\n  Please report this error.");
		return;
		}
			// if touchEvent occurred on the menu item (or a child, need to get container
	if (bigNode == null) { // tchdNode was the menu item (or a child) => container node is null
		bigNode = itmNode.parentNode;
		if (bigNode == null) {
			alert("tchMenuMainDwn(): could not find the parentNode of the menu item (id = \"" 
					+ itmNode.id + "\"; class = \"" + itmNode.className + "\").  "
					+ "Could not display the drop-down menu.\n\n  Please report this error.");
			return;
			}
		if (!bigNode.className.includes("menuDrpDwnContnrClass")) {
			alert("tchMenuMainDwn(): the parentNode (class = \"" + bigNode.className 
					+ "\") of the menu item (id = \"" +itmNode.id + "\"; class = \"" 
					+ itmNode.className + "\") is not the container for the menu item.  "
					+ "Could not display the drop-down menu.\n\n  Please report this error.");
			return;
			}
		}  // end "if bigNode == null"
	if (itmNode == null) {  // touchEvent occurred on the container, need to get item node from bigNode
		itmNode = tchMenuItmFromCntr(bigNode,"menuDrpDwnItemClass");
		if (itmNode == null) { return; } // error message already provided by tchMenuItmFromCntr()
		}
			// get drop-down menu content node
	var contNode = tchMenuItmFromCntr(bigNode,"menuDrpDwnContentClass");
	if (contNode == null) { return; } // error message already provided by tchMenuItmFromCntr()
		// if criterion-box side menu is selected, unselect it.
	if (glbOpnDDLst.length > 0) { tsrchStripDDLst(); }  // this pushes criterion box onto gblMnuOpn[]
	var bkgClrObj = tsrchGetBkgClr(itmNode);
	if (bkgClrObj != null) { itmNode.style.backgroundColor = bkgClrObj.hovrClr; }
	else { itmNode.style.backgroundColor = "rgb(80,80,114)"; } //'hover' color
	contNode.style.display = "block";
	tsrchOpMnuPush(itmNode,contNode,null);
	return;	
	}

	// tchMenuItmFromCntr() is passed the parentNode (cntrNode), presumably a menu container 
	//		(class = "menuDrpDwnContnrClass"), and a text-string (clssNm) that is a className.  
	//	The function gets the node-list of children whose className matches clssNm, checks to
	//		make certain that there is only one element in the list, and then returns the
	//		node that the first element in the node-list.  It returns null if the number of
	//		nodes in the list is not 1.
function tchMenuItmFromCntr(cntrNode,clssNm) {
	var nodeLst = cntrNode.getElementsByClassName(clssNm);
	var lstSz = nodeLst.length;
	if (lstSz <= 0) {
		alert("tchMenuItmFromCntr(): could not find a child-node of the menu container-node (id = \"" 
					+ cntrNode.id + "\", class = \"" + cntrNode.className + "\") whose className = \"" 
					+ clssNm + "\".\n\n  Please report this error.");
		return(null);
		}
	else if (lstSz > 1) {
	alert("tchMenuItmFromCntr(): There should be ONLY ONE child-node of the menu container-node (id = \"" 
				+ cntrNode.id + "\", class = \"" + cntrNode.className + "\") whose className = \"" 
				+ clssNm + "\".  We found " + lstSz + " nodes of this class.\n\n  Please report this error.");
		return(null);
		}
	return(nodeLst[0]);	
	}

	//	6/10/20:  because the extensive coding to get nodes and check global variables is identical for
	//		both touchstart and touchend events on a menu subItem.  I combined the functions handling
	//		all touchEvents on these objects into a single function, with "if tevt.type == ?" at the 
	//		end of the function to handle the different actions for different events.
	// tchMenuItmDwn() is called by a touchEvent on an item on one of the drop-down menus.
	// The function:
	//	 - gets the relevant nodes and checks to make certain that the container for the clicked item 
	//		matches the container holding the content of the drop-down menu.
	//	 - either:
	//		 > calls menuSetSrtByItm() for "Sort by items" (i.e., id begins with "menuSrtBy_")
	//		 > uses a switch to call the appropriate function to carry-out the action specified by the
	//			clicked item (i.e., open an "About" box, open a browser window ("More about PNWU),
	//			download a PDF, or change sorting direction).
function tchMenuClcked(tchdNode,tevt) {
	tevt.preventDefault();
	tevt.stopPropagation();
		// itmNode is the box on the drop-down menu, NOT the main-menu item
	var itmNode = tchGetNodeByClass(tchdNode,"menuDrpDwnSubItem");
	if (itmNode ==  null) { return; } // error message by tchGetNodeByClass()
	var itmId = itmNode.id;  // need this at end of function, can use it sooner
	if (itmId == "") {
		alert("tchMenuClcked(): the item (class = \"" + itmNode.className 
				+ "\") on the drop-down menu that was touched must have an \".id\"."
				+ "\n\n  Please report this error.");
		return;
		}
	var contNode = tchGetNodeByClass(itmNode,"menuDrpDwnContentClass");
	if (contNode == null) { return; }  // error message by tchGetNodeByClass()
	var mainNode = tchGetNodeByClass(contNode,"menuDrpDwnContnrClass");
	if (mainNode == null) { return; }  // error message by tchGetNodeByClass()
	if (mainNode.firstElementChild.className.includes("menuDrpDwnItemClass")) {
		mainNode = mainNode.firstElementChild;
		}
	else {  // don't return on this error
		alert("tchMenuClcked(): could not find main-menu box for \"" + itmId 
					+ "\".  SlideBox may hang if items are chosen from the main menu."
					+ "\n\nPlease report this error."); 
		}
	var oldCnNode;
	var bkgClrObj;
			// if a different menu is open (this should not happen), close it
	if (glbMnuOpn.length < 1) {
		alert("tchMenuClcked(): glbMnuOpn[] is empty, which (incorrectly) implies that the "
					+ "menu containing the clicked item (\"" + itmNode.id 
					+ "\") is not open.\n\n  Please report this error.");
		}
	else {
		oldCnNode = glbMnuOpn[glbMnuOpn.length-1].menuCnNode;
		if (oldCnNode != contNode) {
			alert("tchMenuClcked(): wrong menu (\"" + oldNode.id + "\") is open; it should be \"" 
						+ contNode.id + "\".\n\n  Please report this error.");
					// set-up current menu and push onto glbMnuOp
			bkgClrObj = tsrchGetBkgClr(mainNode);
			if (bkgClrObj != null) { mainNode.style.backgroundColor = bkgClrObj.hovrClr; }
			else { mainNode.style.backgroundColor = "rgb(80,80,114)"; }
			contNode.style.display = "block";
			tsrchOpMnuPush(mainNode,contNode,null);
			}
		}
		// set itmNode ("menuDrpDwnSubItem") to :active state
	var evtType =  tevt.type;
//		1/08/22 specifying 'active' background color apparently is unnecessary
//			'active' background color is set to CSS 'active' color without this if statement
//	if (evtType == "touchstart") {  // this seems to be unnecessary ...
//		itmNode.style.backgroundColor = "rgb(192,192,216)"; 
//	}
//	else if ((evtType == "touchend") || (evtType == "touchcancel")) {
	if ((evtType == "touchend") || (evtType == "touchcancel")) {
				// execute button's function
		if (itmId.slice(0,10) == "menuSrtBy_") { menuSetSrtByItm(itmId.slice(10)); }
		else {
			switch(itmId) {
				case "menuSrtOrdAsc" : menuSetSrtByDir(1); break;
				case "menuSrtOrdDec" : menuSetSrtByDir(-1); break;
					// "About" menu items now handled by tchAbtMenu(): 5/08/22
				default :
						if (!tchAbtMenu(itmId)) {  // tchAbtMenu() returns true if itmId == glbInSAbtLst[].mnuId
							alert("tchMenuClcked():  cannot perform the action requested because \"" 
									+ itmId + "\" is not recognized.\n\n  Please report this error.");
							}
						break;
				}  // end of switch on non-sortBy actions
			}  // end of onClick actions
				// reset itmNode to normal CSS state; close (.display = none) & reset contentNode
		itmNode.style.backgroundColor = ""; 
		tsrchOpMnuPush(null,null,null);  // no menu open
		}
	else if (evtType != "touchstart") {  // 1/08/22: "touchstart action is no longer defined
		alert("tchMenuClcked(): need to define actions for \"" + evtType 
					+ "\" events.\n\n  Please report this error.");
		}
	return;
	}

	// tchAbtMenu() written 5/08/22 to handle touchend events on institution-specific "About" menu items.
	// tchAbtMenu() is passed the itmId of touched-node.
	//	The function reads through glbInSAbtLst for glbInSAbtLst[].mnuId == itmId.
	//	If a match is found the function calls glbInSAbtLst[].mnuClk and returns true.
	//	If no match is found, the function returns false.
	//	NOTE:  AS OF 5/08/22 => THIS CODE HAS NOT BEEN TESTED!!
function tchAbtMenu(itmId){
	var i;
	const lstSz = glbInSAbtLst.length;
	for (i = 0; i < lstSz; i++) {
		if (itmId == glbInSAbtLst[i].mnuId) {
			if (glbInSAbtLst[i].mnuClk == null){
				alert("tchAbtMenu(): no function associated with clicking-on \"About\" menu item. \"" 
						+ itmId + "\".\n\nPlease report this error.");
				}
			else { glbInSAbtLst[i].mnuClk; }
			return(true);
			}
		}
	return(false);
	}
