//	jrsbSelectAction.js
//	Copyright 2022  James Rhodes
//	Copyright 2020, 2021, 2022  Pacific Northwest University of Health Sciences

//	jrsbSelectAction.js is a component of the "Slide Box" part of "Multifocal-plane Virtual Microscope"
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
//	jrsbSelectAction.js is part of the "SlideBox"
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

// jrsbSelectAction.js contains =>
//		functions involved in responding to user actions (e.g., changing selection criteria) on the first ("Selection")
//		page of slide box.
//	this file was created on 11/12/21 by splitting jrsbSelect.js (created on 5/25/20) into two files:
//		jrsbSelectInit.js and this file (jrsbSelectAction.js)


// ********************************************************************************
// ******       hide other arrows when mouse is over crtSideContainer        ******
// ******      show other arrows when mouse moves of  crtSideContainer       ******
// ********************************************************************************

	// for efficiency, names of arrows uses index into glbSrchMainArr[] rather than
	//	glbSrchMainArr[].txtId (and srchIdToI(txtId,curArr)).

	// srchHideArrow() is called on a mouseover event with arrI equal to the index
	//		in glbSrchMainArr[] of the container that mouse just moved over.
	//	The changes the visibility to "hide" of the arrows for all criterion boxes 
	//		except current box.	
function srchHideArrows(arrI) {
	var i;
	var idArrow;   // id of node containing arrow.
	var nodeArrow;
	for (i = 0; i < glbSrchMainArr.length; i++) {
		idArrow = glbSrchMainArr[i].txtId + "Arrow";
		nodeArrow = document.getElementById(idArrow);
		if (nodeArrow == null) {
			alert("srchHideArrow("+arrI+"): can't find arrow \"" + idArrow + "\" for criterion box #" + i + ".");
			continue;
			}
		if (i == arrI) { nodeArrow.style.visibility = "visible"; }
		else { nodeArrow.style.visibility = "hidden"; }
		}
	return;
	}

function srchShowArrows() {
	if (glbOpnDDLst.length > 0) { return; }  // don't show arrows if menu is locked
	var i;
	var idArrow;   // id of node containing arrow.
	var nodeArrow;
	for (i = 0; i < glbSrchMainArr.length; i++) {
		idArrow = glbSrchMainArr[i].txtId + "Arrow";
		nodeArrow = document.getElementById(idArrow);
		if (nodeArrow == null) {
			alert("srchHideArrow(): can't find arrow \"" + idArrow + "\" for criterion box #" + i + ".");
			continue;
			}
		nodeArrow.style.visibility = "visible";
		}
	return;
	}



// *******************************************************************
// ******    functions for locking/unlocking criterion menus    ******
// *******************************************************************

	// srchResetMusOvr() is called in cases where previously 'locked' menus have
	//	been unlocked and glbMusOvr needs to be reinitialized
function srchResetMusOvr() {
	if (glbMusOvr.cnNode != null) {
		glbMusOvr.cnNode.style.display = "";
		} 
	glbMusOvr.cnNode = null;
	glbMusOvr.bxNode = null;
	var wrnBoxNode = document.getElementById("lockWarnBox");
	if (wrnBoxNode == null) {
		alert("srchResetMusOvr(): cannot get node for \'locked\' menu warning box.  "
					+ "This warning box cannot be closed.\n\nPlease report this error.");
		}
	else { wrnBoxNode.style.display = "none"; }
	return;
	}

	// srchMusOvrMainCrt() is called by a mouseover event on one of the main criterion
	//	boxes.  If another menu is 'locked' open, srchMusOvrMainCrt() prevents the
	//	criterion's sidemenu from being displayed when the mouse 'hovers' over the
	//	the criterion box.  It also displays the "locked-menu" warning.
function srchMusOvrMainCrt(musNode) {
		// musNode should be itmNode, since only the main-criterion boxes have the 
		//	onmouseover eventlistener attached, calling tchGetNodeByClass()
		//	ensures that we know that we're dealing with the main-criterion box 
	var itmNode = tchGetNodeByClass(musNode,"crtMainBoxClass");
	if (itmNode == null) { return; } // tchGetNodeByClass() issued the error message
	var itmIdTxt = itmNode.id.slice(0,3);
	itmI = srchIdToI(itmIdTxt,glbSrchMainArr);
	if (Number.isNaN(itmI)) { return; } //srchIdToI() already issued error message.
	
		// glbMusOvr.bxNode should be null, but we should check
	var oldBxNode = glbMusOvr.bxNode;  // NOTE: this variable is reused for glbOpnDDLst[0].bxNode
	var oldI;
	var oldCnNode;
	var warnTxt;
	var arrTop;
	if (oldBxNode != null) {
		alert("srchMusOvrCrt(): mouse moved over \"" + itmNode.id + "\" without moving off \"" 
					+ oldBxNode.id + "\"; resetting glbMusOvr.\n\nPlease report this error.");
		srchResetMusOvr();
		}
			// get side-container belonging to itmNode
	var cntrNode = document.getElementById("crtSdCntr_" + itmIdTxt);
	if (cntrNode == null) {
		alert("srchMusOvrCrt(): could not find node for container \"crtSdCntr_" + itmIdTxt
				+ "\".  The selection menus may not display correctly because the menu for "
				+ "limiting slides by \"" + glbSrchMainArr[itmI].txtNm 
				+ "\" cannot be hidden.\n\nPlease report this error.");
		return;
		}
		// The first part of the text in the "menu-locked" warning is the same regardless
		//	of which menu is 'locked' open
	warnStr = "The menu for the \"Limit slides by: <b>" + glbSrchMainArr[itmI].txtNm;
	warnStr += "</b>\" criterion cannot be displayed because ";
	if (glbOpnDDLst.length > 0) {  //there is a locked criterion menu
		oldBxNode = glbOpnDDLst[0].bxNode;
			// don't do anything if mouse is over the 'locked' menu
		if (oldBxNode == itmNode) { return; }
		else {
			oldI = srchIdToI(oldBxNode.id.slice(0,3),glbSrchMainArr);
			if (Number.isNaN(oldI)) { warnStr += "another menu"; }
			else {
				warnStr += "the menu for \"" + glbSrchMainArr[oldI].txtNm + "\"";
				}
			warnStr += " is \'locked\' open.&nbsp; Click anywhere on SlideBox ";
			warnStr += "(<span style='font-size:80%'>except on the \'locked\' criterion ";
			warnStr += "box &amp; menu</span>) to unlock the menu.";
			}
		} // end if a criterion menu is 'locked'
	else if (glbMnuOpn.length > 0) { // a main-menu may be locked open
			// only the top-level of glbMnuOpn[] can contain a 'locked' main-menu item
			//	since tsrchOpMnuPush() hides (.style.display = "none" or "") the drop-down
			//	menu when it pushes new items onto glbMnuOpn[].
		arrTop = glbMnuOpn.length - 1;
		oldBxNode = glbMnuOpn[arrTop].itmNode;
		oldCnNode = glbMnuOpn[arrTop].menuCnNode;
			// !oldBxNode.className.includes("menuDrpDwnItemClass") implies oldBxNode is 
			//		NOT a main-menu item
			// oldCnNode.style.display != "block" implies that the menu isn't locked
			// if main-menu item isn't locked, then don't do anything
		if ((oldBxNode == null) || (!oldBxNode.className.includes("menuDrpDwnItemClass"))
				|| (oldCnNode == null) || (oldCnNode.style.display != "block")) {
			return;
			}
		else {
			warnStr += "one of the main menu's drop-down menus is \'locked\' open.&nbsp; "
			warnStr += "Click anywhere on SlideBox "
			warnStr += "(<span style='font-size:80%'>except on the \'locked\' main-menu "
			warnStr += "item</span>) to unlock the menu."
			}
		}  // end else if main-menu is 'locked'
	else { return; } // no locked menu
	cntrNode.style.display = "none";
	glbMusOvr.bxNode =  itmNode;
	glbMusOvr.cnNode = cntrNode;
	var wrnBoxNode = document.getElementById("lockWarnBox");
	if (wrnBoxNode == null) {
		alert("srchResetMusOvr(): cannot get node for \'locked\' menu warning box.  "
					+ "This warning box cannot be displayed.\n\nPlease report this error.");
		}
	else {
		wrnBoxNode.innerHTML = warnStr;
		wrnBoxNode.style.display = "block";
		}
	return;
	}	

	// srchMusOutMainCrt() is called by a mouseout event on one of the main criterion
	//	boxes.  The function returns without doing anything if glbMnuOvr.bxNode is null 
	//	(i.e. srchMusOvrMainCrt() did not prevent the sidemenu from being displayed).
	//	Otherwise the function resets glbMnuOvr
function srchMusOutMainCrt(musNode) {
	if ((glbMusOvr.bxNode == null) && (glbMusOvr.cnNode == null)) { return; }
	else if (glbMusOvr.bxNode == null) {
		alert("srchMusOutMainCrt(): glbMusOvr mismatch: bxNode is null, but cnNode = \""
					+ glbMusOvr.cnNode.id + "\"; glbMusOvr is being reset."
					+ "\n\nPlease report this error.");
		srchResetMusOvr();
		return;
		}
		// musNode should be itmNode, since only the main-criterion boxes have the 
		//	onmouseover eventlistener attached, calling tchGetNodeByClass()
		//	ensures that we know that we're dealing with the main-criterion box 
	var oldBxNode = glbMusOvr.bxNode;
	var itmNode = tchGetNodeByClass(musNode,"crtMainBoxClass");
	var cntrNode;
	if (itmNode == null) { return; } // tchGetNodeByClass() issued the error message
	if (itmNode != oldBxNode) {
		alert("srchMusOutMainCrt(): the item (\"" + itmNode.id 
					+ "\") that the mouse is leaving is different from the item (\"" 
					+ oldBxNode.id + "\" over which it had been hovering."
					+ "\n\nPlease report this error");
		cntrNode = document.getElementById("crtSdCntr_" + itmNode.id.slice(0,3));
		if (cntrNode == null) {
			alert("srchMusOutMainCrt(): cannot find the container (\"crtSdCntr_" 
					+ itmNode.id.slice(0,3) + ") for the criterion box (\"" + itmNode.id 
					+ "\") that the mouse was leaving.\n\nPlease report this error");
			}
		else if (cntrNode.style.display == "none") { cntrNode.style.display = ""; }
		}
		// else (itmNode == oldBxNode)
		//	 => mouse leaving the box it was supposed to be hovering over
	srchResetMusOvr();  // clear glbMusOvr
	return;
	}

	// NOTE: except for events on text-input boxes (see: srchClkTxtBx(), below)
	//	 'mousedown' and 'click' events on main-criterion boxes are handled by tsrchCrtMainDwn() 
	//		and tsrchCrtMainUp(), since we don't have to deal with building missing part of
	//		an incomplete glbOpnDDLst[].

	// srchTxtMusEvt() handles mousedown and click events on the criterion box's 2nd-line
	//	text-input boxes.  If the criterion box menu's are locked, the event is passed
	//	tsrchCrtMainDwn() or tsrchCrtMainUp(), since glbOpnDDLst[] may need to be modified
	// "mousedown" and "click" events on text-input boxes don't do much except change focus
	//	and background colors; the values entered into these boxes are recorded in glbSrchMainArr[]
	//	in response to text-input-box "change" events
