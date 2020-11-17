const imgContainer = document.querySelector("#canvas_container")

const state = {
  currentDisplay: null,
  isImageLoading: false,
  imageSrc: ``,
  processedImgSrc: ``,
  imageContainer: imgContainer,
  isProcessWaiting: false,
}


var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var accordion_content = this.nextElementSibling;
    if (accordion_content.style.display === "block") {
      accordion_content.style.display = "none";
    } else {
      accordion_content.style.display = "block";
    }
  });
}

const canvas_wrapper = document.querySelector("#canvas_wrapper");
const drag_space = document.querySelector("#drag_space");
const dashed = document.querySelector(".dashed");

drag_space.addEventListener('drop', async (event) => {
  event.preventDefault();
  event.stopPropagation();

  ipcRenderer.send('openFile', event.dataTransfer.files[0].path)

  dashed.classList.remove('active');
});

drag_space.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

drag_space.addEventListener('dragenter', (event) => {
  console.log('File is in the Drop Space');
  dashed.classList.add('active');
});

drag_space.addEventListener('dragleave', (event) => {
  console.log('File has left the Drop Space');
  dashed.classList.remove('active');
});


function updateImgView() {
  state.imageContainer.innerHTML = `
   <img id="old_image" ${state.currentDisplay ? `class="small"` : ""} src="${state.imageSrc}" />
    ${state.currentDisplay ? `<img id="new_image" src="${state.processedImgSrc}" />` : ""}
    ${state.isImageLoading ? `
    <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>` : ""}
  `
}

document.querySelector("#rotate").addEventListener('click', () => {
  ipcRenderer.send('rotate', { angle: 45 })
  state.isProcessWaiting = true
  updateImgView()
})