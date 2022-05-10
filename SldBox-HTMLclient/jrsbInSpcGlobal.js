//  jrsbInSpcGlobal.js
//  Copyright 2022  James A. Rhodes

//	jrsbInSpcGlobal.js is a component of the "Slide Box" part of "Multifocal-plane Virtual Microscope"
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

// jrsbInSpcGlobal.js contains global variables that are unique to each institution's specific implementation
//	of SlideBox
// This version of jrsbInsSpcGlobal.js is for the generic ("Chipmunk") version of SlideBox

const glbInSCpyRtDate = "2022";
const glbInSCpyRtHolder = "James A. Rhodes";
const glbInSViewerURL = "";   // URL for Viewer

const glbInSTitle = "Slide Box";
const glbInSFavIco = "..\\InstSpcImgChip\\GenIcon16.ico";
		// logo for "special" buttons ("To Microscope"; "Create a new slide list")
const glbInSBtnLogo = "..\\InstSpcImgChip\\btnLogo34_Chip.png";
const glbInSBtnBkgClr = null;  // no background color

	// data for building right-side of first ("search") page:  see prgInitRghtSide() in jrsbSelectInit.js
const glbInSIntroTitle = "Virtual&nbsp;Slide&nbsp;Box";
const glbInSIntroLogo = "..\\InstSpcImgChip\\introLogo.png";
	// IntroLogo need not be square, but its height should be > ~350px
    // the actual height of the logo (on the search page) is set by prgInitSldBox()
const glbInSLogoHt = 500;
const glbInSLogoWdth = 980;
	// IntroLogo can be off-center in the X-axis
const glbInSLogoCntr = 400;

	// glbInSInstrTxt is the text that goes at the top of the right side of the
	//	SlideBox's first ("search") page.
const glbInSInstrTxt = "<div style='margin-top:0px'>"
		+ "Click on the <b>\"Get list of slides\"</b> button (<span style='font-size:85%'>left</span>) "
		+ "to display a list of the virtual slides that are available to the Multifocal-plane Virtual Microscope "
		+ "(<span style='font-size:85%'>including both single-focal-plane "
		+ "&amp; multifocal-plane slides</span>).&nbsp; "
		+ "You can use the search options listed on the left to limit which of the virtual slides in "
		+ "this collection are included in this list.</div>"
		+ "<div style='margin-top:15px'></div>"
		+ "Once the list of slides is displayed, clicking on the slide "
		+ "(<span style='font-size:85%'>i.e. clicking on the box containing the information about the slide</span>) "
		+ "will cause the slide to be displayed by the Multifocal-plane Virtual Microscope.</div>";

const glbInSInstrCpyRt = "<div style='font-size:15px'>"
		+ "<div style='text-align:center'>"
		+ "&copy;&nbsp;" + glbInSCpyRtDate + " &nbsp;" + glbInSCpyRtHolder + "</div>"
		+ "<div style='margin-top:6px'>For more information, see (<span style='font-size:85%'>on menu</span>):</div>"
		+ "<div style='text-align:center; padding-top:2px'>"
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&quot;About&quot;&rarr;&quot;About Virtual Slide Box&quot</div>"
		+ "</div>";


//  ****************************************************
//  ***  Title & Body text for Institution-Specific  ***
//  ***              "About" info boxes              ***
//  ****************************************************

			// About Slide Box
