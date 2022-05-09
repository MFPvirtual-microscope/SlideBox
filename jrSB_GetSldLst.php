<?php 

// jrSB_GetSldLst.php
//	Copyright 2022  James Rhodes
//	Copyright 2020,2021,2022  Pacific Northwest University of Health Sciences
    
//	jrSB_GetSldLst.php is a component of the "Slide Box" part of "Multifocal-plane Virtual Microscope"
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
//	jrSB_GetSldLst.php is part of the "SlideBox"
//	Currently, the "Slide Box" part of "Multifocal-plane Virtual Microscope" consists of 
//		11 principal files and other supplementary files:
//		- one HTML file
//		- one cascading style sheet
//		- eight javascript files
//		- one PHP file (this file).
//	Questions concerning the "Multifocal-plane Virtual Microscope" may be directed to:
//		James Rhodes, PhD.
//		1923 S. 44th Avenue
//		Yakima, WA  98903

		// This file returns a list of sldNum, sldName, sldOrgan, sldSpecies, maxF, strStainAbbr,
		//		and the paths to the image root and label image.  These will be used by 
		//		selMakeItmArr() & lstBuildWnd() to create the "Choose a slide" slide list.
		//	The SQL call is encoded as a function (jrGetSQLList()) with the body of the PHP file 
		//		calling the function
		
		// 3/28/21:  Previously, the function did not return a slide if the slide does not have an entry
		//  in tabOrgan, apparently because the "INNER JOIN tabOrgan ON tabSldList.sldNum = tabOrgan.sldNum"
		//  statement failed for any slide whose slide number was not listed in tabOrgan.sldNum.  This was
		//  corrected by only including the "INNER JOIN tabOrgan" if doing an "O"-based search.

$inclOrg = false;  // set to true if criteria include an "O" (organ system) criterion

		// input data
$sentData= &$_POST["jrArray"];
if ($sentData == "") { jrGetSQLList("",NULL); }
else { jrMkSrchStrg($sentData) ; }

	// jrMkSrchStrg(): 
	//	- converts $sentData into an array ($selArr[][]).
	//		Each element (subsidiary array) of $selArr[] corresponds to one set of selection criteria.
	//		 - $selArr[][0] is a single character corresponding to glbSrchMainArr[].charId
	//		 - $selArr[][1] is either (depending on $selArr[][0]:
	//			 - "(valStrt,valEnd)" strings, which are interpreted by jrMkNumSrchStrg(), or
	//			 - text-search strings, which are interpreted by jrMkTxtSrchStrg().

	// 11/18/21:  Because of what looks like an apparent bug in PHP handling of global arrays, we had to:
	//	 - make srchTxtArr[] a local array (rather than a global array)
	//	 - have jrMkSrchStrg(), rather than jrMkTxtSrchStrg(), push the search-text strings onto srchTxtArr[]
	//	 - pass srchTxtArr as an argument in the call from jrMkSrchStrg() to jrGetSQLList()
