import { MdFile } from './ream/ream.js';

let buttons = document.querySelectorAll(".update-button")

buttons.forEach(button => button.addEventListener('click', event => {
  const id = event.target.id;
  const input = document.getElementById(`${id}-input`).value;
  let mdFile = new MdFile(input);
  let output;
  try {
    output = mdFile.toCSV();
  } catch (error) {
    output = error;
  }
  document.getElementById(`${id}-output`).innerHTML = output;
}))
