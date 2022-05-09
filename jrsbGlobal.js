// jrsbGlobal.js
//	Copyright 2022  James A. Rhodes
//	Copyright 2020, 2021, 2022  Pacific Northwest University of Health Sciences

//	jrsbInGlobal.js is a component of the "Slide Box" part of "Multifocal-plane Virtual Microscope"
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
//	jrsbGlobal.js is part of the "SlideBox"
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

// jrsbGlobal.js contains =>  Headers & Global variables for the slide-box part of the Multifocal-plane Virtual microscope
//	this file was initially created on 5/25/20

//	NOTE global variables for infoBoxes are at the bottom of this file

var glbAjxTimer = Number.NaN;  // variable for Ajax timeout calls
var glbAjxTimeOut = 10000;  // time-out for Ajax/SQL server connection

var glbColNum = Number.NaN;
var glbScrlWdth = Number.NaN;

var glbSldItmHt = 144;  // slide-item height is 128px + 2x8px border
var glbSldItmWdth = 536 // slide-item width is 520px + 8xpx border
var glbSldItmHMrg = 1;  // space between columns of sldItms
var glbItmVMrg = 1;  // space between rows of sldItms
		// because we don't initially know if there will be a scroll-bar, the width of
		//	the list page is initially indeterminate.  The menu is constructed on the 
		//	assumption that the scroll-bar is not present, and the elements in the
		//	menu later need to be re-centered.  glbLstMenuArr[] is used to re-center the elements
var glbLstMenuArr = [];  // listing of elements in list-page menu

var glbIsLstVScrl = false;  // set to true if list-window has Y-axis scroll bar
		// if lstPage is wider than screen, it automatically gets a X-scroll bar
		//		calculations as to whether the lstWnd needs a Y-scroll bar need
		//		to take this into account
var glbIsLstHScrl = false;  // set to true if list-page wider than screen

var glbSldItmArr = [];  // an array to hold the slide-information from server database



// ******************************************** *
// *******    search variable arrays    ******* *
// ******************************************** *

	// November, 2021:  in order to accomodate searching on slide name and on species, a new
	//	boolean variable was created: isTxt.  If isTxt == false, the criterion is numerically
	//	indexed and valStrt, valEnd, and valStrg behave as originally designed (see below).
	//	If isTxt == true, then valStrt is an integer that indicates how entered text string is
	//	to be handled: "any slide", "matches", "includes", and (for species) "unknown" (NULL),
	//	and valStrg is the string (before parsing to handle wildcard characters) that will
	//	be searched by mySQL. 

	//valStrg is a text string consisting of pairs of integers enclosed in parentheses and
	//	separated by commas.  For each pair the first integer is the lowest value for the
	//	variable and the second integer is the highest value.  A negative integer causes 
	//	the value to be left out of the comparison.  For instance, if valStrg for
	//		if valStrg for num was valStrg: "(3001, 3005)" the SQL search would be:
	//			 "WHERE (tabSldList.sldNum BETWEEN 3001 AND 3005)"
	//		if valStrg for num was valStrg: "(3001, -1)" the SQL search would be:
	//			 "WHERE (tabSldList.sldNum >= 3001)"
	//		if valStrg for num was valStrg: "(-1, 3005)" the SQL search would be:
	//			 "WHERE (tabSldList.sldNum <= 3005)"
	//		if both values are negative, the comparison is not included the SQL search
	//		otherwise if the values are identical, then equality is tested, e.g.,
	//		if valStrg for num was valStrg: "(3005, 3005)" the SQL search would be:
	//			 "WHERE (tabSldList.sldNum = 3005)"
	//	multiple pairs are connected by OR statements, e.g.
	//		if valStrg for num was valStrg: "(3001, 3005),(770,770)" the SQL search would be:
	//			 "WHERE (tabSldList.sldNum BETWEEN 3001 AND 3005) OR (tabSldList.sldNum = 770)"
	//  11/21/20:  added mechanism for making multiple columns in drop-down lists.
	//	  The program will attempt to fit the drop-down lists to computer screen.
	//	  maxCol:  this is the maximum number of columns that will be created.
	//		if maxCol == 0, a single column drop-down box is created without attempting to fit
	//			the computer screen.
	//		if maxCol > 0 AND the drop-down menu is bigger than computer screen, the program will
	//			attempt to shift the dropdown menu (so it starts above the 1st line of crtNode.
	
	// 11/07/21 moved glbSrchMainArr[] to end of this list of arrays because it now references
	//	the subsidiary arrays (so they have to be defined first).
	
			
var glbSrchArr_num = [	
			{ txtId: "anyN", txtNm: "any slide", arrSub: null, rnk: 1, valStrg: "(-1,-1)" },
			{ txtId: "spcN", txtNm: "specific range", arrSub: null, rnk: 1, valStrg: Number.NaN }
			];

var glbSrchArr_nam = [	
			{ txtId: "anyM", txtNm: "any slide", arrSub: null, rnk: 1, valStrg: 0 },
			{ txtId: "matM", txtNm: "matches <i><q>text</q></i> (<span style='font-size:80%'>specified by user</span>)", 
						arrSub: null, rnk: 1, valStrg: 1 },
			{ txtId: "incM", txtNm: "includes <i><q>text</q></i> (<span style='font-size:80%'>specified by user</span>)", 
						arrSub: null, rnk: 1, valStrg: 2 }
			];
		
var glbSrchArr_fmx = [	
			{ txtId: "anyF", txtNm: "any slide", arrSub: null, rnk: 1, valStrg: "(-1,-1)" },
			{ txtId: "singF", txtNm: "single focal plane", arrSub: null, rnk: 1, valStrg: "(1,1)" },
			{ txtId: "multiF", txtNm: "multiple focal planes", arrSub: null, rnk: 1, valStrg: "(2,-1)" },
			{ txtId: "spcF", txtNm: "specific range", arrSub: null, rnk: 1, valStrg: Number.NaN }
			];

var glbSrchArr_spc = [	
			{ txtId: "anyP", txtNm: "any slide", arrSub: null, rnk: 1, valStrg: 0 },
			{ txtId: "unkP", txtNm: "unknown (<span style='font-size:80%'>not listed in slide data</span>)", arrSub: null, rnk: 1, valStrg: -1 },
			{ txtId: "matP", txtNm: "matches <i><q>text</q></i> (<span style='font-size:80%'>specified by user</span>)",
						arrSub: null, rnk: 1, valStrg: 1 },
			{ txtId: "incP", txtNm: "includes <i><q>text</q></i> (<span style='font-size:80%'>specified by user</span>)",
						arrSub: null, rnk: 1, valStrg: 2 }
			];

