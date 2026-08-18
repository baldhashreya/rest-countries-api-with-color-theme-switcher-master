(function () {
  const grid = document.getElementById("countryGrid");
  const searchInput = document.getElementById("searchInput");
  const statusMessage = document.getElementById("statusMessage");

  const filterEl = document.querySelector(".filter");
  const filterButton = document.getElementById("filterButton");
  const filterLabel = document.getElementById("filterLabel");
  const filterList = document.getElementById("filterList");

  // COUNTRIES_DATA comes from js/countries-data.js, loaded before this file.
  const allCountries = typeof COUNTRIES_DATA !== "undefined" ? COUNTRIES_DATA : [];

  let searchTerm = "";
  let selectedRegion = "";

  function numberWithCommas(num) {
    return num.toLocaleString("en-US");
  }

  function countryCardTemplate(country) {
    const flagUrl = country.flags && country.flags.svg ? country.flags.svg : country.flag;
    return `
      <a class="card" href="detail.html?code=${encodeURIComponent(country.alpha3Code)}">
        <img class="card__flag" src="${flagUrl}" alt="Flag of ${country.name}" loading="lazy" />
        <div class="card__body">
          <h2 class="card__name">${country.name}</h2>
          <ul class="card__info">
            <li><strong>Population:</strong> ${numberWithCommas(country.population)}</li>
            <li><strong>Region:</strong> ${country.region || "—"}</li>
            <li><strong>Capital:</strong> ${country.capital || "—"}</li>
          </ul>
        </div>
      </a>
    `;
  }

  function render() {
    if (!allCountries.length) {
      statusMessage.hidden = false;
      statusMessage.textContent =
        "Country data didn't load — make sure js/countries-data.js is included before js/app.js.";
      return;
    }

    const term = searchTerm.trim().toLowerCase();
    const filtered = allCountries.filter((country) => {
      const matchesSearch = country.name.toLowerCase().includes(term);
      const matchesRegion = !selectedRegion || country.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });

    if (filtered.length === 0) {
      grid.innerHTML = "";
      statusMessage.hidden = false;
      statusMessage.textContent = "No countries found matching your search.";
      return;
    }

    statusMessage.hidden = true;
    grid.innerHTML = filtered.map(countryCardTemplate).join("");
  }

  function setRegion(region, label) {
    selectedRegion = region;
    filterLabel.textContent = label;
    closeFilter();
    render();
  }

  function openFilter() {
    filterList.hidden = false;
    filterEl.setAttribute("data-open", "true");
    filterButton.setAttribute("aria-expanded", "true");
  }

  function closeFilter() {
    filterList.hidden = true;
    filterEl.setAttribute("data-open", "false");
    filterButton.setAttribute("aria-expanded", "false");
  }

  function toggleFilter() {
    if (filterList.hidden) {
      openFilter();
    } else {
      closeFilter();
    }
  }

  searchInput.addEventListener("input", (event) => {
    searchTerm = event.target.value;
    render();
  });

  filterButton.addEventListener("click", toggleFilter);

  filterList.addEventListener("click", (event) => {
    const option = event.target.closest("[data-region]");
    if (!option) return;
    const region = option.getAttribute("data-region");
    setRegion(region, region || "Filter by Region");
  });

  document.addEventListener("click", (event) => {
    if (!filterEl.contains(event.target)) {
      closeFilter();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeFilter();
  });

  render();
})();