function srchTxtMusEvt(musNode,musEvt) {
//	musEvt.preventDefault();
	musEvt.stopPropagation();
	var evtType = musEvt.type
		//  get information for main node
	var mainNode = tchGetNodeByClass(musNode,"crtMainBoxClass");
	if (mainNode == null) { return; } // tchGetNodeByClass() already issued error message
	var ddBxNode = null;

// TEMPORARY
var tmpNode;
glbTmpStr += "\n > TxtBoxEvt: musNode = \"" + musNode.id + "\"; mainNode = \"" + mainNode.id + "\"\n >>> event = \"" + musEvt.type + "\"; target = \"" + musEvt.target.id + "\".";
// END TEMPORARY

	var mainBkgClr = "";
	var bkgClrObj = tsrchGetBkgClr(mainNode);  // get background colors for mainNode
			// if mainNode.style.backgroundColor = "", background color should
			//		be 'hover' color as long as mouse is over mainNode
	if (bkgClrObj != null) {
		if (evtType == "mousedown") { mainBkgClr = bkgClrObj.actvClr; }
		}
	else {  // call to tsrchGetBkgClr() failed, bkgClrObj == null
		if (evtType == "mousedown") { mainBkgClr = "rgb(216,168,168)"; }
		}
		//on mousedown: don't do anything except set mainNode color and glbTxtMusTrap
	if (evtType == "mousedown") {
			// set background color => this also closes any open main menus
		mainNode.style.backgroundColor = mainBkgClr;
		tsrchOpMnuPush(mainNode,null,null);
			// set the mouse trap
		glbTxtMusTrap.txtNode = musNode;
		glbTxtMusTrap.itmNode = mainNode;
		}
	else if (evtType == "click") {
			// give focus to musNode
		musNode.focus();
// TEMPORARY
//tmpNode = document.activeElement;
//glbTmpStr += "; !! focus is on: ";
//if (tmpNode == null) { glbTmpStr += "nothing"; }
//else { glbTmpStr += "\"" + tmpNode.id + "\""} 
//musNode.style.backgroundColor = "orange";
// END TEMPORARY

		glbPrevFocus.bxNode = musNode;
		glbPrevFocus.bxVal = musNode.value;
			// set mainNode background color to ""
		mainNode.style.backgroundColor = mainBkgClr;
			// cannot call tsrchStripDDLst() if glbOpnDDLst[] is empty
			// tsrchStripDDLst() will push glbOpnDDLst[0].bxNode onto glbMnuOpn[],
			//	 but need to push mainNode if mainNode != glbOpnDDLst[0].bxNode

// TEMPORARY
//glbTmpStr += "; mainNode background color = \"" + mainNode.style.backgroundColor + "\".";
//END TEMPORARY

		if (glbOpnDDLst.length > 0) {
				// push glbOpnDDLst[0].bxNode onto glbMnuOpn[] before pushing mainNode
				//	(if mainNode != glbOpnDDLst[0].bxNode) onto glbMnuOpn[]
			ddBxNode = glbOpnDDLst[0].bxNode;
			tsrchStripDDLst();
			if (ddBxNode != mainNode) {tsrchOpMnuPush(mainNode,null,null); }
			}
		else { tsrchOpMnuPush(mainNode,null,null); }
			// clear the mouse trap
		glbTxtMusTrap.txtNode = null;
		glbTxtMusTrap.itmNode = null;
		}
	else {
		alert("srchTxtMusEvt(): cannot handle an \"" + evtType + "\" event on \"" + musNode.id 
					+ "\".  Size of glbOpnDDLst[] is " + glbOpnDDLst.length 
					+ ".\n\nPlease report this error.");
		}
	return;
	}

	//srchMusDwnSdArr() is called by a 'mousedown' event on an array-type (non-active) criterion side-menu
	//	item.  This function has to deal with two possible scenarios:
	//	 - part of a menu already is 'locked' open, and the item that is being clicked is in the part of
	//		the menu that is locked (i.e. itm.rnk <=  top rank of locked part of the menu).
	//		 > I think that in this case, srchMusDwnSdArr() can just call tsrchArrBtnDwn() with the same
	//			proviso as for tsrchCrtMainDwn() that we need to add srchResetMusOvr() to the function 
	//			to clean-up glbMusOvr.
	//	 - the item is on a part of the menu that is being displayed by the CSS 'hover' feature.  I don't
	//		think that it matters whether part of the menu is 'locked' open or whether the entire menu
	//		is displayed by mouse 'hovering'.
	//		 > we are guaranteed that, if there is a 'locked' menu, the part of the menu that is in 
	//			glbOpnDDLst[] is an ancestor to the item that is being clicked, since display of a 
	//			non-ancestor menu is prevented by srchMusOvrSdArr()
	//		 > I think we build glbOpnDDLst[] 'backwards', using item.rnk to determine position in 
	//			in glbOpnDDLst[], using tchGetNodeByClass() to get the parent item for each level
	//			of glbOpnDDLst[].
	//		 > Once glbOpnDDLst[] is built, we should be able to use tsrchArrBtnDwn().
	
	
