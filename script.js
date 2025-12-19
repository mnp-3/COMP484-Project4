/*--------- global variables ---------*/
let map;
let currentLocation = 0;
let guessMarker = null;
let score = 0;
let rectangle = null;

/*--------- guessing game locations ---------*/
const locations = [
  {name: "CSUN University Library", lat: 34.240029876539516, lng: -118.52931552874976},
  {name: "CSUN Bookstore", lat: 34.23766697324876, lng: -118.52821857656366},
  {name: "Sierra Tower", lat: 34.23897510917053, lng: -118.530197052841},
  {name: "Eucalyptus Hall", lat: 34.23866810741818, lng:  -118.52812867449526},
  {name: "Sequoia Hall", lat: 34.24059906774468, lng: -118.52822454578279} //class assigned location
]
const distanceAllowed = 40; //max distance allowed from guess

/*--------- CSUN Campus Map ---------*/
function initMap() { 
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.239168, lng: -118.528595 },
    zoom: 17,
    mapType: 'ROADMAP',
    //map functionalities off
    gestureHandling: "none", 
    zoomControl: false,
    disableDefaultUI: true,
    draggable: false,
    scrollwheel: false,
    //remove building names & street names
    styles: [ 
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off"}]
      }
    ]
  });

  //show user prompt
  userPrompt(); 

  // Listen for double click on the map
  map.addListener("dblclick", function (event) {
    checkGuess(event.latLng);
  });

}
//run initMap
window.onload = initMap;

/*--------- guessing game questions ---------*/
function userPrompt() {
  const instructionsEl = document.getElementById("instructions");
  const feedbackEl = document.getElementById("feedback");
  
  feedbackEl.textContent = ""; //clear previous feedback
    //guess if there are more locations
    if (currentLocation < locations.length) {
      instructionsEl.textContent =
        `Double-click where you think ${locations[currentLocation].name} is.`;
        instructionsEl.classList.remove("game-over");
    } else { //game over
      instructionsEl.textContent =
        `Game Over! You got ${score} out of ${locations.length} correct.`;
        instructionsEl.classList.add("game-over");
    }

}

/*--------- check users answer ---------*/
function checkGuess(clickedLatLng) {
  //stop when there are no more locations left to guess
  if (currentLocation >= locations.length) return;
  //get the current target location
  const target = locations[currentLocation];
  //check if the location is in the correct area
  const correct = correctBounds(clickedLatLng, target);
  //show correct area, feedback and user guess
  showAnswer(target, correct);
  showFeedback(correct);
  showGuessMarker(clickedLatLng);
  //increase score if correct
  if (correct) score++;
  //move onto next location
  setTimeout(() => {
    currentLocation++;
    userPrompt();
  }, 1000);    
}

/*--------- users guess marked---------*/
function showGuessMarker(latLng) {
  guessMarker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: "Your Guess"
  });
}

/*--------- show if correct or incorrect ---------*/
function showFeedback(isCorrect) {
  const feedbackEl = document.getElementById("feedback");
  //display message
  if (isCorrect) {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "white";
  } else {
    feedbackEl.textContent = "Incorrect!";
    feedbackEl.style.color = "white";
  }
}

/*--------- draw rectangle around location ---------*/
function showAnswer(location, correct) {
  //define rectangle around the correct location
  const bounds = {
    north: location.lat + 0.00025,
    south: location.lat - 0.00025,
    east:  location.lng + 0.00025,
    west:  location.lng - 0.00025
  };
  //draw rectangle around the correct area
  rectangle = new google.maps.Rectangle({
    map: map,
    //green if guess is correct or red if the guess what not correct
    strokeColor: correct ? "#00C853" : "#D50000", 
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: correct ? "#00C853" : "#D50000",
    fillOpacity: 0.35,
    bounds: bounds
  });
}

/*--------- check if guess is in bounds ---------*/
function correctBounds(latLng, location) {
  //bounding box around the target location
  const bounds = new google.maps.LatLngBounds(
    {lat: location.lat - 0.0005, lng: location.lng - 0.0005},
    {lat: location.lat + 0.0005, lng: location.lng + 0.0005}
  );
  //return true if the guess was inside
  return bounds.contains(latLng);
}

/*--------- restart game ---------*/
document.getElementById("reset").addEventListener("click", () => {
  window.location.reload();
});