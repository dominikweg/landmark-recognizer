var geocoder;
var map;
var address = null;
var marker;

var upload_err_msg = "Something went wrong, please try uploading the file again";

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResult')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function openForm(){
  document.getElementById("popupForm").style.display = "block";
  document.getElementById("mask").style.display = "flex"
}

function closeForm(){
  document.getElementById("popupForm").style.display = "none";
  document.getElementById("mask").style.display = "none";
}


function showFileName( event ) {
    var input = event.srcElement;
    var fileName = input.files[0].name;
    infoArea.textContent = 'Your uploaded file: ' + fileName;
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
  zoom: 5,
  center: {lat: -34.397, lng: 150.644}
  });
  geocoder = new google.maps.Geocoder();
  if ((address != null) && (address != "Unknown")){
    codeAddress(geocoder, map, address);
  }
  }

function codeAddress(geocoder, map, address) {
  geocoder.geocode({'address': address}, (results, status) => {
  if (status === 'OK') {
    map.setCenter(results[0].geometry.location);
    marker = new google.maps.Marker({
      map: map,
      position: results[0].geometry.location
    });
  } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
  });
}

var input = document.getElementById( 'upload' );
var infoArea = document.getElementById( 'upload-label' );

input.addEventListener( 'change', showFileName );

const myForm = document.getElementById("myForm");
const inpImg  = document.getElementById("upload");


myForm.addEventListener("submit", e =>{
  e.preventDefault();
  document.getElementById("result").style.visibility = "visible"
  const endpoint = "/upload";
  formData = new FormData();
  formData.append('user-img', inpImg.files[0]);

  fetch(endpoint, {
    method: "post",
    body: formData
  }).then(
    response => response.json()
  ).then(
      (data) => {
          document.getElementById("result").style.fontSize = "15px"
          document.getElementById("result").style.fontWeight = "Bold"
          document.getElementById("result").innerHTML = data["result"]
          document.getElementById("report-container").style.visibility = "visible"
          if(data['result'] != upload_err_msg){
            address = data["result"];
          }
          initMap();
      }
  );
 
});

var reportForm = document.getElementById("reportForm");
reportForm.addEventListener("submit", e=>{
  e.preventDefault()
  const endpoint = "/report"
  reportData = new FormData();
  reportData.append('report-img', inpImg.files[0])

  if(reportForm.elements["class"].value.length == 0){
    reportForm.elements["class"].value = "Unknown";
  }

  reportData.append('class-name', reportForm.elements["class"].value);

  fetch(endpoint, {
    method: "post",
    body: reportData
  });
});