const glbInS_email = "microscope.virtual"
const glbInSAbtSldBox_Title = "About this Virtual Slide Box";
var glbInSAbtSldBox_Body = "<p style='text-align: center; font-size:20px; line-height: 0.95; margin-bottom:14px; margin-top:16px'>"
				// version, date, copyright
		+ "<b>Virtual Slide Box, version " + glbSldBoxVersion + ".</b>"
		+ " (<span style='font-size: 18px'>" + glbSldBoxDate + "</span>)<span style='font-size: 14px'>"
		+ "<br>&copy;&nbsp;" + glbInSCpyRtDate + " &nbsp;" + glbInSCpyRtHolder + "</span></p>"
				//License => software license
		+ "<span class='aboutBodyTxtClass' style='text-indent: -10px; padding-top: 8px; border-top: 1px solid black'>"
		+ "<b>Copyright &amp; Licenses:</b> "
		+ "&nbsp;  This Virtual Slide Box is part of the Multifocal-plane Virtual Microscope system, "
		+ "which consists of this Slide Box and the Multifocal-plane Virtual Microscope Viewer.&nbsp; "
		+ "The computer software comprising the Virtual Slide Box, which is copyrighted ("
		+ "<span style='font-size:85%'>2020, 2021, 2022 by Pacific Northwest University of Health Sciences, "
		+ "and 2022 by James A. Rhodes, PhD.</span>"
		+ "), is free software:&nbsp; you may redistribute it and/or modify it under the terms of the "
		+ "<a href='https://www.gnu.org/licenses/gpl-3.0.html' target='_blank'>GNU General Public License</a>"
		+ ", either version 3 of the GNU License, or any later version, as published by the "
		+ "<a href='https://www.gnu.org/licenses/licenses.html' target='_blank'>Free Software Foundation</a>.&nbsp; "
		+ "This software is distributed WITHOUT ANY WARRANTY; without even the implied warranty of "
		+ "MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.</span>"
			//License => image license
		+ "<span class='aboutBodyTxtClass' style='padding-bottom: 10px'>"
		+ "The images of slide labels and the thumb-nail images of the specimens ("
		+ "<span style='font-size:12px'>displayed after you click the \"Get list of slides\" button</span>"
		+ ") may be copyrighted by the individual or institution providing that specific virtual slide.&nbsp; "
		+ "The source and licensing information for the images of a particular slide can be seen by "
		+ "loading the slide into the Multifocal-plane Virtual Microscope Viewer ("
		+ "<span style='font-size:12px'>by clicking on the box containing the slide information</span>).</span>"
			// authorship & credits
		+ "<span class='aboutBodyTxtClass' style='text-indent: -10px; padding-top: 8px; border-top: 1px solid black'>"
		+ "The computer code for this Virtual Slide Box was written by James&nbsp;Rhodes, PhD, "
		+ "initially as part of a collaborative project with John&nbsp;DeVore, Director of Network Services, "
		+ "at Pacific Northwest University of Health Sciences (<span style='font-size:85%'>PNWU</span>) in Yakima, Washington, U.S.A., "
		+ "and more recently as an independent project.</span>"
				// email info
		+ "<div style='padding: 4px 10px 20px'>Please report any programming errors (\"bugs\"), "
		+ "and send any comments or questions regarding the Virtual Slide Box "
		+ "(<span style='font-size:85%'>or other components of the Multifocal-plane Virtual Microscope system</span>) "
		+ "to:&nbsp; <a href='mailto:" + glbInS_email + "@gmail.com'>"+ glbInS_email + "@gmail.com</a>.</div>";

			// About Virtual Slides
const glbInSAbtVirSld_Title = "Virtual slides in this Virtual Slide Box";
const glbInSAbtVirSld_Body = "<div style='margin-top: 4px; border-top: 1px solid black; padding: 10px 8px 8px 8px'>"
		+ "<div style='margin: 0px; padding: 0px 0px 5px 0px'>"
		+ "Virtual slides normally are created by using a (<span style='font-size:85%'>\"real\"</span>) microscope "
		+ "to digitally scan actual (<span style='font-size:85%'>\"real\"</span>) specimens that usually are sections "
		+ "of tissue mounted on glass microscope slides.&nbsp; "
		+ "These virtual slides are stored in digital databases that can be shared, and the virtual slides found "
		+ "in this Virtual Slide Box derive from several of these shared databases:"
		+ "</div>"
		+ "<ul style='margin: 0px 0px 5px 18px; padding: 0px 5px 8px 8px'>"
		+ "<li style='margin-bottom: 5px'>"
		+ "<b>PNWU:</b>&nbsp; A collection of virtual slides were created at Pacific Northwest University of "
		+ "Health Sciences (<span style='font-size:85%'>PNWU</span>) by James&nbsp;Rhodes, PhD, while he was on the PNWU faculty.&nbsp; "
		+ "This collection includes both multifocal-plane virtual slides (<span style='font-size:85%'>which can be focused up-and-down</span>) "
		+ "and single-focal-plane virtual slides.&nbsp; "
		+ "The origin of the \"real\" glass microscope slides used to create virtual slides in this collection can be seen by clicking on "
		+ "the \"About\" menu &rarr; \"About scanned slides\" menu item.</li>"
				// University of Michigan ... add this back if UM database is included on new server
//		+ "<li style='margin-bottom: 5px'>"
//		+ "<b>University of Michigan:</b>&nbsp; PNWU received a copy of the University of Michigan virtual slide "
//		+ "database through the generosity of "//
//		+ "J.&nbsp;Matthew&nbsp;Velkey, PhD, and Michael&nbsp;Hortsch, PhD, University of Michigan Medical School.&nbsp; "
//		+ "For more about this database of virtual slides, see:&nbsp; "
//		+ "<a href='https://histology.medicine.umich.edu/full-slide-list' target='_blank' style='font-size:85%'>"
//		+ "https://histology.medicine.umich.edu/full-slide-list</a>.</li>"
		+ "<li style='margin-bottom: 5px'>"
		+ "<b>VMD:</b>&nbsp; The American Association for Anatomy maintains the Virtual Microscopy Database "
		+ "(<span style='font-size:85%'>VMD</span>), "
		+ "which is a is a repository containing virtual slides contributed by many universities world-wide.&nbsp; "
		+ "This large collection consists of principally of single-focal-plane virtual slides.&nbsp; "
		+ "For more about this database, see:&nbsp; "
		+ "<a href='http://www.virtualmicroscopydatabase.org/' target='_blank' style='font-size:85%'>"
		+ "http://www.virtualmicroscopydatabase.org/</a>.</li>"
		+ "</ul></div>";
		
			// About Scanned Slides
