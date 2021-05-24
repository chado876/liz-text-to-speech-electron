const dropArea = document.getElementById("drag-area"),
dragText = dropArea.querySelector("header"),
button = dropArea.querySelector("button"),
input = dropArea.querySelector("input");

const speakButton = document.getElementById("speak-btn"),
textOptionBtn = document.getElementById("textOption"),
fileOptionBtn = document.getElementById("fileOption"),
backBtn = document.getElementById("back-btn"),
headerText = document.getElementById("headerText"),
audio = document.getElementById('audio-controls');


var isFileOption = false;
var validFile = false;

let file; //this is a global variable and we'll use it inside multiple functions
 
var test = 'Hello'
async function makePostRequest(test) {
  fetch('http://127.0.0.1:5000/test')
  .then(response=>{
    return response.json();
  }).then(res => {
    console.log(res);
  });
}

async function uploadFile(file) {
  let formData = new FormData();
  formData.append('file', file);

  fetch('http://127.0.0.1:5000/upload',
  {
    body: formData,
    method:"post"
  }).then(response=>{
    return response.json();
  }).then(data => {
    console.log(data.audio);
    var audioDownloadEnpoint = "http://127.0.0.1:5000/audio/" + data.audio
    audio.style.display="flex";
    audio.setAttribute('src', audioDownloadEnpoint);
    audio.play();
  });

}

textOptionBtn.onclick = ()=>{
  headerText.innerHTML = "Type Some Text For Liz To Read!";
  document.getElementById('home').style.display='none';
  document.getElementById('text-area').style.display='flex';
  document.getElementById('file-area').style.display='none';
  document.getElementById('button-group').style.display='flex';
  isFileOption = false;
}

fileOptionBtn.onclick = ()=>{
  headerText.innerHTML = "Upload A File For Liz To Read!";
  document.getElementById('home').style.display='none';
  document.getElementById('text-area').style.display='none';
  document.getElementById('file-area').style.display='flex';
  document.getElementById('button-group').style.display='flex';
  isFileOption = true;
}

backBtn.onclick = ()=>{
  headerText.innerHTML = "Upload A File For Liz To Read!";
  audio.style.display="none";
  document.getElementById('home').style.display='flex';
  document.getElementById('text-area').style.display='none';
  document.getElementById('file-area').style.display='none';
  document.getElementById('button-group').style.display='none';
}

speakButton.onclick = ()=>{
  audio.style.display="none";
  if(isFileOption){
    if(validFile){
      uploadFile(file);
    }
  } else {
    var textEntered = document.getElementById("text-box").value;
    console.log(textEntered);
  
    let formData = new FormData();
    formData.append('text', textEntered);
  
    fetch('http://127.0.0.1:5000/text',
    {
      body: formData,
      method:"post"
    }).then(response=>{
      return response.json();
    }).then(data => {
      console.log(data.audio);
      var audioDownloadEnpoint = "http://127.0.0.1:5000/audio/" + data.audio
      audio.style.display="flex";
      audio.setAttribute('src', audioDownloadEnpoint);
      audio.play();
    });
  }
}


button.onclick = ()=>{
  input.click(); //if user click on the button then the input also clicked
}
 
input.addEventListener("change", function(){
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  dropArea.classList.add("active");
  showFile(); //calling function
});
 
 
//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});
 
//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});
 
//If user drop File on DropArea
dropArea.addEventListener("drop", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = event.dataTransfer.files[0];
  console.log(file);
  showFile(); //calling function
});
 
function showFile(){
  validFile = false;
  let fileType = file.type; //getting selected file type
  let fileName = file.name;
  let validExtensions = ["application/pdf", "text/plain"]; //adding some valid image extensions in array
  if(validExtensions.includes(fileType)){ //if user selected file is an image file
    validFile = true;
    document.getElementById('fileName').textContent = fileName;
  }else{
    alert("This is not a supported file!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}

