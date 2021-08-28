import {
	RESPONSE_TYPE_HTML,
	forceArray,
	//toStr,
	ucFirst
} from '@enonic/js-utils';
import {
	render,
	article,
	div,
	h1,
	h2,
	section,
	style
} from 'render-js/src/class';

import {getContent as getCurrentContent} from '/lib/xp/portal';


export function get() {
	const content = getCurrentContent();
	//log.info(`content:${toStr(content)}`);

	const {
		data: {
			parts = []
		},
		displayName
	} = content;

	const sections = forceArray(parts).map(({songSection,lyrics}) => section({class: 'lyrics'},[
		h2(ucFirst(songSection)),
		div(lyrics)
	]));

	const obj = article([
		h1(displayName)
	].concat(sections));
	//log.info(`obj:${toStr(obj)}`);

	const {
		//css,
		html
	} = render(obj);
	//log.info(`css:${toStr(css)}`);
	//log.info(`html:${toStr(html)}`);

	const headEnd = render(style(`.lyrics sup {
	position: relative;
	top: -1em;
	display:inline-block;
	width: 0;
	overflow:visible;
	text-shadow:#f8f8f8 -1px 1px;
	color:#000;
	font-weight:bold;
	font-family:Arial, Helvetica, sans-serif;
}`)).html;
	//log.info(`headEnd:${toStr(headEnd)}`);

	return {
		body: html,
		contentType: RESPONSE_TYPE_HTML,
		pageContributions: {
			headEnd
		}
	};
}
