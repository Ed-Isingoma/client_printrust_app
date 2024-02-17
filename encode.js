const fs = require('fs');
const path = require('path')

const bigButton = document.querySelector('.upload-button')
let firstInput = document.querySelector('#file-input')

function addfile() {
    firstInput.click()
    nextInput = document.createElement('input')
    nextInput.addEventListener('change', (ev) => {inputChanged(ev)})
    document.querySelector('.file-names').insertAdjacentElement("afterend", nextInput)
    nextInput.style.display = 'none'
    nextInput.type = "file"
}

function inputChanged(ev) {
    const uploadedFile = ev.target.files[0];
    const fileName = uploadedFile.name
    const newchild = document.createElement("li")
    newchild.innerHTML = fileName
    document.querySelector('.file-names ul').appendChild(newchild)
    if (document.querySelector('.file-names').style.display != "block") {
        changeSpecs()
    }
}

function changeSpecs() {
    document.querySelector('.file-names').style.display = "block"
    document.querySelector(".send").classList.add("add")
    document.querySelector(".send").classList.remove("send")

}
firstInput.addEventListener('change', (ev) => {inputChanged(ev)})


function encodeFolder(folderPath) {
  const filesData = {}
  const files = fs.readdirSync(folderPath)
  if (files.length > 24) {
    throw new Error('Too many files in the folder. Maximum allowed is 24.')
  }
  let totalSize = 0
  for (const file of files) {
    const stats = fs.statSync(path.join(folderPath, file))
    totalSize += stats.size
  }
  if (totalSize > 20 * 1024 * 1024) throw new Error('Combined file size exceeds max limit (20MB).')
  const wantedFilePath = path.join(folderPath, new Date().toString().substring(4, 25).replace(/\s/g, '')+'.printrust')
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const base64Data = fs.readFileSync(filePath, 'base64')
    const storedName = 'file' + file
    filesData[storedName] = base64Data
  });
  fs.appendFileSync(wantedFilePath, JSON.stringify(filesData))
}