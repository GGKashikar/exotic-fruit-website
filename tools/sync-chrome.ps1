# Sync shared utility bar + primary nav across all site HTML pages.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $root "index.html"))) {
  $root = "E:\Drive E Data\MIPL Docs\exotic-fruit-com-full-site-offline\www.exotic-fruit.com"
}

function Get-NavHtml([string]$Prefix, [string]$Active) {
@"
  <div class="utility-bar" role="region" aria-label="Export recognition">
    <div class="utility-inner">
      <div class="utility-left">
        <span>Star Export House Recognized</span>
        <span>APEDA Registered</span>
        <span>FSSAI Central Export License #10019022005421</span>
      </div>
      <div class="utility-right">
        <span>HSN Code: 200799910</span>
        <span>SGF Germany (IRMA) Member</span>
      </div>
    </div>
  </div>

  <header class="site-header glass">
    <div class="header-inner">
      <div class="brand-cluster">
      <a class="brand" href="${Prefix}index.html">
        <img src="${Prefix}img/logo.png" alt="Exotic Fruits Pvt. Ltd.">
        <span class="brand-name">Exotic Fruits<small>Pulp &amp; Purees B2B Global</small></span>
      </a>
      <a class="home-link" href="${Prefix}index.html" aria-label="Home" title="Home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5.5v-6.5h-3V21H5a1 1 0 0 1-1-1v-9.5z"/></svg>
      </a>
      </div>
      <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="site-nav" aria-label="Primary">
        <ul class="nav-list">
          <li class="nav-item has-mega">
            <a class="nav-trigger$(if($Active -eq 'products'){' is-active'})" href="${Prefix}products.html">Products</a>
            <div class="mega" role="menu">
              <p class="mega-kicker">Product families</p>
              <div class="mega-grid">
                <a href="${Prefix}products.html#catalog" data-nav-filter="purees">Purees <span>Aseptic &middot; frozen bulk</span></a>
                <a href="${Prefix}products.html#catalog" data-nav-filter="concentrates">Concentrates <span>High-Brix industrial</span></a>
                <a href="${Prefix}products.html#catalog" data-nav-filter="organic">Organic <span>Certified lots</span></a>
                <a href="${Prefix}products.html#catalog" data-nav-filter="canned">Canned <span>OTS / A10 formats</span></a>
              </div>
            </div>
          </li>
          <li class="nav-item has-mega">
            <a class="nav-trigger$(if($Active -eq 'applications'){' is-active'})" href="${Prefix}applications.html">Applications</a>
            <div class="mega" role="menu">
              <p class="mega-kicker">Industrial use cases</p>
              <div class="mega-grid">
                <a href="${Prefix}applications.html#beverage">Beverage <span>RTD &middot; nectars &middot; smoothies</span></a>
                <a href="${Prefix}applications.html#dairy">Dairy <span>Yogurt &middot; ice cream &middot; lassi</span></a>
                <a href="${Prefix}applications.html#confectionery">Confectionery <span>Fillings &middot; jellies &middot; bakery</span></a>
                <a href="${Prefix}applications.html#baby-food">Baby Food <span>Clean-label infant</span></a>
              </div>
            </div>
          </li>
          <li class="nav-item has-mega">
            <a class="nav-trigger$(if($Active -eq 'supply'){' is-active'})" href="${Prefix}supply-chain.html">Supply Chain</a>
            <div class="mega" role="menu">
              <p class="mega-kicker">Operations</p>
              <div class="mega-grid">
                <a href="${Prefix}supply-chain.html#plants">Processing Units <span>4 industrial campuses</span></a>
                <a href="${Prefix}supply-chain.html#calendar">Crop Calendar <span>12-month windows</span></a>
                <a href="${Prefix}supply-chain.html#logistics">Logistics <span>FCL loading calculator</span></a>
              </div>
            </div>
          </li>
          <li class="nav-item has-mega">
            <a class="nav-trigger$(if($Active -eq 'quality'){' is-active'})" href="${Prefix}quality.html">Quality &amp; Compliance</a>
            <div class="mega" role="menu">
              <p class="mega-kicker">Assurance</p>
              <div class="mega-grid">
                <a href="${Prefix}quality.html#pipeline">QA Labs <span>In-house release testing</span></a>
                <a href="${Prefix}quality.html#pipeline">MRL Testing <span>EU &middot; FDA &middot; Codex</span></a>
                <a href="${Prefix}quality.html#certificates">Certificates <span>FSSC &middot; SGF &middot; HACCP</span></a>
              </div>
            </div>
          </li>
          <li class="nav-item has-mega">
            <a class="nav-trigger$(if($Active -eq 'about'){' is-active'})" href="${Prefix}about.html">About Us</a>
            <div class="mega" role="menu">
              <p class="mega-kicker">Company</p>
              <div class="mega-grid">
                <a href="${Prefix}about.html#who">Who We Are <span>Company profile</span></a>
                <a href="${Prefix}about.html#what-we-do">What We Do <span>Processing &amp; export</span></a>
                <a href="${Prefix}about.html#infrastructure">Infrastructure <span>Plants &amp; capacity</span></a>
                <a href="${Prefix}about.html#values">Our Values <span>How we work</span></a>
                <a href="${Prefix}about.html#difference">What Makes Us Different <span>Why buyers work with us</span></a>
              </div>
            </div>
          </li>
        </ul>
        <div class="header-actions">
          <a class="btn-secondary" href="${Prefix}quality.html#downloads">TDS Library</a>
          <button class="btn-primary" type="button" data-open-drawer>Request Bulk Sample / RFQ</button>
        </div>
      </nav>
    </div>
  </header>
"@
}

