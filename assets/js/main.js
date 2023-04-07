const pollutionScale = [
  {
    scale: [0, 50],
    quality: "Good",
    src: "happy",
    background: "linear-gradient(to right, #154734, #6EC531)",
  },
  {
    scale: [51, 100],
    quality: "Moderate",
    src: "thinking",
    background: "linear-gradient(to right, #ECEBBD, #FFCB05)",
  },
  {
    scale: [101, 150],
    quality: "Unhealthy",
    src: "unhealthy",
    background: "linear-gradient(to right, #FFA400, #E44D26)",
  },
  {
    scale: [151, 200],
    quality: "Bad",
    src: "bad",
    background: "linear-gradient(to right, #ef473a, #cb2d3e)",
  },
  {
    scale: [201, 300],
    quality: "Very bad",
    src: "mask",
    background: "linear-gradient(to right, #8E54E9, #4776E6)",
  },
  {
    scale: [301, 500],
    quality: "Terrible",
    src: "terrible",
    background: "linear-gradient(to right, #7a2828, #a73737)",
  },
];

const loader = document.querySelector(".loader");
const emojiLogo = document.querySelector(".emoji");
const userInformation = document.querySelector(".user-information");

async function getPollutionData(){
  try {
    const response = await fetch("https://api.airvisual.com/v2/nearest_city?key=bf605e1a-1c3d-43d6-9770-33d0f6f91d69").catch(error => { //attend le résultat de l'api
      throw new Error(error); 
    })
    if(!response.ok){
      throw new Error(`Error ${response.status}, ${response.statusText}`) 
    }
    else {
      const responseData = await response.json();
      const aqi = responseData.data.current.pollution.aqius;
      
      const sortedData = {
        city: responseData.data.city,
        aqi,
        ...pollutionScale.find(obj => aqi >= obj.scale[0] && aqi <= obj.scale[1])
      }
      populateUI(sortedData)
    }
  }
  catch(error) {
    loader.classList.remove("active");
    emojiLogo.src = "./assets/icons/browser.svg";
    userInformation.textContent = error.message;
  }
}
getPollutionData();


const cityName = document.querySelector(".city-name");
const pollutionInfo = document.querySelector(".pollution-info");
const pollutionValue = document.querySelector(".pollution-value");
const backgroundLayer = document.querySelector(".background-layer");

function populateUI(data){
  console.log(data);
  emojiLogo.src = `assets/icons/${data.src}.svg`;
  userInformation.textContent = `Voici la situation à ${data.city}.`;
  cityName.textContent = data.city;
  pollutionInfo.textContent = `${data.quality}`;
  pollutionValue.textContent = `${data.aqi}`;
  backgroundLayer.style.backgroundImage = data.background;
  loader.classList.remove("active");
  
  pointerPlacement(data.aqi)
}

const locationPointer = document.querySelector(".location-pointer");

function pointerPlacement(AQIValue){
  const parentWidth = locationPointer.parentElement.scrollWidth;
  locationPointer.style.transform = `translateX(${(AQIValue / 500) * parentWidth}px) rotate(180deg)`
}