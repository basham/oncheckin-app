export function debounce(fn, timeout = 100) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, timeout);
	};
}

export function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), ms);
	});
}

export function focus(id) {
	waitForElement(id, (el) => el.focus());
}

export function getOrCreate(cache, key, createCallback) {
	if (!cache.has(key)) {
		cache.set(key, createCallback());
	}
	return cache.get(key);
}

export function pipe(value, ...fns) {
	return fns.reduce((v, f) => f(v), value);
}

export function pluralize(count, singular, plural = `${singular}s`) {
	return count === 1 ? singular : plural;
}

export function setMapFromObject(map, object) {
	for (const [key, value] of Object.entries(object)) {
		map.set(key, value);
	}
}

export function sort(selectorOrKey, multiplier) {
	const type = typeof selectorOrKey;
	const typeMap = {
		function: selectorOrKey,
		string: (item) => item[selectorOrKey],
	};
	const selector = typeMap[type];
	return (a, b) => {
		const [keyA, keyB] = [a, b].map((item) => selector(item));
		return keyA < keyB ? -1 * multiplier : keyA > keyB ? 1 * multiplier : 0;
	};
}

export function sortAsc(key) {
	return sort(key, 1);
}

export function sortDesc(key) {
	return sort(key, -1);
}

export function todayDate() {
	const now = new Date();
	now.setHours(0, 0, 0);
	return now.toJSON().split('T')[0];
}

export function waitForElement(id, callback = () => { }, retry = 180) {
	const el = document.getElementById(id);
	if (el) {
		return callback(el);
	}
	if (retry > 0) {
		window.requestAnimationFrame(() => waitForElement(id, callback, retry - 1));
	}
}