function jrMkSrchStrg($sentData) {
	$srchTxtArr = array();  // holds the search-text strings for SQL prepared statement substitutions
	$selArr = json_decode($sentData,false);
	$selArrSz = count($selArr);
	$selStrg = "";  // holds string containing the SQL 'WHERE' search clauses
	$tmpStrg = "";  // holds string returned by jrMk[Num/Txt]SrchStrg() ... to be added to $selStrg
	for ($i = 0; $i < $selArrSz; $i++) {
		$charId = $selArr[$i][0];
		$srchTxt = $selArr[$i][1];
		switch ($charId) {
					// valStrt/valEnd criteria
			case "O" : 
			case "R" :
			case "S" :
			case "F" :
			case "N" : $tmpStrg = jrMkNumSrchStrg($charId,$srchTxt);
						break;
					// search-text criteria
			case "P" :
			case "M" : $tmpStrg = jrMkTxtSrchStrg($charId,$srchTxt);

								// string returned by jrMkTxtSrchStrg() begins with "SQL" on error
								// string returned by jrMkTxtSrchStrg() will contain one "?" if
								//		srchTxt (or equivalently, selArr[i][1]) is a text-search string
								//		that is to be bound into the prepared SQL statement
						if ((substr($tmpStrg,0,3) != "SQL") && (strpos($tmpStrg,"?") !== false)) {
								// if (charId == "P") && (srchTxt == "") then tmpStrg won't contain "?"
								// if (charId != "P") && (srchTxt == "") then jrMkTxtSrchStrg() returns
								//		an error string beginning with "SQL"
								// thus, this should guarantee that (srchTxt != "") within this 'if' statement
							$srchTxt = jrChkSrchTxt($srchTxt);
							if (substr($srchTxt,0,3) == "SQL") {  // jrChkSrchTxt() returned an error
								$tmpStrg = $srchTxt . "SQL - jrMkSrchStrg(): error in search-text string (\"";
								$tmpStrg .= $selArr[$i][1] . "\") for criterion \"" . $charId;
								$tmpStrg .= "\".  Please report this error.\n";
								}
							else if (($srchTxt == "") || ($srchTxt == NULL)) {  // this should never happen, but test for it
								$tmpStrg = "SQL - jrMkSrchStrg(): search-text string (\"";
								$tmpStrg .= $selArr[$i][1] . "\") for criterion \"" . $charId;
								$tmpStrg .= "\" is empty.  Please report this error.\n";
								}
							else {  // srchTxt is OK, push it onto srchTxtArr[]							
								$srchTxtArr[count($srchTxtArr)] = $srchTxt;
								}
							}
						break;
			default : $tmpStrg = "SQL - undefined criterion (\"" . $selArr[$i][0] . "\".  Please report this error.\n";
						break;
			}
				// test to ensure $tmpStrg is valid
		if (($tmpStrg == NULL) || ($tmpStrg == "")) {
			$tmpStrg = "SQL - jrMkSrchStrg() error: tmpStrg is NULL for selArr[" . $i . "][0] = \"";
			$tmpStrg .= $charId . "\"; selArr[" . $i . "][1] = \"" . $srchTxt;
			$tmpStrg .= "\".  Cannot process SQL request.  Please report this error.\n";
			echo $tmpStrg;
			return;
			}
		else if (substr($tmpStrg,0,3) == "SQL") { // tmpStrg contains error message
			echo $tmpStrg . "SQL - Could not process SQL search request.\n";
			return;
			} 
				// insert new criterion ($tmpStrg) into search string ($selStrg)
//  different from jrSB_SupSldList.php ... if first element, SupSldList needs "WHERE" and no "AND"
		$selStrg .= " AND (" . $tmpStrg . ")";
//  end different from jrSB_SupSldList.php
		}
	jrGetSQLList($selStrg, $srchTxtArr);
	return;
	}

	// For valStrt/valEnd variables, jrMkNumSrchStrg() will parse the text in $selArr[][1], check to make
	//		certain that each element is an integer, and then return a string containing the clause:
	//		  (tabSldInfo.variable BETWEEN valStrt AND valEnd), 
	//		or multiple BETWEEN clauses connected by OR statements.
