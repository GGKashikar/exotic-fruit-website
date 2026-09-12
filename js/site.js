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
    var netEl = document.getElementById("fcl-net");
    var noteEl = document.getElementById("fcl-note");
    if (!unitsEl || !netEl) return;
    var units = 0;
    var net = 0;
    var note = "";
    if (format === "drums") {
      units = size === "40" ? 160 : 80;
      net = units * 215;
      note = "215 kg net aseptic drums · " + units + " drums per " + size + "ft FCL";
    } else if (format === "cans") {
      units = size === "40" ? 2000 : 1000;
      net = units * 18.6;
      note = "OTS cartons (6 × 3.1 kg) · " + units + " cartons per " + size + "ft FCL";
    } else {
      units = size === "40" ? 2200 : 1100;
      net = units * 16;
      note = "Frozen cartons (approx. 16 kg) · indicative " + size + "ft FCL load";
    }
    unitsEl.textContent = String(units);
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

  /* Home process steps keyboard/hover */
  document.querySelectorAll("#home-flow .flow-step, #flow-steps .flow-step").forEach(function (step, _, list) {
    function activate() {
      list.forEach(function (s) { s.classList.remove("is-active"); });
      step.classList.add("is-active");
    }
    step.addEventListener("mouseenter", activate);
    step.addEventListener("focus", activate);
    step.addEventListener("click", activate);
  });

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
        quantity: document.getElementById("drawer-quantity").value.trim(),
        message: document.getElementById("drawer-message").value.trim()
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

  /* Hero slideshow */
  (function initHeroSlideshow() {
    var hero = document.querySelector(".hero");
    var root = document.querySelector(".hero-media");
    var story = document.querySelector(".hero-story");
    if (!root) return;
    var slides = root.querySelectorAll(".hero-slide");
    var dots = document.querySelectorAll("[data-hero-dot]");
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

  /* Interactive processing-unit map (Leaflet) */
  (function initFootprintMap() {
    var mapEl = document.getElementById("map");
    if (!mapEl || typeof L === "undefined") return;

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

    function hoverLabel(loc) {
      return loc.name;
    }

    function pinIcon(loc) {
      return L.divIcon({
        className: "footprint-marker" + (loc.kind === "hq" ? " is-hq" : ""),
        html: '<span class="footprint-pin" aria-hidden="true"></span><span class="footprint-pin-name" aria-hidden="true">' + loc.short + "</span>",
        iconSize: [92, 56],
        iconAnchor: [46, 36],
        popupAnchor: [0, -38]
      });
    }

    function popupHtml(loc) {
      var phoneLine = loc.phone
        ? '<p><a href="' + loc.phoneHref + '">' + loc.phone + "</a></p>"
        : "";
      return (
        '<div class="footprint-popup-inner">' +
        '<p class="footprint-popup-kicker">' + (loc.kind === "hq" ? "Corporate HQ" : "Processing unit") + "</p>" +
        "<h3>" + loc.name + "</h3>" +
        "<p>" + loc.address + "</p>" +
        phoneLine +
        '<a href="mailto:' + loc.email + '">' + loc.email + "</a>" +
        '<div><span class="footprint-popup-tag">' + loc.tag + "</span></div>" +
        "</div>"
      );
    }

    var map = L.map(mapEl, {
      scrollWheelZoom: true,
      zoomControl: true,
      closePopupOnClick: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var markers = {};
    var bounds = L.latLngBounds([]);
    var activeId = "";
    var suppressMapClose = false;

    function fitAll() {
      map.fitBounds(bounds, {
        paddingTopLeft: [18, 18],
        paddingBottomRight: [28, 18],
        maxZoom: 6
      });
    }

    function closeAllTooltips(exceptId) {
      Object.keys(markers).forEach(function (key) {
        if (exceptId && key === exceptId) return;
        markers[key].closeTooltip();
      });
    }

    function closeAllPopups(exceptId) {
      Object.keys(markers).forEach(function (key) {
        if (exceptId && key === exceptId) return;
        markers[key].closePopup();
      });
      if (!exceptId) map.closePopup();
    }

    function bestTooltipDirection(marker) {
      var pt = map.latLngToContainerPoint(marker.getLatLng());
      var size = map.getSize();
      var edgeX = 120;
      var edgeY = 56;
      if (pt.y < edgeY) return "bottom";
      if (pt.x > size.x - edgeX) return "left";
      if (pt.x < edgeX) return "right";
      return "top";
    }

    function tooltipOffset(direction) {
      if (direction === "bottom") return [0, 8];
      if (direction === "left") return [-14, -18];
      if (direction === "right") return [14, -18];
      return [0, -36];
    }

    function showHoverTooltip(id) {
      var marker = markers[id];
      if (!marker) return;

      closeAllPopups();
      closeAllTooltips(id);

      var direction = bestTooltipDirection(marker);
      var tooltip = marker.getTooltip();
      if (tooltip) {
        tooltip.options.direction = direction;
        tooltip.options.offset = tooltipOffset(direction);
      }

      marker.openTooltip();
      map.panInside(marker.getLatLng(), {
        paddingTopLeft: [28, 48],
        paddingBottomRight: [28, 48],
        animate: true,
        duration: 0.2
      });
    }

    function highlightCards(id, scrollIntoView) {
      document.querySelectorAll(".footprint-card").forEach(function (card) {
        var on = card.getAttribute("data-location") === id;
        card.classList.toggle("is-active", on);
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
        }
      });
    }

    function setActive(id, fly) {
      var loc = locations[id];
      var marker = markers[id];
      if (!loc || !marker) return;

      activeId = id;
      closeAllTooltips();
      closeAllPopups(id);
      highlightCards(id, !fly);

      suppressMapClose = true;
      if (fly) {
        map.flyTo(loc.coords, loc.zoom, { duration: 1.15 });
        map.once("moveend", function () {
          marker.openPopup();
          window.setTimeout(function () {
            suppressMapClose = false;
          }, 50);
        });
      } else {
        map.panInside(marker.getLatLng(), {
          paddingTopLeft: [40, 72],
          paddingBottomRight: [40, 72],
          animate: true,
          duration: 0.25
        });
        marker.openPopup();
        window.setTimeout(function () {
          suppressMapClose = false;
        }, 50);
      }
    }

    Object.keys(locations).forEach(function (id) {
      var loc = locations[id];
      var label = hoverLabel(loc);
      var marker = L.marker(loc.coords, {
        icon: pinIcon(loc),
        keyboard: true,
        riseOnHover: true,
        alt: label
      })
        .addTo(map)
        .bindTooltip(label, {
          direction: "top",
          offset: [0, -36],
          opacity: 0.97,
          className: "footprint-tooltip",
          sticky: false,
          permanent: false,
          interactive: false
        })
        .bindPopup(popupHtml(loc), {
          className: "footprint-popup",
          maxWidth: 280,
          autoPan: true,
          autoPanPadding: [36, 36],
          keepInView: true,
          closeOnClick: false,
          autoClose: true
        });

      marker.on("mouseover", function () {
        showHoverTooltip(id);
      });

      marker.on("mouseout", function () {
        marker.closeTooltip();
      });

      marker.on("click", function (e) {
        L.DomEvent.stopPropagation(e);
        setActive(id, false);
      });

      markers[id] = marker;
      bounds.extend(loc.coords);

      var el = marker.getElement();
      if (el) {
        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", label + ". Activate for full address and export details.");
        el.setAttribute("aria-expanded", "false");
        el.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActive(id, true);
          }
        });
      }
    });

    map.on("click", function () {
      if (suppressMapClose) return;
      closeAllTooltips();
      closeAllPopups();
      activeId = "";
      document.querySelectorAll(".footprint-card").forEach(function (card) {
        card.classList.remove("is-active");
        card.setAttribute("aria-pressed", "false");
      });
      Object.keys(markers).forEach(function (key) {
        var el = markers[key].getElement();
        if (el) {
          el.classList.remove("is-active");
          el.setAttribute("aria-expanded", "false");
        }
      });
    });

    map.on("popupopen", function (e) {
      closeAllTooltips();
      Object.keys(markers).forEach(function (key) {
        if (markers[key].getPopup() !== e.popup) {
          markers[key].closePopup();
        }
      });
    });

    document.querySelectorAll(".footprint-card").forEach(function (card) {
      card.setAttribute("aria-pressed", "false");
      function activate(e) {
        if (e.target.closest("a")) return;
        setActive(card.getAttribute("data-location"), true);
      }
      card.addEventListener("click", activate);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate(e);
        }
      });
    });

    fitAll();
    window.setTimeout(function () {
      map.invalidateSize();
      fitAll();
    }, 180);

    window.addEventListener("resize", function () {
      map.invalidateSize();
    });
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
