// Load API key and base URL from environment variables
const apiKey = import.meta.env.VITE_API_KEY;
const baseURL = import.meta.env.VITE_API_URL;

/**
 * Fetch Astronomy Picture of the Day (APOD) data for a specific date from NASA API.
 * @param {string} inputDate - Date in YYYY-MM-DD format to fetch the APOD for.
 * @returns {Promise<object>} APOD data including date, explanation, urls, and title.
 */
export default async function fetchAPOD(inputDate) {
  // Construct the full API URL including the date query if provided
  const apiURL = `${baseURL}?api_key=${apiKey}${inputDate ? `&date=${inputDate}` : ""}`;

  // Initialize variables to hold APOD data
  let date = "";
  let explanation = "";
  let url = "";
  let hdurl = "";
  let title = "";

  try {
    // Fetch data from NASA APOD API
    const res = await fetch(apiURL);

    // Handle HTTP errors
    if (!res.ok) {
      alert(`Response Status: ${res.status}`);

      // Use default fallback data if API call fails
      const defaultDataVars = defaultData();
      date = defaultDataVars.date;
      explanation = defaultDataVars.explanation;
      url = defaultDataVars.url;
      title = defaultDataVars.title;

      return { date, explanation, url, hdurl, title };
    }

    // Log inputDate for debugging (optional)
    console.log(inputDate);

    // Parse the JSON response
    const jsonData = await res.json();

    // Extract required fields from response
    date = jsonData.date;
    explanation = jsonData.explanation;
    url = jsonData.url;
    hdurl = jsonData.hdurl;
    title = jsonData.title;

    return { date, explanation, url, hdurl, title };

  } catch (error) {
    // Throw an error if fetch or parsing fails
    throw new Error(`Error: ${error}`);
  }
}

/**
 * Provides fallback APOD data when API call fails.
 * @returns {object} Default APOD data.
 */
function defaultData() {
  const date = new Date("1 1, 2015");
  const explanation =
    "The plane of our Milky Way Galaxy runs through this complex and beautiful skyscape. At the northwestern edge of the constellation Vela (the Sails) the telescopic frame is over 10 degrees wide, centered on the brightest glowing filaments of the Vela Supernova Remnant, an expanding debris cloud from the death explosion of a massive star. Light from the supernova explosion that created the Vela remnant reached Earth about 11,000 years ago. In addition to the shocked filaments of glowing gas, the cosmic catastrophe also left behind an incredibly dense, rotating stellar core, the Vela Pulsar. Some 800 light-years distant, the Vela remnant is likely embedded in a larger and older supernova remnant, the Gum Nebula";
  const url = "https://apod.nasa.gov/apod/image/1501/VelaSNR-3_bigCedic.jpg";
  const hdurl = "https://apod.nasa.gov/apod/image/1501/VelaSNR-3_bigCedic.jpg"; // fixed typo from hrurl to hdurl
  const title = "Vela Supernova Remnant";
  return { date, explanation, url, hdurl, title };
}
