import {
	RESPONSE_TYPE_HTML/*,
	toStr*/
} from '@enonic/js-utils';

import {
	assetUrl,
	getContent as getCurrentContent//,
	//getSiteConfig as getCurrentSiteConfig
} from '/lib/xp/portal';


export function get() {
	const content = getCurrentContent();
	//log.info(`content:${toStr(content)}`);

	const {displayName} = content;
	//log.info(`displayName:${toStr(displayName)}`);

	const {components} = content.page.regions.body;
	//log.info(`components:${toStr(components)}`);

	return {
		body: `<html>
	<head>
    <link rel="stylesheet" type="text/css" href="${assetUrl({path: 'style.css'})}"/>
    <title>${displayName}</title>
  </head>
  <body>
	  <main data-portal-region="body">${(components && components.length)
		? components.map((c) => `<!--# COMPONENT ${c.path} -->`)
		: ''}</main>
  </body>
</html>`,
		contentType: RESPONSE_TYPE_HTML
	};
}
