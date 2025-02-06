async function loadFont() {
    // Fetch the font file and convert it to Base64
    const response = await fetch("KGPrimaryDots.ttf");
    if (!response.ok) {
        console.error("Failed to load font");
        return null;
    }
    const fontBuffer = await response.arrayBuffer();
    
    return arrayBufferToBase64(fontBuffer);
}

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

async function exportPNG() {
    const fontData = await loadFont();
    if (!fontData) {
        alert("Failed to load font. Ensure the TTF file is available.");
        return;
    }

    // Register the font in CSS
    const fontFace = new FontFace('KGPrimaryDots', `url(data:font/ttf;base64,${fontData})`);
    await fontFace.load();
    document.fonts.add(fontFace);  // Add to document

    // Create a container for the text
    let textContainer = document.createElement("div");
    textContainer.style.fontFamily = "KGPrimaryDots, sans-serif";  // Apply the custom font
    textContainer.style.fontSize = "40px";
    textContainer.style.whiteSpace = "pre-wrap";
    textContainer.style.lineHeight = "50px";
    
    // Get user input and format text
    let text = document.getElementById("inputText").value.split("\n");
    text.forEach(line => {
        let lineDiv = document.createElement("div");
        lineDiv.textContent = line;
        textContainer.appendChild(lineDiv);
    });

    // Append to the body temporarily to capture it with html2canvas
    document.body.appendChild(textContainer);

    // Use html2canvas to render the text as an image
    html2canvas(textContainer).then(canvas => {
        // Remove the temporary container
        document.body.removeChild(textContainer);

        // Create a PNG from the canvas and download it
        let pngUrl = canvas.toDataURL("image/png");
        let link = document.createElement("a");
        link.href = pngUrl;
        link.download = "handwriting_practice.png";
        link.click();
    });
}

function updatePreview() {
    let inputText = document.getElementById("inputText").value;
    let preview = document.getElementById("preview");
    preview.innerHTML = "";

    inputText.split("\n").forEach(line => {
        let lineContainer = document.createElement("div");
        lineContainer.classList.add("dashed-text");
        lineContainer.textContent = line;
        preview.appendChild(lineContainer);
    });
}
