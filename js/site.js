(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  var backTop = document.querySelector(".back-top");
  var modal = document.getElementById("spec-modal");
  var plantModal = document.getElementById("plant-modal");
  var modalTitle = document.getElementById("spec-title");
  var modalBody = document.getElementById("spec-body");
  var modalLink = document.getElementById("spec-sheet-link");
  var form = document.getElementById("inquiry-form");
  var drawerForm = document.getElementById("drawer-form");
  var success = document.getElementById("form-success");
  var drawerSuccess = document.getElementById("drawer-success");
  var fruitSelect = document.getElementById("fruit-type");
  var drawer = document.getElementById("rfq-drawer");
  var drawerBackdrop = document.getElementById("drawer-backdrop");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 12);
    if (backTop) backTop.classList.toggle("is-visible", y > 500);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll(".nav-item.has-mega").forEach(function (item) {
    var trigger = item.querySelector(".nav-trigger");
    if (!trigger || trigger.tagName === "A") return;
    trigger.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 1100px)").matches) {
        e.preventDefault();
        var open = item.classList.toggle("is-open");
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
      }
    });
  });

  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      var filter = btn.getAttribute("data-filter");
      document.querySelectorAll(".product-card").forEach(function (card) {
        var cat = card.getAttribute("data-category");
        var pack = card.getAttribute("data-packaging") || "";
        var show = true;
        if (filter === "all") show = true;
        else if (filter === "aseptic" || filter === "canned" || filter === "frozen") {
          show = pack.indexOf(filter) !== -1;
        } else {
          show = cat === filter;
        }
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  function applyCatalogFilters() {
    var cat = (document.getElementById("filter-category") || {}).value || "all";
    var method = (document.getElementById("filter-method") || {}).value || "all";
    var crop = (document.getElementById("filter-crop") || {}).value || "all";
    var cert = (document.getElementById("filter-cert") || {}).value || "all";
    document.querySelectorAll(".product-card").forEach(function (card) {
      var ok = true;
      if (cat !== "all" && (card.getAttribute("data-type") || "").indexOf(cat) === -1) ok = false;
      if (method !== "all" && (card.getAttribute("data-packaging") || "").indexOf(method) === -1) ok = false;
      if (crop !== "all" && (card.getAttribute("data-crop") || "") !== crop) ok = false;
      if (cert !== "all" && (card.getAttribute("data-cert") || "").indexOf(cert) === -1) ok = false;
      card.classList.toggle("is-hidden", !ok);
    });
  }

  ["filter-category", "filter-method", "filter-crop", "filter-cert"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("change", applyCatalogFilters);
  });

  /* FCL loading calculator */
  function updateFclCalc() {
    var format = (document.getElementById("fcl-format") || {}).value || "drums";
    var size = (document.getElementById("fcl-size") || {}).value || "20";
    var unitsEl = document.getElementById("fcl-units");
    var unitLabelEl = document.getElementById("fcl-unit-label");
    var netEl = document.getElementById("fcl-net");
    var noteEl = document.getElementById("fcl-note");
    if (!unitsEl || !netEl) return;
    var units = 0;
    var net = 0;
    var note = "";
    var unitLabel = "Drums";
    if (format === "drums") {
      units = size === "40" ? 160 : 80;
      net = units * 215;
      note = "215 kg net aseptic drums · " + units + " drums per " + size + "ft FCL";
      unitLabel = "Drums";
    } else if (format === "cans") {
      units = size === "40" ? 2000 : 1000;
      net = units * 18.6;
      note = "OTS cartons (6 × 3.1 kg) · " + units + " cartons per " + size + "ft FCL";
      unitLabel = "Cartons";
    } else {
      units = size === "40" ? 2200 : 1100;
      net = units * 16;
      note = "Frozen cartons (approx. 16 kg) · indicative " + size + "ft FCL load";
      unitLabel = "Buckets";
    }
    unitsEl.textContent = String(units);
    if (unitLabelEl) unitLabelEl.textContent = unitLabel;
    netEl.textContent = (net / 1000).toFixed(1) + " MT";
    if (noteEl) noteEl.textContent = note;
  }
  ["fcl-format", "fcl-size"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("change", updateFclCalc);
  });
  updateFclCalc();

  /* Contact page multi-step RFQ */
  var contactForm = document.getElementById("contact-rfq-form");
  if (contactForm) {
    var cStep = 1;
    function showContactStep(n) {
      cStep = n;
      contactForm.querySelectorAll(".rfq-step-panel").forEach(function (panel) {
        panel.classList.toggle("is-active", parseInt(panel.getAttribute("data-cstep"), 10) === n);
      });
      contactForm.querySelectorAll("[data-cstep-dot]").forEach(function (dot) {
        dot.classList.toggle("is-on", parseInt(dot.getAttribute("data-cstep-dot"), 10) <= n);
      });
    }
    contactForm.querySelectorAll("[data-cnext]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (cStep === 1) {
          var fruits = contactForm.querySelectorAll('input[name="cfruit"]:checked');
          if (!fruits.length) {
            alert("Select at least one fruit variant.");
            return;
          }
          if (!document.getElementById("c-packaging").value) {
            alert("Select a packaging format.");
            return;
          }
        }
        if (cStep === 2) {
          if (!document.getElementById("c-volume").value.trim()) {
            alert("Enter estimated annual volume.");
            return;
          }
        }
        showContactStep(cStep + 1);
      });
    });
    contactForm.querySelectorAll("[data-cprev]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showContactStep(Math.max(1, cStep - 1));
      });
    });
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var fruits = [];
      contactForm.querySelectorAll('input[name="cfruit"]:checked').forEach(function (cb) {
        fruits.push(cb.value);
      });
      var apps = [];
      contactForm.querySelectorAll('input[name="capp"]:checked').forEach(function (cb) {
        apps.push(cb.value);
      });
      window.location.href = buildMailto({
        name: document.getElementById("c-name").value.trim(),
        email: document.getElementById("c-email").value.trim(),
        company: document.getElementById("c-company").value.trim(),
        phone: document.getElementById("c-designation").value.trim(),
        port: document.getElementById("c-port").value.trim() + " (" + document.getElementById("c-incoterm").value + ")",
        product: fruits.join(", "),
        packaging: document.getElementById("c-packaging").value,
        application: apps.join(", ") + (document.getElementById("c-brix").value ? " | Spec notes: " + document.getElementById("c-brix").value : ""),
        quantity: document.getElementById("c-volume").value.trim(),
        message: document.getElementById("c-message").value.trim()
      });
      var ok = document.getElementById("contact-rfq-success");
      if (ok) ok.classList.add("is-visible");
    });
  }

  var specs = {
    alphonso: {
      title: "Alphonso Mango Pulp",
      sheet: "img/products/PS-AlphM.PNG",
      rows: [
        ["Alphonso Mango Pulp", "Aseptic", "16 Bx Min", "0.45 Min", "Less than 4.5", "Packed in 220 lts. Aseptic bag-in-drum using a polyliner (Net wt. 220 kg ± 1kg Gross Wt. 240 kg ± 1kg)"],
        ["Alphonso Mango Pulp", "Frozen", "16 Bx Min", "0.45 Min", "Less than 4.5", "Packed in 1 kg x 16 packs per carton OR 8 kg x 2 packs per carton OR 200 kg bag-in-drum"],
        ["Alphonso Mango Pulp", "Canned", "16 Bx Min", "0.45 Min", "Less than 4.5", "Packed in A10 Cans (3.1 kg) - 6 cans of 3.1 kg each in a carton"]
      ]
    },
    kesar: {
      title: "Kesar Mango Pulp",
      sheet: "img/products/PS-KesrM.PNG",
      rows: [
        ["Kesar Mango Pulp", "Aseptic", "16 Bx Min", "0.45 Min", "Less than 4.5", "Packed in 220 lts. Aseptic bag-in-drum using a polyliner (Net wt. 220 kg ± 1 kg Gross Wt. 240 kg ± 1 kg)"],
        ["Kesar Mango Pulp", "Canned", "16 Bx Min", "0.45 Min", "Less than 4.5", "Packed in A10 Cans (3.1 kg) - 6 cans of 3.1 kg each in a carton"]
      ]
    },
    raspuri: {
      title: "Raspuri Mango Pulp",
      sheet: "img/products/PS-RasM.PNG",
      rows: [
        ["Raspuri Mango Pulp", "Aseptic", "16 Bx Min", "0.45 Min", "Less than 4.5", "Packed in 220 lts. Aseptic bag-in-drum using a polyliner (Net wt. 220 kg ± 1 kg Gross Wt. 240 kg ± 1 kg)"],
        ["Raspuri Mango Pulp", "Canned", "16 Bx Min", "0.45 Min", "Less than 4.5", "Packed in A10 Cans (3.1 kg) - 6 cans of 3.1 kg each in a carton"]
      ]
    },
    totapuri: {
      title: "Totapuri Mango",
      sheet: "img/products/PS-TotM.PNG",
      rows: [
        ["Totapuri Mango Pulp", "Aseptic", "14 Bx Min", "0.35 Min", "Less than 4.5", "Packed in 220 lts. Aseptic bag-in-drum using a polyliner (Net wt. 220 kg ± 1 kg Gross Wt. 240 kg ± 1 kg)"],
        ["Totapuri Mango Pulp", "Frozen", "14 Bx Min", "0.35 Min", "Less than 4.5", "Packed in 1 kg x 16 packs per carton"],
        ["Totapuri Mango Pulp", "Canned", "14 Bx Min", "0.35 Min", "Less than 4.5", "Packed in A10 Cans (3.1 kg) - 6 cans of 3.1 kg each in a carton"],
        ["Totapuri Mango Concentrate", "Aseptic", "28 Bx Min", "0.7 Min", "Less than 4.5", "Packed in 220 lts. Aseptic bag-in-drum using a polyliner (Net wt. 228 kg ± 1 kg Gross Wt. 248 kg ± 1 kg)"]
      ]
    },
    guava: {
      title: "Guava",
      sheet: "img/products/PS-Guav.PNG",
      rows: [
        ["Guava Puree", "Aseptic", "9 Bx Min", "0.40 Min", "Less than 4.5", "Packed in 220 lts. Aseptic bag-in-drum using a polyliner (Net wt. 215 kg ± 1 kg Gross Wt. 235 kg ± 1 kg)"],
        ["Guava Pulp", "Frozen", "9 Bx Min", "0.40 Min", "Less than 4.5", "Packed in 1 kg x 16 packs per carton OR 8 kg x 2 packs per carton"],
        ["Guava Pulp", "Canned", "9 Bx Min", "0.40 Min", "Less than 4.5", "Packed in A10 Cans (3.1 kg) - 6 cans of 3.1 kg each in a carton"],
        ["Guava Puree Concentrate", "Aseptic", "20 Bx Min", "0.7 Min", "Less than 4.5", "Packed in 220 lts. Aseptic bag-in-drum using a polyliner (Net wt. 220 kg ± 1 kg Gross Wt. 240 kg ± 1 kg)"]
      ]
    },
    papaya: {
      title: "Papaya",
      sheet: "img/products/PS-Pap.PNG",
      rows: [
        ["Papaya Puree (Red & Yellow, Natural)", "Aseptic", "9 Bx Min", "0.4 Min", "Less than 4.5", "Packed in 220 lts. Aseptic bag-in-drum using a polyliner (Net wt. 215 kg ± 1 kg Gross Wt. 235 kg ± 1 kg)"],
        ["Papaya Concentrate (Red & Yellow, Natural)", "Aseptic", "25 Bx Min", "0.3 Min", "Less than 4.5", "Packed in 220 lts. Aseptic bag-in-drum using a polyliner (Net wt. 220 kg ± 1 kg Gross Wt. 240 kg ± 1 kg)"],
        ["Papaya Pulp", "Frozen", "9 Bx Min", "0.40 Min", "Less than 4.5", "Packed in 1 kg x 16 packs per carton OR 8 kg x 2 packs per carton"]
      ]
    },
    tomato: {
      title: "Tomato Paste",
      sheet: "img/products/PS-Tom.PNG",
      rows: [
        ["Tomato Paste", "Aseptic", "28 Bx Min", "2 - 3.25", "Less than 4.5", "Packed in 220 lts. Aseptic bag-in-drum using a polyliner (Net wt. 225 kg ± 1 kg Gross Wt. 245 kg ± 1 kg)"]
      ]
    },
    pomegranate: {
      title: "Pomegranate Juice (NFC)",
      sheet: "img/products/PS-Pom.PNG",
      rows: [
        ["Pomegranate Juice (NFC)", "Aseptic", "12 Bx Min", "0.25 Min", "Less than 4.5", "Packed in 220 lts. Aseptic bag-in-drum using a polyliner (Net wt. 215 kg ± 1 kg Gross Wt. 235 kg ± 1 kg)"],
        ["Pomegranate Juice (NFC)", "Frozen", "12 Bx Min", "0.25 Min", "Less than 4.5", "Packed in 1 kg x 16 packs per carton OR 8 kg x 2 packs per carton"]
      ]
    }
  };

  function closeModals() {
    document.querySelectorAll(".modal.is-open").forEach(function (m) {
      m.classList.remove("is-open");
    });
    document.body.style.overflow = "";
  }

  function openModal(el) {
    closeModals();
    closeDrawer();
    if (!el) return;
    el.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function openDrawer(prefill) {
    if (!drawer) return;
    closeModals();
    if (prefill && prefill.product) {
      var key = String(prefill.product).toLowerCase();
      document.querySelectorAll('#fruit-checks input[name="fruit"]').forEach(function (cb) {
        var val = cb.value.toLowerCase();
        if (val.indexOf("guava") !== -1) {
          cb.checked = key.indexOf("guava") !== -1 && val.indexOf("white") === -1;
        } else {
          var token = val.split(" ")[0];
          cb.checked = !!token && key.indexOf(token) !== -1;
        }
      });
      if (typeof window.syncFruitLimit === "function") window.syncFruitLimit();
      var sel = document.getElementById("drawer-product");
      if (sel && !sel.value) sel.value = prefill.product;
    }
    if (prefill && prefill.packaging) {
      var pack = document.getElementById("drawer-packaging");
      if (pack) {
        var options = pack.options;
        for (var i = 0; i < options.length; i++) {
          if (options[i].value.toLowerCase().indexOf(String(prefill.packaging).toLowerCase()) !== -1) {
            pack.value = options[i].value;
            break;
          }
        }
      }
    }
    drawer.classList.add("is-open");
    if (drawerBackdrop) drawerBackdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setDrawerStep(1);
    var closeBtn = drawer.querySelector("[data-close-drawer]");
    if (closeBtn) closeBtn.focus();
  }

  function setDrawerStep(n) {
    var steps = document.querySelectorAll(".drawer-step");
    if (!steps.length) return;
    var max = steps.length;
    var step = Math.min(Math.max(n, 1), max);
    steps.forEach(function (el) {
      el.classList.toggle("is-active", parseInt(el.getAttribute("data-step"), 10) === step);
    });
    document.querySelectorAll("[data-step-dot]").forEach(function (dot) {
      var i = parseInt(dot.getAttribute("data-step-dot"), 10);
      if (dot.classList.contains("is-on") || true) {
        dot.classList.toggle("is-on", i <= step);
      }
    });
    if (drawer) drawer._step = step;
  }

  document.querySelectorAll("[data-next-step]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var current = drawer && drawer._step ? drawer._step : 1;
      if (current === 1) {
        syncFruitLimit();
        var product = (document.getElementById("drawer-product") || {}).value || "";
        if (!product) {
          alert("Please select at least one fruit (up to 3).");
          return;
        }
      }
      if (current === 2) {
        var pack = document.getElementById("drawer-packaging");
        if (pack && !pack.value) {
          alert("Please select a packaging format.");
          return;
        }
      }
      setDrawerStep(current + 1);
    });
  });

  document.querySelectorAll("[data-prev-step]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setDrawerStep((drawer._step || 2) - 1);
    });
  });

  function closeDrawer() {
    if (drawer) drawer.classList.remove("is-open");
    if (drawerBackdrop) drawerBackdrop.classList.remove("is-open");
    if (!document.querySelector(".modal.is-open")) {
      document.body.style.overflow = "";
    }
  }

  window.ExoticRFQ = { open: openDrawer, close: closeDrawer };

  document.querySelectorAll("[data-open-drawer]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openDrawer({
        product: btn.getAttribute("data-product") || "",
        packaging: btn.getAttribute("data-packaging") || ""
      });
    });
  });

  document.querySelectorAll("[data-close-drawer]").forEach(function (btn) {
    btn.addEventListener("click", closeDrawer);
  });

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener("click", closeDrawer);
  }

  /* Plant cards — hover parallax */
  document.querySelectorAll(".plant-card, .calm-plant").forEach(function (card) {
    var img = card.querySelector(".plant-media img, img");
    if (!img || !card.classList.contains("plant-card")) return;

    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      img.style.transform = "scale(1.14) translate(" + (x * 18) + "px, " + (y * 14) + "px)";
    });

    card.addEventListener("mouseleave", function () {
      img.style.transform = "";
    });
  });

  /* Plant unit details — edit mapEmbed, contact, shift when ready */
  var plants = {
    ratnagiri: {
      title: "Exotic Fruits — Ratnagiri",
      address: "Plot No G-19/20, MIDC Mirjole, Ratnagiri, Maharahstra - 415639, India",
      contact: "",
      email: "info@exotic-fruit.com",
      phone: "+91 02352-229653",
      shift: "",
      cert: "HACCP certified",
      mapEmbed: ""
    },
    krishnagiri: {
      title: "Exotic Fruits — Krishnagiri",
      address: "S.F. No.263/1, Bargur Thirupathur Road, Sigaralapally Post, Thalabanda Village, Bargur, Krishnagiri, Tamil Nadu – 635104, India",
      contact: "",
      email: "info@exotic-fruit.com",
      phone: "",
      shift: "",
      cert: "HACCP certified",
      mapEmbed: ""
    },
    nashik: {
      title: "Exotic Fruits — Nashik",
      address: "Plot No CU-81, Additional Vinchur Industrial Area, Taluka Niphad, Vinchur, Nashik, Maharahstra - 422305, India",
      contact: "",
      email: "info@exotic-fruit.com",
      phone: "",
      shift: "",
      cert: "",
      mapEmbed: ""
    },
    chittoor: {
      title: "Exotic Fruits — Chittoor",
      address: "Chittoor processing units — street address to be confirmed with commercial.",
      contact: "",
      email: "info@exotic-fruit.com",
      phone: "",
      shift: "",
      cert: "HACCP certification in progress",
      mapEmbed: ""
    }
  };

  function setPlaceholder(el, value, fallback) {
    if (!el) return;
    if (value) {
      el.textContent = value;
      el.classList.remove("placeholder-text");
    } else {
      el.textContent = fallback || "To be updated";
      el.classList.add("placeholder-text");
    }
  }

  function openPlant(key) {
    var data = plants[key];
    if (!data || !plantModal) return;

    document.getElementById("plant-title").textContent = data.title;
    document.getElementById("plant-address").textContent = data.address;
    setPlaceholder(document.getElementById("plant-contact"), data.contact);
    setPlaceholder(document.getElementById("plant-shift"), data.shift);

    var emailEl = document.getElementById("plant-email");
    emailEl.innerHTML = '<a href="mailto:' + data.email + '">' + data.email + "</a>";
    emailEl.classList.remove("placeholder-text");

    var phoneEl = document.getElementById("plant-phone");
    if (data.phone) {
      phoneEl.innerHTML = '<a href="tel:' + data.phone.replace(/\s/g, "") + '">' + data.phone + "</a>";
      phoneEl.classList.remove("placeholder-text");
    } else {
      setPlaceholder(phoneEl, "");
    }

    var certBlock = document.getElementById("plant-cert-block");
    if (data.cert) {
      certBlock.hidden = false;
      document.getElementById("plant-cert").textContent = data.cert;
    } else {
      certBlock.hidden = true;
    }

    document.getElementById("plant-email-link").href = "mailto:" + data.email;

    var telLink = document.getElementById("plant-tel-link");
    if (data.phone) {
      telLink.href = "tel:" + data.phone.replace(/\s/g, "");
      telLink.hidden = false;
    } else {
      telLink.hidden = true;
    }

    var mapFrame = document.getElementById("plant-map-frame");
    var mapPlaceholder = document.getElementById("plant-map-placeholder");
    if (data.mapEmbed) {
      mapFrame.src = data.mapEmbed;
      mapFrame.hidden = false;
      mapPlaceholder.hidden = true;
    } else {
      mapFrame.removeAttribute("src");
      mapFrame.hidden = true;
      mapPlaceholder.hidden = false;
    }

    openModal(plantModal);
  }

  document.querySelectorAll("[data-plant]").forEach(function (card) {
    card.addEventListener("click", function () {
      openPlant(card.getAttribute("data-plant"));
    });
  });

  function openSpecs(key) {
    var data = specs[key];
    if (!data) return;

    var tableHtml =
      "<div class='tds-table-wrap'><table class='spec-table'>" +
      "<thead><tr><th>Product</th><th>Category</th><th>Brix</th><th>Acidity</th><th>pH</th><th>Packaging</th></tr></thead><tbody>";
    data.rows.forEach(function (row) {
      tableHtml +=
        "<tr>" +
        row
          .map(function (cell) {
            return "<td>" + cell + "</td>";
          })
          .join("") +
        "</tr>";
    });
    tableHtml += "</tbody></table></div>";

    var tdsModal = document.getElementById("tds-modal");
    var tdsTitle = document.getElementById("tds-title");
    var tdsView = document.getElementById("tds-view");

    if (tdsModal && tdsView) {
      if (tdsTitle) tdsTitle.textContent = data.title;
      tdsView.innerHTML = tableHtml;
      openModal(tdsModal);
      return;
    }

    if (!modal) return;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalBody) modalBody.innerHTML = tableHtml;
    if (modalLink) modalLink.hidden = true;
    openModal(modal);
  }

  document.querySelectorAll("[data-spec], [data-tds]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openSpecs(btn.getAttribute("data-spec") || btn.getAttribute("data-tds"));
    });
  });

  document.querySelectorAll("[data-inquire]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-inquire") || "";
      if (drawer) {
        openDrawer({ product: value });
        return;
      }
      if (fruitSelect) {
        fruitSelect.value = value;
        var contact = document.getElementById("contact");
        if (contact) contact.scrollIntoView({ behavior: "smooth" });
        return;
      }
      window.location.href = "contact.html";
    });
  });

  document.querySelectorAll(".modal").forEach(function (m) {
    m.addEventListener("click", function (e) {
      if (e.target === m) closeModals();
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
    btn.addEventListener("click", closeModals);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModals();
      closeDrawer();
    }
  });

  function buildMailto(fields) {
    var body = [
      "Company: " + (fields.company || ""),
      "Name: " + (fields.name || ""),
      "Email: " + (fields.email || ""),
      "Telephone: " + (fields.phone || ""),
      "Destination country / port: " + (fields.port || ""),
      "Fruit / Product: " + (fields.product || ""),
      "Category / Packaging: " + (fields.packaging || ""),
      "Industry application: " + (fields.application || ""),
      "Estimated volume: " + (fields.quantity || ""),
      "",
      fields.message || ""
    ].join("\n");
    return "mailto:info@exotic-fruit.com?subject=" +
      encodeURIComponent("Quote / Sample request: " + (fields.product || "Inquiry")) +
      "&body=" + encodeURIComponent(body);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = buildMailto({
        name: document.getElementById("inq-name").value.trim(),
        email: document.getElementById("inq-email").value.trim(),
        company: document.getElementById("inq-company").value.trim(),
        phone: (document.getElementById("inq-phone") || {}).value || "",
        port: (document.getElementById("inq-port") || {}).value || "",
        product: document.getElementById("fruit-type").value,
        packaging: document.getElementById("packaging").value,
        application: (document.getElementById("inq-application") || {}).value || "",
        quantity: document.getElementById("quantity").value.trim(),
        message: document.getElementById("inq-message").value.trim()
      });
      if (success) success.classList.add("is-visible");
    });
  }

  document.querySelectorAll("[data-nav-filter]").forEach(function (link) {
    link.addEventListener("click", function () {
      var filter = link.getAttribute("data-nav-filter");
      var map = {
        purees: { category: "purees" },
        concentrates: { category: "concentrates" },
        organic: { cert: "organic" },
        canned: { method: "canned" }
      };
      var cfg = map[filter];
      if (cfg) {
        if (cfg.category && document.getElementById("filter-category")) {
          document.getElementById("filter-category").value = cfg.category;
        }
        if (cfg.cert && document.getElementById("filter-cert")) {
          document.getElementById("filter-cert").value = cfg.cert;
        }
        if (cfg.method && document.getElementById("filter-method")) {
          document.getElementById("filter-method").value = cfg.method;
        }
        if (typeof applyCatalogFilters === "function") applyCatalogFilters();
      }
      var btn = document.querySelector('.filter-btn[data-filter="' + filter + '"]');
      if (btn) btn.click();
    });
  });

  /* Application tabs */
  document.querySelectorAll(".app-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-app");
      document.querySelectorAll(".app-tab").forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      document.querySelectorAll(".app-panel").forEach(function (panel) {
        var on = panel.id === "panel-" + key;
        panel.classList.toggle("is-active", on);
        panel.hidden = !on;
      });
    });
  });

  /* Packaging estimator from TDS-typical net weights */
  var qtyInput = document.getElementById("qty-kg");
  function updateEstimator() {
    if (!qtyInput) return;
    var kg = parseFloat(qtyInput.value) || 0;
    var drums = Math.ceil(kg / 215);
    var cartons = Math.ceil(kg / 18.6);
    var dEl = document.getElementById("est-drums");
    var cEl = document.getElementById("est-cartons");
    if (dEl) dEl.textContent = String(drums);
    if (cEl) cEl.textContent = String(cartons);
  }
  if (qtyInput) {
    qtyInput.addEventListener("input", updateEstimator);
    updateEstimator();
  }

  /* Plant-to-Port interactive horizontal timeline */
  (function initPlantPortTimeline() {
    var root = document.getElementById("home-flow");
    if (!root) return;

    var nodes = Array.prototype.slice.call(root.querySelectorAll(".plant-port-node"));
    var panels = Array.prototype.slice.call(root.querySelectorAll(".plant-port-panel"));
    var fill = root.querySelector(".plant-port-track-fill");
    if (!nodes.length || !fill) return;

    var last = nodes.length - 1;

    function setActive(index, opts) {
      index = Math.max(0, Math.min(last, index));
      root.setAttribute("data-active", String(index));

      nodes.forEach(function (node, i) {
        var reached = i <= index;
        var active = i === index;
        node.classList.toggle("is-reached", reached);
        node.classList.toggle("is-active", active);
        node.setAttribute("aria-selected", active ? "true" : "false");
      });

      panels.forEach(function (panel, i) {
        var active = i === index;
        panel.classList.toggle("is-active", active);
        if (active) {
          panel.removeAttribute("hidden");
        } else {
          panel.setAttribute("hidden", "");
        }
      });

      /* Progress from center of 01 to center of selected step */
      fill.style.width = last === 0 ? "0%" : ((index / last) * 100) + "%";

      if (opts && opts.scroll) {
        var activeNode = nodes[index];
        if (activeNode && typeof activeNode.scrollIntoView === "function") {
          activeNode.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      }
    }

    nodes.forEach(function (node) {
      node.addEventListener("click", function () {
        setActive(parseInt(node.getAttribute("data-step"), 10) || 0, { scroll: true });
      });
      node.addEventListener("keydown", function (event) {
        var current = parseInt(root.getAttribute("data-active"), 10) || 0;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          setActive(current + 1, { scroll: true });
          nodes[Math.min(last, current + 1)].focus();
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          setActive(current - 1, { scroll: true });
          nodes[Math.max(0, current - 1)].focus();
        } else if (event.key === "Home") {
          event.preventDefault();
          setActive(0, { scroll: true });
          nodes[0].focus();
        } else if (event.key === "End") {
          event.preventDefault();
          setActive(last, { scroll: true });
          nodes[last].focus();
        }
      });
    });

    setActive(0);
  })();

  /* Legacy flow-steps on other pages (if present) */
  document.querySelectorAll("#flow-steps .flow-step").forEach(function (step, _, list) {
    function activate() {
      list.forEach(function (s) { s.classList.remove("is-active"); });
      step.classList.add("is-active");
    }
    step.addEventListener("mouseenter", activate);
    step.addEventListener("focus", activate);
    step.addEventListener("click", activate);
  });

  /* From Farm to Factory — scroll reveal */
  (function initFarmJourney() {
    var root = document.getElementById("pipeline");
    if (!root) return;
    var stages = root.querySelectorAll("[data-farm-stage]");
    if (!stages.length) return;

    if (!("IntersectionObserver" in window)) {
      stages.forEach(function (stage) { stage.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.22, rootMargin: "0px 0px -8% 0px" });

    stages.forEach(function (stage) { observer.observe(stage); });
  })();
  /* Drawer: max 3 fruit checkboxes */
  var fruitChecks = document.querySelectorAll('#fruit-checks input[name="fruit"]');
  function syncFruitLimit() {
    var selected = [];
    fruitChecks.forEach(function (cb) {
      if (cb.checked) selected.push(cb.value);
    });
    fruitChecks.forEach(function (cb) {
      var label = cb.closest(".fruit-check");
      if (!cb.checked && selected.length >= 3) {
        cb.disabled = true;
        if (label) label.classList.add("is-disabled");
      } else {
        cb.disabled = false;
        if (label) label.classList.remove("is-disabled");
      }
    });
    var hidden = document.getElementById("drawer-product");
    if (hidden) hidden.value = selected.join(", ");
  }
  window.syncFruitLimit = syncFruitLimit;
  fruitChecks.forEach(function (cb) {
    cb.addEventListener("change", syncFruitLimit);
  });

  if (drawerForm) {
    drawerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      syncFruitLimit();
      var product = (document.getElementById("drawer-product") || {}).value || "";
      if (!product) {
        alert("Please select at least one fruit (up to 3).");
        return;
      }
      var apps = [];
      drawerForm.querySelectorAll('input[name="application"]:checked').forEach(function (c) {
        apps.push(c.value);
      });
      window.location.href = buildMailto({
        name: document.getElementById("drawer-name").value.trim(),
        email: document.getElementById("drawer-email").value.trim(),
        company: document.getElementById("drawer-company").value.trim(),
        port: document.getElementById("drawer-port").value.trim(),
        product: product,
        packaging: document.getElementById("drawer-packaging").value,
        application: apps.join(", "),
        quantity: document.getElementById("drawer-quantity").value.trim()
      });
      if (drawerSuccess) drawerSuccess.classList.add("is-visible");
    });
  }

  /* Harvest calendar */
  var seasonGrid = document.getElementById("season-grid");
  if (seasonGrid) {
    seasonGrid.querySelectorAll("[data-season]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-season");
        var already = btn.classList.contains("is-active");
        seasonGrid.querySelectorAll("[data-season]").forEach(function (b) {
          b.classList.remove("is-active");
        });
        if (already) {
          seasonGrid.classList.remove("is-filtered");
          seasonGrid.querySelectorAll(".cell").forEach(function (cell) {
            cell.classList.remove("is-on");
          });
          return;
        }
        btn.classList.add("is-active");
        seasonGrid.classList.add("is-filtered");
        seasonGrid.querySelectorAll(".cell").forEach(function (cell) {
          cell.classList.toggle("is-on", cell.getAttribute("data-fruit") === key);
        });
      });
    });
  }

  /* Hero: Processing Plants — hover + tap reveal details */
  (function initHeroExperience() {
    var root = document.querySelector("[data-hero-plants]");
    if (!root) return;

    var items = root.querySelectorAll("[data-unit]");
    if (!items.length) return;

    var fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    function clearActive() {
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("is-active");
        items[i].setAttribute("aria-pressed", "false");
      }
    }

    for (var p = 0; p < items.length; p++) {
      (function (item) {
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");
        item.setAttribute("aria-pressed", "false");

        function activate(toggle) {
          var wasOn = item.classList.contains("is-active");
          clearActive();
          if (toggle && wasOn) return;
          item.classList.add("is-active");
          item.setAttribute("aria-pressed", "true");
        }

        item.addEventListener("click", function (e) {
          e.preventDefault();
          activate(!fineHover);
        });

        item.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            activate(true);
          }
        });

        if (fineHover) {
          item.addEventListener("mouseenter", function () {
            activate(false);
          });
        }
      })(items[p]);
    }

    if (fineHover) {
      root.addEventListener("mouseleave", clearActive);
    }
  })();

  /* Legacy hero slideshow (kept inert if no slides present) */
  (function initHeroSlideshow() {
    var hero = document.querySelector(".hero");
    var root = document.querySelector(".hero-media");
    var story = document.querySelector(".hero-story");
    if (!root) return;
    var dots = document.querySelectorAll("[data-hero-dot]");
    var slides = root.querySelectorAll(".hero-slide[data-hero-chapter], .hero-slide.hero-slide--legacy");
    if (!slides.length) return;
    var index = 0;
    var timer = null;
    var progressTimer = null;
    var paused = false;
    var INTERVAL = 5200;

    var chapterEl = story ? story.querySelector("[data-hero-chapter-label]") : null;
    var kickerEl = story ? story.querySelector("[data-hero-kicker]") : null;
    var titleEl = story ? story.querySelector("[data-hero-title]") : null;
    var noteEl = story ? story.querySelector("[data-hero-note]") : null;
    var progressEl = story ? story.querySelector("[data-hero-progress]") : null;

    function syncStory(slide) {
      if (!story || !slide) return;
      if (chapterEl) chapterEl.textContent = slide.getAttribute("data-hero-chapter") || "";
      if (kickerEl) kickerEl.textContent = slide.getAttribute("data-hero-kicker") || "";
      if (titleEl) titleEl.textContent = slide.getAttribute("data-hero-title") || "";
      if (noteEl) noteEl.textContent = slide.getAttribute("data-hero-note") || "";
    }

    function resetProgress() {
      if (!progressEl) return;
      progressEl.style.transition = "none";
      progressEl.style.width = "0%";
      void progressEl.offsetWidth;
      if (!paused) {
        progressEl.style.transition = "width " + INTERVAL + "ms linear";
        progressEl.style.width = "100%";
      }
    }

    function show(i) {
      index = ((i % slides.length) + slides.length) % slides.length;
      for (var n = 0; n < slides.length; n++) {
        if (n === index) slides[n].classList.add("is-active");
        else slides[n].classList.remove("is-active");
      }
      for (var d = 0; d < dots.length; d++) {
        var on = d === index;
        if (on) dots[d].classList.add("is-active");
        else dots[d].classList.remove("is-active");
        dots[d].setAttribute("aria-selected", on ? "true" : "false");
      }
      syncStory(slides[index]);
      resetProgress();
    }

    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      if (progressTimer) {
        window.clearTimeout(progressTimer);
        progressTimer = null;
      }
      if (progressEl) {
        progressEl.style.transition = "none";
      }
    }

    function start() {
      stop();
      if (paused) return;
      resetProgress();
      timer = window.setInterval(next, INTERVAL);
    }

    var nextBtn = document.querySelector("[data-hero-next]");
    var prevBtn = document.querySelector("[data-hero-prev]");
    if (nextBtn) {
      nextBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        next();
        start();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        prev();
        start();
      });
    }
    for (var i = 0; i < dots.length; i++) {
      (function (dot) {
        dot.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          show(parseInt(dot.getAttribute("data-hero-dot"), 10) || 0);
          start();
        });
      })(dots[i]);
    }

    var pauseTarget = hero || root;
    pauseTarget.addEventListener("mouseenter", function () {
      paused = true;
      stop();
      if (progressEl) {
        var computed = window.getComputedStyle(progressEl).width;
        progressEl.style.width = computed;
      }
    });
    pauseTarget.addEventListener("mouseleave", function () {
      paused = false;
      start();
    });

    show(0);
    start();
  })();

  /* Processing-unit map — MapLibre GL + OpenFreeMap + India boundary GeoJSON */
  (function initFootprintMap() {
    var mapEl = document.getElementById("map");
    if (!mapEl || typeof maplibregl === "undefined") return;

    var cardSelector = document.querySelector(".footprint-flip-card")
      ? ".footprint-flip-card"
      : ".footprint-card";

    var BOUNDARY_GEOJSON_URL = "assets/map/india-boundary.geojson";
    var BASEMAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
    var BOUNDARY_LINE_COLOR = "#263f35";

    var locations = {
      hq: {
        name: "Corporate Office (HQ)",
        short: "HQ",
        place: "Mumbai, Maharashtra",
        kind: "hq",
        coords: [19.0438, 72.9103],
        zoom: 14,
        address: "502, Malhotra Chambers, Deonar, Govandi (East), Mumbai, Maharashtra – 400 088, India",
        phone: "+91 22 2555 0091 / 92 / 93",
        phoneHref: "tel:+912225550091",
        email: "info@exotic-fruit.com",
        tag: "Global Export HQ / JNPT Connection"
      },
      ratnagiri: {
        name: "Ratnagiri Processing Unit",
        short: "Ratnagiri",
        place: "Ratnagiri, Maharashtra",
        kind: "plant",
        coords: [16.9902, 73.312],
        zoom: 13,
        address: "Plot No G-19/20, MIDC Mirjole, Ratnagiri, Maharashtra – 415639, India",
        phone: "+91 02352-229653",
        phoneHref: "tel:+9102352229653",
        email: "info@exotic-fruit.com",
        tag: "Alphonso Mango & Guava Belt | JNPT Port"
      },
      nashik: {
        name: "Nashik Processing Unit",
        short: "Nashik",
        place: "Nashik, Maharashtra",
        kind: "plant",
        coords: [20.1062, 74.0242],
        zoom: 13,
        address: "Plot No CU-81, Additional Vinchur Industrial Area, Niphad, Vinchur, Nashik, Maharashtra – 422305, India",
        phone: "",
        phoneHref: "",
        email: "info@exotic-fruit.com",
        tag: "Tomato & Pomegranate Belt | JNPT Port"
      },
      krishnagiri: {
        name: "Krishnagiri Processing Unit",
        short: "Krishnagiri",
        place: "Krishnagiri, Tamil Nadu",
        kind: "plant",
        coords: [12.5458, 78.3582],
        zoom: 13,
        address: "S.F. No.263/1, Bargur Thirupathur Road, Sigaralapally Post, Bargur, Krishnagiri, Tamil Nadu – 635104, India",
        phone: "",
        phoneHref: "",
        email: "info@exotic-fruit.com",
        tag: "Totapuri Mango Belt | Chennai Port"
      },
      chittoor: {
        name: "Chittoor Processing Unit",
        short: "Chittoor",
        place: "Chittoor, Andhra Pradesh",
        kind: "plant",
        coords: [13.2172, 79.1003],
        zoom: 13,
        address: "Industrial Estate, Chittoor, Andhra Pradesh – 517001, India",
        phone: "",
        phoneHref: "",
        email: "info@exotic-fruit.com",
        tag: "Tropical Fruit Processing | Chennai Port"
      }
    };

    function lngLatOf(loc) {
      return [loc.coords[1], loc.coords[0]];
    }

    function hoverLabel(loc) {
      return loc.name;
    }

    function boundaryLineWidth() {
      return window.matchMedia("(max-width: 720px)").matches ? 1.5 : 2;
    }

    function indiaFitPadding() {
      var narrow = window.matchMedia("(max-width: 720px)").matches;
      return narrow
        ? { top: 36, bottom: 72, left: 28, right: 28 }
        : { top: 45, bottom: 56, left: 45, right: 45 };
    }

    function boundsFromGeoJSON(geojson) {
      var minLng = Infinity;
      var minLat = Infinity;
      var maxLng = -Infinity;
      var maxLat = -Infinity;

      function accum(coord) {
        if (!coord || coord.length < 2) return;
        var lng = coord[0];
        var lat = coord[1];
        if (typeof lng !== "number" || typeof lat !== "number") return;
        if (lng < minLng) minLng = lng;
        if (lat < minLat) minLat = lat;
        if (lng > maxLng) maxLng = lng;
        if (lat > maxLat) maxLat = lat;
      }

      function walk(node) {
        if (!node) return;
        if (typeof node[0] === "number") {
          accum(node);
          return;
        }
        for (var i = 0; i < node.length; i++) walk(node[i]);
      }

      var features =
        geojson.type === "FeatureCollection"
          ? geojson.features || []
          : geojson.type === "Feature"
            ? [geojson]
            : [{ geometry: geojson }];

      features.forEach(function (f) {
        if (f && f.geometry && f.geometry.coordinates) {
          walk(f.geometry.coordinates);
        }
      });

      if (!isFinite(minLng) || !isFinite(minLat) || !isFinite(maxLng) || !isFinite(maxLat)) {
        return null;
      }
      return [
        [minLng, minLat],
        [maxLng, maxLat]
      ];
    }

    var wrap = mapEl.parentElement;
    var tipEl = document.createElement("div");
    tipEl.className = "footprint-map-tooltip";
    tipEl.hidden = true;
    tipEl.setAttribute("aria-hidden", "true");
    if (wrap) wrap.appendChild(tipEl);

    var tipId = "";
    var markers = {};
    var activeId = "";
    var indiaBounds = null;
    var cards = document.querySelectorAll(cardSelector);
    var markersReady = false;

    /* Temporary view until GeoJSON bounds are available — not the primary framing */
    var map = new maplibregl.Map({
      container: mapEl,
      style: BASEMAP_STYLE_URL,
      center: [0, 20],
      zoom: 1,
      attributionControl: false
    });

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    function fitIndiaBoundary(animated) {
      if (!indiaBounds) return;
      map.fitBounds(indiaBounds, {
        padding: indiaFitPadding(),
        duration: animated ? 700 : 0
      });
    }

    function hideTooltip() {
      tipId = "";
      tipEl.hidden = true;
      tipEl.textContent = "";
    }

    function positionTooltip() {
      if (!tipId || tipEl.hidden || !markers[tipId]) return;
      var pt = map.project(markers[tipId].getLngLat());
      var size = map.getContainer().getBoundingClientRect();
      var offsetY = markers[tipId].getElement().classList.contains("is-star") ? 18 : 40;
      var x = pt.x;
      var y = pt.y - offsetY;
      if (tipId === "nashik") {
        x = pt.x + 18;
        y = pt.y - 8;
        tipEl.style.transform = "translate(0, -50%)";
      } else {
        tipEl.style.transform = "translate(-50%, -100%)";
      }
      x = Math.max(12, Math.min(size.width - 12, x));
      y = Math.max(12, Math.min(size.height - 12, y));
      tipEl.style.left = x + "px";
      tipEl.style.top = y + "px";
    }

    function showHoverTooltip(id) {
      var loc = locations[id];
      var marker = markers[id];
      if (!loc || !marker) return;

      Object.keys(markers).forEach(function (key) {
        var el = markers[key].getElement();
        if (el) el.style.zIndex = key === id ? "2" : "1";
      });

      tipId = id;
      tipEl.textContent = hoverLabel(loc);
      tipEl.hidden = false;
      positionTooltip();
    }

    function highlightCards(id, scrollIntoView) {
      cards.forEach(function (card) {
        var on = card.getAttribute("data-location") === id;
        card.classList.toggle("is-active", on);
        card.classList.toggle("is-flipped", on);
        card.setAttribute("aria-pressed", on ? "true" : "false");
        if (on && scrollIntoView) {
          card.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });

      Object.keys(markers).forEach(function (key) {
        var el = markers[key].getElement();
        if (el) {
          el.classList.toggle("is-active", key === id);
          el.setAttribute("aria-expanded", key === id ? "true" : "false");
          el.style.zIndex = key === id ? "2" : "1";
        }
      });
    }

    function clearActive() {
      activeId = "";
      hideTooltip();
      cards.forEach(function (card) {
        card.classList.remove("is-active", "is-flipped", "is-expanded");
        card.setAttribute("aria-pressed", "false");
      });
      Object.keys(markers).forEach(function (key) {
        var el = markers[key].getElement();
        if (el) {
          el.classList.remove("is-active");
          el.setAttribute("aria-expanded", "false");
          el.style.zIndex = "1";
        }
      });
    }

    function setActive(id, fly) {
      var loc = locations[id];
      var marker = markers[id];
      if (!loc || !marker) return;

      activeId = id;
      hideTooltip();
      highlightCards(id, !fly);

      if (fly) {
        map.flyTo({
          center: lngLatOf(loc),
          zoom: loc.zoom,
          duration: 1100
        });
      }
    }

    function createMarkerElement(loc) {
      var el = document.createElement("div");
      if (loc.kind === "hq") {
        el.className = "footprint-marker is-hq is-star";
        el.innerHTML = '<span class="footprint-star" aria-hidden="true">★</span>';
      } else {
        el.className = "footprint-marker";
        el.innerHTML = '<span class="footprint-pin" aria-hidden="true"></span>';
      }
      return el;
    }

    function addLocationMarkers() {
      if (markersReady) return;
      markersReady = true;

      Object.keys(locations).forEach(function (id) {
        var loc = locations[id];
        var label = hoverLabel(loc);
        var el = createMarkerElement(loc);
        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "button");
        el.setAttribute(
          "aria-label",
          label + ". Activate for full address and export details."
        );
        el.setAttribute("aria-expanded", "false");

        var marker = new maplibregl.Marker({
          element: el,
          anchor: loc.kind === "hq" ? "center" : "bottom",
          pitchAlignment: "viewport",
          rotationAlignment: "viewport"
        })
          .setLngLat(lngLatOf(loc))
          .addTo(map);

        el.addEventListener("mouseenter", function () {
          showHoverTooltip(id);
          if (activeId !== id) {
            cards.forEach(function (card) {
              card.classList.toggle(
                "is-linked",
                card.getAttribute("data-location") === id
              );
            });
          }
        });

        el.addEventListener("mouseleave", function () {
          if (tipId === id) hideTooltip();
          cards.forEach(function (card) {
            card.classList.remove("is-linked");
          });
        });

        el.addEventListener("click", function (e) {
          e.stopPropagation();
          hideTooltip();
          setActive(id, true);
        });

        el.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActive(id, true);
          }
        });

        markers[id] = marker;
      });
    }

    function ensureBoundaryLayer(geojson) {
      if (map.getSource("india-boundary")) {
        map.getSource("india-boundary").setData(geojson);
      } else {
        map.addSource("india-boundary", {
          type: "geojson",
          data: geojson
        });
      }

      if (!map.getLayer("india-boundary-line")) {
        map.addLayer({
          id: "india-boundary-line",
          type: "line",
          source: "india-boundary",
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": BOUNDARY_LINE_COLOR,
            "line-width": boundaryLineWidth(),
            "line-opacity": 0.95
          }
        });
      } else {
        map.setPaintProperty(
          "india-boundary-line",
          "line-width",
          boundaryLineWidth()
        );
      }
    }

    function loadIndiaBoundaryAndFrame() {
      return fetch(BOUNDARY_GEOJSON_URL, { cache: "no-cache" })
        .then(function (res) {
          if (!res.ok) {
            throw new Error(
              "India boundary GeoJSON failed to load (" +
                res.status +
                "): " +
                BOUNDARY_GEOJSON_URL
            );
          }
          return res.json();
        })
        .then(function (geojson) {
          ensureBoundaryLayer(geojson);
          indiaBounds = boundsFromGeoJSON(geojson);
          if (!indiaBounds) {
            throw new Error("India boundary GeoJSON has no usable coordinates");
          }
          fitIndiaBoundary(false);
          addLocationMarkers();
        })
        .catch(function (err) {
          console.error(err);
          /* Keep basemap usable; do not invent a replacement boundary */
          addLocationMarkers();
        });
    }

    map.on("load", function () {
      loadIndiaBoundaryAndFrame();
    });

    map.on("click", function () {
      clearActive();
    });

    map.on("move", positionTooltip);

    var fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    cards.forEach(function (card) {
      card.setAttribute("aria-pressed", "false");
      var locId = card.getAttribute("data-location");

      card.addEventListener("mouseenter", function () {
        if (markers[locId]) showHoverTooltip(locId);
        if (fineHover && locId !== "hq") {
          cards.forEach(function (c) {
            if (c !== card) c.classList.remove("is-expanded");
          });
          card.classList.add("is-expanded");
        }
      });

      card.addEventListener("mouseleave", function () {
        if (tipId === locId) hideTooltip();
        if (fineHover && activeId !== locId) {
          card.classList.remove("is-expanded");
        }
      });

      card.addEventListener("click", function (e) {
        if (e.target.closest("a")) return;
        var id = card.getAttribute("data-location");

        if (!fineHover && id !== "hq") {
          if (!card.classList.contains("is-expanded") && activeId !== id) {
            cards.forEach(function (c) {
              c.classList.remove("is-expanded");
            });
            card.classList.add("is-expanded");
            if (markers[id]) showHoverTooltip(id);
            return;
          }
        }

        if (activeId === id) {
          clearActive();
          card.classList.remove("is-expanded");
          return;
        }
        cards.forEach(function (c) {
          c.classList.toggle("is-expanded", c === card);
        });
        setActive(id, true);
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (e.target.closest("a")) return;
          setActive(card.getAttribute("data-location"), true);
        }
      });
    });

    window.addEventListener("resize", function () {
      map.resize();
      if (map.getLayer("india-boundary-line")) {
        map.setPaintProperty(
          "india-boundary-line",
          "line-width",
          boundaryLineWidth()
        );
      }
      positionTooltip();
    });
  })();

  /* Certifications logo strip + detail carousel */
  (function () {
    var root = document.querySelector("[data-cert-carousel]");
    if (!root) return;

    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll("[data-cert-panel]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-cert-dot]"));
    var prev = root.querySelector("[data-cert-prev]");
    var next = root.querySelector("[data-cert-next]");
    var index = 0;
    var touchX = null;

    function setIndex(nextIndex, focusTab) {
      if (!tabs.length) return;
      index = (nextIndex + tabs.length) % tabs.length;

      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.classList.toggle("is-active", on);
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        if (on && focusTab) tab.focus();
      });

      panels.forEach(function (panel, i) {
        var on = i === index;
        panel.classList.toggle("is-active", on);
        if (on) panel.removeAttribute("hidden");
        else panel.setAttribute("hidden", "");
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        setIndex(Number(tab.getAttribute("data-cert-index") || 0), false);
      });
      tab.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          setIndex(index + 1, true);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          setIndex(index - 1, true);
        } else if (e.key === "Home") {
          e.preventDefault();
          setIndex(0, true);
        } else if (e.key === "End") {
          e.preventDefault();
          setIndex(tabs.length - 1, true);
        }
      });
    });

    if (prev) prev.addEventListener("click", function () { setIndex(index - 1, false); });
    if (next) next.addEventListener("click", function () { setIndex(index + 1, false); });

    var viewport = root.querySelector(".cert-detail-viewport");
    if (viewport) {
      viewport.addEventListener("touchstart", function (e) {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        touchX = e.changedTouches[0].clientX;
      }, { passive: true });
      viewport.addEventListener("touchend", function (e) {
        if (touchX == null || !e.changedTouches || !e.changedTouches[0]) return;
        var dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) < 40) return;
        setIndex(index + (dx < 0 ? 1 : -1), false);
      }, { passive: true });
    }

    setIndex(0, false);
  })();

  document.querySelectorAll(".pd-tabs").forEach(function (tabs) {
    var buttons = tabs.querySelectorAll("[data-pd-tab]");
    var panels = document.querySelectorAll("[data-pd-panel]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-pd-tab");
        buttons.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        panels.forEach(function (panel) {
          panel.hidden = panel.getAttribute("data-pd-panel") !== id;
        });
      });
    });
  });
})();
