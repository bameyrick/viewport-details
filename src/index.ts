import { AddInitialTick } from 'tick-manager';

export interface IViewportDetails {
	width: number;
	height: number;
	heightCollapsedControls: number;
	scrollX: number;
	scrollY: number;
	resized: boolean;
	scrolled: boolean;
	scrollDirection: number[];
}

// A psuedo element is used to calculate heightCollapsedControls as the window.height value changes
// on iOS as the user scrolls and the browser chrome shrinks
const vhElem: HTMLElement = addHeightElement();

// State
let initialised: boolean = false;
let width: number = window.innerWidth;
let heightCollapsedControls: number = vhElem.offsetHeight;
let height: number = window.innerHeight;
let scrollX: number = window.pageXOffset;
let scrollY: number = window.pageYOffset;
let resized: boolean = false;
let scrolled: boolean = false;

// Previous State
let previousWidth: number = width;
let previousHeight: number = heightCollapsedControls;
let previousScrollX: number = scrollX;
let previousScrollY: number = scrollY;
let scrollDirection: number[] = [0, 0];

// Public functions
export function GetViewportDetails(): IViewportDetails {
	if (!initialised) {
		initialised = true;
		AddInitialTick(setDetails);
	}

	return {
		width,
		height,
		heightCollapsedControls,
		scrollX,
		scrollY,
		resized,
		scrolled,
		scrollDirection,
	};
}

// Private functions
function setDetails(): void {
	// Set current
	width = window.innerWidth;
	height = window.innerHeight;
	heightCollapsedControls = vhElem.offsetHeight;
	scrollX = window.pageXOffset;
	scrollY = window.pageYOffset;

	// Set resized and scrolled
	resized = previousWidth !== width || previousHeight !== height;
	scrolled = previousScrollX !== scrollX || previousScrollY !== scrollY;
	scrollDirection = [getScrollDirection(previousScrollX, scrollX), getScrollDirection(previousScrollY, scrollY)];

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

function getScrollDirection(previous: number, current: number): number {
	if (previous < current) {
		return 1;
	}

	if (previous > current) {
		return -1;
	}

	return 0;
}
