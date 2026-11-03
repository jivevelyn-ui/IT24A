
/* =========================================
   CHICKENVERSE JAVASCRIPT
   Page Navigation + Interactive Map
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

  // =========================================
  // 1. PAGE NAVIGATION
  // =========================================

  const pages = document.querySelectorAll(".page-view");
  const navLinks = document.querySelectorAll(".nav-link");

  function showPage(pageId, updateAddress = true) {

    // Check whether the requested page exists
    const targetPage = document.getElementById(pageId);

    if (!targetPage || !targetPage.classList.contains("page-view")) {
      pageId = "home";
    }

    // Display the selected page and hide the others
    pages.forEach(function (page) {
      page.classList.toggle("active", page.id === pageId);
    });

    // Update the active navigation link
    navLinks.forEach(function (link) {
      const isActive = link.dataset.page === pageId;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    // Update the browser URL without reloading
    if (updateAddress) {
      history.replaceState(null, "", "#" + pageId);
    }

    // Scroll to the top when changing pages
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // Refresh map dimensions when About Us is opened
    if (pageId === "about" && window.chickenverseMap) {
      setTimeout(function () {
        window.chickenverseMap.invalidateSize();
      }, 300);
    }
  }


  // Header navigation
  navLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {
      event.preventDefault();

      showPage(link.dataset.page);
    });

  });


  // Links within the website, including the footer
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    // Header navigation is already handled above
    if (link.classList.contains("nav-link")) {
      return;
    }

    link.addEventListener("click", function (event) {

      const destination = link.getAttribute("href").slice(1);
      const target = document.getElementById(destination);

      // Switch pages only for main page destinations
      if (
        target &&
        target.classList.contains("page-view")
      ) {
        event.preventDefault();

        showPage(destination);
      }

    });

  });


  // Open the correct page if a URL contains a page hash
  const initialPage = window.location.hash.slice(1);
  const initialTarget = document.getElementById(initialPage);

  if (
    initialTarget &&
    initialTarget.classList.contains("page-view")
  ) {
    showPage(initialPage, false);
  } else {
    showPage("home", false);
  }


  // Respond to browser back and forward navigation
  window.addEventListener("hashchange", function () {

    const pageId = window.location.hash.slice(1);
    const target = document.getElementById(pageId);

    if (target && target.classList.contains("page-view")) {
      showPage(pageId, false);
    } else {
      showPage("home", false);
    }

  });


  // =========================================
  // 2. LEAFLET MAP
  // =========================================

  const mapElement = document.getElementById("map");

  if (mapElement && typeof L !== "undefined") {

    // Example coordinates for Manolo Fortich, Bukidnon
    const exampleLocation = [8.3602, 124.8675];

    // Initialize the map
    const map = L.map(mapElement).setView(
      exampleLocation,
      15
    );

    // Make the map available to the navigation function
    window.chickenverseMap = map;

    // Load OpenStreetMap tiles
    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,

        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">' +
          "OpenStreetMap</a> contributors"
      }
    ).addTo(map);

    // Add the example location marker
    L.marker(exampleLocation)
      .addTo(map)
      .bindPopup(
        "<strong>Chickenverse</strong><br>" +
        "Example project location in Manolo Fortich, Bukidnon"
      );

    // Refresh the map after initialization
    setTimeout(function () {
      map.invalidateSize();
    }, 300);

    // Correct the map size when the browser window changes
    window.addEventListener("resize", function () {
      map.invalidateSize();
    });

  } else if (mapElement) {

    console.error(
      "Leaflet did not load. Check your internet connection " +
      "and the Leaflet script URL in index.html."
    );

  }

});
