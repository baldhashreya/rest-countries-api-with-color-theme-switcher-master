(function () {
  const detailContent = document.getElementById("detailContent");

  // COUNTRIES_DATA comes from js/countries-data.js, loaded before this file.
  const allCountries = typeof COUNTRIES_DATA !== "undefined" ? COUNTRIES_DATA : [];

  function numberWithCommas(num) {
    return num.toLocaleString("en-US");
  }

  function getCodeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("code");
  }

  function renderNotFound() {
    detailContent.innerHTML = `<p class="status">Country not found. <a href="index.html">Go back home.</a></p>`;
  }

  function renderCountry(country) {
    const flagUrl = country.flags && country.flags.svg ? country.flags.svg : country.flag;

    const nativeName = country.nativeName || "—";
    const currencies = (country.currencies || []).map((c) => c.name).filter(Boolean).join(", ") || "—";
    const languages = (country.languages || []).map((l) => l.name).filter(Boolean).join(", ") || "—";
    const topLevelDomain = (country.topLevelDomain || []).join(", ") || "—";

    const borderCountries = (country.borders || [])
      .map((code) => allCountries.find((c) => c.alpha3Code === code))
      .filter(Boolean);

    const bordersHtml = borderCountries.length
      ? `
        <span class="detail__borders-title">Border Countries:</span>
        ${borderCountries
          .map(
            (b) =>
              `<a class="detail__border-tag" href="detail.html?code=${encodeURIComponent(b.alpha3Code)}">${b.name}</a>`
          )
          .join("")}
      `
      : `<span class="detail__borders-title">Border Countries:</span> <span class="detail__no-borders">None</span>`;

    detailContent.innerHTML = `
      <div class="detail">
        <img class="detail__flag" src="${flagUrl}" alt="Flag of ${country.name}" />
        <div class="detail__text">
          <h1 class="detail__name">${country.name}</h1>
          <div class="detail__columns">
            <ul>
              <li><strong>Native Name:</strong> ${nativeName}</li>
              <li><strong>Population:</strong> ${numberWithCommas(country.population)}</li>
              <li><strong>Region:</strong> ${country.region || "—"}</li>
              <li><strong>Sub Region:</strong> ${country.subregion || "—"}</li>
              <li><strong>Capital:</strong> ${country.capital || "—"}</li>
            </ul>
            <ul>
              <li><strong>Top Level Domain:</strong> ${topLevelDomain}</li>
              <li><strong>Currencies:</strong> ${currencies}</li>
              <li><strong>Languages:</strong> ${languages}</li>
            </ul>
          </div>
          <div class="detail__borders">
            ${bordersHtml}
          </div>
        </div>
      </div>
    `;
  }

  function init() {
    const code = getCodeFromUrl();
    if (!code) {
      renderNotFound();
      return;
    }

    const country = allCountries.find((c) => c.alpha3Code === code);
    if (!country) {
      renderNotFound();
      return;
    }

    renderCountry(country);
  }

  init();
})();
