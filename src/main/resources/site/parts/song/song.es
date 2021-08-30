import {
	RESPONSE_TYPE_HTML,
	forceArray,
	rpad,
	//toStr,
	ucFirst
} from '@enonic/js-utils';
import {
	render,
	article,
	//div,
	h1,
	h2,
	pre,
	section//,
	//style
} from 'render-js/src/class';

import {get as getContentByKey} from '/lib/xp/content';
import {getContent as getCurrentContent} from '/lib/xp/portal';


if (!String.prototype.splice) {
	/**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
	String.prototype.splice = function(start, delCount, newSubStr) {
		const s = this.length < start ? rpad(this, start) : this;
		return s.slice(0, start) + newSubStr + s.slice(start + Math.abs(delCount));
	};
}


export function get() {
	const content = getCurrentContent();
	//log.info(`content:${toStr(content)}`);

	const {
		data: {
			parts = []
		},
		displayName
	} = content;

	const roleIdToDisplayName = {};

	const sections = forceArray(parts).map(({
		songSection,
		lines = [],
		//lyrics
		roles = []
	}) => {
		lines = forceArray(lines);
		//log.info(`lines:${toStr(lines)}`);
		const obj = {};

		roles = forceArray(roles);
		//log.info(`roles:${toStr(roles)}`);
		roles.forEach(({
			roles: roleIds = [],
			annotations = []
		}) => {
			roleIds = forceArray(roleIds);
			roleIds.forEach((roleId) => {
				if (!roleIdToDisplayName[roleId]) {
					roleIdToDisplayName[roleId] = getContentByKey({key: roleId}).displayName;
				}
			});
			const roleLabel = roleIds.map(roleId => roleIdToDisplayName[roleId]).join(', ');
			//log.info(`roleLabel:${toStr(roleLabel)}`);

			const l = [];
			lines.forEach(() => {
				l.push('');
			});
			//log.info(`l:${toStr(l)}`);

			//log.info(`annotation:${toStr(annotation)}`);
			annotations = forceArray(annotations);
			annotations.forEach((a) => {
				//log.info(`a:${toStr(a)}`);
				const position = a.substring(0, a.indexOf(' '));
				//log.info(`position:${toStr(position)}`);
				const [line, column] = position.split(':');
				//log.info(`line:${toStr(line)}`); // Index starts at 1
				//log.info(`column:${toStr(column)}`); // Index starts at 1
				const text = a.substring(a.indexOf(' ') + 1);
				//log.info(`text:${toStr(text)}`);
				l[line - 1] = l[line - 1].splice(column - 1, text.length, text);
			});
			//log.info(`l:${toStr(l)}`);
			obj[roleLabel] = l;
		}); // roles.forEach
		//log.info(`obj:${toStr(obj)}`);

		return section({class: 'lyrics'},[
			h2(ucFirst(songSection)),
			pre(lines.map((line, i) => Object.keys(obj).map(k => obj[k][i]).concat(line).join('<br/>')).join('<br/><br/>'))
		]);
	});
	//log.info(`roleIdToDisplayName:${toStr(roleIdToDisplayName)}`);

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

	/*const headEnd = render(style(`.lyrics sup {
	position: relative;
	top: -1em;
	display:inline-block;
	width: 0;
	overflow:visible;
	text-shadow:#f8f8f8 -1px 1px;
	color:#000;
	font-weight:bold;
	font-family:Arial, Helvetica, sans-serif;
}`)).html;*/
	//log.info(`headEnd:${toStr(headEnd)}`);

	return {
		body: html,
		contentType: RESPONSE_TYPE_HTML/*,
		pageContributions: {
			headEnd
		}*/
	};
}
