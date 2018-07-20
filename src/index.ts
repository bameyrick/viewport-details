import { AddInitialTick } from 'tick-manager';

export interface IViewportDetails {
	width: number;
	height: number;
	heightCollapsedControls: number;
	scrollX: number;
	scrollY: number;
	resized: boolean;
	scrolled: boolean;
	scrollDirectionX: EScrollDirectionX;
	scrollDirectionY: EScrollDirectionY;
}

export enum EScrollDirectionX {
	Left = -1,
	None = 0,
	Right = 1,
}

export enum EScrollDirectionY {
	Up = -1,
	None = 0,
	Down = 1,
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
let scrollDirectionX: number;
let scrollDirectionY: number;

// Previous State
let previousWidth: number = width;
let previousHeight: number = heightCollapsedControls;
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
		heightCollapsedControls,
		scrollX,
		scrollY,
		resized,
		scrolled,
		scrollDirectionX,
		scrollDirectionY,
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
	scrollDirectionX = getScrollDirection(previousScrollX, scrollX);
	scrollDirectionY = getScrollDirection(previousScrollY, scrollY);

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

function getScrollDirection(previous: number, current: number): EScrollDirectionX | EScrollDirectionY {
	if (previous < current) {
		return 1;
	}

	if (previous > current) {
		return -1;
	}

	return 0;
}
