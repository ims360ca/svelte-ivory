# Ivory, more than just a [skeleton](https://www.skeleton.dev/)

A svelte library with a bunch of components and utilities, building upon [skeletons](https://www.skeleton.dev/) design system.  
Currently this library is primarily intended for our ([ims360](https://ims360.de/)) internal use, so documentation is sparse at the moment.  
Eventually we will add more documentation and examples to make it easier for devs outside our organization to use.

## Setup

Include this line in your `app.css` file, so the TW classes used in the lib are included:

```css
@source "../node_modules/@ims360/svelte-lib";
```

_You may need to adjust the path if your `app.css` is not located in `/src`_