var glbSrchArr_src =[
			{ txtId: "anyR", txtNm: "any slide", arrSub: null, rnk: 1, valStrg: "(-1,-1)" },
			{ txtId: "pnwuR", txtNm: "PNWU", arrSub: null, rnk: 1, valStrg: "(11,99)" },
			{ txtId: "drexR", txtNm: "Drexel University", arrSub: null, rnk: 1, valStrg: "(121,126)" },
			{ txtId: "ubcR", txtNm: "University of British Columbia", arrSub: null, rnk: 1, valStrg: "(331,340)" },
			{ txtId: "ubuckR", txtNm: "University of Buckingham", arrSub: null, rnk: 1, valStrg: "(361,366)" },
			{ txtId: "ucsfR", txtNm: "UCSF", arrSub: null, rnk: 1, valStrg: "(117,120)" },
			{ txtId: "ucinnR", txtNm: "University of Cincinnati", arrSub: null, rnk: 1, valStrg: "(371,376)" },
			{ txtId: "ucolR", txtNm: "University of Colorado", arrSub: null, rnk: 1, valStrg: "(381,386)" },
			{ txtId: "uiowaR", txtNm: "University of Iowa", arrSub: null, rnk: 1, valStrg: "(401,499)" },
			{ txtId: "umR", txtNm: "University of Michigan", arrSub: null, rnk: 1, valStrg: "(101,115)" },
			{ txtId: "umissR", txtNm: "<span style='font-size:80%'>University of Mississippi Medical Center</span>",
						 arrSub: null, rnk: 1, valStrg: "(321,330)" },
			{ txtId: "uneR", txtNm: "University of New England", arrSub: null, rnk: 1, valStrg: "(351,360)" },
			{ txtId: "usdR", txtNm: "University of South Dakota", arrSub: null, rnk: 1, valStrg: "(391,396)" },
			{ txtId: "utasR", txtNm: "University of Tasmania", arrSub: null, rnk: 1, valStrg: "(341,346)" },
			{ txtId: "uvaR", txtNm: "University of Virginia", arrSub: null, rnk: 1, valStrg: "(270,279)" },
			{ txtId: "vacmwR", txtNm: "<span style='font-size:95%'>Virginia Commonwealth University</span>",
						arrSub: null, rnk: 1, valStrg: "(291,296)" },
			{ txtId: "spcR", txtNm: "specific range", arrSub: null, rnk: 1, valStrg: Number.NaN }
			];


		// ******************************************** *
		// *******         Stain Arrays         ******* *
		// ******************************************** *
		
const glbSubSrch_miscS = [
			{ txtId: "anyMiscS", txtNm: "Miscellaneous stains", arrSub: null, rnk: 2, 
						valStrg: "(1,8),(210,219),(240,249),(333,333),(613,613),(700,899)" },
			{ txtId: "alcBlS", txtNm: "Alcian blue", arrSub: null, rnk: 2, valStrg: "(210,219),(240,249),(333,333)" },
			{ txtId: "bestCarmS", txtNm: "Best\'s carmine (<span style='font-size:80%'>glycogen</span>)", 
						arrSub: null, rnk: 2, valStrg: "(613,613)" },
			{ txtId: "phagS", txtNm: "Phagocytosed particulates", arrSub: null, rnk: 2, valStrg: "(700,799)" },
			{ txtId: "perfuseS", txtNm: "Vascular perfusion (<span style='font-size:80%'>post-mortem</span>)", 
						arrSub: null, rnk: 2, valStrg: "(800,899)" },
			{ txtId: "grdS", txtNm: "Ground section (<span style='font-size:80%'>hard tissue</span>)",
						arrSub: null, rnk: 2, valStrg: "(8,8)" },
			{ txtId: "unkS", txtNm: "Unknown stain", arrSub: null, rnk: 2, valStrg: "(1,1)" }
			];
		
const glbSubSrch_histochS = [
			{ txtId: "anyHistochS", txtNm: "Histochemical stains", arrSub: null, rnk: 2, valStrg: "(201,239),(381,489)" },
			{ txtId: "pasS", txtNm: "PAS-based stains", arrSub: null, rnk: 2, valStrg: "(201,239)" },
			{ txtId: "catechS", txtNm: "Catecholamine stains", arrSub: null, rnk: 2, valStrg: "(450,489)" },
			{ txtId: "acheS", txtNm: "Acetlcholinesterase stains", arrSub: null, rnk: 2, valStrg: "(420,422)" },
			{ txtId: "atpaseS", txtNm: "ATPase stains", arrSub: null, rnk: 2, valStrg: "(431,431)" },
			{ txtId: "osmiumS", txtNm: "Osmium tetroxide (<span style='font-size:85%'>lipid stain</span>)", arrSub: null, rnk: 2, valStrg: "(391,391)" }
			];
		
const glbSubSrch_silS = [
			{ txtId: "anySilS", txtNm: "Silver stains", arrSub: null, rnk: 2, valStrg: "(261,299)" },
			{ txtId: "reticSilS", txtNm: "Reticular fiber stains", arrSub: null, rnk: 2, valStrg: "(261,275)" },
			{ txtId: "filamSilS", txtNm: "Intermediate filament stains", arrSub: null, rnk: 2, valStrg: "(282,293)" },
			{ txtId: "golgiSilS", txtNm: "Golgi method", arrSub: null, rnk: 2, valStrg: "(276,279)" }
			];

		
const glbSubSrch_otherHemS = [
			{ txtId: "anyOthHemS", txtNm: "Other hematoxylin (<span style='font-size:80%'>not H&amp;E</span>) stains", 
						arrSub: null, rnk: 2, valStrg: "(28,59),(202,222),(461,461),(811,811),(11059,11059),(11209,11209)" },
			{ txtId: "hemS", txtNm: "Hematoxylin (<span style='font-size:80%'>alum</span>) - not eosin", 
						arrSub: null, rnk: 2, valStrg: "(30,35),(205,206),(461,461),(811,811),(11059,11059),(11209,11209)" },
			{ txtId: "irheS", txtNm: "Iron hematoxylin", arrSub: null, rnk: 2, valStrg: "(40,59)" },
			{ txtId: "ptahS", txtNm: "PTAH (<span style='font-size:75%'>phosphotungstic acid hematoxylin</span>)", 
						arrSub: null, rnk: 2, valStrg: "(36,39)" }
			];

