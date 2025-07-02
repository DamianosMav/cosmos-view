<script setup>
import { onMounted } from "vue";
import { useAPOD } from "../composable/updateAPOD";

// Destructure needed reactive references and methods from the composable
const { apodTitle, apodExplanation, apodURL, apodHDURL, formattedDate, updateAPOD } = useAPOD();

// Function to open the HD image or fallback image in a new tab
function downloadImage() {
  const imgURL = apodHDURL.value || apodURL.value;
  if (!imgURL) {
    alert("No image URL found to download");
    return;
  }
  window.open(imgURL, "_blank");
}

// Fetch the Astronomy Picture of the Day when component mounts
onMounted(async () => {
  try {
    await updateAPOD();
  } catch (error) {
    alert("Could not load APOD. Try again later.");
  }
});
</script>

<template>
  <div :class="$style.apod">
    <img :src="apodURL" alt="astronomy picture of the day" @click="downloadImage" />
    <h3> {{ formattedDate }} </h3>
    <h2><b>Title:</b> {{ apodTitle }} </h2>
    <p><b>Image explanation:</b> {{ apodExplanation }}</p>
  </div>
</template>

<style module>
/* Custom font face */
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/FallingSky.woff2') format('woff2'),
       url('/fonts/FallingSky.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* Container styles for the APOD component */
.apod {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  gap: 0.5rem;
  color: rgb(221, 221, 221);
  font-family: 'MyFont', Arial, Helvetica, sans-serif;
  font-size: 1.2rem;
}

.apod h2,
.apod h3,
.apod h4,
.apod p {
  margin: 0;
}

/* Add horizontal margin to paragraphs */
.apod p {
  margin: 0 2rem;
}

/* Styling for the image */
.apod img {
  height: 40rem;
  width: auto;
  object-fit: contain;
  border-radius: 2rem;
  border: 2px solid blueviolet;
  box-shadow: 0 0 1rem blueviolet;
}

/* Hover effect for image */
.apod img:hover {
  box-shadow: 0 0 4rem blueviolet;
  cursor: pointer;
}

/* Responsive image styles for small screens */
@media (max-width: 600px) {
  .apod img {
    height: auto;
    width: 100%;
    object-fit: contain;
    border-radius: 2rem;
    border: 2px solid blueviolet;
    box-shadow: 0 0 1rem blueviolet;
  }
}
</style>
