//globals
//I would not have the key stored here in a customer prod site, obviously
const key = '6ab021994bb96f9191c11d763e575bab';
var condition = "";
var lat = "";
var lon = "";
var url = '';

var tempF = '';
var tempC = '';


// location is obtained, then the getWeather function will be triggered
function getLocation() {
  url = 'http://api.openweathermap.org/data/2.5/weather?';
  $('#location').empty();
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  } else {
      x.innerHTML = "Not supported";
  }
}
function showPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  url = url + 'lat=' + lat + '&lon=' + lon + '&units=imperial' + '&appid=' + key;
  getWeather();
}

//weather data
function getWeather(){
  $.ajax({
    url: url,
    method: 'GET',
    datatype: 'json',
    success: function(data){
      $('#video-bg').empty();
      // let weatherStr= "602";
      let weatherStr = data.weather[0].id.toString();
      let search = weatherStr.match(/\d/)
      let weatherCode = search[0];
      var vidURL = "";
      var location = data.name;
      condition = data.weather[0].main;

      $("#location").append(location + ":");

      tempF = Math.round(data.main.temp);
      $('#temp').html(condition + " " + tempF + '°F');


      //determine background based on code
      if(weatherCode == 2){
        vidURL = "vids/storm.mp4";
        appendVid(vidURL);
      } else if (weatherCode == 3 || weatherCode == 5){
        vidURL = "vids/rain.mp4";
        appendVid(vidURL);
      } else if (weatherCode == 6){
        vidURL = "vids/snow.mp4";
        appendVid(vidURL);
      } else if (weatherCode == 7){
        vidURL = "vids/mist.mp4";
        appendVid(vidURL);
      } else if (weatherCode == 8){
        if (weatherStr == 800){
          vidURL = "vids/clear.mp4";
          appendVid(vidURL);
        } else {
          vidURL = "vids/cloudy.mp4";
          appendVid(vidURL);
        }
      }

      //video background
      function appendVid(url){
    
        var videourl = url; // set the url to your video file here
        var videocontainer = document.getElementById("video-bg"); // set the ID of the container that you want to insert the video in
        var parameter = new Date().getMilliseconds();  //  generate variable based on current date/time
        
        var video = '<video width="1102" height="720" id="intro-video" muted autoplay loop src="' + videourl + '?t=' + parameter + '"></video>'; // setup the video element
      
        $(videocontainer).append(video); // insert the video element into its container
        
        videl = $(document).find('#intro-video')[0]; // find the newly inserterd video
            
        videl.load(); // load the video (it will autoplay because we've set it as a parameter of the video)
               
      }
      $('#convert').show();
    },
    error: function(){
      $('#results').html('Ya done fucked up');
    }
  });
}

//Switch for F to C
function convertTemp() {
  if(tempC == ''){
      tempC = Math.round((tempF - 32) * 5 / 9);
      $('#temp').html(condition + " " + tempC + "°C");
  } else {
      $('#temp').html(condition + " " + tempF + "°F");
      tempC = '';
  }
}

//weather call for ctiy form submission
function getCityWeather(){
  //reset url
  url = 'http://api.openweathermap.org/data/2.5/weather?q=';
  //reset current location name
  var city = "";
  //pass form data and append to url
  var x = document.getElementById("cityForm");
  var text = "";
  for (i = 0; i < x.length ;i++) {
      city += x.elements[i].value;
  }
  $('#location').empty();
  url += city;
  url += '&units=imperial';
  url += '&appid=' + key;
  getWeather();
  //clearing input to avoid form submission clashing
  $('#cityForm')[0].reset()
}

// call for zip submission
function getZipWeather(){
  //reset url
  url = 'http://api.openweathermap.org/data/2.5/weather?zip=';
  //reset current location name
  var zip = "";
  //pass form data and append to url
  var z = document.getElementById("zipForm");
  var words = "";
  for (i = 0; i < z.length ;i++) {
      zip += z.elements[i].value;
  }
  $('#location').empty();
  url += zip;
  url += '&units=imperial';
  url += '&appid=' + key;
  getWeather();
  //clearing input to avoid form submission clashing
  $('#zipForm')[0].reset()
}

//IIFE for click events
$(function() {
  $('#convert').hide()
  $('#currentLocation').on('click', getLocation)
  $('#convert').on('click', convertTemp)
});