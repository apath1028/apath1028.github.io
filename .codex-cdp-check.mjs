const targets = await fetch("http://127.0.0.1:9225/json").then((response) => response.json());
const target = targets.find((entry) => entry.type === "page");
if (!target) throw new Error("No Chrome page target found");

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const diagnostics = [];
let requestId = 0;

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
<<<<<<< ours
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }

  if (message.method === "Runtime.exceptionThrown") {
    diagnostics.push({ type: "exception", value: message.params.exceptionDetails.text });
  }
  if (message.method === "Runtime.consoleAPICalled") {
    diagnostics.push({
      type: `console.${message.params.type}`,
      value: message.params.args.map((arg) => arg.value ?? arg.description).join(" "),
    });
=======
    return message.error ? reject(new Error(message.error.message)) : resolve(message.result);
  }
  if (message.method === "Runtime.exceptionThrown") {
    diagnostics.push(message.params.exceptionDetails.text);
>>>>>>> theirs
  }
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

function send(method, params = {}) {
  const id = ++requestId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
<<<<<<< ours
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(JSON.stringify(result.exceptionDetails, null, 2));
  }
=======
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
>>>>>>> theirs
  return result.result.value;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

await send("Runtime.enable");
await send("Page.enable");
<<<<<<< ours
await send("Page.navigate", { url: "http://127.0.0.1:3000/passages" });
await wait(2000);

const initial = await evaluate(`(() => ({
  url: location.href,
  readyState: document.readyState,
  revealCount: document.querySelectorAll('.reveal').length,
  visibleRevealCount: document.querySelectorAll('.reveal.visible').length,
  visibleCards: [...document.querySelectorAll('.blog-item')].filter((el) => getComputedStyle(el).display !== 'none').length,
  headerOpacity: getComputedStyle(document.querySelector('.page-header')).opacity,
  toolbarOpacity: getComputedStyle(document.querySelector('.blog-toolbar')).opacity,
}))()`);

const filterResult = await evaluate(`(() => {
  const select = document.querySelector('#categoryFilter');
  select.value = '学习';
  select.dispatchEvent(new Event('change', { bubbles: true }));
  return {
    visibleCards: [...document.querySelectorAll('.blog-item')].filter((el) => getComputedStyle(el).display !== 'none').length,
    value: select.value,
  };
})()`);

const timelineResult = await evaluate(`(() => {
  document.querySelector('[data-view="timeline"]').click();
  return {
    gridDisplay: getComputedStyle(document.querySelector('#blog-grid')).display,
    timelineDisplay: getComputedStyle(document.querySelector('#blog-timeline')).display,
    visibleTimelineItems: [...document.querySelectorAll('.bt-timeline-item')].filter((el) => getComputedStyle(el).display !== 'none').length,
=======
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});
await send("Page.navigate", { url: "http://127.0.0.1:3000/passages" });
await wait(1200);

const layout = await evaluate(`(() => {
  const rect = (selector) => {
    const value = document.querySelector(selector)?.getBoundingClientRect();
    return value ? { left: value.left, right: value.right, width: value.width } : null;
  };
  return {
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    sidebar: rect('.sidebar-card'),
    nav: rect('.sidebar-nav'),
    pageShell: rect('.page-shell'),
    container: rect('.content-area > .container'),
    filterRow: rect('.filter-row'),
    viewToggle: rect('.view-toggle'),
    firstCard: rect('.blog-card'),
  };
})()`);

const filters = await evaluate(`(() => {
  const count = (selector) => [...document.querySelectorAll(selector)]
    .filter((el) => getComputedStyle(el).display !== 'none').length;
  const category = document.querySelector('#categoryFilter');
  category.value = '学习';
  category.dispatchEvent(new Event('change', { bubbles: true }));
  const categoryCount = count('.blog-item');
  document.querySelector('[data-tag="learning"]').click();
  const combinedCount = count('.blog-item');
  document.querySelector('[data-view="timeline"]').click();
  return {
    categoryCount,
    combinedCount,
    timelineCount: count('.bt-timeline-item'),
    gridDisplay: getComputedStyle(document.querySelector('#blog-grid')).display,
    timelineDisplay: getComputedStyle(document.querySelector('#blog-timeline')).display,
>>>>>>> theirs
  };
})()`);

await evaluate(`document.querySelector('.sidebar-nav-link[href="/blog"]').click()`);
<<<<<<< ours
await wait(1200);
await evaluate(`document.querySelector('.sidebar-nav-link[href="/passages"]').click()`);
await wait(1200);

const afterRoundTrip = await evaluate(`(() => {
  const select = document.querySelector('#categoryFilter');
  select.value = '生活';
  select.dispatchEvent(new Event('change', { bubbles: true }));
  return {
    url: location.href,
    visibleCards: [...document.querySelectorAll('.blog-item')].filter((el) => getComputedStyle(el).display !== 'none').length,
    headerOpacity: getComputedStyle(document.querySelector('.page-header')).opacity,
    visibleRevealCount: document.querySelectorAll('.reveal.visible').length,
  };
})()`);

console.log(JSON.stringify({ initial, filterResult, timelineResult, afterRoundTrip, diagnostics }, null, 2));
=======
await wait(700);
await evaluate(`document.querySelector('.sidebar-nav-link[href="/passages"]').click()`);
await wait(700);

const afterRoundTrip = await evaluate(`(() => {
  const category = document.querySelector('#categoryFilter');
  category.value = '生活';
  category.dispatchEvent(new Event('change', { bubbles: true }));
  return [...document.querySelectorAll('.blog-item')]
    .filter((el) => getComputedStyle(el).display !== 'none').length;
})()`);

await send("Page.navigate", { url: "http://127.0.0.1:3000/passages/hello-world" });
await wait(800);
const article = await evaluate(`(() => ({
  path: location.pathname,
  prose: Boolean(document.querySelector('.prose')),
  headings: document.querySelectorAll('.prose h1, .prose h2, .prose h3').length,
  tocLinks: document.querySelectorAll('.toc-item').length,
  katex: document.querySelectorAll('.katex').length,
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth,
}))()`);

console.log(JSON.stringify({ layout, filters, afterRoundTrip, article, diagnostics }, null, 2));
>>>>>>> theirs
socket.close();