const glbInSAbtScanSld_Title = "About slides scanned for this project";
const glbInSAbtScanSld_Body = "<div style='margin-top: 4px; border-top: 1px solid black; padding: 10px 8px 8px 8px'>"
		+ "<div style='margin: 0px; padding: 0px 0px 8px 0px'>"
		+ "In addition to creating a viewer that allows the user to focus up-and-down through "
		+ "a multifocal-plane virtual slide and a \"slide box\" that allows the user to choose the slide that "
		+ "will be viewed using the Multifocal-plane Virtual Microscope Viewer, "
		+ "a goal of the Virtual Microscope project was to create virtual slides that were scanned at "
		+ "(<span style='font-size:85%'>or close to</span>) the resolution limit of the light microscope, "
		+ " and that (<span style='font-size:85%'>in some case</span>) were scanned at multiple focal planes "
		+ "(<span style='font-size:85%'>which allows the user to look at different levels within the full thickness "
		+ "of the section of tissue</span>).&nbsp; We are indebted to the individuals and institutions who generously "
		+ "provided the \"real\" (<span style='font-size:85%'>glass</span>) microscope slides that were scanned "
		+ "to create \"virtual\" slides:"
		+ "</div>"
		+ "<ul style='margin: 0px 0px 5px 18px; padding: 0px 5px 8px 8px'>"
		+ "<li style='margin-bottom: 5px'>"
		+ "<b>DCJR:</b>&nbsp; Diana C.J. Rhodes, DVM,PhD, Pacific Northwest University of Health Sciences.</li>"
		+ "<li style='margin-bottom: 5px'>"
		+ "<b>UCSF:</b>&nbsp; Steven Rosen, PhD, University of California, San Francisco.</li>"
		+ "<li style='margin-bottom: 5px'>"
		+ "<b>UM:</b>&nbsp; Michael Hortsch, PhD, University of Michigan</li>"
		+ "</ul></div>";
		
			// About Using Slide Box
const glbInSAbtUseSldBx_Title = "Using the Virtual Slide Box";
const glbInSAbtUseSldBx_Body = "<div style='margin-top: 4px; border-top: 1px solid black; padding: 10px 8px 8px 8px'>"
		+ "This Virtual Slide Box consists of two \"pages\".  The first \"page\" is involved in defining "
		+ "the criteria used to search the database of virtual slides that are available to the "
		+ "Multifocal-plane Virtual Microscope.&nbsp; "
		+ "The second \"page\" displays the results of that search.&nbsp;  "
		+ "Clicking the button labeled \"<span style='font-size:90%'>Get list of slides</span>\" "
		+ "(<span style='font-size:75%'>at the top of the left side of the first \"page\"</span>) causes "
		+ "the database to be searched and Slide Box to switch to the second \"page\", which shows "
		+ "the resulting list of virtual slides.</div>"
		+ "<div style='padding: 0px 5px 8px 8px''>"
		+ "You probably will want to use the \"<span style='font-size:85%'><b>Limit Slides by:...</b></span>\" "
		+ "options on the left side of the first \"page\" to decrease the number "
		+ "of slides in the search results.&nbsp; "
		+ "A drop-down menu appears to the right of the each selection-criterion box "
		+ "(<span style='font-size:80%'>on the left side of the first \"page\"</span>) "
		+ "when the computer mouse is moved over this box "
		+ "(<span style='font-size:80%'>or when the box is touched on a touch-screen device</span>).&nbsp; "
		+ "Click the computer mouse (<span style='font-size:80%'>or touch the screen of a touch-screen device</span>) "
		+ "on an option in the drop-down menu to apply that criterion to the slide search "
		+ "(<span style='font-size:80%'>you must also click on the \"<span style='font-size:90%'>Get list of slides</span>\" "
		+ "button to initiate the search</span>).&nbsp; "
		+ "Selection criteria can be combined.&nbsp; "
		+ "For instance, selecting \"<span style='font-size:80%'><i>Respiratory system</i></span>\" &rarr; "
		+ "\"<span style='font-size:80%'><i>Lung</i></span>\" from "
		+ "\"<span style='font-size:85%'><b>Limit by: Organ systems</b></span>\" and selecting "
		+ "\"<span style='font-size:80%'><i>Elastin stains</i></span>\" from "
		+ "\"<span style='font-size:85%'><b>Limit by: Stain</b></span>\" "
		+ "(<span style='font-size:80%'>and then clicking the "
		+ "\"<span style='font-size:90%'>Get list of slides</span>\" button</span>) "
		+ "will result in a list only of slides of lung tissue that are stained for elastic fibers.&nbsp; "
			// section on specific ranges should be added when these PDF's are available
