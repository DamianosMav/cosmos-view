<script setup>
import { onMounted, ref } from "vue";
import { useAPOD } from "../composable/updateAPOD";

const { apodDate, isLoading, updateAPOD } = useAPOD();

const shouldNextButtonBeDisabled = ref(false);
const shouldPreviousButtonBeDisabled = ref(false);

const firstAPOD = "2015-01-01";

//Updates the disabled state of Next and Previous buttons
async function updateButtonStates() {
  const today = new Date().toISOString().split("T")[0];
  shouldNextButtonBeDisabled.value = !apodDate.value || apodDate.value >= today;
  shouldPreviousButtonBeDisabled.value = apodDate.value <= firstAPOD;
}

//Loads the APOD for the previous day
async function previousImage() {
  const baseDate = new Date(apodDate.value);
  const oneDayAgo = new Date(baseDate.getTime() - 24 * 60 * 60 * 1000);
  const date = oneDayAgo.toISOString().split("T")[0];
  
  isLoading.value = true;
  await updateAPOD(date);
  isLoading.value = false;
  updateButtonStates();
}

//Loads the APOD for the next day
async function nextImage() {
  const baseDate = new Date(apodDate.value);
  const oneDayAfter = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000);
  const date = oneDayAfter.toISOString().split("T")[0];
  
  isLoading.value = true;
  await updateAPOD(date);
  isLoading.value = false;
  updateButtonStates();
}

onMounted(async () => {
  await updateButtonStates();
});
</script>

<template>
  <div :class="$style['nav-btns']">
    <button type="button" :disabled="isLoading || shouldPreviousButtonBeDisabled" @click="previousImage">
      ← Previous
    </button>
    <button type="button" :disabled="isLoading || shouldNextButtonBeDisabled" @click="nextImage">
      Next →
    </button>
  </div>
</template>

<style module>
/* Container for navigation buttons with spacing and center alignment */
.nav-btns {
  margin: 2rem 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5rem;
}

/* Styles for navigation buttons */
.nav-btns button {
  height: 3rem;
  width: 10rem;
  background-color: black;
  color: rgb(223, 223, 223);
  font-size: 1.2rem;
  border-radius: 2rem;
  border-color: blueviolet;
  box-shadow: 0 0 1rem blueviolet;
  cursor: pointer;
}

/* Hover effect for navigation buttons */
.nav-btns button:hover {
  box-shadow: 0 0 0.6rem 0.2rem blueviolet;
}

/* Disabled state styles for navigation buttons */
.nav-btns button:disabled {
  opacity: 0.6;
  background-color: #333;
  color: #888;
  border-color: gray;
  box-shadow: 0 0 1rem 1rem rgba(70, 70, 70, 0.521);
  cursor: not-allowed;
}
</style>
