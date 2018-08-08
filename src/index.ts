import { AddInitialTick } from 'tick-manager';

export interface IViewportDetails {
	width: number;
	height: number;
	heightCollapsedControls: number;
	scrollX: number;
	scrollY: number;
	orientation: string | number;
	resized: boolean;
	scrolled: boolean;
	orientationChanged: boolean;
	scrollDirectionX: EScrollDirectionX;
	scrollDirectionY: EScrollDirectionY;
	previous: IViewportDetails;
	changed: boolean;
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
let orientation: string | number = window.orientation;
let orientationChanged: boolean = false;
let changed = false;

// Previous State
let previousState: IViewportDetails;
let previousWidth: number = width;
let previousHeight: number = height;
let previousScrollX: number = scrollX;
let previousScrollY: number = scrollY;
let previousOrientation: string | number = orientation;

// Public functions
export function GetViewportDetails(): IViewportDetails {
	if (!initialised) {
		initialised = true;
		AddInitialTick(setDetails);
	}

	const state = <IViewportDetails>{
		width,
		height,
		heightCollapsedControls,
		scrollX,
		scrollY,
		orientation,
		resized,
		scrolled,
		orientationChanged,
		scrollDirectionX,
		scrollDirectionY,
		previous: previousState,
		changed,
	};

	previousState = state;

	return state;
}

// Private functions
function setDetails(): void {
	// Set current
	width = window.innerWidth;
	height = window.innerHeight;
	heightCollapsedControls = vhElem.offsetHeight;
	scrollX = window.pageXOffset;
	scrollY = window.pageYOffset;
	orientation = window.orientation;

	// Set resized, scrolled, and orientation changed
	resized = previousWidth !== width || previousHeight !== height;
	scrolled = previousScrollX !== scrollX || previousScrollY !== scrollY;
	scrollDirectionX = getScrollDirection(previousScrollX, scrollX);
	scrollDirectionY = getScrollDirection(previousScrollY, scrollY);
	orientationChanged = previousOrientation !== orientation;

	// Set previous
	previousWidth = width;
	previousHeight = height;
	previousScrollX = scrollX;
	previousScrollY = scrollY;
	previousOrientation = orientation;

	changed = resized || scrolled || orientationChanged;
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
