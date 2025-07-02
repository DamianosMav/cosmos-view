import { ref, computed } from "vue";
import fetchAPOD from "../nasa-api";

// Reactive references to hold APOD data
const apodDate = ref();
const apodTitle = ref();
const apodExplanation = ref();
const apodURL = ref();
const apodHDURL = ref();

// Tracks the last date for which data was fetched to avoid duplicate calls
const lastFetchedDate = ref(null);

// Loading state to indicate if data fetching is in progress
const isLoading = ref(false);

export function useAPOD() {
  // Computed property to format the APOD date for display, example (1 July 2025)
  const formattedDate = computed(() =>
    apodDate.value
      ? new Date(apodDate.value).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Date not available"
  );

  /**
   * Fetches and updates APOD data for the given date.
   * Avoids re-fetching if the requested date is the same as the last fetched date.
   * @param {string} inputDate - The date to fetch APOD data for (format: YYYY-MM-DD).
   */
  async function updateAPOD(inputDate = new Date().toISOString().split("T")[0]) {
    // Check if data for requested date is already fetched
    if ( new Date(inputDate).toDateString() === new Date(lastFetchedDate.value).toDateString()) return;

    try {
      isLoading.value = true;
      const currentDate = new Date().toISOString().split("T")[0];
      // Fetch APOD data from the API
      const data = await fetchAPOD(inputDate || currentDate);

      // Update reactive variables with new data
      apodDate.value = data.date;
      apodTitle.value = data.title;
      apodExplanation.value = data.explanation;
      apodURL.value = data.url;
      apodHDURL.value = data.hdurl;

      lastFetchedDate.value = inputDate; // Remember the last fetched date
    } catch (error) {
      console.error("Failed to fetch APOD:", error);
    } finally {
      isLoading.value = false;
    }
  }

  // Expose reactive data and functions to components
  return {
    apodDate,
    apodTitle,
    apodExplanation,
    apodURL,
    apodHDURL,
    formattedDate,
    updateAPOD,
    isLoading,
  };
}
