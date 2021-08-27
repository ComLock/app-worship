import {
	RESPONSE_TYPE_HTML,
	forceArray,
	toStr,
	ucFirst
} from '@enonic/js-utils';

import {
	get as getContentByKey,
	query
} from '/lib/xp/content';
import {getContent as getCurrentContent} from '/lib/xp/portal';


export function get() {
	const content = getCurrentContent();
	//log.info(`content:${toStr(content)}`);

	const {
		datetime = '',
		songs = [],
		lead = ''
	} = content.data;
	//log.info(`lead:${toStr(lead)}`);
	//log.info(`songs:${toStr(songs)}`);

	const songsObj = {}
	forceArray(songs).map((key) => getContentByKey({key})).forEach(({
		_id,
		_path,
		displayName
	}) => {
		songsObj[_id] = {
			_path,
			displayName
		}
	});
	//log.info(`songsObj:${toStr(songsObj)}`);

	const queryParams = {
		count: -1,
		contentType: [
			'media:document', // pdf, pptx
			'media:video'
		],
		filters: {
			boolean: {
				must: {
					hasValue: {
						field: '_parentPath',
						values: Object.keys(songsObj).map(k => `/content${songsObj[k]._path}`)
					}
				}
			}
			/*ids: { // No this gives us the songs
				values: songs
			}*/
		},
		query: ''
		//query: `_parentPath in []`
	};
	log.info(`queryParams:${toStr(queryParams)}`);

	const queryRes = query(queryParams);
	log.info(`queryRes:${toStr(queryRes)}`);

	/*queryRes.hits.forEach(({
		id,
		displayName,
		_path
	}) => {

	});
	log.info(`songsObj:${toStr(songsObj)}`);*/

	const array = [];
	[
		'soprano',
		'alto',
		'tenor',
		'bass',
		'piano',
		'gitar',
		'drums',
		'cajon'
	].forEach((k) => {
		const value = content.data[k];
		if (value) {
			array.push(`<h2>${ucFirst(k)}</h2>
			<ul>
				${forceArray(value).map((key) => `<li>${getContentByKey({key}).displayName}</li>`).join('\n')}
			</ul>`);
		}
	});
	//log.info(`array:${toStr(array)}`);

	return {
		body: `<article>
		<h1>Service ${datetime}</h1>

		<h2>Songs</h2>
		<ol>
			${forceArray(songs).map((key) => `<li>${getContentByKey({key}).displayName}</li>`).join('\n')}
		</ol>

		<h3>Lead</h3>
		<ul><li>${lead ? getContentByKey({key:lead}).displayName: ''}</li></ul>

		${array.join('\n')}
<article/>`,
		contentType: RESPONSE_TYPE_HTML
	}
}
