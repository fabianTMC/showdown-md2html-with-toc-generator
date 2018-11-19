# showdown md2html with toc generator 

## Getting Started 

### Input Files
* Store all the input markdown files in the folder `src`. 
* Conversion works recursively for all folders inside this directory.

### Output Files
* The output html files will be stored in the folder `public`. 

### HTML Template
* Each `.md` file will be wrapped around a template that you specify. 
* To specify the template, modify the `config/templates/file-template.html` file.
* The HTML comment `<!--CONTENT-->` will be replaced with the generated markdown from each file. 


### TOC Generation
* The toc will be generated as the root `index.html` page.
* The TOC that is generated will be based on the `config/toc.json` configuration.
* The configuration format is: 
```json
{
    ".md file link": "Title"
}
```
* The **.md file link** must be relative to the `src` directory with a leading slash (`/`)
For example:
```json
{
    "/hello.md": "Hello World",
    "/about.md": "About Me",
    "/posts/first.md": "My first post",
}
```
* _**NOTE:**_ If none of the .md file links are found in the generated files, that will be skipped in the toc generated index.html file.

### TOC link template
* Each link for the toc will be wrapped in the template from `config/templates/partials/toc-link.html`
* `<!--NAME-->` represents the title of the link
* `<!--LINK-->` represents the link to the html page

### TOC template
* Once the toc links are generated, the toc page will be generated using the template from `config/templates/toc-template.html`
* `<!--CONTENT-->` will be replaced with the generated toc links. 

## Running the script

```bash
$ npm install
$ node convert.js
```

## Notes
* The `src/` folder is tracked by the git index.
* The `public/` is _**git ignored**_ so that it will never be commited unless forced.