var glbSrchArr_stn = [	
			{ txtId: "anyS", txtNm: "any slide", arrSub: null, rnk: 1, valStrg: "(-1,-1)" },
			{ txtId: "heS", txtNm: "H&amp;E and similar", arrSub: null, rnk: 1, valStrg: "(9,25),(43,45),(470,479),(720,749)" },
			{ txtId: "othHemS", txtNm: "Other hematoxylin-based stains", arrSub: glbSubSrch_otherHemS, 
						rnk: 1, valStrg: "(28,59),(202,222),(461,461),(811,811),(11059,11059),(11209,11209)" },
			{ txtId: "cvlS", txtNm: "Cresyl violet (<span style='font-size:70%'>including Luxol fast-blue</span>)",
						arrSub: null, rnk: 1, valStrg: "(60,69)" },
			{ txtId: "thiazS", txtNm: "Basic thiazine stains", arrSub: null, rnk: 1, valStrg: "(21,22),(70,79)" },
			{ txtId: "triS", txtNm: "Trichrome (<span style='font-size:80%'>&amp; tetrachrome</span>)", 
						arrSub: null, rnk: 1, valStrg: "(100,199),(350,369)" },
			{ txtId: "elasS", txtNm: "Elastin stains", arrSub: null, rnk: 1, valStrg: "(300,369)" },
			{ txtId: "silS", txtNm: "Silver stains", arrSub: glbSubSrch_silS, rnk: 1, valStrg: "(261,299)" },
			{ txtId: "histochS", txtNm: "Histochemical stains", arrSub: glbSubSrch_histochS, 
						rnk: 1, valStrg: "(201,239),(381,489)" },
			{ txtId: "immunoS", txtNm: "Immunohistochemical stains", arrSub: null, rnk: 1, valStrg: "(10000,49999)" },
			{ txtId: "miscS", txtNm: "Other (<span style='font-size:80%'>miscellaneous</span>) stains", 
						arrSub: glbSubSrch_miscS, rnk: 1, 
						valStrg: "(1,8),(210,219),(240,249),(333,333),(613,613),(700,899)" },
			{ txtId: "spcS", txtNm: "specific range", arrSub: null, rnk: 1, valStrg: Number.NaN }
			];


		// ******************************************** *
		// *******     Organ System Arrays      ******* *
		// ******************************************** *

			// ******************************************** *
			// *******   Connective Tissue Arrays   ******* *
			// ******************************************** *

const glbSubSrch_boneO = [
			{ txtId: "anyBoneO", txtNm: "Bone", arrSub: null, rnk: 3, valStrg: "(1701,1899)" },
			{ txtId: "matBoneO", txtNm: "Bone without growth plate", arrSub: null, rnk: 3, valStrg: "(1710,1749),(1850,1889)" },
			{ txtId: "endochonO", txtNm: "Endochondral ossification", arrSub: null, rnk: 3, valStrg: "(1750,1799)" }
			];
		
const glbSubSrch_conTisO = [
			{ txtId: "anyCTO", txtNm: "Connective tissue", arrSub: null, rnk: 2, valStrg: "(1000,1999)" },
			{ txtId: "mesentO", txtNm: "Mesentery (<span style='font-size:85%'>loose connective tissue</span>)", 
						arrSub: null, rnk: 2, valStrg: "(1110,1115)" },
			{ txtId: "brnFatO", txtNm: "Brown adipose tissue", arrSub: null, rnk: 2, valStrg: "(1221,1239)" },
			{ txtId: "tendonO", txtNm: "Tendons &amp; ligaments", arrSub: null, rnk: 2, valStrg: "(1410,1489)" },
			{ txtId: "earO", txtNm: "Ear (<span style='font-size:85%'>elastic cartilage</span>)", 
						arrSub: null, rnk: 2, valStrg: "(1563,1563)" },
			{ txtId: "pubSympO", txtNm: "Pubic symphysis (<span style='font-size:85%'>fibrocartilage</span>)", 
						arrSub: null, rnk: 2, valStrg: "(1583,1584)" },
			{ txtId: "ivDiskO", txtNm: "Intervertebral disk (<span style='font-size:85%'>fibrocartilage</span>)", 
						arrSub: null, rnk: 2, valStrg: "(1586,1586)" },
			{ txtId: "boneO", txtNm: "Bone", arrSub: glbSubSrch_boneO, rnk: 2, valStrg: "(1701,1899)" }
			];

			// ********************************************* *
			// *******     Nervous Tissue Arrays     ******* *
			// ********************************************* *

const glbSubSrch_sensO = [
			{ txtId: "anySensO", txtNm: "Encapsulated sensory organs", arrSub: null, rnk: 3, valStrg: "(5001,5099)" },
			{ txtId: "musSpindO", txtNm: "Muscle spindles", arrSub: null, rnk: 3, valStrg: "(5072,5079)" },
			{ txtId: "pacCorpO", txtNm: "Pacinian corpuscles", arrSub: null, rnk: 3, valStrg: "(5011,5019)" },
			{ txtId: "meisCorpO", txtNm: "Meissner corpuscles", arrSub: null, rnk: 3, valStrg: "(5021,5029)" }
			];

const glbSubSrch_pnsO = [
			{ txtId: "anyPnsO", txtNm: "Peripheral nervous system", arrSub: null, rnk: 3, valStrg: "(4501,4859)" },
			{ txtId: "pNervO", txtNm: "Peripheral nerve", arrSub: null, rnk: 3, valStrg: "(4501,4599)" },
			{ txtId: "gangliaO", txtNm: "Ganglia (<span style='font-size:85%'>sensory or autonomic</span>)", arrSub: null, rnk: 3, valStrg: "(4601,4699)" },
			{ txtId: "drgO", txtNm: "Dorsal root ganglia", arrSub: null, rnk: 3, valStrg: "(4611,4629)" },
			{ txtId: "autoGangO", txtNm: "Autonomic ganglia", arrSub: null, rnk: 3, valStrg: "(4630,4699)" }
			];

const glbSubSrch_cnsO = [
			{ txtId: "anyCnsO", txtNm: "Central nervous system", arrSub: null, rnk: 3, valStrg: "(4101,4499)" },
			{ txtId: "brainO", txtNm: "Brain", arrSub: null, rnk: 3, valStrg: "(4301,4389)" },
			{ txtId: "spinCordO", txtNm: "Spinal cord", arrSub: null, rnk: 3, valStrg: "(4201,4249)" }
			];
		
const glbSubSrch_nervTisO = [
			{ txtId: "anyNervO", txtNm: "Nervous tissue", arrSub: null, rnk: 2, valStrg: "(4101,5999)" },
			{ txtId: "cnsO", txtNm: "Central nervous system", arrSub: glbSubSrch_cnsO, rnk: 2, valStrg: "(4101,4499)" },
			{ txtId: "pnsO", txtNm: "Peripheral nervous system", arrSub: glbSubSrch_pnsO, rnk: 2, valStrg: "(4501,4859)" },
			{ txtId: "encapSensO", txtNm: "Encapsulated sensory organs", arrSub: glbSubSrch_sensO, rnk: 2, valStrg: "(5001,5099)" },
			{ txtId: "eyeO", txtNm: "Eye", arrSub: null, rnk: 2, valStrg: "(5301,5499)" }
			];


			// ********************************************* *
			// *******     Lymphoid Organ Arrays     ******* *
			// ********************************************* *

