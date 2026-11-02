import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const source = await readFile(new URL('../src/components/sections/HeroLanyard.tsx', import.meta.url), 'utf8');
const personal = JSON.parse(await readFile(new URL('../src/data/personal.json', import.meta.url), 'utf8'));
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;

function renderLanyard(status, face = 'front') {
  const states = [status, false, false, false, face];
  let stateIndex = 0;
  const react = {
    ...React,
    useState: () => [states[stateIndex++], () => {}],
    useRef: () => ({ current: null }),
    useEffect: () => {},
  };
  const image = ({ unoptimized, fill, ...props }) => React.createElement('img', props);
  const module = { exports: {} };
  const resolve = (name) => {
    if (name === 'react') return react;
    if (name === 'react-dom') return { createPortal: (element) => element };
    if (name === 'next/image') return image;
    if (name === '@/data/personal.json') return personal;
    if (name === '@/lib/lanyard-scene') return { createLanyardScene: () => {}, getInitials: (name) => name };
    if (name === '@/lib/motion') return { itemVariants: { hidden: {}, visible: {} } };
    return require(name);
  };
  runInNewContext(compiled, { exports: module.exports, module, require: resolve, console });
  return renderToStaticMarkup(React.createElement(module.exports.HeroLanyard, { heroElement: {} }));
}

test('loading reserves an empty stage instead of flashing the static badge', () => {
  const markup = renderLanyard('loading');
  assert.match(markup, /data-lanyard-stage[^>]*><\/div>/);
  assert.doesNotMatch(markup, /data-lanyard-fallback/);
  assert.match(markup, /<canvas[^>]*opacity-0/);
});

test('a static two-sided badge appears only when the 3D preview fails', () => {
  const failed = renderLanyard('unavailable');
  assert.match(failed, /data-lanyard-fallback/);
  assert.match(failed, /3D preview unavailable/);
  assert.doesNotMatch(renderLanyard('ready'), /data-lanyard-fallback/);
});

test('the projected badge is keyboard-accessible and the hint contains no buttons', () => {
  const front = renderLanyard('ready');
  const back = renderLanyard('ready', 'back');
  assert.match(front, /aria-label="Flip badge to show QR code and pause automatic motion"/);
  assert.match(back, /aria-label="Flip badge to show ID and resume automatic motion"/);
  const hint = front.match(/<div id="lanyard-hint"[\s\S]*?<\/div>/)?.[0];
  assert.ok(hint);
  assert.doesNotMatch(hint, /<button/);
  assert.match(hint, /Drag to swing/);
});