function jrMkNumSrchStrg($chId,$crtStrg) {
	global $inclOrg;
	$strOut = "";
		// get variable name
	$srchVar = "";
	switch ($chId) {
		case "O" : $srchVar = "tabOrgan.orgNum"; 
					$inclOrg = true; break;
		case "R" : $srchVar = "tabSldList.srcID"; break;
		case "S" : $srchVar = "tabSldInfo.stainID"; break;
		case "F" : $srchVar = "tabSldList.maxF"; break;
		case "N" : $srchVar = "tabSldList.sldNum"; break;
		default :  $strOut = "SQL - jrMkNumSrchStrg(): undefined character-ID value (\"";
					$strOut .= $chId . "\").  Please report this error.\n";
					return($strOut);
		}
		// parse $selCrt into separate "(valStrt,valEnd)" elements
			// remove terminal ")"
	$strSz = strlen($crtStrg) - 1;
	if (($strSz >=0) && ($crtStrg[$strSz] == ")")) {
		$curStrg = substr($crtStrg,0,$strSz);
		}
	else {
		$strOut = "SQL - jrMkNumSrchStrg(): for chID = \"" . $chId;
		$strOut .= "\", cannot find terminal \")\" in \"" . $crtStrg;
		$strOut .= "\".  Please report this error.\n";
		return($strOut);		
		}
			// convert string containing list of ranges into array
	$crtArr = explode(")",$curStrg);
	$crtArrSz = count($crtArr);
	if ($crtArrSz <= 0) {  // check array size
		$strOut = "SQL - jrMkNumSrchStrg(): Illegal size of crtArr[] (" . $crtArrSz;
		$strOut .= ").  There must be at least one set of values for chID = \"" . $chId;
		$strOut .= "\" (\"" . $crtStrg . "\").  Please report this error.";
		return($strOut);
		}
			// convert string '(valStrt,valEnd)' into a sub-array
	for ($i =  0; $i < $crtArrSz; $i++) {
			// remove '*(' from beginning of each element
		$crtArr[$i] = substr($crtArr[$i],strpos($crtArr[$i],"(") + 1);
		if (($crtArr[$i] == false) || ($crtArr[$i] == "")) {
			$strOut = "SQL - jrMkNumSrchStrg(): could not find \"(\" at beginning of string for crtArr[";
			$strOut .= $i . "] for chID = \"" . $chId . "\" in \"" . $crtStrg;
			$strOut .= "\".  Please report this error.\n";
			return($strOut);		
			}
			// explode 'valStrt,valEnd' into [valStrt][valEnd]
		$crtArr[$i] = explode(",",$crtArr[$i]);
		if (count($crtArr[$i]) != 2 ){
			$strOut = "SQL - jrMkNumSrchStrg(): wrong number of elements (" . count($crtArr[$i]);
			$strOut .= ") in crtArr[" . $i . "] for chID = \"" . $chId . "\" (\"" . $crtStrg;
			$strOut .= "\").  Please report this error.\n";
			return($strOut);		
			}
				// convert strings to numbers
		for ($j = 0; $j < 2; $j++) {
			if (is_numeric($crtArr[$i][$j])) { $crtArr[$i][$j] = $crtArr[$i][$j] + 0; }
			else { 
				$strOut = "SQL - jrMkNumSrchStrg():  for chID = \"" . $chId . "\" (\"" . $crtStrg;
				$strOut .= "\"), crtArr[" . $i . "][" . $j . "] (\"" . $crtArr[$i][$j];
				$strOut .= "\") is not (but should be) a number.  Please report this error.\n";
				return($strOut);
				}
			}
				// check for integers
		if (!(is_int($crtArr[$i][0]) && is_int($crtArr[$i][1]))) {
			$strOut = "SQL - jrMkNumSrchStrg():  for chID = \"" . $chId . "\" (\"" . $crtStrg;
			$strOut .= "\"), both crtArr[" . $i . "][0] (\"" . $crtArr[$i][0];
			$strOut .= "\"), and crtArr[" . $i . "][1] (\"" . $crtArr[$i][1];
			$strOut .= "\") must be integers.  Please report this error.\n";
			return($strOut);
			}
				// check for at least one positive number
		if (($crtArr[$i][0] < 0) && ($crtArr[$i][1] < 0)) {
			$strOut = "SQL - jrMkNumSrchStrg():  for chID = \"" . $chId . "\" (\"" . $crtStrg;
			$strOut .= "\"), both crtArr[" . $i . "][0] (\"" . $crtArr[$i][0];
			$strOut .= "\"), and crtArr[" . $i . "][1] (\"" . $crtArr[$i][1];
			$strOut .= "\") cannot be less than zero.  Please report this error.\n";
			return($strOut);
			}
		}  // end loop building valStrt/valEnd array
		// build search string

	for ($i = 0; $i < $crtArrSz; $i++) {
		if ($crtArrSz > 1) { $strOut .= "("; } // need parenthesis if more than one set of values
		$strOut .= $srchVar;
		if ($crtArr[$i][0] < 0) {  // valStrt == minimum
			$strOut .= " <= " . $crtArr[$i][1];
			}
		else if ($crtArr[$i][1] < 0) {  // valEnd == maximum
			$strOut .= " >= " . $crtArr[$i][0];
			}
		else {
			$strOut .= " BETWEEN " . $crtArr[$i][0] . " AND " . $crtArr[$i][1];
			}
		if ($crtArrSz > 1) {  // need parenthesis & OR if more than one set of values
			$strOut .= ")";
			if ($i < ($crtArrSz - 1)) { $strOut .= " OR "; }
			}
		}
	return($strOut);
	}


	// jrMkTxtSrchStrg() creates the SQL clause for text-search criteria.
	// jrMkTxtSrchStrg() is passed:
	//	 - chId, which is the single-character code (glbSrchMainArr[].charId) for the criterion
	//	 - crtStrg, which is the search-string (after massaging by selMkTxtSrchStrg()) that was
	//		entered by the user.  
	//		 - for chId = "P" (species), crtStrg = "" results in a search for instances where the 
	//			tabSldInfo.sldSpecies == NULL (this occurs when the user selects "unknown" (so
	//			valStrt == -1).
	//		 - for chId = "M" (slide name), crtStrg == "" is an error.
	//		 - if crtStrg != "", then it is assumed that the string already is in a form ready
	//			for inclusion (through a prepared statement) in a SQL "WHERE variable LIKE string"
	//			clause.  The string can contain SQL wildcard characters, the user must precede each
	//			wildcard character with a '~' since selMkTxtSrchStrg() excapes all wildcard characters
	//			that are not preceded by a tilde.
	// jrMkTxtSrchStrg():
	//	- tests if crtStrg == ""; if chId == "P", the function returns a SQL
	//		WHERE "variable IS NULL" clause, otherwise it returns a "SQL - error" string.
	//	- if crtStrg != "", the function creates a WHERE "variable LIKE ?" clause
	// jrMkTxtStrchStrg() 
