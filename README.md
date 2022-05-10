# SlideBox for MFPvirtual-microscope

Open-source multifocal-plane virtual microscope for teaching histology

The "Multifocal-plane Virtual Microscope", which is the object of this GitHub Organization (MFPvirtual-microscope), is an internet-based program for displaying multifocal-plane, whole-slide-scanned microscope slides ("virtual slides").&nbsp; This Virtual Microscope is intended for use in teaching histology (microscopic anatomy).&nbsp; The virtual slides, which are stored using an image-tile architecture similar to that used by the Google Maps API, can be either single-focal-plane virtual slides typically used for teaching histology, or multifocal-plane virtual slides.&nbsp; With a multifocal-plane virtual slide, the user can focus up-and-down through the tissue section, allowing the student to gain a better appreciation of the three-dimensional structure of the specimen (for instance, see: http://viewer.pnwu.edu?sb=3012 or http://viewer.pnwu.edu/?sb=3003).

This Virtual Microscope consists of two modules:

* the "Viewer", which displays a selected virtual slide, and is contained in a separate repository:  [MFPvirtual-microscope/Viewer](https://github.com/MFPvirtual-microscope/Viewer).  An example of an implementation of the Viewer can be seen at: http://viewer.pnwu.edu.
* the "SlideBox", which is contained in this repository.&nbsp; SlideBox allows the user to search a database of virtual slides and to choose a slide to be displayed in the Viewer.&nbsp; An example of an implementation of the SlideBox can be seen at: http://slidebox.pnwu.edu.

This repository ([MFPvirtual-microscope/SlideBox](https://github.com/MFPvirtual-microscope/SlideBox)) contains the code and ancillary files for the generic version of the SlideBox (each implementation of the SlideBox can be "branded" with the university's/institution's logo and specific "About" menu).&nbsp; In addition to the files contained in this repository, the SlideBox utilizes a database containing the virtual slides and a SQL database (containing metadata about the virtual slides).&nbsp; This repository consists of four directories (folders):

* [SldBox-HTMLclient](https://github.com/MFPvirtual-microscope/SlideBox/tree/main/SldBox-HTMLclient) contains the HTML and related (javascript, css) files that run in the client's internet browser.
* [SldBox-PHP](https://github.com/MFPvirtual-microscope/SlideBox/tree/main/SldBox-PHP) contains the server-side PHP file ([jrSB_GetSldLst.php](https://github.com/MFPvirtual-microscope/SlideBox/blob/main/SldBox-PHP/jrSB_GetSldLst.php)) that SlideBox uses to access the SQL database.&nbsp; This file should be included in the same directory (folder) as the HTML/javascript/CSS files in SldBox-HTMLclient, although we've placed it in a separate directory in this respository (in analogy with the PHP files for the Viewer).&nbsp; However, unlike SlideBox's PHP file, the Viewer's PHP files go in a directory (..\\PHP_SQL) that is distinct from that used by the Viewer's client (HTML/javascript/CSS) files.
* [SldBox-Images](https://github.com/MFPvirtual-microscope/SlideBox/tree/main/SldBox-Images) contains the non-institution-specific \*.png images that are used by all implementations of SlideBox.&nbsp; These images were used when transitioning from the version of the Multifocal-plane Virtual Micrsocope in which the institution-specific logos were embedded in the HTML code, and they are unessential except that they still are referenced in the HTML file (we'll remove the references in an upcoming version of SlideBox).
* [SldBox-InstSpcImgChip](https://github.com/MFPvirtual-microscope/SlideBox/tree/main/SldBox-InstSpcImgChip) contains the "institution-specific" images for the generic ("Chipmunk") version of SlideBox.&nbsp; Each implementation of the Multifocal-plane Virtual Microscope (both SlideBox & Viewer) can use a unique set of logos & "About" menu items for "branding" that is specific for the university or institution that is hosting the Virtual Microscope.&nbsp; For each implementation of SlideBox, the name and contents of this institution-specific directory may be different and is specified in [jrsbInSpcGlobal.js](https://github.com/MFPvirtual-microscope/SlideBox/blob/main/SldBox-HTMLclient/jrsbInSpcGlobal.js)

There also are README files in each directory: [README-SldBox-client.md](https://github.com/MFPvirtual-microscope/SlideBox/blob/main/SldBox-HTMLclient/README-SldBox-client.md), [README-SldBoxPHP.md](https://github.com/MFPvirtual-microscope/SlideBox/blob/main/SldBox-PHP/README-SldBoxPHP.md), [README-SldBox-images.md](https://github.com/MFPvirtual-microscope/SlideBox/blob/main/SldBox-Images/README-SldBox-images.md) and [README-SldBox-InstituteSpecific.md](https://github.com/MFPvirtual-microscope/SlideBox/blob/main/SldBox-InstSpcImgChip/README-SldBox-InstituteSpecific.md).&nbsp; I hope that these are helpful.