const glbSubSrch_lymphO = [
			{ txtId: "anyLymphO", txtNm: "Lymphoid organs", arrSub: null, rnk: 2, valStrg: "(7221,7329),(7401,7599),(7801,7899)" },
			{ txtId: "thymusO", txtNm: "Thymus", arrSub: null, rnk: 2, valStrg: "(7221,7299)" },
			{ txtId: "palTonsO", txtNm: "Palatine tonsils", arrSub: null, rnk: 2, valStrg: "(7322,7329)" },
			{ txtId: "lymphNodeO", txtNm: "Lymph nodes", arrSub: null, rnk: 2, valStrg: "(7401,7599)" },
			{ txtId: "spleenO", txtNm: "Spleen", arrSub: null, rnk: 2, valStrg: "(7801,7899)" }
			];


			// ************************************************ *
			// *******   Cardiovascular System Arrays   ******* *
			// ************************************************ *

const glbSubSrch_cardiO = [
			{ txtId: "anyCardiO", txtNm: "Cardiovascular system", arrSub: null, rnk: 2, valStrg: "(8101,8999)" },
			{ txtId: "heartO", txtNm: "Heart", arrSub: null, rnk: 2, valStrg: "(8101,8199)" },
			{ txtId: "lrgArtO", txtNm: "Large (<span style='font-size:85%'>elastic</span>) arteries", arrSub: null, rnk: 2, valStrg: "(8200,8249)" },
			{ txtId: "lrgVeinO", txtNm: "Large veins", arrSub: null, rnk: 2, valStrg: "(8301,8369)" },
			{ txtId: "supVeinO", txtNm: "Superficial veins", arrSub: null, rnk: 2, valStrg: "(8401,8499)" },
			{ txtId: "medVesO", txtNm: "<span style='font-size:85%'>Muscular (<span style='font-size:85%'>medium-size</span>) arteries &amp; veins</span>", arrSub: null, rnk: 2, valStrg: "(8501,8599)" },
			{ txtId: "lymphVesO", txtNm: "Lymphatic vessels", arrSub: null, rnk: 2, valStrg: "(8901,8999)" }
			];



			// ******************************************** *
			// *******    Endocrine Organ Arrays    ******* *
			// ******************************************** *
		
const glbSubSrch_endoO = [
			{ txtId: "anyEndoO", txtNm: "Endocrine organs", arrSub: null, rnk: 2, 
						valStrg: "(15101,15299),(15521,15599),(15710,15749),(15760,15799)" },
			{ txtId: "pituitaryO", txtNm: "Pituitary gland", arrSub: null, rnk: 2, valStrg: "(15101,15199)" },
			{ txtId: "pinealO", txtNm: "Pineal gland", arrSub: null, rnk: 2, valStrg: "(15201,15299)" },
			{ txtId: "adrenalO", txtNm: "Adrenal gland", arrSub: null, rnk: 2, valStrg: "(15521,15599)" },
			{ txtId: "thyroidO", txtNm: "Thyroid gland", arrSub: null, rnk: 2, valStrg: "(15710,15749)" },
			{ txtId: "parathyO", txtNm: "Parathyroid gland", arrSub: null, rnk: 2, valStrg: "(15760,15799)" }
			];

			// ********************************************* *
			// *******  Integumentary System Arrays  ******* *
			// ********************************************* *

const glbSubSrch_skinO = [
			{ txtId: "anySkinO", txtNm: "Skin", arrSub: null, rnk: 3, 
						valStrg: "(10102,10185),(10205,10999),(11122,11123)" },
			{ txtId: "thckSknO", txtNm: "Thick skin", arrSub: null, rnk: 3, valStrg: "(10102,10185)" },
			{ txtId: "hairSknO", txtNm: "Hairy skin", arrSub: null, rnk: 3, valStrg: "(10205,10270)" },
			{ txtId: "eyeLidO", txtNm: "Eyelid", arrSub: null, rnk: 3, valStrg: "(10321,10321)" },
			{ txtId: "intLipO", txtNm: "Lip", arrSub: null, rnk: 3, valStrg: "(11122,11123)" }
			];

const glbSubSrch_intGlandO = [
			{ txtId: "anyIntGlndO", txtNm: "Integumentary glands", arrSub: null, rnk: 3, valStrg: "(10500,10599)" },
			{ txtId: "apocrineO", txtNm: "Apocrine sweat glands", arrSub: null, rnk: 3, valStrg: "(10510,10529)" },
			{ txtId: "allMammaryO", txtNm: "Mammary gland (<span style='font-size:75%'>active or inactive</span>)", arrSub: null, rnk: 3, valStrg: "(10530,10549)" },
			{ txtId: "lacMammaryO", txtNm: "Mammary gland, active", arrSub: null, rnk: 3, valStrg: "(10540,10540)" },
			{ txtId: "restMammaryO", txtNm: "Mammary gland, inactive", arrSub: null, rnk: 3, valStrg: "(10530,10530)" }
			];
		
const glbSubSrch_integO = [
			{ txtId: "anyIntegO", txtNm: "Integumentary system", arrSub: null, rnk: 2, 
						valStrg: "(10102,10185),(10205,10999),(11122,11123)" },
			{ txtId: "skinO", txtNm: "Skin", arrSub: glbSubSrch_skinO, rnk: 2, 
						valStrg: "(10102,10185),(10205,10999),(11122,11123)" },
			{ txtId: "nailO", txtNm: "Nails &amp; claws", arrSub: null, rnk: 2, valStrg: "(10410,10429)" },
			{ txtId: "intGlandO", txtNm: "Integumentary glands", arrSub: glbSubSrch_intGlandO, rnk: 2,
						 valStrg: "(10500,10599)" }
			];


			// ******************************************** *
			// *******  GI Alimentary Canal Arrays  ******* *
			// ******************************************** *

const glbSubSrch_lgIntstO = [
			{ txtId: "anyLgIntstO", txtNm: "Large intestine", arrSub: null, rnk: 3, valStrg: "(11800,11899)" },
			{ txtId: "colO", txtNm: "Colon or cecum", arrSub: null, rnk: 3, valStrg: "(11810,11849)" },
			{ txtId: "appO", txtNm: "Appendix", arrSub: null, rnk: 3, valStrg: "(11860,11869)" },
			{ txtId: "analO", txtNm: "Anal canal", arrSub: null, rnk: 3, valStrg: "(11880,11889)" }
			];

const glbSubSrch_smIntstO = [
			{ txtId: "anySmIntstO", txtNm: "Small intestine", arrSub: null, rnk: 3, valStrg: "(11720,11799)" },
			{ txtId: "duodO", txtNm: "Duodenum", arrSub: null, rnk: 3, valStrg: "(11740,11759)" },
			{ txtId: "jejunO", txtNm: "Jejunum", arrSub: null, rnk: 3, valStrg: "(11760,11779)" },
			{ txtId: "ileumO", txtNm: "Ileum", arrSub: null, rnk: 3, valStrg: "(11780,11799)" }
			];

