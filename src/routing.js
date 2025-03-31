import { registerRoute as originalRegisterRoute } from 'workbox-routing';
import {
	getAccount,
	getCurrentAccountId,
	getDevice,
	hasOrg
} from './api.js';
import { Store } from '@src/api/computed/store.js';
import { APP_NAME } from './constants.js';

export function registerRoute(path, methods) {
	const { get, post } = methods;
	if (get) {
		registerRouteMethod(path, get);
	}
	if (post) {
		registerRouteMethod(path, post, 'POST');
	}
}

function registerRouteMethod(path, handler, method) {
	const re = regexFromPath(path);
	originalRegisterRoute(
		({ url }) => re.test(url.pathname),
		async (options) => {
			const params = await getParams(options.url.pathname.match(re).groups);
			if (!params) {
				const h1 = 'Page not found';
				const route = '404';
				const data = { h1, route };
				return respondWithTemplate(data);
			}
			const searchParams = Object.fromEntries(options.url.searchParams);
			const route = path.replace(/^\//, '').replace(/\/index$/, '');
			const data = { ...searchParams, route, ...params };
			const { download, html, json, template, redirect } = await handler({
				...options,
				data,
			});
			if (html) {
				return respondWithHTML(html);
			}
			if (json && download) {
				return respondWithDownloadJSON(json);
			}
			if (json) {
				return respondWithJSON(json);
			}
			if (template) {
				return respondWithTemplate({ ...data, ...template });
			}
			if (redirect) {
				return Response.redirect(redirect);
			}
		},
		method
	);
}

async function getParams(source = {}) {
	const paramMap = {
		org: getOrgFromParams,
		event: getEventFromParams,
		participant: getParticipantFromParams,
	};
	const paramPromises = [...Object.entries(source)].map(([k, v]) =>
		paramMap[k] ? paramMap[k](k, source) : [k, v]
	);
	const mapedParams = await Promise.all(paramPromises);
	const someNotFound = mapedParams.some((v) => !v);
	if (someNotFound) {
		return;
	}
	const device = await getDevice();
	const accountId = await getCurrentAccountId();
	const account = await getAccount(accountId);
	return {
		device,
		account,
		...Object.fromEntries(mapedParams),
	};
}

async function getOrgFromParams(key, { org: oid }) {
	const accountId = await getCurrentAccountId();
	if (await hasOrg(accountId, oid)) {
		const { org } = await Store(oid);
		return [key, org];
	}
}

async function getEventFromParams(key, { org: oid, event: eid }) {
	const { eventsById } = await Store(oid);
	if (eventsById.has(eid)) {
		const event = eventsById.get(eid);
		return [key, event];
	}
}

async function getParticipantFromParams(key, { org: oid, participant: pid }) {
	const { participantsById } = await Store(oid);
	if (participantsById.has(pid)) {
		const participant = participantsById.get(pid);
		return [key, participant];
	}
}

function createResponse(body, contentType, headers = {}) {
	const options = {
		headers: {
			'Content-Type': contentType,
			...headers
		},
	};
	return new Response(body, options);
}

function createTitle(h1, h2) {
	return [h2, h1, APP_NAME].filter((t) => t).join(' - ');
}

function regexFromPath(path) {
	const p = path
		// Replace `$key` with a group of the name name.
		.replace(/\$(\w+)/g, (match, p1) => `(?<${p1}>[\\w-=]+)`)
		// Remove the `/index` file name.
		.replace(/\/index$/, '');
	// Make trailing `/` optional.
	return new RegExp(`^${p}/?$`);
}

function respondWithHTML(body) {
	return createResponse(body, 'text/html');
}

function respondWithJSON(data) {
	const body = JSON.stringify(data);
	return createResponse(body, 'application/json');
}

function respondWithDownloadJSON(data) {
	const body = JSON.stringify(data);
	const headers = {
		'Content-Disposition': 'attachment'
	};
	return createResponse(body, 'application/json', headers);
}

function respondWithTemplate(data) {
	const entryBase = import.meta.env.DEV ? '/src' : '';
	const { title = createTitle(data.h1, data.h2) } = data;
	const body = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>${title}</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="Membership and event management software for Hash House Harriers.">
		<meta name="mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="msapplication-starturl" content="/">
		<meta name="theme-color" content="#190f05">
		<link rel="manifest" href="/manifest.webmanifest">
		<link rel="stylesheet" href="/style.css">
		<link rel="icon" href="/icon.svg" type="image/svg+xml">
		<link rel="apple-touch-icon" href="/icon-192.png">
		<link rel="preload" as="image" href="/icon.svg">
		<script id="data" type="application/json">
	${JSON.stringify(data)}
		</script>
		<script type="module" crossorigin src="${entryBase}/index.js"></script>
		</head>
	<body>
	</body>
</html>
`;
	return respondWithHTML(body);
}
