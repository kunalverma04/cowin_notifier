
//Format date received as input to dd-MM-YYYY format
function formatDate (input) {
  var datePart = input.match(/\d+/g),
  year = datePart[0].substring(0), // get only two digits
  month = datePart[1], day = datePart[2];
  return day+'-'+month+'-'+year;
  // console.log(day+'-'+month+'-'+year);
}

//Validate pincode received via input as 6 digits
function isValidZipCode(zipcode){
  pincodeRegExp = /^\d{6}$/ ;
  if (pincodeRegExp.test(zipcode)) {
         return true;
  }
  else {
    alert("enter correct pincode")
      // return false;
   }
}


// Object with COWIN authorization headers and Content-Type header
const COWIN_API_REQUEST_HEADERS = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
  "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
  "sec-ch-ua-mobile": "?0",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "cross-site"
};

// Object with COWIN request options
const COWIN_API_REQUEST_OPTIONS = {
        "headers": COWIN_API_REQUEST_HEADERS,
        "referrer": "https://www.cowin.gov.in/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
};

//Generate Cowin Api Pincode url using pincode and date
function generateCowinApiUrl(pincode,dateString){
  return `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${dateString}`;

}


var lastAttemptDiv = document.getElementById("lastAttemptDateTimeDisplay");
//Display current date and time when cowin api request was made 
function lastAttemptDateTime() {
  var currentDate = new Date();
  var currentDateTime = currentDate.toLocaleTimeString();
  lastAttemptDiv.innerHTML = currentDateTime;
}

var apiResponseMainContainer = document.getElementById("apiResponseData");
// Process vaccine availiabilty data received from cowin and display it
function processResponseData(responseData) {
  var apiResponseMainContainer = document.getElementById("apiResponseData");
  apiResponseMainContainer.innerHTML = '';
  var centersData = responseData.centers;
  console.log(centersData)
  if (centersData == null || centersData.length == 0 ){
    apiResponseMainContainer.innerHTML = 'Availibility Status Not found ,Trying again in 10 seconds.. ';
    //mainContainer.appendChild(apiResponseDataDiv);
  }
  else {
  for (var i = 0; i < centersData.length; i++) {
    for (var j = 0; j < centersData[i].sessions.length; j++) {
      var apiResponseDataDiv = document.createElement("div");
      var centerName = centersData[i].name;
      var feeType = centersData[i].fee_type;
      var vaccineCount =  centersData[i].sessions[j].available_capacity;
      var dose1Count =  centersData[i].sessions[j].available_capacity_dose1;
      var dose2Count =  centersData[i].sessions[j].available_capacity_dose2;
      var minAge =  centersData[i].sessions[j].min_age_limit;
      var vaccineName =  centersData[i].sessions[j].vaccine;
      apiResponseDataDiv.innerHTML = 'Vaccine Name :' + vaccineName +  ' Center Name: ' + centerName + ' ' + 'Minimun Age Allowed :' + minAge + ' Center Fees : ' + feeType + ' Total Avaliable Capacity :' + vaccineCount + ' {Dose1: ' + dose1Count + ' ,Dose2: ' + dose2Count + '}' ;
      apiResponseMainContainer.appendChild(apiResponseDataDiv);
     }
    }

  }
  
  lastAttemptDateTime()
}

//Hit the Cowin Api to fetch response in json format
async function fetchCowinResponse(url='',options={}){
  // console.log(url);
   await fetch(url, options)
   .then(response => response.json())
   .then(function (responseData) {
       processResponseData(responseData);
     })
     .catch(function (err) {
       console.log(err);
     }); 
}

//Timer variable to Start or stop cowin notifier
var apiHitTimer;

//Fetch input from html form
var form = document.getElementById('form');
var inputDataDiv = document.getElementById('inputData');

form.addEventListener('submit',function(event){
  event.preventDefault();
  //fetch input values from form
  var pincode = document.getElementById('pincode').value;
  var email = document.getElementById('email').value;
  var date = document.getElementById('date').value;

  //validate pincode 
  isValidZipCode(pincode);

  console.log(email.toString());
  console.log(formatDate(date).toString());
  console.log(pincode.toString());

  //Generate Api url to fetch vaccine avaliablity status 
  var COWIN_API_PIN_CODE_DATE_URL = generateCowinApiUrl(pincode.toString(),formatDate(date).toString());
  //Schedule to check vaccine status every 10 seconds
  clearInterval(apiHitTimer);
  apiResponseMainContainer.textContent ='';
  inputDataDiv.innerHTML ='Scheduled Cowin Notifier to check Vaccine Availibity for pincode :' + pincode + ' and date :' + date.toString();
  apiHitTimer = setInterval(fetchCowinResponse, 10*1000,COWIN_API_PIN_CODE_DATE_URL,COWIN_API_REQUEST_OPTIONS);

});

//Stop Vaccine Notifier scheduler
function stopCowinNotifier(){
  clearInterval(apiHitTimer);
  inputDataDiv.textContent ='';
  lastAttemptDiv.textContent ='NA';
  apiResponseMainContainer.textContent ='Cowin Notifier Stopped';
}

// Show current date & time 
var currentDateTimer = setInterval(dateDisplayTimer, 1000);
function dateDisplayTimer() {
  var currentDate = new Date();
  var currentDateTime = currentDate.toLocaleTimeString();
  document.getElementById("currentDateTimeDisplay").innerHTML = currentDateTime;
}