const glbSubSrch_stomO = [
			{ txtId: "anyStomO", txtNm: "Stomach", arrSub: null, rnk: 3, valStrg: "(11500,11599),(11710,11719)" },
			{ txtId: "cardStomO", txtNm: "Cardiac region", arrSub: null, rnk: 3, valStrg: "(11550,11559)" },
			{ txtId: "fundStomO", txtNm: "Fundic region", arrSub: null, rnk: 3, valStrg: "(11560,11569)" },
			{ txtId: "pylStomO", txtNm: "Pyloric region", arrSub: null, rnk: 3, valStrg: "(11580,11589)" },
			{ txtId: "gastIntstO", txtNm: "Gastrointestinal jxn", arrSub: null, rnk: 3, valStrg: "(11710,11719)" }
			];

const glbSubSrch_esophO = [
			{ txtId: "anyEsophO", txtNm: "Esophagus", arrSub: null, rnk: 3, valStrg: "(11300,11399),(11540,11549)" },
			{ txtId: "upEsophO", txtNm: "Upper esophagus", arrSub: null, rnk: 3, valStrg: "(11300,11339)" },
			{ txtId: "midEsophO", txtNm: "Middle esophagus", arrSub: null, rnk: 3, valStrg: "(11340,11352)" },
			{ txtId: "lowEsophO", txtNm: "Lower esophagus", arrSub: null, rnk: 3, valStrg: "(11360,11379)" },
			{ txtId: "gastEsophO", txtNm: "Gastroesophageal jxn", arrSub: null, rnk: 3, valStrg: "(11540,11549)" }
			];

const glbSubSrch_oralO = [
			{ txtId: "anyOralO", txtNm: "Oral cavity", arrSub: null, rnk: 3, valStrg: "(11100,11299)" },
			{ txtId: "lipO", txtNm: "Lip", arrSub: null, rnk: 3, valStrg: "(11120,11129)" },
			{ txtId: "tongO", txtNm: "Tongue", arrSub: null, rnk: 3, valStrg: "(11140,11159)" },
			{ txtId: "palO", txtNm: "Palate", arrSub: null, rnk: 3, valStrg: "(11160,11179)" },
			{ txtId: "gngteethO", txtNm: "Gingiva or tooth", arrSub: null, rnk: 3, valStrg: "(11190,11299)" }
			];

		// This array must precede the array that references it.
const glbSubSrch_alim0 = [
			{ txtId: "anyAlimO", txtNm: "Alimentary canal", arrSub: null, rnk: 2, valStrg: "(11000,11999)" },
			{ txtId: "oralO", txtNm: "Oral cavity", arrSub: glbSubSrch_oralO, rnk: 2, valStrg: "(11100,11299)" },
			{ txtId: "esophO", txtNm: "Esophagus", arrSub: glbSubSrch_esophO, rnk: 2, valStrg: "(11300,11399),(11540,11549)" },
			{ txtId: "stomO", txtNm: "Stomach", arrSub: glbSubSrch_stomO, rnk: 2, valStrg: "(11300,11399),(11710,11719)" },
			{ txtId: "anyIntestO", txtNm: "Intestine (<span style='font-size:70%'>small or large</span>)", 
						arrSub: null, rnk: 2, valStrg: "(11700,11899)" },
			{ txtId: "smIntstO", txtNm: "Small intestine", arrSub: glbSubSrch_smIntstO, rnk: 2, valStrg: "(11720,11799)" },
			{ txtId: "lgIntstO", txtNm: "Large intestine", arrSub: glbSubSrch_lgIntstO, rnk: 2, valStrg: "(11800,11899)" }
			];


			// ******************************************** *
			// *******  GI Extramural Gland Arrays  ******* *
			// ******************************************** *

const glbSubSrch_salivO = [
			{ txtId: "anySalivO", txtNm: "Salivary gland", arrSub: null, rnk: 3, valStrg: "(12220,12299)" },
			{ txtId: "parotO", txtNm: "Parotid salivary gland", arrSub: null, rnk: 3, valStrg: "(12220,12229)" },
			{ txtId: "subMandO", txtNm: "Submandibular salivary gland", arrSub: null, rnk: 3, valStrg: "(12230,12239)" },
			{ txtId: "subLingO", txtNm: "Sublingual salivary gland", arrSub: null, rnk: 3, valStrg: "(12240,12249)" }
			];

const glbSubSrch_glandO = [
			{ txtId: "anyGlandO", txtNm: "Extramural GI gland", arrSub: null, rnk: 2, valStrg: "(12000,12999)" },
			{ txtId: "salivO", txtNm: "Salivary gland", arrSub: glbSubSrch_salivO, rnk: 2, valStrg: "(12220,12299)" },
			{ txtId: "pancrO", txtNm: "Pancreas", arrSub: null, rnk: 2, valStrg: "(12406,12499)" },
			{ txtId: "liverO", txtNm: "Liver", arrSub: null, rnk: 2, valStrg: "(12500,12599)" },
			{ txtId: "gallO", txtNm: "Gallbladder or bile duct", arrSub: null, rnk: 2, valStrg: "(12710,12789)" }
			];


			// ******************************************** *
			// *******   Respiratory System Array   ******* *
			// ******************************************** *


const glbSubSrch_respO = [
			{ txtId: "anyRespO", txtNm: "Respiratory system", arrSub: null, rnk: 2, valStrg: "(13000,13999)" },
			{ txtId: "noseO", txtNm: "Nasal cavity", arrSub: null, rnk: 2, valStrg: "(13100,13199)" },
			{ txtId: "larynO", txtNm: "Larynx (<span style='font-size:90%'>including epiglottis</span>)", 
						arrSub: null, rnk: 2, valStrg: "(13260,13299)" },
			{ txtId: "bronchO", txtNm: "1&deg; bronchus - root of lung", arrSub: null, rnk: 2, valStrg: "(13490,13499)" },
			{ txtId: "lungO", txtNm: "Lung", arrSub: null, rnk: 2, valStrg: "(13500,13599)" },
			];


			// ******************************************** *
			// *******     Urinary System Array     ******* *
			// ******************************************** *


const glbSubSrch_urinO = [
			{ txtId: "anyUrinO", txtNm: "Urinary system", arrSub: null, rnk: 2, valStrg: "(16000,16999)" },
			{ txtId: "kidneyO", txtNm: "Kidney", arrSub: null, rnk: 2, valStrg: "(16101,16199)" },
			{ txtId: "ureterO", txtNm: "Ureter", arrSub: null, rnk: 2, valStrg: "(16301,16399)" },
			{ txtId: "urbladO", txtNm: "Urinary bladder", arrSub: null, rnk: 2, valStrg: "(16401,16499)" },
			{ txtId: "urethrO", txtNm: "Urethra", arrSub: null, rnk: 2, valStrg: "(16601,16699)" }
			];


			// ************************************************* *
			// *******  Male Reproductive System Arrays  ******* *
			// ************************************************* *

