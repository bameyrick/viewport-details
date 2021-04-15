import { Viewport } from 'karma-viewport/dist/adapter/viewport';
declare const viewport: Viewport;

import { getViewportDetails, ScrollDirectionX, ScrollDirectionY } from '../src';

describe('getViewportDetails', () => {
  beforeEach(() => {
    viewport.set(200, 200);

    document.body.style.width = `400px`;
    document.body.style.height = `400px`;

    document.documentElement.scrollTo(0, 0);
  });

  it('correctly gets the viewport width', () => {
    const result = getViewportDetails();

    expect(result.width).toEqual(200);
  });

  it('correctly gets the viewport width', () => {
    const result = getViewportDetails();

    expect(result.height).toEqual(200);
  });

  it('correctly gets the scrollX', () => {
    document.documentElement.scrollTo(10, 0);

    const result = getViewportDetails();

    expect(result.scrollX).toEqual(10);
  });

  it('correctly gets the scrollY', () => {
    document.documentElement.scrollTo(0, 60);

    const result = getViewportDetails();

    expect(result.scrollY).toEqual(60);
  });

  it('correctly gets the scrollX direction (Right)', () => {
    getViewportDetails();

    document.documentElement.scrollTo(10, 0);

    const result = getViewportDetails();

    expect(result.scrollDirectionX).toEqual(ScrollDirectionX.Right);
  });

  it('correctly gets the scrollX direction (Left)', () => {
    document.documentElement.scrollTo(10, 0);

    getViewportDetails();

    document.documentElement.scrollTo(0, 0);

    const result = getViewportDetails();

    expect(result.scrollDirectionX).toEqual(ScrollDirectionX.Left);
  });

  it('correctly gets the scrollX direction (No change)', () => {
    document.documentElement.scrollTo(0, 0);

    getViewportDetails();

    document.documentElement.scrollTo(0, 0);

    const result = getViewportDetails();

    expect(result.scrollDirectionX).toEqual(ScrollDirectionX.None);
  });

  it('correctly gets the scrollY direction (Right)', () => {
    getViewportDetails();

    document.documentElement.scrollTo(0, 20);

    const result = getViewportDetails();

    expect(result.scrollDirectionY).toEqual(ScrollDirectionY.Down);
  });

  it('correctly gets the scrollY direction (Left)', () => {
    document.documentElement.scrollTo(0, 20);

    getViewportDetails();

    document.documentElement.scrollTo(0, 0);

    const result = getViewportDetails();

    expect(result.scrollDirectionY).toEqual(ScrollDirectionY.Up);
  });

  it('correctly gets the scrollY direction (No change)', () => {
    document.documentElement.scrollTo(0, 0);

    getViewportDetails();

    document.documentElement.scrollTo(0, 0);

    const result = getViewportDetails();

    expect(result.scrollDirectionY).toEqual(ScrollDirectionY.None);
  });

  it('correctly reports if the window resized since last time it was called (resized)', () => {
    getViewportDetails();

    viewport.set(300, 300);

    const result = getViewportDetails();

    expect(result.resized).toEqual(true);
  });

  it('correctly reports if the window resized since last time it was called (no resize)', () => {
    getViewportDetails();

    viewport.set(200, 200);

    const result = getViewportDetails();

    expect(result.resized).toEqual(false);
  });

  it('correctly reports if the viewport scrolled since last time it was called (x)', () => {
    document.documentElement.scrollTo(0, 0);

    getViewportDetails();

    document.documentElement.scrollTo(10, 0);

    const result = getViewportDetails();

    expect(result.scrolled).toEqual(true);
  });

  it('correctly reports if the viewport scrolled since last time it was called (x)', () => {
    document.documentElement.scrollTo(0, 0);

    getViewportDetails();

    document.documentElement.scrollTo(0, 10);

    const result = getViewportDetails();

    expect(result.scrolled).toEqual(true);
  });

  it('correctly reports if the viewport scrolled since last time it was called (no change)', () => {
    document.documentElement.scrollTo(0, 0);

    getViewportDetails();

    document.documentElement.scrollTo(0, 0);

    const result = getViewportDetails();

    expect(result.scrolled).toEqual(false);
  });

  it('correctly reports if any changes happened since last time it was called (resized)', () => {
    getViewportDetails();

    viewport.set(300, 300);

    const result = getViewportDetails();

    expect(result.changed).toEqual(true);
  });

  it('correctly reports if any changes happened since last time it was called (no resize)', () => {
    getViewportDetails();

    viewport.set(200, 200);

    const result = getViewportDetails();

    expect(result.changed).toEqual(false);
  });

  it('correctly reports if the viewport scrolled since last time it was called (scroll)', () => {
    document.documentElement.scrollTo(0, 0);

    getViewportDetails();

    document.documentElement.scrollTo(10, 0);

    const result = getViewportDetails();

    expect(result.changed).toEqual(true);
  });

  it('correctly reports if the viewport scrolled since last time it was called (no scroll)', () => {
    document.documentElement.scrollTo(0, 0);

    getViewportDetails();

    document.documentElement.scrollTo(0, 0);

    const result = getViewportDetails();

    expect(result.changed).toEqual(false);
  });
});
