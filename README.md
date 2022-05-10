# SlideBoxfor MFPvirtual-microscope

Open-source multifocal-plane virtual microscope for teaching histology

The "Multifocal-plane Virtual Microscope", which is the object of this GitHub Organization (MFPvirtual-microscope), is an internet-based program for displaying multifocal-plane, whole-slide-scanned microscope slides ("virtual slides"). This Virtual Microscope is intended for use in teaching histology (microscopic anatomy). The virtual slides, which are stored using an image-tile architecture similar to that used by the Google Maps API, can be either single-focal-plane virtual slides typically used for teaching histology, or multifocal-plane virtual slides. With a multifocal-plane virtual slide, the user can focus up-and-down through the tissue section, allowing the student to gain a better appreciation of the three-dimensional structure of the specimen (for instance, see: http://viewer.pnwu.edu?sb=3012 or http://viewer.pnwu.edu/?sb=3003).

This Virtual Microscope consists of two modules:

    the "Viewer", which displays a selected virtual slide. An example of an implementation of the Viewer can be seen at: http://viewer.pnwu.edu.
    the "SlideBox", which allows the user to search a database of virtual slides and to choose a slide to be displayed in the Viewer. An example of an implementation of the SlideBox can be seen at: http://slidebox.pnwu.edu.

This repository (MFPvirtual-microscope/SlideBox) contains the code and ancillary files for the generic version of the SlideBox (each implementation of the SlideBox can be "branded" with the university's/institution's logo and specific "About" menu). In addition to the files contained in this repository, the SlideBox utilizes a database containing the virtual slides and a SQL database (containing metadata about the virtual slides). This repository consists of four directories (folders):

    SldBox-HTMLclient contains the HTML and related (javascript, css) files that run in the client's internet browser.
    PHP_SQL contains the server-side PHP files that the Viewer uses to access the SQL database.
    images contains the non-institution-specific *.png and *.jpg images (and a "beep"/"toot" *.wav file) that are used by all implementations of the Viewer.
    InstSpcImgChip contains the "institution-specific" images for the generic ("chipmunk") version of the viewer. Each implementation of the Viewer will have a different (and possibly differently-named) directory containing the logos and other "branding" that is specific for the university or institution that is hosting the Viewer. For each implementation of the Viewer, the name and contents of this directory are specified in jrscpInstSpcGlobal.js.

There also are README files in each directory: README-HTMLclient.md, README-phpFiles.md, README-images.md, README-images.md, and README-institution-specific images.md. I hope that these are helpful.