// NOTE: srchSbMnuDisp() HAS TO BE MODIFIED TO HANDLE mouseover & mouseout events on 'locked' menu items
//	this function also can be called by srchMusUpSdArr() to display the top-most item's side-menu
function srchMusDwnSdArr(tchdNode,tevt) {
	tevt.preventDefault();
	tevt.stopPropagation();
	var i;
		// get itmNode corresponding to tchdNode
	var itmNode = tchGetNodeByClass(tchdNode,"crtSideItmClass");
	if (itmNode == null) { return; } // tchGetNodeByClass() already issued error message
	var itmId = itmNode.id;
			// get entry in global search arrays corresponding to itmNode
	var ddObj = tsrchSdObjFromItmId(itmId);
	if (ddObj == null) {
		alert("srchMusDwnSdArr(): ddObj == null; cannot respond to \"" + tevt.type 
					+ "\" event on \"" + itmId 
					+ "\".  The menu cannot be locked.\n\nPlease report this error");
		return;
		}
	var ddRnk = ddObj.rnk;
	var tmpArr = [];
	var cntrNode;
	var parBxNode;
	var parCnNode;
	var tmpArrObj;
	var ddLstTopRnk;
	var bkgClrObj;
	var ddLstSz = glbOpnDDLst.length
			// build glbOpnDDLst[]
	if (ddLstSz < ddRnk) {  // use tmpArr[] to build/add to glbOpnDDLst[]
			// get item's side-menu container (cntrNode)
		cntrNode = srchGetSbMnuFromItm(itmNode); // don't need to check for null
		tmpArr[0] = {bxNode: itmNode, cnNode: cntrNode, rnk: ddRnk };
			// reiteratively get parent containers and items for items that are
			//	not in glbOpnDDLst[]
		parBxNode = itmNode;
		for (i = ddRnk; i > ddLstSz; i--) {
					// get menu that is the parent of clicked item (parCnNode)
			if (i > 1) {  // get rank = i-1 parent node
				parCnNode = tchGetNodeByClass(parBxNode,"crtSbMnuContainerClass");
				if (parCnNode == null) {
					alert("srchMusDwnSdArr(): couldn\'t find the menu (className "
								+ "= \"crtSbMnuContainerClass\"; rank = " + (i-1) + ")"
								+ "containing \"" + parBxNode.id + "\". The \"" + tevt.type 
								+ "\" action on \"" + ddObj.txtNm 
								+ "\" cannot be processed.\n\nPlease report this error.");
					return;
					}
				else { // parent of menu should be the next item-ancestor.
					parBxNode = tchGetNodeByClass(parCnNode,"crtSideItmClass");  //still need to validate parBxNode
					}
				}  // end if i > 1
			else if (i == 1) {  // get parent node for first side-menu
				parCnNode = tchGetNodeByClass(parBxNode,"crtSideContainerClass");
				if (parCnNode == null) {
					alert("srchMusDwnSdArr(): couldn\'t find the menu (className "
								+ "= \"crtSideContainerClass\"; rank = 0) containing \"" 
								+ parBxNode.id + "\". The \"" + tevt.type 
								+ "\" action on \"" + ddObj.txtNm 
								+ "\" cannot be processed.\n\nPlease report this error.");
					return;
					}
				else { // grandparent or  of menu should be the next item-ancestor.
					parBxNode = tchGetNodeByClass(parCnNode.parentNode,"crtMainBoxClass");
					}
				}  // end if i == 1
			else {
				alert("srchMusDwnSdArr(): illegal (i = " + i + ") value in loop; item rank = " 
							+ ddRnk + "; size of glbOpnDDLst[] = " + ddLstSz + ". The \"" 
							+ tevt.type + "\" action on \""+ ddObj.txtNm 
							+ "\" cannot be processed.\n\nPlease report this error.");
				return;
				}
					// push item-ancestor (parBxNode), associated menu (parCnNode), and rank onto tmpArr[]
					// set parCnNode.style.display = "block"
			if (parBxNode == null) {
				alert("srchMusDwnSdArr():  unable to get the node for the selected item of rank = " 
							+ (i-1) +". The \"" + tevt.type + "\" action on \"" + ddObj.txtNm 
							+ "\" cannot be processed.\n\nPlease report this error.");
				return;
				}
			if ((i > 1) && (!parBxNode.className.includes("crtSideItmClass"))) {
				alert("srchMusDwnSdArr():  the className (\"" + parBxNode.className 
							+ "\") for the selected item (\"" + parBxNode.id 
							+ "\") is not correct for a menu-item of rank = " + (i-1)
							+ " (should be \"crtSideItmClass\"). The \"" + tevt.type 
							+ "\" action on \"" + ddObj.txtNm 
							+ "\" cannot be processed.\n\nPlease report this error.");
				return;
				}
			if ((i == 1) && (!parBxNode.className.includes("crtMainBoxClass"))) {
				alert("srchMusDwnSdArr():  the className (\"" + parBxNode.className 
							+ "\") for the selected item (\"" + parBxNode.id 
							+ "\") is not correct for a main criterion box "
							+ " (should be \"crtMainBoxClass\"). The \"" + tevt.type 
							+ "\" action on \"" + ddObj.txtNm 
							+ "\" cannot be processed.\n\nPlease report this error.");
				return;
				}
			tmpArr.push({bxNode: parBxNode, cnNode: parCnNode, rnk: (i-1)});
			parCnNode.style.display = "block";
			bkgClrObj = tsrchGetBkgClr(parBxNode);
			if (bkgClrObj != null) { parBxNode.style.backgroundColor = bkgClrObj.hovrClr; }
			else { parBxNode.style.backgroundColor = "rgb(232,200,200)"; } // 'hover' color
			} // end of for loop
				// copy items from tmpArr[] to glbSrchMainArr[]
					// align top item in tmpArr[] with top item in glbOpnDDLst[]	
		tmpArrObj = tmpArr.pop();
		if (ddLstSz > 0) {
			ddLstTopRnk = glbOpnDDLst[ddLstSz-1].rnk;
			if (ddLstSz != ddLstTopRnk + 1) {
				alert("srchMusDwnSdArr():  there is a mismatch between the size of glbOpnDDLst (" 
							+ ddLstSz + ") and rank (glbOpnDDLst[" + (ddLstSz-1) + "].rnk = " 
							+ ddLstTopRnk + "). The \"" + tevt.type + "\" action on \"" + ddObj.txtNm 
							+ "\" cannot be processed.\n\nPlease report this error.");
				return;
				}
			if (ddLstTopRnk == tmpArrObj.rnk) { // this should be the case
				if ( glbOpnDDLst[ddLstSz-1].bxNode != tmpArrObj.bxNode ) {
					alert("srchMusDwnSdArr(): the item (\"" + tmpArrObj.bxNode.id + "\") of rank = " 
								+ tmpArrObj.rnk + ", does not match that in glbOpnDDList[" + ddLstTopRnk 
								+ "] (\"" + glbOpnDDLst[ddLstSz-1].bxNode.id + "\"). The \"" + tevt.type 
								+ "\" action on \"" + ddObj.txtNm 
								+ "\" cannot be processed.\n\nPlease report this error.");
					return;
					}
				else if (glbOpnDDLst[ddLstTopRnk].cnNode == null) {
					glbOpnDDLst[ddLstTopRnk].cnNode = tmpArrObj.cnNode;
					}
				else if (glbOpnDDLst[ddLstTopRnk].cnNode != tmpArrObj.cnNode) {
					alert("srchMusDwnSdArr(): there is a mismatch between glbOpnDDLst[" 
								+ ddLstTopRnk + "].cnNode and menu for rank = " + tmpArrObj.rnk 
								+ ". The \"" + tevt.type + "\" action on \"" + ddObj.txtNm 
								+ "\" cannot be processed.\n\nPlease report this error.");
					return;
					}
				} // end if ddLstTopRnk == tmpArrObj.rnk
			else if (ddLstSz == tmpArrObj.rnk) { glbOpnDDLst.push(tmpArrObj); }
			else {
				alert("srchMusDwnSdArr():  there is a mismatch between the size of glbOpnDDLst[] (" 
							+ ddLstSz + ") and the rank (" + tmpArrObj.rnk + ") of \"" 
							+ tmpArrObj.bxNode.id + "\". The \"" + tevt.type + "\" action on \"" 
							+ ddObj.txtNm + "\" cannot be processed.\n\nPlease report this error.");
				return;
				}
			}  // end if ddLstSz > 0
					// glbOpnDDLst[] is empty
		else if (tmpArrObj.rnk == 0) { glbOpnDDLst.push(tmpArrObj); }
		else {
			alert("srchMusDwnSdArr():  glbOpnDDLst[] is empty, but the rank (" + tmpArrObj.rnk + ") of \"" 
						+ tmpArrObj.bxNode.id + "\" is not 0. The \"" + tevt.type + "\" action on \"" 
						+ ddObj.txtNm + "\" cannot be processed.\n\nPlease report this error.");
			return;
			} // end => align top item in tmpArr[] with top item in glbOpnDDLst[]
				// push remainder of tmpArr[] onto glbOpnDDLst[]
		while (tmpArr.length > 0) { glbOpnDDLst.push(tmpArr.pop()); }
		ddLstSz = glbOpnDDLst.length;
		if (ddLstSz != (ddRnk + 1)) {
			alert("srchMusDwnSdArr():  after building missing part of glbOpnDDLst[], the size of glbOpnDDLst[] (" 
						+ ddLstSz + " is not consistent with the rank (" + ddRnk + "1) of \"" + itmNode.id 
						+ "\". The \"" + tevt.type + "\" action on \"" + ddObj.txtNm 
						+ "\" cannot be processed.\n\nPlease report this error.");
			return;
			}
		}
			// glbOpnDDLst[] has been updated (if ddLstSz < ddRnk)
			// call tsrchArrBtnDwn(itmNode,tevt) to handle the rest
	tsrchArrBtnDwn(itmNode,tevt);
	return;
	}


// *********************************************************
// ******       get values for search criteria        ******
// ******      from drop-down menu & edit boxes       ******
// *********************************************************

	// This function was created ~11/10/21, by splitting the old srchMenuInp() into srchMenuInp() and srchNumInpItm()
	// srchMenuInp() is passed the .id field of the side-array item that was clicked.  
	//	If the side-array 'button' is from a valStrt/valEnd numeric criterion, it calls srchNumInpItm().
	//	If the side array 'button' is from a text-search criterion, it calls srchTxtInpItm().

function srchMenuInp(tchdNode,tevt) {
	tevt.preventDefault();
	tevt.stopPropagation();
		// for touch-screen devices, tsrchSdBtnDwn() and tsrchSdBtnUp() handle closing open menus
		//	but a "click" event can come without warning on a mouse-driven device, as a result
		//	we use a call to conditional (glbOpnDDLst[] must contain elements) call to 
		//	tsrchStripDDLst() to clean-up menus.  This is needed for mouse-driven devices.  It
		//	is almost redundant for touchscreen devices, but tsrchStripDDLst() does more clean-up
		//	than the call to tsrchClrDDLst(0) in tsrchSdBtnUp().
		//	 - tsrchSdBtnDwn() and tsrchSdBtnUp() assume that glbOpnDDLst[] has been created
		//		in a stepwise manner, so using these functions for "mousedown" & "mouseup" events 
		//		on an "action" (non-array) item was impractical
	if ((tevt.type == "click") && (glbOpnDDLst.length > 0)) { tsrchStripDDLst(); }
		// get Id strings
	var btnId = tchdNode.id
		// get indices into arrays
	var mainI = srchChToI(btnId.slice(btnId.length-1));  // index for main-object in glbSrchMainArr[]
	if (Number.isNaN(mainI)) { return; }  // srchChToI() already issued an error message
	if (glbSrchMainArr[mainI].isTxt) { srchTxtInpItm(mainI, btnId); }  // ctiterion is a text-seacrh item
	else { srchNumInpItm(mainI, btnId); }  // criterion is a strtVal/endVal item
	return;
	}

	// srchNumInpItm() is called by srchMenuInp() if the menu button that was clicked belongs to a
	//	valStrt/valEnd criterion.
	// The function is passed:
	//	- an integer (mainI) that is the index in glbSrchMainArr[] of the criterion, and
	//	- a text string that is the node.id for the menu button that was clicked.  This string is
	//		"sdItm_" + sdArrObj.txtId.
	// If the button was the "specific range" button, srchNumInpItm() makes the second line of the
	// 		main criterion box visible (so user can input numbers into the edit boxes.
	// If any button (in either the primary drop-down menu, or in a drop-down submenu) that is not "specific range" 
	//		and that calls srchMenuInp() when an onclick event occurs (i.e., does not have a submenu associated with
	//		it), the function uses srchGtSdArrObj() to get the element (sdArrObj) of the side-menu array whose txtId matches
	//		btnId (less the first 6 characthers). srchMenuInp() then uses the values in the sdArrObj to populate
	//		the mainI entry in glbSrchMainArr[] and the 'show value' box in the main criterion box.
