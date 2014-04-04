(function() {

	// Generate an AppConfig from the element's attributes
	function getPlaceholderFromElement(node) {
		var output;
		var appConfig;

		if (node) {
			var appId = node.getAttribute('data-f2-appid');
			var manifestUrl = node.getAttribute('data-f2-manifesturl');

			if (appId && manifestUrl) {
				appConfig = {
					appId: appId,
					manifestUrl: manifestUrl
				};

				// See if the user passed in a block of serialized json
				var contextJson = node.getAttribute('data-f2-context');

				if (contextJson) {
					try {
						appConfig.context = JSON.parse(contextJson);
					}
					catch (e) {
						console.warn('F2: "data-f2-context" of node is not valid JSON', '"' + e + '"');
					}
				}
			}
		}

		if (appConfig) {
			// See if this node has children
			// If it does, assume it has already been loaded
			var isPreload = hasNonTextChildNodes(node);

			output = {
				appConfig: appConfig,
				isPreload: isPreload,
				node: node
			};
		}

		return output;
	}

	function getElementsByAttribute(parent, attribute) {
		var elements = [];

		// Start with the first child if the parent isn't a placeholder itself
		if (!parent.getAttribute(attribute)) {
			parent = parent.firstChild;
		}

		(function walk(node) {
			while (node) {
				// Must be a non-text node and have the specified attribute
				if (node.nodeType === 1 && node.getAttribute(attribute)) {
					elements.push(node);
				}

				// Walk children
				if (node.hasChildNodes()) {
					walk(node.firstChild);
				}

				node = node.nextSibling;
			}
		})(parent);

		return elements;
	}

	function hasNonTextChildNodes(node) {
		var hasNodes = false;

		if (node.hasChildNodes()) {
			for (var i = 0, len = node.childNodes.length; i < len; i++) {
				if (node.childNodes[i].nodeType === 1) {
					hasNodes = true;
					break;
				}
			}
		}

		return hasNodes;
	}

	// ---------------------------------------------------------------------------
	// API
	// ---------------------------------------------------------------------------

	Helpers.AppPlaceholders = {
		getInNode: function(parentNode) {
			var placeholders = [];
			var elements = getElementsByAttribute(parentNode, 'data-f2-appid');

			for (var i = 0, len = elements.length; i < len; i++) {
				var placeholder = getPlaceholderFromElement(elements[i]);

				if (placeholder) {
					placeholders.push(placeholder);
				}
			}

			return placeholders;
		}
	};

})();