function jrMkTxtSrchStrg($chId,$crtStrg) {
	$strOut = "";
	switch ($chId) {
		case "P" : $srchVar = "tabSldInfo.sldSpecies"; break;
		case "M" : $srchVar = "tabSldList.sldName"; break;
		default :  $strOut = "SQL - jrMkTxtSrchStrg(): undefined character-ID value (\"";
					$strOut .= $chId . "\").  Please report this error.\n";
					return($strOut);
		}
	if (($crtStrg == "") || ($crtStrg == NULL)) {
			// if, in the future, there are other criteria that can be NULL
			//	these if ... else statements should be replaced with a switch
		if ($chId == "P") { $strOut = $srchVar . " IS NULL"; } 
		else {
			$strOut = "SQL - jrMkTxtSrchStrg(): an empty text-search string (crtStrg = \"\")";
			$strOut .= " is not allowed for chId = \"" . $chId . "\".  Please report this error.\n";
			}
		}
	else {
		$strOut = $srchVar . " LIKE ?";
			// pushing $crtStrg onto srchTxtArr[] is now done by jrMKSrchStrg() ... 11/18/21
		}
	return($strOut);	
	}


	// jrChkSrchTxt() is passed the string ($srchTxt; $selArr[$i][1]) that will be matched in the 'LIKE' clause.
	//	The function checks to make sure that the string is not empty ("", NULL) and that it does not contain
	//	a prohibited SQL keyword.  On error, it returns a string beginning with "SQL".