function srchNumInpItm(mainI, btnId){
	var itmId = btnId.slice(6);	// .txtId for side-object is sdArr[]
	var isSpc = false;  // "specific range" requires special handling => true if side-object = "spc?"
	if (itmId.slice(0,3) == "spc") { isSpc = true; }
		// get indices into arrays
	var mainTxtId = glbSrchMainArr[mainI].txtId;  // need this for node.id's
		// get sdArrObj corresponding to itmId
	var sdArrObj = srchGtSdArrObj(glbSrchMainArr[mainI].sdArr,itmId);
	if (sdArrObj == null) {
		alert("srchNumInpItm():  couldn't find an entry in the \"" 
				+ glbSrchMainArr[mainI].txtName.toLowerCase() 
				+ "\" array (and subarrays) whose ID matches \"" + itmId 
				+ "\"\n\nPlease report this error.");
		return;
		}
		// get id's for boxes' nodes
	var idShwVal = mainTxtId + "ShwVal"
	var idRowTwo = mainTxtId + "RowTwo";
	var idStrtInpBx = mainTxtId + "StrtVal";
	var idEndInpBx = mainTxtId + "EndVal";
	var valStrt;
	var valEnd;
		// assign values
	document.getElementById(idShwVal).innerHTML = sdArrObj.txtNm;
	document.getElementById(idStrtInpBx).style.backgroundColor = "";
	document.getElementById(idEndInpBx).style.backgroundColor = "";
	if (isSpc) {  // "specific range" selection requires special handling
				// use .valStrt & .valEnd, in case this already is the option
		document.getElementById(idRowTwo).style.visibility = "visible";
				// get old start,end values & set-up edit boxes
		valStrt = glbSrchMainArr[mainI].valStrt;
		if ((Number.isNaN(valStrt)) || (valStrt < 0)) {
			document.getElementById(idStrtInpBx).value = 0;
			}
		else {
			document.getElementById(idStrtInpBx).value = valStrt;
			}
		valEnd = glbSrchMainArr[mainI].valEnd;
		if ((Number.isNaN(valEnd)) || (valEnd < 0)) {
			document.getElementById(idEndInpBx).value = "maximum";
			}
		else {
			document.getElementById(idEndInpBx).value = valEnd;
			}
				// build current .valStrg.  Commented-out 11/13/21:
		//	glbSrchMainArr[mainI].valStrg = "(" + valStrt + "," + valEnd + ")";
		//	if valStrt != NaN or valEnd != NaN => then valStrg will be built
		//		when "Get slide list" button is clicked.  Use valStrg = "" to
		//		indicate that it needs to be built.
		glbSrchMainArr[mainI].valStrg = "";
		}
	else {  // not "specific range"
		glbSrchMainArr[mainI].valStrg = sdArrObj.valStrg;
		glbSrchMainArr[mainI].valStrt = Number.NaN;
		glbSrchMainArr[mainI].valEnd = Number.NaN;
		document.getElementById(idStrtInpBx).value = 0;
		document.getElementById(idEndInpBx).value = "maximum";
		document.getElementById(idRowTwo).style.visibility = "hidden";
		}

	return;
	}

	// 1/22/22: there was a problem if text was entered into "start number", "end number" or (for search-text boxes)
	//	"text" boxes, and then the the user moved to a box (e.g. "Get list of slides" box") that was not a 
	//	an <input> box that could accept focus.  Since the focus had not moved from the old text-input box
	//	an onchange event wasn't fired and the data in the box was not copied to glbSrchMainArr[].
	// To circumvent this problem, a global object:  glbPrevFocus was created to hold the node and value of
	//	the main-criterion text-input box (i.e., those boxes whose id's consist of a 3-letter id followed by 
	//	"StrtVal", "EndVal", or "SrchText") whose values were the last to be copied into glbSrchMainArr[] by
	//	srchTxtInp() or srchTxtSrchValidate().  When one of these boxes loses focus (i.e. an onblur event occurs),
	//	if the box is not the box contained in glbPrevFocus (i.e., the box's values haven't already been written 
	//	to glbSrchMainArr[]), srchLoseFocus() is called and this function calls srchTxtInp() or srchTxtSrchValidate()
	//	to enter the box's values into glbSrchMainArr[].
	// Assigning focus to one of the main-criterion text-input boxes implies that whoever previously had the focus
	//	has now been blurred (i.e. lost focus), so srchSetGlbPrevFocus() clears the values in glbPrevFocus (unless
	//	the focus is assigned to the box which previously had the focus).	


	// srchSetGlbPrevFocus() is called by an onfocus event by a text-input box on the 2nd line of one of the main criterion
	//	boxes.  The function resets the glbPrevFocus object if the box that receives the focus does not already 
	//	have the focus.  The onfocus event (on the new box) occurs after the onblur event on the old box
function srchSetGlbPrevFocus(curNode) {
	if (curNode != glbPrevFocus.bxNode) {
		glbPrevFocus.bxNode = null;
		glbPrevFocus.bxVal = "";
		}
	return;	
	}

	// srchLoseFocus() is called when a text-input box on the 2nd line of a main criterion box loses focus (i.e., when
	//	the box has an onblur event).  This function was added 1/22/22
	//	 - Since the onblur event happens AFTER the onchange event, if an onchange event occurs,
	//		srchTxtSrchValidate() or srchTxtInp() would already have been invoked, setting
	//		glbPrevFocus.bxNode & glbPrevFocus.bxVal to the node & value of the text-input box 
	//		which had the onchange event.  In this case srchLoseFocus() returns without doing anything.
	//	- If the onblur event happens without an onchange event (apparently this happens with touch events)
	//		then glbPrevFocus does not hold the values for the box that is being blurred, and in this case,
	//		srchLoseFocus() calls srchTxtSrchValidate() or srchTxtInp() set the values in glbSrchMainArr[].
function srchLoseFocus(bxNode) {
			// check for valid bxNode
	if (bxNode == null) {
		alert("srchLoseFocus(): node for text-input box is \"null\".  The entered text cannot be read."
					+ "\n\nPlease report this error.");
		return;
		}
			// srchTxtInp() already has handled changed data (in response to onchange event).
	if ((bxNode == glbPrevFocus.bxNode) && (bxNode.value == glbPrevFocus.bxVal)) { return; }
			// 3-letter code only works for main-criterion box components, but this should be
			//	OK because srchLoseFocus is only called by boxes whose names are:
			//	 - glbSrchMainArr[arrI].txtId + "StrtVal"
			//	 - glbSrchMainArr[arrI].txtId + "EndVal", or
			//	 - glbSrchMainArr[arrI].txtId + "SrchText"
	var bxCode = bxNode.id.slice(0,3);  // three letter code indicating criterion
	var bxType = bxNode.id.slice(3);
			// lost focus without an onchange event, call srchTxtInp() to update glbSrchMainArr[].
	if (bxType == "SrchText") { srchTxtSrchValidate(bxNode); }
	else { srchTxtInp(bxNode); }
	return;
	}


	// srchTxtInp() is passed the node to one of text-input box of a valStrt/valEnd criterion on an onChange event.
	//	NOTE: this function does NOT handle the text-input box from a text-search criterion.  Text-search criteria 
	//		text-input entry is handled by srchTxtInpItm()
	//	The function:
	//	 - identifies the text-box,
	//	 - sets glbSrchMainArr[].valStrg to "" to indicate that the a new value needs to be calculated.
	//	 - tests whether the value is an integer that is valid (i.e. > 0).
	//		As of 11/13/21, srchTxtInp() no longer compares the entered value to the value in the 
	//		other valStrt/valEnd input box.
	//	 - if the input is a valid integer
	//		 - sets glbSrchMainArr[].valStrt or glbSrchMainArr[].valEnd (whichever corresponds to the
	//			text-input box that had the onChange event) to the value of the text-input box.
	//		 - sets background color of the text-input box to white.
	//	 - if the input is not a valid integer:
	//		 - issues an alert() error message.
	//		 - sets background color of the text input box to yellow
	//		 - sets glbSrchMainArr[].valStrt or glbSrchMainArr[].valEnd (depending on the box into 
	//			which the datum was entered) to number.NaN.
	//		 - sets focus to the text-input box.
	//	As of November 2021, this function no longer writes value (other than "") to glbSrchMainArr[].valStrg.
	//		valStrg is now calculated (from valStrt & valEnd) when the "Get slide list" button is clicked.
	//	On 1/22/22 this function now set glbPrevFocus to the current nodes values, and removes the focus from 
	//		the node.  This seems to be needed to get touch events to work properly.
