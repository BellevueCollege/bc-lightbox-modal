import { Modal } from 'bootstrap'

class BCLightboxModal {
	static modalId = 'bc-lightbox-modal';
	static loadingHtml = '<p class="text-center">Loading...</p>';

	constructor( modalId = BCLightboxModal.modalId, dataAttribute = '[data-bc-lightbox]' ) {
		this.modalId = modalId;
		this.dataAttribute = dataAttribute;
		this.modalBodyId = `${this.modalId}-body`;
		this.init();
	}

	/**
	 * Initialize the lightbox modal by creating the modal HTML and transforming links.
	 * @return {void}
	 */
	init() {
		// Find all links with the specified data attribute
		this.lightboxLinks = document.querySelectorAll( this.dataAttribute );

		// Create the modal HTML and transform links
		this.modal = this.createModalHtml( this.lightboxLinks );
		if ( this.modal ) {
			this.transformLinksToLightbox( this.lightboxLinks, this.modal );
		}
	}

	/**
	 * Generate the HTML for the modal and append it to the body.
	 *
	 * @param {NodeList} lightboxLinks - The links that will trigger the lightbox.
	 * @returns {Modal|boolean} - Returns the Bootstrap Modal instance or false if no links.
	 */
	createModalHtml( lightboxLinks ) {

		// Only create the modal if there are links to attach it to
		if ( lightboxLinks.length > 0 ) {

			// Create container and set attributes
			const modalHtml = `
				<div class="lightbox-modal modal fade" tabindex="-1" aria-hidden="true" id="${this.modalId}" aria-label="Video Overlay">
					<button type="button" class="btn-close position-absolute top-0 end-0 m-3 zindex-tooltip border border-0 bg-transparent fs-2" data-bs-dismiss="modal" aria-label="Close">
						<span aria-hidden="true" class="fas fa-times fa-lg text-light"></span>
					</button>
					<div class="modal-dialog modal-lg modal-dialog-centered">
						<div class="modal-content">
							<div class="modal-body p-0 bg-black" id="${this.modalBodyId}">
								<div class="ratio ratio-16x9">${BCLightboxModal.loadingHtml}</div>
							</div>
						</div>
					</div>
				</div>
			`;

			// Do a fun dance to convert the string to a DOM element and append to body
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = modalHtml;
			const modalContainer = tempDiv.firstElementChild;
			document.body.appendChild(modalContainer);

			// Initialize the Bootstrap Modal
			const modal =  new Modal(modalContainer, {});
			return modal;
		}
		return false;
	}

	/**
	 * Transform links to open the lightbox modal and handle video embedding.
	 *
	 * @param {NodeList} lightboxLinks - The links that will trigger the lightbox.
	 * @param {Modal} modal - The Bootstrap Modal instance.
	 * @return {void}
	 */
	transformLinksToLightbox( lightboxLinks, modal ) {

		// Loop through each link and set up the modal trigger
		lightboxLinks.forEach( (link) => {

			// Check if each link is a YouTube or Vimeo link
			const href = link.getAttribute('href');
			if ( href.includes('youtube.com') || href.includes('youtu.be') || href.includes('vimeo.com') ) {

				// Transform Links to Bootstrap Modal triggers by Adding Data Attributes
				link.setAttribute('data-bs-toggle', 'modal');
				link.setAttribute('data-bc-lightbox-url', href);
				link.setAttribute('href', `#${this.modalId}`);

				// Get modal container and set up event listeners for show and hide
				// to load and unload the video embed HTML
				const modalContainer = document.getElementById(this.modalId);
				if ( modalContainer ) {

					// When the modal is shown, fetch and insert the video embed HTML
					modalContainer.addEventListener('show.bs.modal', (event) => {

						// Get the URL from the triggering link (what the user clicked)
						const trigger = event.relatedTarget;
						const videoUrl = trigger.getAttribute('data-bc-lightbox-url');

						// Get the element to insert the embed HTML into
						const modalBody = document.getElementById(this.modalBodyId);
						const ratioWrapper = modalBody.querySelector('.ratio');

						// Fetch the embed HTML and insert it into the modal
						BCLightboxModal.getOembedHTML(videoUrl).then( (html) => {
							if ( html ) {
								ratioWrapper.innerHTML = html;
							}
						}).catch( (error) => {
							// Handle errors gracefully
							console.error('Unable to fetch video embed html:', error);
							ratioWrapper.innerHTML = `<p class="text-center alert alert-warning">Sorry, this video cannot be played at this time. <a href="${videoUrl}" target="_blank" rel="noopener">Open in a New Window.</a></p>`;
						});
					});

					// Clear out content when modal is closed
					modalContainer.addEventListener('hidden.bs.modal', (event) => {
						const modalBody = document.getElementById('bc-lightbox-modal-body');
						const ratioWrapper = modalBody.querySelector('.ratio');
						// Clear out existing content
						ratioWrapper.innerHTML = BCLightboxModal.loadingHtml;
					});
				}
			}

		});
	}

	/**
	 * Fetch oEmbed HTML for a given video URL (YouTube or Vimeo).
	 *
	 * @param {string} url - The video URL.
	 * @returns {Promise<string|null>} - Returns the embed HTML or null if not found/error.
	 */
	static async getOembedHTML( url ) {
		try {

			// Determine if the URL is YouTube or Vimeo and fetch the oEmbed data
			if ( url.includes('youtube.com') || url.includes('youtu.be') ) {

				// Get Video Info from oEmbed API
				const response = await fetch('https://www.youtube.com/oembed?url=' + encodeURIComponent(url) + '&format=json');
				if (!response.ok) throw new Error('Network response was not ok');
				const data = await response.json();

				// Modify embed HTML to include autoplay and nocookie domain
				let embedHtml = data.html.replace('feature=oembed', 'feature=oembed&autoplay=1&enablejsapi=1&rel=0');
				embedHtml = embedHtml.replace('www.youtube.com', 'www.youtube-nocookie.com');
				return embedHtml || null;
			} else if ( url.includes('vimeo.com') ) {
				const response = await fetch('https://vimeo.com/api/oembed.json?url=' + encodeURIComponent(url) +'&autoplay=1' );
				if (!response.ok) throw new Error('Network response was not ok');
				const data = await response.json();
				return data.html || null;
			}
		} catch (error) {
			throw(error);
		}
	}
}

// Export the class for use in other modules
export default BCLightboxModal;
