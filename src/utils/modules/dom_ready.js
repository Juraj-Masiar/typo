const isDomReadyFn = () => document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive';

export const DOMContentLoadedPromise = new Promise((resolve => isDomReadyFn() ? resolve() : document.addEventListener('DOMContentLoaded', resolve)));