function srchTxtInp(bxNode) {
				// check for valid bxNode
	if (bxNode == null) {
		alert("srchTxtInp(): node for text-input box is \"null\".  The entered text cannot be read."
					+ "\n\nPlease report this error.");
		return;
		}
			// set glbPrevFocus values to prevent endless loops
	glbPrevFocus.bxNode = bxNode;
	glbPrevFocus.bxVal = bxNode.value;
	bxNode.blur();

			// get parameters from bxNode
	var errStr;
	var tmpVal;
	var bxCode = bxNode.id.slice(0,3);  // three letter code indicating criterion
	var bxStE = bxNode.id.slice(3,6);  // "Str" or "End" indicating which box is being edited
	var bxTxt = bxNode.value;
	var arrI = srchIdToI(bxCode,glbSrchMainArr);  // get index into glbSrchMainArr[] corresponding to box
	if (Number.isNaN(arrI)) { return; }  // error message generated by srchIdToI()
			// check to make certain that bxStE is valid
	if ((bxStE != "Str") && (bxStE != "End")) {
		errStr = "srchTxtInp():  illegal ID (\"" + bxStE + "\" in \"" + bxNode.id;
		errStr += "\").  Can\'t use edit-box to enter limit for \"";
		errStr += glbSrchMainArr[arrI].txtNm.toLowerCase() + "\".\n\n  Please report this error.";
		alert(errStr);
		return;
		}
			// clear prvious entry in glbSrchMainArr[]
	glbSrchMainArr[arrI].valStrg = "";

			// check for empty string => do before conversion to number since Number("") == 0
	if (bxTxt.replace(/\s/g,"") == "") {  // user emptied string. \s is any whitecharacter
				// build warning message
		errStr = "Leaving the ";
		if (bxStE == "Str") { errStr += "\"start number\""; }
		else if (bxStE == "End") { errStr += "\"end number\""; }
		errStr += " blank (in limiting slides by \"" + glbSrchMainArr[arrI].txtNm.toLowerCase();
		errStr += "\") sets this value to the ";
		if (bxStE == "Str") { errStr += "minimum (0)"; }
		else if (bxStE == "End") { errStr += "maximum"; }
		errStr += " possible value."
		alert(errStr);
				// set values to minimum/maximum
		if (bxStE == "Str") {
			glbSrchMainArr[arrI].valStrt = -1;
			bxNode.value = 0;
			}
		else if (bxStE == "End") {
			glbSrchMainArr[arrI].valEnd = -1;
			bxNode.value = "maximum";
			}
		bxNode.style.backgroundColor = "";
		return;
		}
			// check to see if entry is an integer
	var bxVal = Number(bxTxt);
	if (Number.isNaN(bxVal)) { // entry is not a number
			// remove leading & trailing whitespace
		bxTxt = bxTxt.replace(/^\s*/,"").replace(/\s*$/,"");

			// check for "min" or "minimum entered into text-input box
		if (bxTxt.slice(0,3).toLowerCase() == "min") { // user entered "minimum"
			if (bxStE == "Str") { // user entered "minimum" for "start number"
				errStr = "Included in the entry for \"start number\" when limiting slides by \"" 
							+ glbSrchMainArr[arrI].txtNm.toLowerCase() + "\" was the text:  \""
							+ bxTxt.slice(0,bxTxt.search(/\w\b/) + 1) + "\".\n\nAssuming that this is a typing error, "
							+ "the \"minimum\" value will be used as the \"start number\" when limiting slides by \"" 
							+ glbSrchMainArr[arrI].txtNm.toLowerCase() + "\".";
				if ((bxTxt.search(/^min\b/i) == 0) || (bxTxt.search(/^minimum\b/i) == 0) || confirm(errStr)) { // value OK, no need for confirm
					glbSrchMainArr[arrI].valStrt = -1;
					bxNode.value = 0;
					bxNode.style.backgroundColor = "";
					return;
					}
				else {
					alert("The value (\"" + bxTxt + "\") for the \"start number\" used to limit slides by \""
								+ glbSrchMainArr[arrI].txtNm.toLowerCase() 
								+ "\" must be an integer.\n\n  Please choose a different \"start number\".");
					glbSrchMainArr[arrI].valStrt = Number.NaN;
					bxNode.style.backgroundColor = "yellow";
					bxNode.focus();
					return;
					}
				}
			else if (bxStE == "End") { // user entered "minimum" for "end number" 
				if ((bxTxt.search(/^min\b/i) == 0) || (bxTxt.search(/^minimum\b/i) == 0)) { // warn no slides selected
					alert("Choosing the \"minimum\" value for the \"end number\" when limiting slides by \""
								+ glbSrchMainArr[arrI].txtNm.toLowerCase() + "\" will result in the search finding no slides." 
								+ "\n\n  Please choose a different \"end number\"."); 
					}
				else {
					alert("The value (\"" + bxTxt + "\") for the \"end number\" used to limit slides by \""
								+ glbSrchMainArr[arrI].txtNm.toLowerCase() 
								+ "\" must be an integer.\n\n  Please choose a different \"start number\".");
					}
				glbSrchMainArr[arrI].valEnd = Number.NaN;
				bxNode.style.backgroundColor = "yellow";
				bxNode.focus();
				return;
				}
			}
			// check for "max" or "maximum entered into text-input box
		else if (bxTxt.slice(0,3).toLowerCase() == "max") { // user entered "maximum"
			if (bxStE == "End") { // user entered "maximum" for "end number"
				errStr = "Included in the entry for \"end number\" when limiting slides by \"" 
							+ glbSrchMainArr[arrI].txtNm.toLowerCase() + "\" was the text:  \""
							+ bxTxt.slice(0,bxTxt.search(/\w\b/) + 1) + "\".\n\nAssuming that this is a typing error, "
							+ "the \"maximum\" value will be used as the \"end number\" when limiting slides by \"" 
							+ glbSrchMainArr[arrI].txtNm.toLowerCase() + "\".";
				if ((bxTxt.search(/^max\b/i) == 0) || (bxTxt.search(/^maximum\b/i) == 0) || confirm(errStr)) { // value OK, no need for confirm
					glbSrchMainArr[arrI].valEnd = -1;
					bxNode.value = "maximum";
					bxNode.style.backgroundColor = "";
					return;
					}
				else {
					alert("The value (\"" + bxTxt + "\") for the \"end number\" used to limit slides by \""
								+ glbSrchMainArr[arrI].txtNm.toLowerCase() 
								+ "\" must be an integer.\n\n  Please choose a different \"end number\".");
					glbSrchMainArr[arrI].valEnd = Number.NaN;
					bxNode.style.backgroundColor = "yellow";
					bxNode.focus();
					return;
					}
				}
			else if (bxStE == "Str") { // user entered "maximum" for "start number" 
				if ((bxTxt.search(/^max\b/i) == 0) || (bxTxt.search(/^maximum\b/i) == 0)) { // warn no slides selected
					alert("Choosing the \"maximum\" value for the \"start number\" when limiting slides by \""
								+ glbSrchMainArr[arrI].txtNm.toLowerCase() + "\" will result in the search finding no slides." 
								+ "\n\n  Please choose a different \"end number\"."); 
					}
				else {
					alert("The value (\"" + bxTxt + "\") for the \"start number\" used to limit slides by \""
								+ glbSrchMainArr[arrI].txtNm.toLowerCase() 
								+ "\" must be an integer.\n\n  Please choose a different \"start number\".");
					}
				glbSrchMainArr[arrI].valStrt = Number.NaN;
				bxNode.style.backgroundColor = "yellow";
				bxNode.focus();
				return;
				}
			}
				// entered text is not a number or "max" or "min"
		else {  // try to extract an integer from the string
					// build common stem for error string
			errStr = "The value entered into the ";
			if (bxStE == "Str") { errStr += "\"start number\" "; }
			else if (bxStE == "End") { errStr += "\"end number\" "; }
			errStr += "text-edit box for using \"" + glbSrchMainArr[arrI].txtNm.toLowerCase();
			errStr += "\" to limit selected slides must be a number.  ";
					// try to parse-out an integer
			tmpVal = bxTxt.search(/\d/);  // find first digit in bxTxt
			if (tmpVal >= 0) { bxVal = parseInt(bxTxt.slice(tmpVal)); }  // this does not allow for negative integers
			else { bxVal = Number.NaN; }  // if bxTxt is NaN if it has no digits
			if (Number.isNaN(bxVal)) {
				errStr += "The value entered into the edit box (\"" + bxTxt;
				errStr += "\") is not a number.  Please enter an integer into the edit-box or ";
				errStr += "use a different option on the side-menu if you want to use \""
				errStr += glbSrchMainArr[arrI].txtNm.toLowerCase();
				errStr += "\" to limit the number of slides that will be displayed.";
				alert(errStr);
				if (bxStE == "Str") { glbSrchMainArr[arrI].valStrt = Number.NaN; }
				if (bxStE == "End") { glbSrchMainArr[arrI].valEnd = Number.NaN; }
				bxNode.focus();
				bxNode.style.backgroundColor = "yellow";
				return;
				}
			else {  // could parse an integer out of bxTxt
				errStr += "Although the value entered into the edit box (\"" + bxTxt;
				errStr += "\") is not a number, it was possible to extract a number (\"" + bxVal; 
				errStr += "\") from the entered text (\"" + bxTxt;
				errStr += "\").\n\n  Click \"OK\" if you want to use " + bxVal + " as the ";
				if (bxStE == "Str") { errStr += "\"start"; }
				else if (bxStE == "End") { errStr += "\"end"; }
				errStr += "\" number when using \"" +  glbSrchMainArr[arrI].txtNm.toLowerCase();
				errStr += "\" to limit the number of slides that will be displayed.";
				errStr += "\n  Click \"Cancel\" if you want to enter a different number.";
				if (confirm(errStr)) {
					if (bxStE == "Str") {  // valStrt = -1 if bxVal = 0
						if ( bxVal > 0) { glbSrchMainArr[arrI].valStrt = bxVal; }
						else { glbSrchMainArr[arrI].valStrt = -1 ; }
						}
					if (bxStE == "End") { glbSrchMainArr[arrI].valEnd = bxVal; }
					bxNode.value = bxVal;
					bxNode.style.backgroundColor = "";
					return;
					}
				else {
					if (bxStE == "Str") { glbSrchMainArr[arrI].valStrt = Number.NaN; }
					if (bxStE == "End") { glbSrchMainArr[arrI].valEnd = Number.NaN; }
					bxNode.focus();
					bxNode.style.backgroundColor = "yellow";
					return;
					}
				}  // end else parseInt is a number
			} // end else not "max"/"min"/""
		} // end bxVal not a number.

			// check to see if bxVal is an integer
	if (!Number.isInteger(bxVal)) {
		errStr = "The value entered into the ";
		if (bxStE == "Str") { errStr += "\"start number\" "; }
		else if (bxStE == "End") { errStr += "\"end number\" "; }
		errStr += "edit-box for \"" + glbSrchMainArr[arrI].txtNm.toLowerCase();
		errStr += "\" (\"" + bxTxt + "\") must be an integer.  ";
		bxVal = parseInt(bxVal);
		if (!Number.isInteger(bxVal)) {  // this case should never happen, but check anyway
			errStr += "The entered value,\"" + bxTxt + "\", is not be an integer.  Please enter ";
			errStr += "an integer into the edit-box or use a different option on the ";
			errStr += "side-menu if you want to use \"" + glbSrchMainArr[arrI].txtNm.toLowerCase();
			errstr += "\" to limit the number of slides that will be displayed.";
			alert(errStr);
			if (bxStE == "Str") { glbSrchMainArr[arrI].valStrt = Number.NaN; }
			if (bxStE == "End") { glbSrchMainArr[arrI].valEnd = Number.NaN; }
			bxNode.focus();
			bxNode.style.backgroundColor = "yellow";
			return;
			}
		else {
			errStr += "Although the value entered into the edit box (\"" + bxTxt;
			errStr += "\") is not an integer, it was possible to extract an integer (\""; 
			errStr += bxVal + "\") from the entered text (\"" + bxTxt;
			errStr += "\").\n\n  Click \"OK\" if you want to use " + bxVal + " as the ";
			if (bxStE == "Str") { errStr += "\"start"; }
			else if (bxStE == "End") { errStr += "\"end"; }
			errStr += " number\" when using \"" +  glbSrchMainArr[arrI].txtNm.toLowerCase();
			errStr += "\" to limit the number of slides that will be displayed.";
			errStr += "\n  Click \"Cancel\" if you want to enter a different number.";
			if (!confirm(errStr)) {
				if (bxStE == "Str") { glbSrchMainArr[arrI].valStrt = Number.NaN; }
				if (bxStE == "End") { glbSrchMainArr[arrI].valEnd = Number.NaN; }
				bxNode.focus();
				bxNode.style.backgroundColor = "yellow";
				return;
				}
			}
		}
			// bxVal is an integer ... check for negative numbers.
	if (bxVal < 0) {
		errStr = "When using \"specific range\" values to limit slide selection, if the value entered into the text-input box for the \"";
		if (bxStE == "Str") { errStr += "start"; }
		else if (bxStE == "End") { errStr += "end"; }
		errStr += " number\" is a negative number, the \"";
		if (bxStE == "Str") { errStr += "start"; }
		else if (bxStE == "End") { errStr += "end"; }
		errStr += " number\" is set to the ";
		if (bxStE == "Str") { errStr += "\"minimum\" value (0)"; }
		else if (bxStE == "End") { errStr += "\"maximum\" value"; }
		errStr += ".  The value entered for the \"";
		if (bxStE == "Str") { errStr += "start"; }
		else if (bxStE == "End") { errStr += "end"; }
		errStr += " number\" when limiting slides by \"" + glbSrchMainArr[arrI].txtNm.toLowerCase() + "\" is \"";
		errStr += bxVal + "\".\n\nClick \"OK\" to set the \"";
		if (bxStE == "Str") { errStr += "start"; }
		else if (bxStE == "End") { errStr += "end"; }
		errStr += " number\" for \"" + glbSrchMainArr[arrI].txtNm.toLowerCase() + "\" to the ";
		if (bxStE == "Str") { errStr += "\"minimum\" value (0)"; }
		else if (bxStE == "End") { errStr += "\"maximum\" value"; }
		errStr += ".\n\nClick \"Cancel\" if you want to enter a different number.";
		if (confirm(errStr)) {  // set value to minimum/maximum
			if (bxStE == "Str") {
				glbSrchMainArr[arrI].valStrt = -1;
				bxNode.value = 0;
				}
			else if (bxStE == "End") {
				glbSrchMainArr[arrI].valEnd = -1;
				bxNode.value = "maximum";
				} 
			bxNode.style.backgroundColor = "";
			return;
			}
		else {  // get a new value
			if (bxStE == "Str") { glbSrchMainArr[arrI].valStrt = Number.NaN; }
			if (bxStE == "End") { glbSrchMainArr[arrI].valEnd = Number.NaN; }
			bxNode.focus();
			bxNode.style.backgroundColor = "yellow";
			return;
			}
		}
			// bxVal is an integer, check for bxVal == 0
	else if (bxVal == 0) {
		if (bxStE == "Str") {
			glbSrchMainArr[arrI].valStrt = -1;
			bxNode.value = 0;  // this probably is redundant
			bxNode.style.backgroundColor = "";
			return;
			}
		else if (bxStE == "End") {
			errStr = "The current value for the \"end number\" when limiting slides by \""
						+ glbSrchMainArr[arrI].txtNm.toLowerCase() + "\" is \"0\" (the \"minimum\" value)."
						+ "  No slides will be returned from a search where the \"end number\" is the \"minimum\" value."
						+ "\n\nClick \"OK\" if you really want the \"end number\" to be 0."
						+ "\n\nClick \"Cancel if you want to enter a different number.";
			if (confirm(errStr)) {
				glbSrchMainArr[arrI].valEnd = 0;
				bxNode.value = bxVal;  // this probably is redundant
				bxNode.style.backgroundColor = "";
				}
			else {
				glbSrchMainArr[arrI].valEnd = Number.NaN;
				bxNode.style.backgroundColor = "yellow";
				bxNode.focus();  // this probably is redundant
				}
			return;
			}  // end if "end number" == 0
		}  // end if bxVal == 0

			// bxVal is an integer > 0
	else {
		if (bxStE == "Str") { glbSrchMainArr[arrI].valStrt = bxVal; }
		else if (bxStE == "End") { glbSrchMainArr[arrI].valEnd = bxVal; }
		bxNode.value = bxVal;
		bxNode.style.backgroundColor = "";
		}
	return;
	}

	// srchIdToI() is passed a text-code (text string) and an array.  The text-code that should 
	//		match an entry in .txtId field of the array.
	//	If a match is found, the function returns the index to that entry.  If no match is found,
	//		the function returns NaN.