const glbSubSrch_malGlndO = [
			{ txtId: "anyMalGlndO", txtNm: "Male glands", arrSub: null, rnk: 3, valStrg: "(17401,17709)" },
			{ txtId: "semVesicleO", txtNm: "Seminal vesicle", arrSub: null, rnk: 3, valStrg: "(17401,17499)" },
			{ txtId: "prostateO", txtNm: "Prostate gland", arrSub: null, rnk: 3, valStrg: "(17501,17599)" },
			{ txtId: "cowperO", txtNm: "Bulbourethral gland", arrSub: null, rnk: 3, valStrg: "(17701,17709)" },
			];

const glbSubSrch_malDctO = [
			{ txtId: "anyMalDctO", txtNm: "Male ductal system", arrSub: null, rnk: 3, valStrg: "(17201,17299),(17505,17515),(17561,17569),(17751,17899)" },
			{ txtId: "epidyO", txtNm: "Epididymis", arrSub: null, rnk: 3, valStrg: "(17201,17249)" },
			{ txtId: "dctDeferO", txtNm: "Ductus deferens", arrSub: null, rnk: 3, valStrg: "(17251,17299)" },
			{ txtId: "malUrethO", txtNm: "Urethra (<span style='font-size:80%'>prostatic or membranous</span>)", arrSub: null, rnk: 3, valStrg: "(17505,17515),(17561,17560),(17751,17759)" },
			{ txtId: "penisO", txtNm: "Penis", arrSub: null, rnk: 3, valStrg: "(17801,17899)" }
			];

const glbSubSrch_maleO = [
			{ txtId: "anyMaleO", txtNm: "Male reproductive system", arrSub: null, rnk: 2, valStrg: "(17000,17999)" },
			{ txtId: "spermO", txtNm: "Spermatozoa", arrSub: null, rnk: 2, valStrg: "(17011,17019)" },
			{ txtId: "testisO", txtNm: "Testis", arrSub: null, rnk: 2, valStrg: "(17101,17199)" },
			{ txtId: "maleDuctO", txtNm: "Male ductal system", arrSub: glbSubSrch_malDctO, rnk: 2, valStrg: "(17201,17299),(17505,17515),(17561,17569),(17751,17899)" },
			{ txtId: "maleGlndO", txtNm: "Male glands", arrSub: glbSubSrch_malGlndO, rnk: 2, valStrg: "(17401,17709)" }
			];


			// ************************************************** *
			// *******  Female Reproductive System Array  ******* *
			// ************************************************** *

const glbSubSrch_femaleO = [
			{ txtId: "anyFemO", txtNm: "Female reproductive system", arrSub: null, rnk: 2, valStrg: "(18101,18599)" },
			{ txtId: "ovaryO", txtNm: "Ovary", arrSub: null, rnk: 2, valStrg: "(18101,18199)" },
			{ txtId: "ovidctO", txtNm: "Uterine tube", arrSub: null, rnk: 2, valStrg: "(18201,18299)" },
			{ txtId: "uterusO", txtNm: "Uterus (<span style='font-size:80%'>corpus uteri</span>)", arrSub: null, rnk: 2, valStrg: "(18301,18399)" },
			{ txtId: "cervixO", txtNm: "Cervix uteri", arrSub: null, rnk: 2, valStrg: "(18401,18499)" },
			{ txtId: "vaginaO", txtNm: "Vagina", arrSub: null, rnk: 2, valStrg: "(18501,18599)" },
			];


			// ********************************************** *
			// *******        Main Organ Array        ******* *
			// ********************************************** *

		// arrSub is the array for a second-side menu; arrSub == null if no second-side menu
const glbSrchArr_org = [	
			{ txtId: "anyO", txtNm: "any slide", arrSub: null, rnk: 1, valStrg: "(-1,-1)" },
			{ txtId: "ctO", txtNm: "Connective tissue", arrSub: glbSubSrch_conTisO, rnk: 1, valStrg: "(1000,1999)" },
				// skip 'incidental' skeletal muscle (2601) and 'incidental' myotendinous jxn (2651)
			{ txtId: "skmusO", txtNm: "Skeletal muscle", arrSub: null, rnk: 1, valStrg: "(2610,2649),(2653,2699)" },
				// includes encapsulated receptors (5000-5099) and special senses (5100-5999)
			{ txtId: "nerveO", txtNm: "Nervous system", arrSub: glbSubSrch_nervTisO, rnk: 1, valStrg: "(4101,5999)" },
			{ txtId: "bloodO", txtNm: "Blood &amp; bone marrow", arrSub: null, rnk: 1, valStrg: "(900,999)" },
			{ txtId: "lympO", txtNm: "Lymphoid organs", arrSub: glbSubSrch_lymphO, 
							rnk: 1, valStrg: "(7221,7329),(7401,7599),(7801,7899)" },
			{ txtId: "cardiO", txtNm: "Cardiovascular system", arrSub: glbSubSrch_cardiO, rnk: 1, valStrg: "(8101,8999)" },
			{ txtId: "endoO", txtNm: "Endocrine organs", arrSub: glbSubSrch_endoO, rnk: 1, 
							valStrg: "(15101,15299),(15521,15599),(15710,15749),(15760,15799)" },
			{ txtId: "integO", txtNm: "Integumentary system", arrSub: glbSubSrch_integO, rnk: 1, 
							valStrg: "(10102,10185),(10205,10999),(11122,11123)" },
			{ txtId: "alimO", txtNm: "GI - alimentary canal", arrSub: glbSubSrch_alim0, rnk: 1, valStrg: "(11000,11999)" },
			{ txtId: "glandO", txtNm: "GI - extramural glands", arrSub: glbSubSrch_glandO, rnk: 1, valStrg: "(12000,12999)" },
			{ txtId: "respO", txtNm: "Respiratory system", arrSub: glbSubSrch_respO, rnk: 1, valStrg: "(13000,13999)" },
			{ txtId: "urinO", txtNm: "Urinary system", arrSub: glbSubSrch_urinO, rnk: 1, valStrg: "(16000,16999)" },
			{ txtId: "maleO", txtNm: "Male reproductive system", arrSub: glbSubSrch_maleO, rnk: 1, valStrg: "(17000,17999)" },
			{ txtId: "femO", txtNm: "Female reproductive system", arrSub: glbSubSrch_femaleO, rnk: 1, valStrg: "(18101,18599)" },
			{ txtId: "embrO", txtNm: "Placenta &amp; embryology", arrSub: null, rnk: 1, valStrg: "(20000,22999)" },
			{ txtId: "spcO", txtNm: "specific range", arrSub: null, rnk: 1, valStrg: Number.NaN }
			];

	// 11/07/21: added sdArr & isTxt variables to glbSrchMainArr[].
	//	sdArr is the array listing the elements in the the drop-down menu for the criterion
	//	isTxt is a boolean variable that specifies whether the criterion is a text-search string criterion (isTxt = true)
	//		or a valStrt/valEnd criterion (isTxt= false).
	//	If isTxt == true:
	//		valStrt is an integer specifying how the search string should be handled.
	//		valEnd is the string after replacement special characters for the SQL 'LIKE' statement
	//		valStrg is the string before replacement of special characters.
	//	If isTxt == false:
	//		valStrt & valEnd are the user specified start & end values (inclusive) for the search.  These are NaN
	//			if the user doesn't choose "specific" range or doesn't change the start or end value.
	
