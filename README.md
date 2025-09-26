# BC Lightbox Modal Library
A small JavaScript library to allow Bootstrap 5.x Modals to be used as Lightboxes for YouTube and Vimeo videos.

## Installation
You can install the library via npm:

```bash
npm install BellevueCollege/bc-lightbox-modal
```

Note that this package is not published to the npm registry, so you need to specify the GitHub repository directly.

## Usage
Import the library in your JavaScript file:
```javascript
import BCLightboxModal from 'bc-lightbox-modal';
```
Then, initialize it:
```javascript
const lightbox = new BCLightboxModal();
```

If you would like to customize things, you can pass in two optional parameters: the desired ID for the modal element, and the data attribute to look for on links that should trigger the lightbox modal. For example:
```javascript
const lightbox = new BCLightboxModal('my-modal-id', '[data-my-lightbox]');
```

Finally, add the appropriate data attribute to your links:
```html
<a href="https://www.youtube.com/watch?v=example" data-bc-lightbox>Watch Video</a>

<!-- or for AblePlayer embed -->
 <a href="https://vimeo.com/example" data-bc-lightbox data-bc-lightbox-ableplayer>Watch Video with AblePlayer</a>
``` 

## Requirements
- Bootstrap 5.x CSS and JS must be included in your project for the modal functionality to work.
- AblePlayer features:
  - To use AblePlayer as an embed option, AblePlayer's CSS and JS must also be included in your project.
  - If you would like to include Vimeo videos in AblePlayer embeds, you must also include the Vimeo Player API script.

## Notes on the build process
This library uses [@wordpress/scripts](https://www.npmjs.com/package/@wordpress/scripts) for the build process. The source code is located in the `src` directory, and the built files are output to the `build` directory. You can run the following commands:
- `npm run build`: Builds the project for production.
- `npm run start`: Starts a development server with live reloading.

**Note:** the 'build' directory is not currently tested; the expectation is that the source code in 'src' is
included in your project and built as part of your own build process.