function srchIdToI(txtId,curArr) {
	var i;
	var arrSz = curArr.length;
	for (i = 0; i < arrSz ; i++) {
		if (curArr[i].txtId == txtId) { break; }
		}
	if (i < arrSz) return(i);
	alert("srchIdToI(): could not find an entry in glbSrchMainArr[] whose txtId matched \""
			+ txtId + "\".  Can\'t use the value entered into the text-edit box."
			+ "\n\n  Please report this error.");
	return(Number.NaN);
	}

	// srchChToI() is similar to srchIdToI() except that it searches for a match on the 
	//		one-character code: glbSrchMainArr[].charId
	//	If a match is found, the function returns the index to that entry.  If no match is found,
	//		the function returns NaN.
function srchChToI(chId) {
	var i;
	var arrSz = glbSrchMainArr.length;
	for (i = 0; i < arrSz ; i++) {
		if (glbSrchMainArr[i].charId == chId) { break; }
		}
	if (i < arrSz) return(i);
	alert("srchChToI(): could not find an entry in glbSrchMainArr[] whose .charId matched \""
			+ chId + "\".  Can\'t use the value entered into the text-edit box."
			+ "\n\n  Please report this error.");
	return(Number.NaN);
	}


	// srchGtSdArrObj() searches through the passed array (sdArr) looking for an element in the
	//		array whose txtId matches itmId.  If it finds a match, it returns the element in the
	//		array that matched.  If it encounters an element in the array that has a subarray,
	//		the function calls itself to search the subarray
function srchGtSdArrObj(sdArr,itmId) {
	var i;
	var arrSz = sdArr.length;
	var sdArrObj = null;
	for (i = 0; i < arrSz; i++) {
		if (sdArr[i].txtId == itmId) {
			sdArrObj = sdArr[i];
			break;
			}
		else if (sdArr[i].arrSub != null) {
			sdArrObj = srchGtSdArrObj(sdArr[i].arrSub,itmId);
			if (sdArrObj != null) { break; }
			}
		}
	return(sdArrObj);	
	}


	// 2/05/22 srchGetSbMnuFromItm() is passed the node to an array-containing (non-action)
	//	criterion item, itmNode (created by initAddSdItm()).  The function returns the node
	//	to the sidemenu (className == "crtSbMnuContainerClass") that is a child of itmNode.  On error, it returns null.
function srchGetSbMnuFromItm(itmNode) {
	var i;
	var cntrNode;
	var ddChildren = itmNode.children;
	if (ddChildren == null) {
		alert("srchGetSbMnuFromItm(): cannot get children for the selected item (\"" 
					+ itmNode.id + "\").  Cannot get the side-menu for this selection."
					+ "\n\nPlease report this error.");
		return(null);
		}
	var ddNumChldrn = ddChildren.length
	for (i = 0; i < ddNumChldrn; i++) {
		cntrNode = ddChildren[i];
		if (cntrNode.className.includes("crtSbMnuContainerClass")) { break; }
		}
	if (i >= ddNumChldrn ) {
		alert("srchGetSbMnuFromItm(): find menu-container "
					+ "(className == \"crtSbMnuContainerClass\") for \"" + ddObj.txtNm 
					+ "\" menu item (\"" + itmNode.id + "\"). The side-menu for this selection "
					+ "cannot be displayed.\n\nPlease report this error.");
		return(null);
		}
	else { return(cntrNode); }
	}


	// srchTxtInpItm() is called by srchMenuInp() when a side-array for a search-string criterion
	//	(glbSrchMainArr.isTxt == true) is clicked.  The function:
	//	 - sets glbSrchMainArr[mainI].valStrt to the integer stored in .valStrg in the element 
	//		corresponding btnId in the relevant side array (glbSrchMainArr[mainI].sdArr).
	//	 - sets innerHTML of the node named glbSrchMainArr[mainI].txtId + "ShwVal" to the .txtID
	//		of the entry corresponding to btnId in the relevant side array.
	//	 - if the integer stored in .valStrg is greater than 0, it makes the 2nd line of the criterion
	//		box visible.

function srchTxtInpItm(mainI, btnId) {
		// get indices 
	var itmId = btnId.slice(6);	// .txtId for side-object is sdArr[]
	var mainTxtId = glbSrchMainArr[mainI].txtId;  // need this for node.id's
	var sdArr = glbSrchMainArr[mainI].sdArr;  // 11/07/21 replaces switch statement assigning sdArr on basis of mainTxtId
	var sdI = srchIdToI(itmId,sdArr);  // index itno the side array
	if (Number.isNaN(sdI)) { return; } // srchIdToI() already issued error message
		// get id's for boxes' nodes
	var idShwValNode = mainTxtId + "ShwVal"
	var idRowTwoNode = mainTxtId + "RowTwo";
	var idSrchStrNode = glbSrchMainArr[mainI].txtId + "SrchText";
	var nodeSrchBx = document.getElementById(idSrchStrNode);  // node for text box on 2nd line
	if (nodeSrchBx == null) {
		alert("srchTxtInpItm():  Could not find search text-box on second line of \""
				+ glbSrchMainArr[mainI].txtNm.toLowerCase() 
				+ "\" criterion.\n\n  Please report this error.");
		return;
		}
		// put choice into criterion ShvWval box
	document.getElementById(idShwValNode).innerHTML = sdArr[sdI].txtNm;
	var valChoice = sdArr[sdI].valStrg;
	glbSrchMainArr[mainI].valStrt = valChoice;
		// if search string needed, show 2nd line
	if (valChoice > 0) {  // display 2nd line
		document.getElementById(idRowTwoNode).style.visibility = "visible";
		nodeSrchBx.value = glbSrchMainArr[mainI].valStrg;
		nodeSrchBx.style.backgroundColor = "";
		nodeSrchBx.focus();
		}
	else {  // hide 2nd row, reset valStrg
		document.getElementById(idRowTwoNode).style.visibility = "hidden";
		nodeSrchBx.value = "";
		nodeSrchBx.style.backgroundColor = "";
		glbSrchMainArr[mainI].valStrg = "";		
		}
	return;
	}

	// srchTxtSrchValidate() is called when there is an onchange event involving the
	//	text-input box on the 2nd line of a text-search criterion (i.e. when the input
	//	box loses focus).
	// The function is passed:
	//	 - the index to the criterion in glbSrchMainArr[], and
	//	 - the node of the text-input box that changed.
	// The function:
	//	 - gets the index (in glbSrchMainArr[] of the criterion 'owning' the text-input box.
	//	 - checks for illegal values (e.g., SQL keywords) in the string.
	//	 - if the string doesn't contain illegal values, it:
	//		 - copies the string to glbSrchMainArr[mainI].valStrg.
	//		 - sets nodeTxtSrchBx.style.backgroundColor = ""
	//	 - if the string contains illegal values, the function:
	//		 - issues an alert()
	//		 - sets glbSrchMainArr[mainI].valStrg = ""
	//		 - sets nodeTxtSrchBx.style.backgroundColor = "yellow"
	//		 - returns focus to nodeTxtSrchBx
	//	 - does NOT parse the string for SQL LIKE escape characters.