function jrChkSrchTxt($chkStrg) {
	$sqlKeyWrd = array("ADD", "ALTER", "AND", "ALL", "AND", "ANY", "AS", "BACKUP", "BETWEEN",
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
						);	
	if (($chkStrg == "") || ($chkStrg == NULL)) {
		return("SQL - text-search string (\"chkStrg\") is empty");
		}
	$arrSz = count($sqlKeyWrd);
	for ($i = 0; $i < $arrSz; $i++) {
		if (preg_match("/\\b". $sqlKeyWrd[$i] . "\\b/i",$chkStrg) == true) {
			return("SQL - text-search string (\"" . $chkStrg . "\") contains a prohibited word (\"" . $sqlKeyWrd[$i] . "\")");
			}
		}
	return($chkStrg);
	}


	// jrGetSQLList() handles the actual SQL query and echo's the result back to SlideBox.
	// jrGetSQLList() is passed:
	//	-  a text string containing the part of the "WHERE ..." clause in the SQL statement that 
	//		varies depending on the search criteria selected in SlideBox.  This string is empty
	//		if all non-restricted slides are to be returned (i.e., the user did not use SlideBox's
	//		"limit slides by" critera
	//	- the array ($strVarArr) containing the values to be inserted into the prepared statement.  This
	//		was added on 11/18/21 because of an apparent bug in PHP's handling of global arrays.
	// jrGetSQLList() also uses the values in global variable $inclOrg
	// jrGetSQLList() echo's (to SlideBox) $jrResult, which contains error messages (if any) and
	//		the results from the SQL search (if the SQL search was successful).

	// $jrResult, which is what is echo'd back to SlideBox, contains:
	//	 - error messages generated during the SQL search (if there are any errors).  All error messages precede any 
	//		valid results from the actual search (assuming the search was successful).
	//		 => all error messages begin with "SQL" and end with "\n".
	//	 - appended after the error messages (if there are any error messages) is result from the SQL search.
	//		The results consist of either:
	//		 => "NONE" if no slides were matched, or
	//		 => a JSON-encoded array containing the data for the matched slides.

	// NOTE:  once SQL connection is established, do NOT exit() or return until connection is closed