var glbSrchMainArr = [
			{ txtId: "org", charId: "O", txtNm: "Organ system", isTxt: false,
						valStrt: Number.NaN, valEnd: Number.NaN, valStrg: "(-1,-1)",
						rnk: 0, sdArr: glbSrchArr_org, maxCol: 2, numCol: 1 },
			{ txtId: "src", charId: "R", txtNm: "Source", isTxt: false,
						valStrt: Number.NaN, valEnd: Number.NaN, valStrg: "(-1,-1)",
						rnk: 0, sdArr: glbSrchArr_src, maxCol: 2, numCol: 2 },
			{ txtId: "stn", charId: "S", txtNm: "Stain", isTxt: false,
						valStrt: Number.NaN, valEnd: Number.NaN, valStrg: "(-1,-1)",
						rnk: 0, sdArr: glbSrchArr_stn, maxCol: 2, numCol:1 },
			{ txtId: "spc", charId: "P", txtNm: "Species", isTxt: true,
						valStrt: 0, valEnd: Number.NaN, valStrg: "",
						rnk: 0, sdArr: glbSrchArr_spc, maxCol: 0, numCol: 1 },
			{ txtId: "fmx", charId: "F", txtNm: "Focal planes", isTxt: false, 
						valStrt: Number.NaN, valEnd: Number.NaN, valStrg: "(-1,-1)",
						rnk: 0, sdArr: glbSrchArr_fmx, maxCol: 0, numCol: 1 },
			{ txtId: "nam", charId: "M", txtNm: "Slide name", isTxt: true,
						valStrt: 0, valEnd: Number.NaN, valStrg: "",
						rnk: 0, sdArr: glbSrchArr_nam, maxCol: 0, numCol: 1 },
			{ txtId: "num", charId: "N", txtNm: "Slide number", isTxt: false,
						valStrt: Number.NaN, valEnd: Number.NaN, valStrg: "(-1,-1)",
						rnk: 0, sdArr: glbSrchArr_num, maxCol: 0, numCol: 1 },
			];

// ************************************************ *
// *******       menu global variables      ******* *
// *******    touchEvent global variables   ******* *
// ************************************************ *


		// menuSrtByArr[] is used to construct the "sort-by" menu item.
var glbMenuSrtByArr = [
					{id: "num", txtNm: "Slide number"},
					{id: "name", txtNm: "Slide name"},
					{id: "tis", txtNm: "Tissue"},
					{id: "maxF", txtNm: "# of focal planes"},
					{id: "stn", txtNm: "Stain"},
					{id: "spc", txtNm: "Species"}					
					];
var glbMenuSrtVar = "num";  // the variable used to sort glbSldItmArr[] 
var glbMenuSrtDir = 1;  // the direction (ascending vs. descending) for sorting glbSldItmArr[]

	// 1/24/22 glbMnuOpn[] replaces glbTchMenuOpen & glbTchPrevOpen.
	//	Object in each array element:  {itmNode: , menuCnNode: , subCnNode: }
	//	 - itmNode = node of box whose background color changed.
	//	 - menuCnNode = node of primary container
	//	 - subCnNode = for criterion side-menus, node of itmNode's subcontainer:
	//	Only one menu (or for criterion side-menus, group of linked menus) on the first ("search") page of SlideBox
	//		can be "open" (i.e., mnuCnNode.style.display == "block") at any given time.  
	//		glbMnuOpn[], in conjunction with glbOpnDDLst[], is used to track which menu is open.
	//	 - If the "open" menu is a main-menu drop-down box, then the top element in glbMnuOpn[]
	//		(i.e. glbMnuOpn[glbMnuOpn.length-1]) corresponds to this menu item, and (since there
	//		are no open criterion sidemenus) glbOpnDDLst will be empty (i.e glbOpnDDLst.length == 0).
	//	 - If the "open" menu is a criterion-box side-menu, then the identity & status of this menu is tracked 
	//		using glbOpnDDLst[] (i.e.glbOpnDDLst.length >= 1), and the function of glbMnuOpn[] is
	//		mainly to handle the problem of resetting display mode or background color to "" (see below, next)
	//	In addition to keeping track of which menu is "open" glbMnuOpn[] also handles the problem that after
	//		setting node.style.backgroundColor = "non-default-color" or node.style.display = "block", resetting
	//		the variable to "" does not restore the default value specified in jrsbStyleMain.css unless
	//		the value is first explicitly set to the default value (and the function settin the values has returned).
	//		Each time tsrchOpMnuPush() is called, it moves the elements stored in glbMnuOpn[] through the
	//		sequence to restore backgrounColor and display to "" (so the CSS values are operative).
	//	itmNode is the node whose background color changes:
	//	 - For main-menu items, this is the node (e.g. "About" or "Sort by:") in the main menu.
	//	 - For criterion side-menu items, this is the highest-level SELECTED ddBox (there may be a higher-level
	//		menu (subCnNode) from which no selection has yet been made.  The sequence for main-menu or side-menu
	//		background colors is:
	//		 > itmNode.style.backgroundColor = "rgb(80,80,114)" or "rgb(232,200,200)" ('hover' color)
	//		 > itmNode.style.backgroundColor = "rgb(128,128,192)" or "rgb(240,224,224)" ('normal')
	//		 > itmNode.style.backgroundColor = "" (CSS default)
	//	menuCnNode is the node of the primary container (which disappears when itmNode's color is 'normal')
	//	 - for main-menu, this is the container holding the drop-down items: 
	//			→ className = "mmenuDrpDwnContentClass"
	//	 - for criterion side-menus, this is the container holding itmNode:
	//			→ className = "crtSideContainerClass" or "crtSbMnuContainerClass"
	//			menuCnNode can be set to null if itmNode and/or subCnNode need to go through to-default
	//			progression, but menuCnNode needs to remain open (e.g.., it is reused by another itmNode)
	//	subCnNode = for criterion side-menus, node of itmNode's subcontainer:
	//	 - for main-menu, this item is null (there isn't a submenu to "close"
	//	 - for criterion side-menus, this can contain a non-null value, or can be null.
	//		> null => itmNode does not have subcontainer, or subcontainer's display = ""
	//		> not null => subcontainer's display is "block" → "none" → (subCnNode = null), display = "" 

