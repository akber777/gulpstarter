# gulpStarter

### Installation
After cloning the project, open the terminal in the project directory and run the following commands in order (if node, bower, and gulp are not installed on your PC, install these three first)
```shell
npm install
```
```shell
bower install
```
```shell
gulp
```

### Development Tools Used
#### GULP
#### SASS
#### NPM
#### BOWER
#### BEM
#### SMACSS 

## GULP
All development changes are made in the **/src** folder and compiled with gulp into the **/build** folder.
Back-end developers only need the contents of the **/build** folder.

Tasks performed in Gulp:<br />
-SASS compilation<br />
-Adding prefixes with autoprefixer<br />
-Importing layouts like header and footer using fileinclude<br />
-Minifying js files<br />
-Minifying css files with cleanCSS<br />
-Renaming minified css files by adding .min suffix<br />
-Concatenating different .js files from js/main folder into main.js<br />
<br />
## SASS
Sass files are in the **/css** folder under **/src**. All CSS changes will be made here. Folders are created using the **SMACSS** standard for better understanding. Here's what each folder contains:<br />

### /abstracts
Contains mixins and variables

### /base
Contains basic CSS files like font styles

### /components
Contains reusable elements used throughout the site like modals and pagination components

### /layout
Contains layouts like footer, header, and navigation

### /pages
Contains CSS files for each page, where page-specific CSS changes are made

## NPM
package.json file lists all development dependencies

## BOWER
All frameworks and plugins used in the site are installed via bower. You can see what's installed in the bower.json file.
Bower packages are installed in the /lib folder, which we reference in the site

## BEM
All CSS class names follow the BEM naming convention

## LIVERELOAD
LiveReload is integrated into the starter. When you save file, it automatically updates the modified files and refreshes everything, eliminating the need to manually refresh the browser

## IMAGES RESIZE
Sometimes image resizing can be time-consuming. In such cases, you should deactivate .pipe(imagemin({use: [imageminMozjpeg()] })) in the imageCompile() function in gulpfile.js. You can reactivate it after completing the entire project. Resized images will be added to the build img folder






