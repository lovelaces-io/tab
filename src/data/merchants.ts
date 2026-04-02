export interface Merchant {
  name: string;
  category: string;
}

const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";

const MERCHANT_QUERY = `
SELECT DISTINCT ?name ?category WHERE {
  VALUES (?class ?category) {
    (wd:Q18534542 "Restaurant")
    (wd:Q1631129 "Hotel")
    (wd:Q291240 "Car Rental")
    (wd:Q27973 "Rideshare")
    (wd:Q64027599 "Gas Station")
    (wd:Q76212517 "Coffee")
    (wd:Q46970 "Airline")
    (wd:Q507619 "Retail/Supplies")
  }
  ?item wdt:P31 ?class .
  ?item rdfs:label ?name .
  FILTER(LANG(?name) = "en")
  ?item wikibase:sitelinks ?sitelinks .
  FILTER(
    (?class = wd:Q46970 && ?sitelinks > 45) ||
    (?class != wd:Q46970 && ?sitelinks > 10)
  )
}
ORDER BY ?category ?name
`;

let cachedMerchants: Merchant[] | null = null;

export async function fetchMerchants(): Promise<Merchant[]> {
  if (cachedMerchants) return cachedMerchants;

  const url = new URL(WIKIDATA_ENDPOINT);
  url.searchParams.set("query", MERCHANT_QUERY);
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/sparql-results+json" },
  });

  if (!response.ok) {
    console.warn("Wikidata fetch failed, falling back to static list");
    return FALLBACK_MERCHANTS;
  }

  const data = await response.json();
  const merchants: Merchant[] = data.results.bindings.map(
    (binding: { name: { value: string }; category: { value: string } }) => ({
      name: binding.name.value,
      category: binding.category.value,
    })
  );

  cachedMerchants = merchants;
  return merchants;
}

// Fallback for offline/error scenarios
const FALLBACK_MERCHANTS: Merchant[] = [
  { name: "American Airlines", category: "Airline" },
  { name: "Delta Air Lines", category: "Airline" },
  { name: "United Airlines", category: "Airline" },
  { name: "Southwest Airlines", category: "Airline" },
  { name: "JetBlue", category: "Airline" },
  { name: "Marriott International", category: "Hotel" },
  { name: "Hilton Hotels", category: "Hotel" },
  { name: "Hyatt", category: "Hotel" },
  { name: "Holiday Inn", category: "Hotel" },
  { name: "Best Western", category: "Hotel" },
  { name: "Uber", category: "Rideshare" },
  { name: "Lyft", category: "Rideshare" },
  { name: "Bolt", category: "Rideshare" },
  { name: "Enterprise Rent-A-Car", category: "Car Rental" },
  { name: "Hertz", category: "Car Rental" },
  { name: "Sixt", category: "Car Rental" },
  { name: "Starbucks", category: "Coffee" },
  { name: "Peet's Coffee", category: "Coffee" },
  { name: "Chipotle", category: "Restaurant" },
  { name: "Panera Bread", category: "Restaurant" },
  { name: "Olive Garden", category: "Restaurant" },
  { name: "The Capital Grille", category: "Restaurant" },
  { name: "Denny's", category: "Restaurant" },
  { name: "Shell", category: "Gas Station" },
  { name: "Chevron", category: "Gas Station" },
  { name: "BP", category: "Gas Station" },
  { name: "ExxonMobil", category: "Gas Station" },
  { name: "Best Buy", category: "Retail/Supplies" },
  { name: "Office Depot", category: "Retail/Supplies" },
  { name: "Staples", category: "Retail/Supplies" },
  { name: "Amazon", category: "Retail/Supplies" },
  { name: "Apple Store", category: "Retail/Supplies" },
  { name: "Micro Center", category: "Retail/Supplies" },
];
