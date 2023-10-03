// Function to load external HTML content and include it in a specified element
function includeHTML(filename, targetElementId) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filename, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById(targetElementId).innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}

// Include the header and footer
//includeHTML("header.html", "header");
includeHTML("footer.html", "footer");
