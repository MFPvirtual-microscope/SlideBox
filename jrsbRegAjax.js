//	jrsbRegAjax.js
//	Copyright 2022  James Rhodes
//	Copyright 2020, 2021  Pacific Northwest University of Health Sciences

//	jrsbRegAjax.js is a component of the "Slide Box" part of "Multifocal-plane Virtual Microscope"
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
//	jrsbRegAjax.js is part of the "SlideBox"
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

    
// jrsbRegAjax.js
//  This file contains the versions for SlideBox.htm of any functions that are 
//		different between SlideBox.htm and SupSldBox.htm


// *********************************************************
// ******          slide-selection functions          ******
// ******        Ajax call & return functions         ******
// *********************************************************

	// sbGetSldList() clears glbSldItmArr[] and then generates
	//	an Ajax call jrSB_GetSldLst.php
	//	if strOut is null, selMkSrchArr() encountered an error while transcribing the data from
	//		glbSrchMainArr[], and selGetSldList() needs to return to the slide-selection page 
	//		(after restoring the "Get slide list" button).
	//	if strOut == "", there are no search criteria, this will be handled by jrSB_GetSldLst.php
	//	otherwise strOut contains a JSON stringified array of search criteria where each element
	//		in the array is an object consisting of crId, which is the single letter code for
	//		the criterion, and crStrg, which a text string.  crStrg is either:
	//		 - one or more (separated by commas) "(valStrt,valEnd)" pairs that will be 
	//			converted into by jrSB_GetSldLst.php into SQL clauses of the form: 
	//			"WHERE variable (specified by crId) BETWEEN valStrt AND valEnd"
	//		 - a text-string that will be inserted into a SQL clause of the form:
	//			 "WHERE variable (specified by crId) LIKE crStrg.
function selGetSldList() {
	    // listing filename at beginning makes switching to jrSB_SupSldLst.php obvious
	const phpFileNm = "jrSB_GetSldLst.php";  // this makes switching to jrSB_SupSldLst.php obvious
		// hide "Get Slide List" button (so user can't click it again)
	document.getElementById("startBtn").style.visibility="hidden" ;
	var strOut = selMkSrchArr();  // contains the JSON-encoded array of search criteria
	if (strOut == null) { // an error occurred selMkSrchArr() read glbSrchMainArr[]
		document.getElementById("startBtn").style.visibility="visible" ;
		return;
		}
		//  11/15/21: emptying glbSldItmArr[] probably isn' necessary, but it already was here.
	if (glbSldItmArr.length > 0) { glbSldItmArr.splice(0); }
		// start timer & set cursor to "wait"
	glbAjxTimer = window.setTimeout(ajxConnectFail,glbAjxTimeOut);
	document.body.style.cursor = "wait";  // this puts the "wait" cursor on the entire window
		// use Ajax to get slide list from server
	var ajxReq = new XMLHttpRequest();
	ajxReq.onreadystatechange = function () {
		if ((this.readyState == 4) && (this.status == 200)) {
			selMakeItmArr(this);
			window.clearTimeout(glbAjxTimer);
			glbAjxTimer = Number.NaN;
			document.body.style.cursor = "";  // restore cursors to previous state
			document.getElementById("startBtn").style.visibility="visible" ;
			}
		}
	ajxReq.open("POST",phpFileNm,true);
	ajxReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	ajxReq.send("jrArray=" + strOut);
	return;
	}
