const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector("header"),
button = dropArea.querySelector("button"),
input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions
 
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
  let fileType = file.type; //getting selected file type
  let validExtensions = ["application/pdf"]; //adding some valid image extensions in array
  if(validExtensions.includes(fileType)){ //if user selected file is an image file
    let fileReader = new FileReader(); //creating new FileReader object
    // let url = pdfToBlob(file);
    fileReader.onload = ()=>{
            let fileURL = fileReader.result; //passing user file source in fileURL variable
            let fileTag  = `<embed src="${fileURL}" width="800px" height="2100px" />`;
            dropArea.innerHTML = fileTag; //adding that created img tag inside dropArea container
    }
    // fileReader.onload = ()=>{
    //   let fileURL = fileReader.result; //passing user file source in fileURL variable
  	//   // UNCOMMENT THIS BELOW LINE. I GOT AN ERROR WHILE UPLOADING THIS POST SO I COMMENTED IT
    //   let imgTag = `<img src="${fileURL}" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
    //   dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
    // }
    fileReader.readAsDataURL(file);
  }else{
    alert("This is not a supported file!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}

function pdfToBlob(pdf){
    // base64 string
var base64str = pdf;

// decode base64 string, remove space for IE compatibility
var binary = atob(base64str.replace(/\s/g, ''));
var len = binary.length;
var buffer = new ArrayBuffer(len);
var view = new Uint8Array(buffer);
for (var i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i);
}

// create the blob object with content-type "application/pdf"               
var blob = new Blob( [view], { type: "application/pdf" });
var url = URL.createObjectURL(blob);

return url;
}