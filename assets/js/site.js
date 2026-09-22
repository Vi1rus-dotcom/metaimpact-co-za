/* Meta Impact (Pty) Ltd — site.js (mobile nav toggle, form validation, honeypot spam protection) */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.style.display === "flex";
      if (open) {
        nav.style.display = "none";
        toggle.setAttribute("aria-expanded", "false");
      } else {
        nav.style.display = "flex";
        nav.style.position = "absolute";
        nav.style.top = "88px";
        nav.style.left = "0";
        nav.style.right = "0";
        nav.style.flexDirection = "column";
        nav.style.background = "#0F1113";
        nav.style.padding = "8px 20px 20px";
        nav.style.borderBottom = "1px solid rgba(255,255,255,0.12)";
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  }

  /* ---------- Form validation + honeypot + mailto handoff ---------- */
  var forms = document.querySelectorAll("form[data-validate]");
  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector(".form-status");
    var honeypot = form.querySelector(".hp-field input");

    function fieldWrap(input) {
      var el = input;
      while (el && !el.classList.contains("field")) { el = el.parentElement; }
      return el;
    }

    function validateField(input) {
      var wrap = fieldWrap(input);
      if (!wrap) { return true; }
      var ok = true;
      var v = (input.value || "").trim();
      if (input.hasAttribute("required") && !v) { ok = false; }
      if (ok && input.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { ok = false; }
      if (ok && input.type === "tel" && v && !/^[+0-9()\-\s]{7,20}$/.test(v)) { ok = false; }
      if (ok && input.dataset.minlength && v.length < parseInt(input.dataset.minlength, 10)) { ok = false; }
      if (wrap) { wrap.classList.toggle("invalid", !ok); }
      return ok;
    }

    Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea"), function (input) {
      input.addEventListener("blur", function () { validateField(input); });
      input.addEventListener("input", function () {
        var wrap = fieldWrap(input);
        if (wrap && wrap.classList.contains("invalid")) { validateField(input); }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (status) { status.className = "form-status"; status.textContent = ""; }

      /* Honeypot: silently accept but do nothing (spam trap). */
      if (honeypot && honeypot.value) { return; }

      var inputs = form.querySelectorAll("input, select, textarea");
      var firstInvalid = null;
      Array.prototype.forEach.call(inputs, function (input) {
        if (input.type === "hidden" || input.type === "submit") { return; }
        if (!validateField(input) && !firstInvalid) { firstInvalid = input; }
      });

      if (firstInvalid) {
        if (status) {
          status.className = "form-status error";
          status.textContent = "Please correct the highlighted fields before submitting.";
        }
        firstInvalid.focus();
        return;
      }

      /* No backend wired yet (future CRM/procurement integration per brief §24):
         hand off as a pre-filled mail message to the verified company address. */
      var subject = form.getAttribute("data-mail-subject") || "Website enquiry";
      var lines = [];
      Array.prototype.forEach.call(inputs, function (input) {
        if (input.type === "hidden" || input.type === "submit" || !input.name) { return; }
        var label = input.name.replace(/_/g, " ");
        lines.push(label + ": " + ((input.value || "").trim()));
      });
      var to = form.getAttribute("data-mail-to") || "metaimpactptyltd@gmail.com";
      var body = encodeURIComponent(lines.join("\n"));
      var mailto = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + body;

      if (status) {
        status.className = "form-status show";
        status.innerHTML = "Thank you — your details are validated and ready. " +
          "<a href=\"" + mailto + "\">Send your enquiry email now</a> (opens your email app, pre-filled). " +
          "This form currently hands off by email; a direct backend connection is planned as part of future integrations.";
      }
    });
  });
})();