function srchTxtSrchValidate(nodeTxtBx){
				// check for valid nodeTxtBx
	if (nodeTxtBx == null) {
		alert("srchTxtSrchValidate(): node for text-input box is \"null\".  The entered text cannot be read."
					+ "\n\nPlease report this error.");
		return;
		}
	var txtEntered = nodeTxtBx.value;
			// set glbPrevFocus values to prevent endless loops
	glbPrevFocus.bxNode = nodeTxtBx;
	glbPrevFocus.bxVal = txtEntered;
	nodeTxtBx.blur();
			// get index into glbSrchMainArr[] for text-box's criterion
	var mainI = srchIdToI(nodeTxtBx.id.slice(0,3),glbSrchMainArr);
	if (Number.isNaN(mainI)) { return; }  // srchChToI() already issued an error message
			// check for illegal words in text
	const sqlKeyWrd = [ "ADD", "ALTER", "AND", "ALL", "AND", "ANY", "AS", "BACKUP", "BETWEEN",
						"CALL", "CASE", "CHAIN", "CHANGE", "COLUMN", "CONSTRAINT", "CREATE",
						"DATABASE", "DEFAULT", "DELETE", "DROP", "ELSE", "ELSEIF",
						"END", "EVENT", "EVERY", "EXEC", "EXECUTE", "EXISTS", "EXIT",
						"FETCH", "FIELDS", "FILE", "FOR", "FORMAT", "FROM", "FUNCTION",
						"GET", "GRANT", "GROUP", "HAVING", 
						"IMPORT", "IN", "INDEX", "INSERT", "INSTALL", "INSTANCE", "IS", "ITERATE",
						"JOIN", "JSON", "KEY", "KILL", "LIKE", "LIMIT", "LOAD", "LOCK", "LOOP",
						"MATCH", "MERGE", "MIGRATE", "MODIFY", "NAME", "NEW", "NULL", 
						"OPEN", "OR", "ORDER", "PASSWORD", "PATH", "PLUGIN", "PORT", "PREPARE", 
						"PRIVILEGES", "PROCEDURE", "PROCESS", "PROFILE", "PROXY", "PURGE", 
						"READ", "REBUILD", "RECOVER", "RELOAD", "REMOVE", "RENAME", "REPLACE",
						"RESET", "RESUME", "RETURN", "ROTATE", "ROWNUM", 
						"SELECT", "SET", "SHARE", "SHOW", "SHUTDOWN", "START", "STOP", "STRING",
						"SUSPEND", "TABLE", "TEMPORARY", "TEXT", "THEN", "TOP", "TRUNCATE",
						"UNDO", "UNION", "UNIQUE", "UNLOCK", "UPDATE", 
						"VALUE", "VALUES", "VIEW", "VISIBLE", "WHEN", "WHERE", "WHILE", "WITH"
						];
	var i = 0;
	var strtMat;
	var jRegExp = new RegExp();
	var sqlKeyWrdArrSize = sqlKeyWrd.length;
		// check entered string for SQL key words
	for (i=0; i < sqlKeyWrdArrSize; i++) {
		jRegExp = RegExp("\\b" + sqlKeyWrd[i] + "\\b", "i");
		strtMat = txtEntered.search(jRegExp);
		if (strtMat >= 0) { break; }
		}
	if (i < sqlKeyWrdArrSize) {  // prohibited word in string
		alert("The word \"" + sqlKeyWrd[i] + "\" may not be included in the"
				+ "\n\"text\" string used to search the \""
				+ glbSrchMainArr[mainI].txtNm.toLowerCase() +"\" criterion."
				+ "\n\n  Please edit the \"text\" string to remove the prohibited word.");
		nodeTxtBx.style.backgroundColor = "yellow";
		nodeTxtBx.focus();
		glbSrchMainArr[mainI].valStrg = "";
		}
	else {
		nodeTxtBx.style.backgroundColor = "";
		glbSrchMainArr[mainI].valStrg = txtEntered;
		}
	return;
	}

// *********************************************************
// ******          slide-selection functions          ******
// ******        Ajax call & return functions         ******
// *********************************************************

	// November 2021:  Replace appending search string to URL with including it as a JSON string
	//	in an Ajax POST request.  The JSON string will be an array where each element in the array consists of
	//	a criterion's single-character id (glbSrchMainArr[].charId), and a string containing the criterion's
	//	valStrg.  
	// Before creating the JSON array, glbSrchMainArr[].valStrg needs to be updated:
	//	 - for valStrt/valEnd criteria, if valStrt or valEnd != NaN, valStrg initially is "" and 
	//		selMkSrchArr() calls selMkNumStrg() to build valStrg.
	//	 - for search-text criteria, selMkSrchArr() calls selMkTxtSrchStrg() to:
	//		 - replace 'real' characters that overlap SQL LIKE command wildcards with escaped characters
	//		 - replace our escape sequence (~?) for wildcard characters
	//		 - if valStrt == 2, append "%" to beginning & end of string
	//		 - if valStrt == -1, set valStrg == ""

// ************************
	// selMkSrchArr() is called by selGetSldList()
	// selMkSrchArr() returns:
	//	 - an empty string ("") => if there are no non-zero selection criteria
	//		(i.e., all selection criteria are "any slide").
	//	 - a JSON text string generated by JSON.stringify() from arrOut[] => if there are any non-zero selection criteria
	//		(i.e., if glbSrchMainArr[] contains any non-"any slide" criteria).
	//	 -  null => if an error occurred.

	//	11/15/21 arrOut[] originally was an array of objects, where each object consisted of 
	//		{crId: glbSrchMainArr[].charId, crStrg: glbSrchMainArr[].valStrg}.  Because I'm not good with PHP objects,
	//		I changed arrOut into a nested array where:
	//		arrOut[][0] = glbSrchMainArr[].charId and arrOut[][1] = glbSrchMainArr[].valStrg
	
function selMkSrchArr() {
	var arrOut = [];
	var i;
	var arrMainSz = glbSrchMainArr.length;
	var strTmp;
	var errStr;
	var valStrt;
	var valEnd
	var valStrg;
			// remove focus from element with focus to ensure
			//	that all text-input boxes have been updated.
	var actNode = document.activeElement;
	if (actNode != null) {
		actNode.blur();
		}
		  // read through glbSrchMainArr[] to build string that will be sent to server
	for (i = 0; i < arrMainSz; i++) {
		if (glbSrchMainArr[i].isTxt) {  // search-text criterion
			valStrt = glbSrchMainArr[i].valStrt;
			valStrg = glbSrchMainArr[i].valStrg;
			if ((valStrt <= 0) && (valStrg != "")) {  
				alert("selMkSrchArr():  glbSrchMainArr[" + i + "].valStrt = " + valStrt
						+ ", but glbSrchMainArr[" + i + "].valStrg is NOT empty (valStrg = \""
						+ valStrg + "\").\n\nPlease report this error.");
				}
			if (valStrt == 0) { continue; }  // don't include "any slide" in array
			else if (valStrt < 0) {  // currently -1 only value:  for limit by "species", -1 => null
				arrOut[arrOut.length] = [glbSrchMainArr[i].charId,""];
				continue;
				}
			else {  // valStrt > 0; valStrt == 1 => match valStrg, valStrt == 2 => includes valStrg
				strTmp = selMkTxtSrchStrg(i);
				if (strTmp == null) { return(null); } // selMkTxtSrchStrg() already issued error message
				else if (strTmp == "") {  // empty string => skip criterion or return to criteria selection
					errStr = "The search-string that was supposed to ";
					if (valStrt == 1) { errStr += "match"; }
					else if (valStrt == 2) { errStr += "be included in"; }
					errStr += " the \"" + glbSrchMainArr[i].txtNm.toLowerCase() 
									+ "\" is an empty string (i.e., it contains no text).";
					errStr += "\n\n Click \"OK\" to NOT limit slide selection on the basis of " 
									+ glbSrchMainArr[i].txtNm.toLowerCase() + " (i.e., \"" +
									+ glbSrchMainArr[i].txtNm + "\" = \"any slide\").";
					errStr += "\n\n Click \"Cancel\" if you want to re-edit the criteria for limiting slides by \""
									+ glbSrchMainArr[i].txtNm.toLowerCase() + "\".";
					if ( confirm(errStr) ) { continue; }
					else { return(null); }
					}
				else {  // valid search string returned by selMkTxtSrchStrg()
					arrOut[arrOut.length] = [glbSrchMainArr[i].charId, strTmp];
					continue;
					}
				}  // end valStrt > 0
			}  // end if .isTxt
		else {  // valStrt/valEnd numerical search crtierion
					// either valStrg should contain a predefined range OR valStrt and/or valEnd should be an integer > 0
			valStrt = glbSrchMainArr[i].valStrt;
			valEnd = glbSrchMainArr[i].valEnd
			valStrg = glbSrchMainArr[i].valStrg;
			if (valStrg == "") { // specific range with valStrt and/or valEnd specified
				if ((Number.isNaN(valStrt)) && (Number.isNaN(valEnd))) {  // skip this criterion
						// if valStrg == "" then:
						//	 - valStrt == NaN implies start value = 0
						//	 - valEnd == NaN implies valEnd = maximum; this occurs if
						//	This situation (valStrg == "" && valStrt == NaN && valEnd == NaN occurs if "specific range" 
						//		is selected, but no values are entered for start & end values.
						//	This is equivalent to a range if (-1,-1)
					continue;
					}
						// check to make certain that valStrt < valEnd
					// srchTxtInp() allows valStrt or valEnd to be -1, need to rule out valEnd == -1 for this comparison
				if ((!Number.isNaN(valStrt)) && (!Number.isNaN(valEnd)) && (valEnd >= 0) && (valStrt > valEnd)) { 
					errStr = "The \"start number\" (" + valStrt + ") is greater than the \"end number\" ("
								+ valEnd + ") for the \"specific range\" used to limit slides by \""
								+ glbSrchMainArr[i].txtNm.toLowerCase() + "\".";
					errStr += "\n\nClick \"OK\" to flip these numbers (so the range is \"start number\" = "
								+ valEnd + " to \"end number\" = " + valStrt + ".";
					errStr += "\n\nClick \"Cancel\" to change the criteria for limiting slides by \""
								+ glbSrchMainArr[i].txtNm.toLowerCase() + "\" to something else.";
					if ( confirm(errStr) ) {
						strTmp = "(" + valEnd + "," + valStrt + ")";
						arrOut[arrOut.length] = [glbSrchMainArr[i].charId, strTmp];
						continue;
						}
					else { return(null); }  // error returned to selGetSldList(); user returns to criteria selection page
					}  // end if valStrt & valEnd are flipped
				else { // valStrt & valEnd are in correct order => build selection string
						// if valStrt/valEnd are NaN, use minimum/maximum values.
						//	both valStrt && valEnd == NaN was trapped previously (above), but we need to deal with
						//		the case of only one of these being NaN
						// Although srchTxtInp() should prevent negative numbers from being entered, we also handle
						//	the case of the user entering -1 or some other negative number
					if ((Number.isNaN(valStrt)) || (valStrt < 0)) { valStrt = -1; }
					if ((Number.isNaN(valEnd)) || (valEnd < 0)) { valEnd = -1; }
						// check to see if both values are minimum/maximum => this should have been caught when
						//	we tested for valStrt == valEnd == NaN (above), but just in case ...
					if ((valStrt == -1) && (valEnd == -1)) { continue; }  // don't include "any slide" in array
					strTmp = "(" + valStrt + "," + valEnd + ")";
					arrOut[arrOut.length] = [glbSrchMainArr[i].charId, strTmp];
					continue;
					}  // end valStrt/valEnd are OK => build selection string
				}  // end if valStrg =="" and valStrt/valEnd are NOT NaN
			else if (Number.isNaN(valStrt) && Number.isNaN(valEnd)) { // predefined range used
				strTmp = glbSrchMainArr[i].valStrg;
				if (strTmp == "(-1,-1)") { continue; } // don't include "any slide" in array
				else {
					arrOut[arrOut.length] = [glbSrchMainArr[i].charId, strTmp];
					continue;
					}
				}
			else { // valStrg is NOT empty and valStrt/valEnd are NOT NaN 
				errStr = "selMkSrchArr():  the criteria for limiting slides by \""
							+ glbSrchMainArr[i].txtNm.toLowerCase()
							+ "\" is overspecified (\"start number\" = " + glbSrchMainArr[i].valStrt
							+ "\", \"end number\" =  " + glbSrchMainArr[i].valEnd
							+ "\", and glbSrchMainArr[" + i + "].valStrg = \""
							+ glbSrchMainArr[i].valStrg + "\").   This is a programming error:  please report it.";
				errStr += "\n\nClick \"OK\" to get the list of slides without limiting it by \""
							+ glbSrchMainArr[i].txtNm.toLowerCase() + "\"."
				errStr += "\n\nClick \"Cancel\" to try to change the selection parameters for limithing slides by \""
							+ glbSrchMainArr[i].txtNm.toLowerCase() + "\" (this may not work).";
				if ( confirm(errStr) ) { continue; }  // skip this criterion
				else { return(null); }  // error returned to selGetSldList(); user returns to criteria selection page
				}
			}  // end valStrt/valEnd numerical search crtierion

		}  // end loop through glbSrchMainArr[]
	if (arrOut.length > 0) { return(JSON.stringify(arrOut)); }
	return("");
	}

	// selMkTxtSrchStrg() is called by selMkSrchArr() and passed an index into glbSrchMainArr[]
	// This function:
	//	 - adds escape characters to characters that correspond to SQL LIKE wildcard characters
	//	 - strips our 'custom' escape character ('~') off of any SQL LIKE wildcard characters
	//		entered by the user.
	//	 - if glbSrchMainArr[arrI].valStrt == 2, appends the wildcard '%" to the beginning and end
	//		of the string.
	// selMkTxtSrchStrg() returns the newly created string.  On error, it returns null