//		+ "More specific criteria can be applied using the "
//		+ "\"<span style='font-size:95%'><i>specific range</i></span>\" option; see "
//		+ "\"<span style='font-size:95%'>About</span>\" menu &rarr; "
//		+ "\"<span style='font-size:95%'>Specific ranges for Organ Systems</span>\" and "
//		+ "\"<span style='font-size:95%'>Specific ranges for Stains</span>\"."
		+ "</div>"
		+ "<div style='padding: 0px 5px 8px 8px''>"
		+ "When the list of slides is displayed, just clicking the computer mouse on the \"slide\" "
		+ "(<span style='font-size:80%'>or, for a touch-screen device, "
		+ "tapping the \"slide\" with your finger</span>) causes the Multifocal-plane Virtual Microscope Viewer "
		+ "(<span style='font-size:80%'>which displays the selected slide</span>) to open in "
		+ "the same browser tab/window that formerly displayed Slide Box, but Slide Box remains in the "
		+ "tab\'s or window\'s history (<span style='font-size:80%'>so the browser\'s \"back\" button "
		+ "can return to Slide Box</span>).&nbsp; "
		+ "If the \<<span style='font-size:90%'>SHIFT</span>\> key is depressed when you click on the \"slide\", the Viewer "
		+ "(<span style='font-size:80%'>displaying the selected slide</span>) is opened in a new browser tab or window "
		+ "(<span style='font-size:80%'>depending on your internet browser\'s settings</span>).</div>"
		+ "<div style='padding: 0px 5px 8px 8px''>"
		+ "On Slide Box\'s second \"page\" (<span style='font-size:80%'>which displays the list of slides</span>), "
		+ "clicking on the \"<span style='font-size:95%'>Create a new slide list</span>\" button "
		+ "(<span style='font-size:85%'>on the menu</span>) will take you back to Slide Box\'s first \"page\".&nbsp; "
		+ "If you just click on this button, the criteria from your previous search are maintained, "
		+ "so you can edit or refine that search.&nbsp;  "
		+ "If the \<<span style='font-size:90%'>SHIFT</span>\> key is depressed when you click on the "
		+ "\"<span style='font-size:95%'>Create a new slide list</span>\" button, the first page of "
		+ "Slide Box is displayed with all of the criteria (<span style='font-size:80%'>on the left side "
		+ "of the first \"page\"</span>) initalized, so you can start a new search from \'scratch\'.</div>";

		
// glbInSAbtLst[] is an array of objects that specify the contents
//	of the main menu's "About" drop-down menu
//	Each object consists of:
//	 - mnuTxt = text string (can contain HTML tags) for content of drop-down menu item.
//	 - mnuId = id of the menu drop-down item 
//	 - mnuCls = text string for className=""
//	 - mnuClk = text string for onClick=""
var glbInSAbtLst = [
	{	mnuTxt: "About Virtual Slide Box <b>...</b>",
		mnuId: "menuAboutSlideBox",
		mnuCls: "menuClickable menuDrpDwnSubItem",
		mnuClk: function () {aboutDispBx(glbInSAbtSldBox_Title,glbInSAbtSldBox_Body);}
		},
	{	mnuTxt: "About the virtual slides <b>...</b>",
		mnuId: "menuAbtVirSlides",
		mnuCls: "menuClickable menuDrpDwnSubItem",
		mnuClk: function () {aboutDispBx(glbInSAbtVirSld_Title,glbInSAbtVirSld_Body);}
		},
	{	mnuTxt: "About scanned slides <b>...</b>",
		mnuId: "menuAbtScanSlides",
		mnuCls: "menuClickable menuDrpDwnSubItem",
		mnuClk: function () {aboutDispBx(glbInSAbtScanSld_Title,glbInSAbtScanSld_Body);}
		},
				// divider
	{	mnuTxt: "",
		mnuId: "",
		mnuCls: "menuDrpDwnSubItem menuDivider",
		mnuClk: null
		},
	{	mnuTxt: "Using SlideBox <b>...</b>",
		mnuId: "menuUsingSldBox",
		mnuCls: "menuClickable menuDrpDwnSubItem",
		mnuClk: function () {aboutDispBx(glbInSAbtUseSldBx_Title,glbInSAbtUseSldBx_Body);}
		},
	];