function Get-FooterHtml([string]$Prefix) {
@"
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="footer-brand" href="${Prefix}index.html"><img src="${Prefix}img/logo.png" alt="Exotic Fruits Pvt. Ltd."></a>
          <p>Elite primary processor and exporter of tropical fruit pulps, purees, and concentrates.</p>
        </div>
        <div>
          <h3>Buyers</h3>
          <a href="${Prefix}products.html">Product catalogue</a>
          <a href="${Prefix}applications.html">Industrial applications</a>
          <a href="${Prefix}quality.html#downloads">TDS library</a>
          <a href="${Prefix}supply-chain.html#calendar">Crop calendar</a>
        </div>
        <div>
          <h3>Company</h3>
          <a href="${Prefix}quality.html">Quality &amp; compliance</a>
          <a href="${Prefix}about.html">About Exotic Fruits</a>
          <a href="${Prefix}supply-chain.html">Supply chain</a>
          <a href="${Prefix}contact.html">Contact &amp; RFQ</a>
        </div>
        <div>
          <h3>Export desk</h3>
          <p>502, Malhotra Chambers, Deonar, Govandi (East), Maharashtra – 400 088</p>
          <a href="mailto:info@exotic-fruit.com">info@exotic-fruit.com</a>
          <a href="tel:+912225550091">+91 22 2555 0091</a>
        </div>
      </div>
      <div class="footer-inner">
        <p class="footer-copy">Copyright © 2026 Exotic Fruits Pvt. Ltd.</p>
        <p class="footer-copy">HSN 200799910 &middot; FSSAI #10019022005421</p>
      </div>
    </div>
  </footer>
"@
}

$map = @{
  "index.html" = @{ Prefix = ""; Active = "home" }
  "products.html" = @{ Prefix = ""; Active = "products" }
  "applications.html" = @{ Prefix = ""; Active = "applications" }
  "supply-chain.html" = @{ Prefix = ""; Active = "supply" }
  "quality.html" = @{ Prefix = ""; Active = "quality" }
  "about.html" = @{ Prefix = ""; Active = "about" }
  "contact.html" = @{ Prefix = ""; Active = "contact" }
  "export.html" = @{ Prefix = ""; Active = "supply" }
}

foreach ($file in $map.Keys) {
  $path = Join-Path $root $file
  if (-not (Test-Path $path)) { Write-Host "skip missing $file"; continue }
  $html = Get-Content -Raw -Path $path
  $cfg = $map[$file]
  $nav = Get-NavHtml $cfg.Prefix $cfg.Active
  $footer = Get-FooterHtml $cfg.Prefix

  # Replace from utility-bar through end of header
  $html = [regex]::Replace($html, '(?s)<div class="utility-bar".*?</header>', $nav.Trim())
  # Replace footer blocks
  $html = [regex]::Replace($html, '(?s)<footer class="site-footer">.*?</footer>', $footer.Trim())
  Set-Content -Path $path -Value $html -Encoding UTF8
  Write-Host "updated $file"
}

Write-Host "Chrome sync complete."
