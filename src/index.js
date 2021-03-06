const apiPath = 'http://127.0.0.1:5000/';
dropArea = document.getElementById("drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  input = dropArea.querySelector("input"),
  speakButton = document.getElementById("speak-btn"),
  parseTreeButton = document.getElementById("parse-btn"),
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
  articleInput = document.getElementById('article-box'),
  // parseTreeView = document.getElementById('parse-tree-view'),
  modal = document.getElementById("myModal"),
  span = document.getElementsByClassName("close")[0],
  modalContent = document.getElementById("modal-content");


var isFileOption = false;
isTextOption = false,
  isArticleOption = false,
  validFile = false;

let file; //this is a global variable and we'll use it inside multiple functions

var parseTreeDownloadPath = ''

async function uploadFile(file) {
  let formData = new FormData();
  formData.append('file', file);
  fileLoader.style.display = "flex";

  fetch(apiPath + 'upload', {
    body: formData,
    method: "post"
  }).then(handleErrors)
  .then(response => {
    return response.json();
  }).then(data => {
    fileLoader.style.display = "none";
    var audioDownloadEnpoint = apiPath + "audio/" + data.audio;
    parseTreeDownloadPath = apiPath + "tree/" + data.tree;
    setAndPlayAudio(audioDownloadEnpoint);
    showParseTreeButton(true);
  });
}

parseTreeButton.onclick = () => {
  var currentParseTree = document.getElementById('parse-tree-view');
  if(currentParseTree != null){
    modalContent.removeChild(currentParseTree);
  }
  createPdfView();
    modal.style.display = "flex";
}

function createPdfView(){
  var pdfView = document.createElement('embed');
  pdfView.id = "parse-tree-view";
  pdfView.width = "100%"
  pdfView.height = "800px";
  pdfView.setAttribute('src', parseTreeDownloadPath);
  modalContent.appendChild(pdfView);
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
textOptionBtn.onclick = () => {
  showParseTreeButton(false);
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
  showParseTreeButton(false);
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
  showParseTreeButton(false);
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
  stopAudio();
  stopLoading();
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
    }).then(handleErrors)
    .then(response => {
      return response.json();
    }).then(data => {
      textLoader.style.display = "none";
      var audioDownloadEnpoint = apiPath + "/audio/" + data.audio
      parseTreeDownloadPath = apiPath + "tree/" + data.tree;
      setAndPlayAudio(audioDownloadEnpoint)
      showParseTreeButton(true);
    });
  } else if (isArticleOption) {
    var articleLink = articleInput.value;
    let formData = new FormData();
    formData.append('articleLink', articleLink);
    articleLoader.style.display = "flex";

    fetch(apiPath + 'article', {
      body: formData,
      method: "post"
    }).then(handleErrors)
    .then(response => {
      return response.json();
    }).then(data => {
      articleLoader.style.display = "none";
      var audioDownloadEnpoint = apiPath + "/audio/" + data.audio
      parseTreeDownloadPath = apiPath + "tree/" + data.tree;
      setAndPlayAudio(audioDownloadEnpoint);
      showParseTreeButton(true);
    });
  }
}

function setAndPlayAudio(audioUrl){
  audio.style.display = "flex";
  audio.setAttribute('src', audioUrl);
  audio.play();
}

function stopAudio(){
  audio.src = ""
  parseTreeView.src = ""
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

function handleErrors(response){
    if (!response.ok) {
        stopLoading();
        window.alert(response.statusText);
        throw Error(response.statusText);
    }
    return response;
}

function stopLoading(){
  if(isTextOption){
    textLoader.style.display = "none";
  } else if (isFileOption) {
    fileLoader.style.display = "none";
  } else if (isArticleOption) {
    articleLoader.style.display = "none";
  }

}

function showParseTreeButton(show) {
  if (show == true){
    parseTreeButton.style.display="flex";
  } else {
    parseTreeButton.style.display="none";
  }
}