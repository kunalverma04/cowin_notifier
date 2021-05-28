


function formatDate (input) {
  var datePart = input.match(/\d+/g),
  year = datePart[0].substring(0), // get only two digits
  month = datePart[1], day = datePart[2];

  return day+'-'+month+'-'+year;
  // console.log(day+'-'+month+'-'+year);

}

function is_usZipCode(str)
{
 regexp = /^\d{6}$/ ;
  
        if (regexp.test(str))
          {
            return true;
          }
        else
          {
            alert("enter correct pincode")
            // return false;
          }
}

// function show() {
    
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//        document.getElementById("result").innerHTML = this.responseText;
//       }
//     };
//     xhttp.open("GET","data.txt",true);
//     xhttp.send();
//   }







  // Constant URL value for COWIN API
const COWINAPI_API_URL = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=394105&date=23-05-2021';




// var pincode = '400703';
//  var dateString='23-05-2021'
//console.log(pincode1);
// var pincode=pincode1;
//console.log(formatDate(date));
//var dateString=formatDate(date);
// var pincode = '401107';
// var dateString='27-05-2021'


function generateCowinApiUrl(pincode,dateString){
    return `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${dateString}`;

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

const COWIN_API_REQUEST_OPTIONS = {
        "headers": COWIN_API_REQUEST_HEADERS,
        "referrer": "https://www.cowin.gov.in/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
};

function processResponseData(responseData) {
    var centersData = responseData.centers;
    console.log(centersData)
    var mainContainer = document.getElementById("apiResponseData");
    mainContainer.innerHTML = '';
    for (var i = 0; i < centersData.length; i++) {
        for (var j = 0; j < centersData[i].sessions.length; j++) {
            var apiResponseDataDiv = document.createElement("div");
            apiResponseDataDiv.innerHTML = 'Center Name: ' + centersData[i].name + ' ' + 'Avaliable Capacity :' + centersData[i].sessions[j].available_capacity;
            mainContainer.appendChild(apiResponseDataDiv);
        }
    }
    lastAttemptDateTime()
}


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


var min1 = 1*5*1000;
var sec1 = 1000;

var dateTimer = setInterval(dateDisplayTimer, sec1);
function dateDisplayTimer() {
  var currentDate = new Date();
  var currentDateTime = currentDate.toLocaleTimeString();
  document.getElementById("currentDateTimeDisplay").innerHTML = currentDateTime;
}

function lastAttemptDateTime() {
    var currentDate = new Date();
    var currentDateTime = currentDate.toLocaleTimeString();
    document.getElementById("lastAttemptDateTimeDisplay").innerHTML = currentDateTime;
  }


var apiHitTimer;
var form = document.getElementById('form');

form.addEventListener('submit',function(event){

event.preventDefault();

 var pincode1 = document.getElementById('pincode').value;
 var email = document.getElementById('email').value;
 var date = document.getElementById('date').value;

is_usZipCode(pincode1);

console.log(email.toString());
console.log(formatDate(date).toString());
console.log(pincode1.toString());

var COWIN_API_PIN_CODE_DATE_URL = generateCowinApiUrl(pincode1.toString(),formatDate(date).toString());
apiHitTimer = setInterval(fetchCowinResponse, min1,COWIN_API_PIN_CODE_DATE_URL,COWIN_API_REQUEST_OPTIONS);
   
});

function stopCowinNotifier() {
    clearInterval(apiHitTimer);
  }