var glbMnuOpn = [];

		// elements in glbOpnDDLst[] {bxNode: , cnNode: , rnk: }
		//	bxNode => node of box (menu button) that was clicked; this is the node that changes background color
		//	cnNode => node of container that is opened (style.display = "block") when boxNode is touched/clicked
		//	rnk: => the rank of the boxNode item in the drop-down side menus.
var glbOpnDDLst = [];  // this array lists side-menus that have been opened by touchEvent or onClickEvent

		// added 1/22/22 to handle changes (e.g. touch events) to input boxes that did not result in an onchange event
		//	glbPrevFocus.bxNode is node of text-input box whose value was most recently updated by onchange or onblur event
		//	glbPrevFocus.bxVal is the value of the text-input box immediately after the onchange or onblur event
		//		When one of the text-input boxes on the 2nd line of one of the main criterion boxes has an onblur event
		//		srchLoseFocus() compares the values of the box that just had the onblur event with the values stored in
		//		glbPrevFocus by srchTxtSrchValidate() or srchTxtInp().
var glbPrevFocus = {bxNode: null, bxVal: ""};

		// glbMusOvr was added 2/04/22 to keep track of container nodes whose CSS 'hover' display has been suppressed 
		//	temporarily(by setting cnNode.style.display = "none") when a menu has been 'locked' (by clicking on the menu)
		//	and the mouse is moved over a box corresponding to a different menu.
		//	Note: (2/06/22) It is only relevant for main-criterion boxes, since the 'hover' feature on side-menu items
		//		is handled by srchSbMnuDisp()
		//	 - bxNode is the target node that the mouse is over.  It is set to a non-null value (i.e. the target node)
		//		by srchMusOvrMainCrt() when the mouse is moved over the non-locked main-criterion box menu 
		//		item. It is set to null (simultaneous with resetting cnNode, see below) when:
		//		 > the mouse moves off the non-locked menu item (by calls to srchMusOutMainCrt())
		//		 > the 'locked' menu is unlocked by touching non-criterion/non-main-menu parts of the window. 
		//			This is done via a call to tchGlbClrPrev(), but is only relevant with a computer that has both
		//			a mouse anda touchscreen, since clicking the mouse on non-criterion/non-main-menu parts of the window
		//			involves moving the mouse off the non-locked menu item.
		//		 > the 'locked' menu is unlocked by clicking on an 'active' menu item (which closes all menus)
		//		 > the menu that is being locked is changed by clicking on a different menu (via calls to 
		//			tsrchCrtMainDwn(), tsrchArrBtnDwn(), or tchMenuMainDwn().
		//	 - cnNode is the container node that is associated with bxNode, and whose .style.display has been set to
		//		"none" to prevent it from being displayed by the CSS 'hover' state.  The className for this node will
		//		include:
		//		 - "menuDrpDwnContentClass" if bxNode is a main-menu item
		//		 - "crtSbMnuContainerClass" if bxNode is an array (non-active) criterion side-menu item
		//		 - "crtSideContainerClass" if bxNode is a main-criterion box.
		//		cnNode is set to a non-null value (i.e., the container node) when the mouse moves over bxNode and 
		//		cnNode.style.display is set to "none".  cnNode is set to null (simultaneous with setting bxNode = null)
		//		when:
		//		 > the mouse moves off bxNode; simultaneously, cnNode.style.display = "".
		//		 > the 'locked' menu is unlocked by clicking on a non-criterion/non-main-menu part of the window; in this
		//			case cnNode.style.display is set to "" (and all menus are closed) 
		//		 > the locked menu is unlocked (and all menu's are closed) by clicking on an 'active' menu item; in this 
		//			case cnNode.style.display is set to "" (and all menus are closed)
		//		 > bxNode is clicked (and becomes the 'locked" menu); in this case cnNode.style.display is set to "block"
var glbMusOvr = {bxNode: null, cnNode: null};

		// 2/08/22 - there is a bug in that if there is a mousedown event on a text-input box but the mouse doesn't come
		//	up until the mouse has dragged out of the text-input box, the "click" event fires on the criterion box and 
		//	NOT on the text-input box.  The only way I can think to trap this is to record the mousedown event in a
		//	global variable and then clear the variable when the "click" event occurs.
		//	 - glbTxtMusTrap.txtNode is the text-input box's node.  
		//	 - glbTxtMusTrap.itmNode is the main criterion box's node
		//	When srchTxtMusEvt() is passed a "mousedown" event, glbTxtMusTrap.txtNode and glbTxtMusTrap.itmNode are set to 
		//		the values of the text-input-box and main criterion-box nodes, respectively.  When srchTxtMusEvt() is 
		//		passed a "click" event, these two values are set to null.  If tsrchCrtMainUp() is passed a "click" event
		//		on the same node as glbTxtMusTrap.itm node when glbOpnDDLst[] is empty (i.e., the menu's are not locked),
		//		tsrchCrtMainUp() uses the values in glbTxtMusTrap to pass the evnt back to srchTxtMusEvt() 
var glbTxtMusTrap = {txtNode: null, itmNode: null};

// TEMPORARY
//var glbTmpStr = "";
// END TEMPORARY

// ******************************************** *
// *******   infoBox global variables   ******* *
// ******************************************** *

const glbSldBoxVersion = "4.00";
const glbSldBoxDate = "May, 2022";
var glbInfoBxDefTop = 110;

	// glbInfoBxVal is an object that holds values needed to move an infoBox
	// glbInfoBxVal.x is the x-coordinate (integer) of the mouse prior to the current move interval
	// glbInfoBxVal.y is the y-coordinate (integer) of the mouse prior to the current move interval
	// glbInfoBxVal.left & .top are the coordinates of top/left corner of the infoBox
	//	  prior to the current move.
	// glbInfoBxVal.boxNode is a pointer to the infoBox (not the infoMvBtn)
	// glbInfoBxVal.idx is the index of in glbInfoBxLst of the box being moved
	// left, top. & boxNode were added because box movements were jerky & unsatisfactory, so
	//    we tried to decrease the time infoBxMusMv() needs to 'think'
	//  x,y,left,top == NaN, boxNode == null, & idx == -1 whenever none of the info boxes
	//		have their move-button depressed
var glbAboutBxVal = {x: Number.NaN, y: Number.NaN, left: Number.NaN, top: Number.NaN};

	// glbInfoBxLst contains a list of all of the info boxes.
	//	btnId is the id of the move btn
	//	boxId is the id of the infoBox
	//	boxNm is the title of the infoBox
	//	boxWd is the width of the infoBox
var glbInfoBxLst = [
		{btnId: "aboutBoxMv", boxId: "aboutBox", boxNm: "About", boxWd: 700},
		];





