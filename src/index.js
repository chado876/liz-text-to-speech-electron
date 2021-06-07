const apiPath = 'http://127.0.0.1:5000/';
dropArea = document.getElementById("drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  input = dropArea.querySelector("input"),
  speakButton = document.getElementById("speak-btn"),
  textOptionBtn = document.getElementById("textOption"),
  fileOptionBtn = document.getElementById("fileOption"),
  articleOptionBtn = document.getElementById("articleOption"),
  backBtn = document.getElementById("back-btn"),
  headerText = document.getElementById("headerText"),
  textLoader = document.getElementById("text-loader"),
  fileLoader = document.getElementById("file-loader"),
  articleLoader = document.getElementById("article-loader"),
  audio = document.getElementById('audio-controls'),
  homeArea = document.getElementById('home'),
  textArea = document.getElementById('text-area'),
  fileArea = document.getElementById('file-area'),
  articleArea = document.getElementById('article-area'),
  buttonGroup = document.getElementById('button-group'),
  textInput = document.getElementById('text-box'),
  articleInput = document.getElementById('article-box');

var isFileOption = false;
isTextOption = false,
  isArticleOption = false,
  validFile = false;

let file; //this is a global variable and we'll use it inside multiple functions

async function uploadFile(file) {
  let formData = new FormData();
  formData.append('file', file);
  fileLoader.style.display = "flex";

  fetch(apiPath + 'upload', {
    body: formData,
    method: "post"
  }).then(response => {
    return response.json();
  }).then(data => {
    var audioDownloadEnpoint = apiPath + "audio/" + data.audio
    fileLoader.style.display = "none";
    audio.style.display = "flex";
    audio.setAttribute('src', audioDownloadEnpoint);
    audio.play();
  });
}

textOptionBtn.onclick = () => {
  headerText.innerHTML = "Type Some Text For Liz To Read!";
  homeArea.style.display = 'none';
  textArea.style.display = 'flex';
  fileArea.style.display = 'none';
  buttonGroup.style.display = 'flex';
  isFileOption = false;
  isTextOption = true;
  isArticleOption = false;
}

fileOptionBtn.onclick = () => {
  headerText.innerHTML = "Upload A File For Liz To Read!";
  homeArea.style.display = 'none';
  textArea.style.display = 'none';
  fileArea.style.display = 'flex';
  buttonGroup.style.display = 'flex';
  isFileOption = true;
  isTextOption = false;
  isArticleOption = false;
}

articleOptionBtn.onclick = () => {
  headerText.innerHTML = "Copy & Paste an Article's Link for Liz to Read!";
  homeArea.style.display = 'none';
  textArea.style.display = 'none';
  fileArea.style.display = 'none';
  articleArea.style.display = 'flex';
  buttonGroup.style.display = 'flex';
  isFileOption = false;
  isTextOption = false;
  isArticleOption = true;
}

backBtn.onclick = () => {
  headerText.innerHTML = "Liz Text To Speech";
  textInput.value = "";
  audio.style.display = "none";
  homeArea.style.display = 'flex';
  textArea.style.display = 'none';
  fileArea.style.display = 'none';
  buttonGroup.style.display = 'none';
  articleArea.style.display = 'none';
}

speakButton.onclick = () => {
  audio.style.display = "none";
  if (isFileOption) {
    if (validFile) {
      uploadFile(file);
    }
  } else if (isTextOption) {
    var textEntered = textInput.value;

    let formData = new FormData();
    formData.append('text', textEntered);
    textLoader.style.display = "flex";

    fetch(apiPath + 'text', {
      body: formData,
      method: "post"
    }).then(response => {
      return response.json();
    }).then(data => {
      console.log(data.audio);
      var audioDownloadEnpoint = apiPath + "/audio/" + data.audio
      textLoader.style.display = "none";
      audio.style.display = "flex";
      audio.setAttribute('src', audioDownloadEnpoint);
      audio.play();
    });
  } else if (isArticleOption) {
    var articleLink = articleInput.value;
    let formData = new FormData();
    formData.append('articleLink', articleLink);
    articleLoader.style.display = "flex";

    fetch(apiPath + 'article', {
      body: formData,
      method: "post"
    }).then(response => {
      return response.json();
    }).then(data => {
      console.log(data.audio);
      var audioDownloadEnpoint = apiPath + "/audio/" + data.audio
      articleLoader.style.display = "none";
      audio.style.display = "flex";
      audio.setAttribute('src', audioDownloadEnpoint);
      audio.play();
    });
  }
}


button.onclick = () => {
  input.click(); //if user click on the button then the input also clicked
}

input.addEventListener("change", function () {
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  dropArea.classList.add("active");
  showFile(); //calling function
});


//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = event.dataTransfer.files[0];
  console.log(file);
  showFile(); //calling function
});

function showFile() {
  validFile = false;
  let fileType = file.type; //getting selected file type
  let fileName = file.name;
  let validExtensions = ["application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]; //adding some valid image extensions in array
  if (validExtensions.includes(fileType)) { //if user selected file is an image file
    validFile = true;
    document.getElementById('fileName').textContent = fileName;
  } else {
    alert("This is not a supported file!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}