function jrGetSQLList($jrExtSrchStr, $srchTxtArr) {
	global $inclOrg;
	if ($srchTxtArr == NULL) { $srchTxtArrSz = 0; }
	else { $srchTxtArrSz = count($srchTxtArr); }
	$servername = "localhost";
	$username = "<INSERT SlideBox's USERNAME HERE>";
	$password = "<INSERT SlideBox's PASSWORD HERE";
	$dbname = "slideData";  // need to make this change to the SQL database name
	$jrResult = "";  // value returned (echo'd) to SlideBox.
	$sqlOut = "";  // will hold result from SQL search, to be appended to end of jrResult
		// Create connection
	$conn = mysqli_connect($servername, $username, $password, $dbname);
		// Check connection
	if (!$conn) {
    	exit( "SQL connection failed: " . mysqli_connect_error() );
		}
		// create SQL statement
	$sqlStr = "SELECT DISTINCT tabSldList.sldNum, tabSldList.sldName, tabSldInfo.sldOrgan, tabSldInfo.sldSpecies,";
	$sqlStr .= " tabSldList.maxF, tabStains.strStainAbbr, tabSldList.sldRoot, tabSldList.lblPathName";
	$sqlStr .= " FROM tabSldList";
	$sqlStr .= " INNER JOIN tabSldInfo ON tabSldList.sldNum = tabSldInfo.sldNum";
	$sqlStr .= " INNER JOIN tabStains ON tabSldInfo.stainID = tabStains.stainID";
		// 3/28/21: only do INNER JOIN tabOrgan if search includes 'limit by "O" request'
	if ($inclOrg) { $sqlStr .= " INNER JOIN tabOrgan ON tabSldList.sldNum = tabOrgan.sldNum"; }
//  different from jrSB_SupSldList.php
	$sqlStr .= " WHERE (tabSldList.isRstrctd = 0)" . $jrExtSrchStr;
// end different
	$sqlStr .= ";";
	
		// prepare SQL statement
	$sqlStmt = mysqli_prepare($conn, $sqlStr);
	if (!$sqlStmt) {
		$jrResult .= "SQL statement preparation failed: " . mysqli_error($conn) . "\n";
		}
			// There has to be a better way of doing this, but I'm not seeing it right now,
			//	mysqli_stmt_bind_param() requires a list of comma-separated values, where the
			//	value can be a string containing comma's.  I can't convert the argument into 
			//	a string, because the function is looking for list of variables, not a string
			//	a string containing a list of values.  I can't use an array, because the function
			//	isn't looking for an array of variables.
			
			// Currently, we're hard-wiring the valStrt/valEnd variables, only the search-string
			//	variables need to be bound ... and currently there are only two search-string
			//	criteria, so (currently) there are only two possible forms of the bind statement.
			//	For now, we'll explicitly list both.

	else if ($srchTxtArrSz > 2) {
		$jrResult .= "SQL - too many (" . $srchTxtArrSz . ") search-string variables. Can\'t bind them to SQL statement.\n";
		}
	
	else {  // statement preparation succeeded, => bind values to prepared statement
		if ( $srchTxtArrSz == 2) {
			$bndResult = mysqli_stmt_bind_param($sqlStmt,"ss",$srchTxtArr[0],$srchTxtArr[1]);
			}
		else if ($srchTxtArrSz == 1) {
			$bndResult = mysqli_stmt_bind_param($sqlStmt,"s",$srchTxtArr[0]);
			}
		else { $bndResult = true; }  // no binding needed if there aren't any search-string criteria, so binding succeeded.
		if (!$bndResult) { $jrResult .= "SQL binding to prepared SQL statement failed:  " . mysqli_stmt_error($sqlStmt) ."\n"; }
		else if (!mysqli_stmt_execute($sqlStmt)) { // binding succeeded => try to execute statement
			$jrResult .= "SQL execution of prepared statement failed:  ". mysqli_stmt_error($sqlStmt) . "\n";			
			}
		else {  // SQL statement executed => get result
			$sqlResult = mysqli_stmt_get_result($sqlStmt);
			if (!$sqlResult) {  // get_result failed
				$jrResult .= "SQL unable to retrieve result:  ". mysqli_stmt_error($sqlStmt) . "\n";			
				}
			else {  // SQL statement successfully ran => now get result
				$sqlRows = mysqli_num_rows($sqlResult);
				if ($sqlRows === false) {
					$jrResult .= "SQL unable to retrieve number of rows  ". mysqli_error($sqlResult) . "\n";
					}
				else if ($sqlRows == 0) { $sqlOut = "NONE"; }
				else if ($sqlRows > 0 ) {
					$sqlOut = mysqli_fetch_all($sqlResult,MYSQLI_ASSOC);
					if (!$sqlOut) {
						$jrResult .= "SQL unable to fetch data:  ". mysqli_error($sqlResult) . "\n";
						} 
					else { $sqlOut = json_encode($sqlOut); }  // convert SQL output into JSON-encoded array
					} 
				}  // end SQL run successfully
			}  // end statement preparation successful
					// need to close prepared statement
		if (!mysqli_stmt_close($sqlStmt)) {
			$jrResult .= "Unable to close prepared statement : " . mysqli_stmt_error($sqlStmt) . "\n";
			}
		}  // end prepare SQL statement
	if (!mysqli_close($conn)) {
		$jrResult .= "SQL unable to close SQL connection:  ". mysqli_error($conn) . "\n";
		}
	if ($sqlOut == "") { $jrResult .= "SQL - no output (sqlOut == \"\").\n"; }
	else { $jrResult .= $sqlOut; }
	echo $jrResult; 
	return;
	}

exit;



?>
