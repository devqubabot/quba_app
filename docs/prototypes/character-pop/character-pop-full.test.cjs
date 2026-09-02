/* global __dirname */

const fs = require("node:fs");
const path = require("node:path");
const { JSDOM, VirtualConsole } = require("jsdom");

const prototypePath = path.join(__dirname, "character-pop-full.html");
const mascotPath = path.join(__dirname, "quba-mascot-physical-v2.png");
const expressiveMascotPath = path.join(__dirname, "quba-mascot-soft-v4.png");
const html = fs.readFileSync(prototypePath, "utf8");
const failures = [];
const browserErrors = [];
const virtualConsole = new VirtualConsole();

assert(
  html.includes("--primary: #baff72;"),
  "Prototype primary color is not Quba lime #BAFF72",
);
assert(
  html.includes("--on-primary: #171341;"),
  "Light appearance is missing the dark on-primary token",
);
assert(fs.existsSync(mascotPath), "Product-faithful mascot asset is missing");
assert(
  fs.existsSync(expressiveMascotPath),
  "Expressive Soft Quba mascot asset is missing",
);
assert(
  html.includes("quba-mascot-physical-v2.png"),
  "Prototype does not reference the product-faithful mascot",
);
assert(
  html.includes("quba-mascot-soft-v4.png"),
  "Prototype does not reference the expressive Soft Quba mascot",
);

virtualConsole.on("jsdomError", (error) => browserErrors.push(error.message));
virtualConsole.on("error", (message) => browserErrors.push(String(message)));

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function click(window, selector) {
  const element = window.document.querySelector(selector);
  assert(Boolean(element), "Missing click target: " + selector);
  if (element) element.click();
  return element;
}

function submit(window, selector) {
  const form = window.document.querySelector(selector);
  assert(Boolean(form), "Missing form: " + selector);
  if (form) {
    form.dispatchEvent(
      new window.Event("submit", { bubbles: true, cancelable: true }),
    );
  }
}

function heading(window, text) {
  return Array.from(window.document.querySelectorAll("h1, h2")).some(
    (element) => element.textContent.trim() === text,
  );
}

(async () => {
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    url: "http://localhost:4173/character-pop-full.html",
    virtualConsole,
  });
  const { window } = dom;
  await new Promise((resolve) => window.setTimeout(resolve, 60));

  window.document
    .querySelectorAll("template[id^='screen-']")
    .forEach((template) => {
      assert(
        Boolean(template.content.querySelector("h1")),
        template.id + " is missing an h1",
      );
      template.content.querySelectorAll("button").forEach((button) => {
        const wired =
          button.type === "submit" ||
          Array.from(button.attributes).some(
            (attribute) =>
              attribute.name === "data-go" ||
              attribute.name === "data-action" ||
              attribute.name === "data-starter" ||
              attribute.name === "data-habit-type" ||
              attribute.name === "data-quick-type" ||
              attribute.name === "data-link-mode" ||
              attribute.name === "data-destination" ||
              attribute.name === "data-counter",
          );
        assert(
          wired,
          template.id + " has an unwired button: " + button.textContent.trim(),
        );
      });
      template.content
        .querySelectorAll("input, select, textarea")
        .forEach((input) => {
          const wrapped = input.closest("label");
          const explicit = input.id
            ? template.content.querySelector("label[for='" + input.id + "']")
            : null;
          assert(
            Boolean(wrapped || explicit),
            template.id + " has an unlabeled input",
          );
        });
    });

  assert(
    heading(window, "Mulai aktivitas tanpa tenggelam di layar."),
    "Welcome did not render",
  );
  click(window, "[data-go='activation']");
  assert(
    heading(window, "Masukkan kode unik Quba."),
    "Activation did not render",
  );

  submit(window, "[data-form='activation']");
  assert(
    heading(window, "Simpan rutinitasmu dengan aman."),
    "Activation did not advance",
  );

  submit(window, "[data-form='account']");
  assert(
    heading(window, "Dekatkan ponsel ke Quba."),
    "Account did not advance",
  );

  click(window, "[data-action='pair']");
  await new Promise((resolve) => window.setTimeout(resolve, 700));
  assert(
    heading(window, "Pilih rutinitas pertama."),
    "Pairing did not advance",
  );

  click(window, "[data-go='firstwin']");
  assert(heading(window, "Coba Dzikir 33."), "First win did not render");
  click(window, "[data-action='first-win']");
  assert(
    window.document.querySelector("#modal-layer.open"),
    "Completion modal did not open",
  );
  click(window, "[data-complete-home]");
  assert(heading(window, "Hai, Fadla! 👋"), "Completion did not return home");

  click(window, "[data-go='habits']");
  assert(heading(window, "Habits"), "Habits did not render");
  click(window, "[data-go='habit-create']");
  submit(window, "[data-form='habit']");
  assert(
    window.document.querySelector("#modal-layer.open"),
    "Habit save did not open sync result",
  );
  click(window, "[data-close-modal]");

  window.location.hash = "#quick";
  click(window, "#prototype-map-button");
  click(window, "#map-grid [data-go='quick']");
  click(window, "[data-quick-type='counter']");
  submit(window, "[data-form='quick']");
  assert(heading(window, "Dzikir sore"), "Quick counter did not start");

  for (let index = 0; index < 5; index += 1) {
    click(window, "[data-counter='1']");
  }
  assert(
    window.document.querySelector("#modal-layer.open"),
    "Counter target did not complete",
  );
  click(window, "[data-complete-home]");

  click(window, "#prototype-map-button");
  click(window, "#map-grid [data-go='settings']");
  const themeToggle = window.document.querySelector("#theme-toggle");
  themeToggle.checked = true;
  themeToggle.dispatchEvent(new window.Event("change", { bubbles: true }));
  assert(
    window.document.documentElement.dataset.theme === "night",
    "Night theme did not activate",
  );

  click(window, "#prototype-map-button");
  click(window, "[data-device-state='offline']");
  click(window, "#prototype-map-button");
  click(window, "#map-grid [data-go='quba']");
  assert(
    window.document.querySelector("[data-device-label]").textContent ===
      "Tidak terhubung",
    "Offline device state did not render",
  );

  click(window, "#prototype-map-button");
  click(window, "[data-device-state='attention']");
  click(window, "[data-action='sync']");
  assert(
    heading(window, "Aktivitasmu sudah aman."),
    "Partial sync result did not render",
  );
  click(window, "[data-close-modal]");

  assert(
    browserErrors.length === 0,
    "Console errors: " + browserErrors.join(" | "),
  );
  dom.window.close();

  if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(
      "Character Pop prototype: all deterministic flow checks passed.",
    );
  }
})();
