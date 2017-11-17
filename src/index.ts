import { AddInitialTick } from 'tick-manager';

export interface IViewportDetails {
	width: number;
	height: number;
	scrollX: number;
	scrollY: number;
	resized: boolean;
	scrolled: boolean;
}

// A psuedo element is used to calculate height as the window.height value changes
// on iOS as the user scrolls and the browser chrome shrinks
const vhElem: HTMLElement = addHeightElement();

// State
let initialised: boolean = false;
let width: number = window.innerWidth;
let height: number = vhElem.offsetHeight;
let scrollX: number = window.pageXOffset;
let scrollY: number = window.pageYOffset;
let resized: boolean = false;
let scrolled: boolean = false;

// Previous State
let previousWidth: number = width;
let previousHeight: number = height;
let previousScrollX: number = scrollX;
let previousScrollY: number = scrollY;

// Public functions
export function GetViewportDetails(): IViewportDetails {
	if (!initialised) {
		initialised = true;
		AddInitialTick(setDetails);
	}

	return {
		width,
		height,
		scrollX,
		scrollY,
		resized,
		scrolled,
	};
}

// Private functions
function setDetails(): void {
	// Set current
	width = window.innerWidth;
	height = vhElem.offsetHeight;
	scrollX = window.pageXOffset;
	scrollY = window.pageYOffset;

	// Set resized and scrolled
	resized = previousWidth !== width || previousHeight !== height;
	scrolled = previousScrollX !== scrollX || previousScrollY !== scrollY;

	// Set previous
	previousWidth = width;
	previousHeight = height;
	previousScrollX = scrollX;
	previousScrollY = scrollY;
}

function addHeightElement(): HTMLElement {
	const elem: HTMLElement = document.createElement('div');
	elem.style.position = 'fixed';
	elem.style.height = '100vh';
	document.documentElement.appendChild(elem);
	return elem;
}