function selMkTxtSrchStrg(arrI) {
	var strOut = glbSrchMainArr[arrI].valStrg;
	var valSel = glbSrchMainArr[arrI].valStrt;
	var i;
	var curPos;
	const sqlWldCh = ["%","_","[","]","^","-","#"];
	var jRegExp = new RegExp();
	var tmpCh;
	const repCh = String.fromCharCode(7);  //repCh is \07 == \Bel
	if ((valSel != 1) && (valSel != 2)) {
		alert("selMkTxtSrchStrg():  The value of glbSrchMainArr[" + arrI + "].valStrt (\"" + valSel 
				+ "\") is incompatible with this function " + "(must be \"1\" or \"2\")."
				+ "\n\nPlease report this error.");
		return(null);
		}
	if (strOut == "") { return(""); }
	var chLstSz = sqlWldCh.length;
	for (i = 0; i < chLstSz; i++) {
		tmpCh = sqlWldCh[i];
			// replace our escaped wildcard ("~"+tmpCh) with repCh (= \07)
		jRegExp = RegExp("~\\" + tmpCh, "g");
		strOut = strOut.replace(jRegExp,repCh);
			// replace unescaped wildcard (tmpCh) with "\\" + wildcard ("\\tmpCh")
		jRegExp = RegExp("\\" + tmpCh, "g");
		strOut = strOut.replace(jRegExp,"\\" + tmpCh);
			// replace repCh (\07) with wildcard
		jRegExp = RegExp(repCh, "g");
		strOut = strOut.replace(jRegExp,tmpCh);
		}
			// if valStrt == 2, the matching string is bounded by "%"
	if (valSel == 2) { strOut = "%" + strOut + "%"; }
	const numCh = ["0","1","2","3","4","5","6","7","8","9",
					"a","b","c","d","e","f",
					"A","B","C","D","E","F"];
	chLstSz = numCh.length;
	var tmpStr1;
	var tmpStr2;
	for (i = 0; i < chLstSz; i++) {
		tmpCh = numCh[i];
		jRegExp = RegExp("%"+tmpCh, "g");
		strOut = strOut.replace(jRegExp,"%\\"+tmpCh);
		}
	return(strOut);
	}

	// selMakeItmArr() is called by the Ajax call-back function attached ajxReq.onreadystatechange in selGetSldList()
	//	The function reads the data returned by the Ajax request, and
	//	 - if an error occurred, uses alert() to display the error message and returns without building the list page
	//	 - if the SQL request returned no entries, empties glbSldItmArr[] and builds list page with no entries.
	//	 - if the SQL request returned entries, selMakeItmArr() transcribed the JSON-encoded data into glbSldItmArr[],
	//		calls selSortItmArr() to sort the array, and calls lstWndBuild() to build the list page.
function selMakeItmArr(ajxReq) {
	var ajxRespTxt = ajxReq.responseText;
	if (ajxRespTxt.slice(0,3) == "SQL") {  // error messages from jrSQL_GetSldList.php begine with "SQL"
		alert("Unable to get list of slides from server due to database error!\n  " + ajxRespTxt);
		return;
		}
	else if (ajxRespTxt.slice(0,4) == "NONE") {
		glbSldItmArr.splice(0);
		lstWndBuild();
		return;
		}
	var sldDataArr = JSON.parse(ajxRespTxt);
	var arrSz = sldDataArr.length;
	var sldItmObj;
	var sldThmbPath;
	var i;
	for (i = 0; i < arrSz; i++) {
		if ((sldDataArr[i].sldRoot == null) || (sldDataArr[i].sldRoot == "")) {
			sldThmbPath = "";
			}
		else if (sldDataArr[i].maxF > 1) {
			sldThmbPath = sldDataArr[i].sldRoot + Math.floor((sldDataArr[i].maxF - 1)/2) + "\/0\/0\/0.jpg";
			}
		else { sldThmbPath = sldDataArr[i].sldRoot + "0\/0\/0.jpg"; }  // no F-level
		if (sldDataArr[i].lblPathName == null) {sldDataArr[i].lblPathName = ""; }
		if (sldDataArr[i].sldSpecies == null) {sldDataArr[i].sldSpecies = ""; }
		if (sldDataArr[i].sldOrgan == null) {sldDataArr[i].sldOrgan = ""; }
		sldItmObj = {
						num: sldDataArr[i].sldNum,
						txtNm: sldDataArr[i].sldName,
						tis: sldDataArr[i].sldOrgan,
						spc: sldDataArr[i].sldSpecies,
						stn: sldDataArr[i].strStainAbbr,
						maxF: sldDataArr[i].maxF,
						lblPath: sldDataArr[i].lblPathName,
						thmbPath: sldThmbPath
						};
		glbSldItmArr.push(sldItmObj);
		}
	selSortItmArr();
	lstWndBuild();
		// clean-up search-page (while it's not displayed) by resetting
		//		the background color of formerly open criterion boxes.
	tsrchOpMnuPush(null,null,null);
	return;
	}

function selSortItmArr() {
	var arrI = menuGetSrtByArrI();
	if (Number.isNaN(arrI)) { return; }  // menuGetSrtByArrI() issued error message
	switch (glbMenuSrtByArr[arrI].id) {
		case "num": 
			glbSldItmArr.sort(function(a,b){return(glbMenuSrtDir * (a.num - b.num))});
			break;
		case "name": 
			glbSldItmArr.sort(function(a,b){return(selStrSort(a.txtNm,b.txtNm))});
			break;
		case "tis": 
			glbSldItmArr.sort(function(a,b){return(selStrSort(a.tis,b.tis))});
			break;
		case "maxF": 
			glbSldItmArr.sort(function(a,b){return(glbMenuSrtDir * (a.maxF - b.maxF))});
			break;
		case "stn": 
			glbSldItmArr.sort(function(a,b){return(selStrSort(a.stn,b.stn))});
			break;
		case "spc": 
			glbSldItmArr.sort(function(a,b){return(selStrSort(a.spc,b.spc))});
			break;
		default: 
			alert("selSortItmArr():  Could not find \"" + glbMenuSrtByArr[arrI].id 
						+ "\" in sort list.  Could not sort the list of slides."
						+ "\n\n  Please report this error.");
		}
	return;
	}

	// selStrSort() is a comparison function used by the array[].sort() routine.  It is called
	//		by selSortItmArr() when sorting on text-string elements within the array of slide-
	//		information objects.
	//	The function strips out "<...>" HTML formatting strings, converts &...; HTML characters
	//		(currently only "&amp;" and "&nbsp;") into their ASCII equivalents, converts the 
	//		string to lowerCase, uses strA.localeCompare(strB) to compare the string, and returns
	//		that value (after multiplying by glbMenuSrtDir.
function selStrSort(a,b) {
	var aStr = a;
	var bStr = b;
	var str = [aStr,bStr];
		// remove formatting characters
	var i;
	var strtI;
	var endI;
	for (i = 0; i < 2; i++) {
			// remove < ... > formatting strings
		strtI = str[i].indexOf("<");
		while (strtI >=0) {
			endI = str[i].indexOf(">")
			if (endI < strtI) {
				break;
				}  // <> pair mismatch
			str[i] = str[i].slice(0,strtI) + str[i].slice(endI+1);
			strtI = str[i].indexOf("<");
			}
			// replace special characters
		str[i] = str[i].replace(/&nbsp;/g," ");
		str[i] = str[i].replace(/&amp;/g,"&");
		str[i] = str[i].toLowerCase();
		}
	var retVal = str[0].localeCompare(str[1]);
	retVal *= glbMenuSrtDir;
	return(retVal);
	}

		// Handles time-out failures when connecting to server
function ajxConnectFail() {
	glbAjxTimer = Number.NaN;
	var timeOutSec = glbAjxTimeOut/1000;
	var timeOutStr = timeOutSec.toPrecision(2);
	var txtStr = "Timed-out while trying to connect with the server!"
	txtStr += "\n  The Virtual Slide Box will not function without a server connection.";
	txtStr += "\n\n  Click \"OK\" if you want to wait another " + timeOutStr + " seconds";
	txtStr += "\n      	to see if a server connection can be established.";
	txtStr += "\n  Click \"Cancel\" if you want to quit.";
	if (confirm(txtStr)) {
		glbAjxTimer = window.setTimeout(ajxConnectFail,glbAjxTimeOut);
		}
	else {
			// srchPage currently is displayed, but "Get slide list" button is hidden 
			//		srchPage is not hidden until lstBuildWnd() is ready to display lstPage
		document.getElementById("startBtn").style.visibility = "visible";
		document.body.style.cursor = "";  // this should restore the cursor

		}
	return;
	}


