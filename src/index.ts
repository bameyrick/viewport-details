export interface ViewportDetails {
  /**
   * The width of the viewport
   */
  width: number;

  /**
   * The height of the viewport
   */
  height: number;

  /**
   * The hight of the viewport if the browser controlls have collapsed (e.g. in iOS Safari)
   */
  heightCollapsedControls: number;

  /**
   * The scroll x position of the viewport
   */
  scrollX: number;

  /**
   * The scroll y position of the viewport
   */
  scrollY: number;

  /**
   * Whether the viewport has resized since the last time getViewportDetails was called
   */
  resized: boolean;

  /**
   * Whether the viewport scrolled since the last time getViewportDetails was called
   */
  scrolled: boolean;

  /**
   * The direction in which the user is scrolling on the x axis. (This will not update until getViewportDetails has been called once)
   */
  scrollDirectionX: ScrollDirectionX;

  /**
   * The direction in which the user is scrolling on the y axis. (This will not update until getViewportDetails has been called once)
   */
  scrollDirectionY: ScrollDirectionY;

  /**
   * The previous getViewportDetails result
   */
  previous?: ViewportDetails;

  /**
   * Whether any of the values have changes since the last time getViewport details was called
   */
  changed?: boolean;
}

export enum ScrollDirectionX {
  Left = -1,
  None = 0,
  Right = 1,
}

export enum ScrollDirectionY {
  Up = -1,
  None = 0,
  Down = 1,
}

// A psuedo element is used to calculate heightCollapsedControls as the window.height value changes
// on iOS as the user scrolls and the browser chrome shrinks
let vhElement: HTMLElement;

// State
let state: ViewportDetails;

/**
 * Gets the current state of the viewport
 * @returns ViewportDetails
 */
export function getViewportDetails(): ViewportDetails {
  setDetails();

  return state;
}

/**
 * Updates the details
 */
function setDetails(): void {
  let previous: ViewportDetails | undefined;

  if (state) {
    previous = { ...state };

    delete previous.previous;
    delete previous.changed;
  } else {
    vhElement = addHeightElement();
  }

  // Get current
  const width = window.innerWidth;
  const height = window.innerHeight;
  const heightCollapsedControls = vhElement.offsetHeight;
  const scrollX = window.pageXOffset;
  const scrollY = window.pageYOffset;
  const resized = previous ? previous.width !== width || previous.height !== height : false;
  const scrolled = previous ? previous.scrollX !== scrollX || previous.scrollY !== scrollY : false;

  state = {
    width,
    height,
    heightCollapsedControls,
    scrollX,
    scrollY,
    scrollDirectionX: previous ? (getScrollDirection(previous.scrollX, scrollX) as ScrollDirectionX) : ScrollDirectionX.None,
    scrollDirectionY: previous ? (getScrollDirection(previous.scrollY, scrollY) as ScrollDirectionY) : ScrollDirectionY.None,
    resized,
    scrolled,
    changed: resized || scrolled,
    previous,
  };
}

/**
 * Adds a HTML element to the view that is the exact same height as the viewport. This is used for calculating the height of the element if
 * the viewport controls were collapsed
 * @returns HTMLElement
 */
function addHeightElement(): HTMLElement {
  const id = 'viewport-details-height-element';

  let element: HTMLElement | null = document.getElementById(id);

  if (!element) {
    element = document.createElement('div');
    element.id = id;

    element.style.position = 'fixed';
    element.style.height = '100vh';
    document.documentElement.appendChild(element);
  }

  return element;
}

/**
 * Gets the direction in which the user is scrolling
 */
function getScrollDirection(previous: number, current: number): ScrollDirectionX | ScrollDirectionY {
  if (previous < current) {
    return 1;
  }

  if (previous > current) {
    return -1;
  }

  return 0;
}
