let completed = document.getElementById("assigned").innerText;
let inprogress = document.getElementById("inprogress").innerText;
let resultField = document.getElementById("result");
let result = Math.round((parseInt(inprogress)/parseInt(completed))*100);
resultField.innerText = `${result}% Completed`;
let progressBar = document.getElementById("meter").style.width = `${result}%`;
let taskStatus = document.getElementsByClassName("status");
for( i of taskStatus){
    if(i.innerText == "Completed")
        i.style.color = "rgb(0, 117, 0)";
    else
        i.style.color = "red";
}