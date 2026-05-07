// 1. Decoder helper function (fixes the &amp; issue)
function decodeEntities(encodedString) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encodedString;
    return textarea.value;
}


// 1. The bulletproof helper function
function typeLine(element, text, options, isLastLine) {
    return new Promise((resolve) => {
        const typewriter = new Typewriter(element, options);

        typewriter
            .typeString(text)
            .pauseFor(100)
            .callFunction((state) => {
                if (!isLastLine) {
                    if (state && state.elements && state.elements.cursor) {
                        state.elements.cursor.style.display = 'none';
                    }
                    typewriter.stop();
                }
                resolve(); 
            })
            .start();
    });
}

// 2. The fully dynamic sequence
async function runSequence() {
    // Grabs EVERY element that has the class "typewriter-line"
    const elements = document.querySelectorAll('.typewriter-line');

    // Extract the text/HTML and fix entities
    const extractedData = Array.from(elements).map(el => {
        const text = el.innerHTML.trim()
            .replace(/&amp;/g, '&')
            .replace(/&gt;/g, '>')
            .replace(/&nbsp;/g, '\u00A0');       
        
        el.innerHTML = ''; // Wipe it instantly for the Typewriter
        return { element: el, text: text };
    });

    // Run the animation loop
    for (let i = 0; i < extractedData.length; i++) {
        const item = extractedData[i];
        const isLast = (i === extractedData.length - 1);
        const cursorSymbol = isLast ? "" : "";

        // Wait for this line to finish before moving to the next
        await typeLine(item.element, item.text, { delay: 10, cursor: cursorSymbol }, isLast);
    }
}

// Kick it off!
runSequence();

















// --- 1. LIVE LA TIME ---
function updateLATime() {
    const timeContainer = document.getElementById('la-time');
    if (!timeContainer) return;

    // Use Intl.DateTimeFormat to force the timezone to LA, regardless of where the user is
    const options = {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    
    timeContainer.textContent = new Intl.DateTimeFormat('en-US', options).format(new Date());
}

// Update the time every second
setInterval(updateLATime, 1000);
updateLATime(); // Fire immediately on load


// --- 2. LIVE LA WEATHER (Typewriter Safe & Monospace Aligned) ---

// Initialize with a perfect 5-character placeholder so the layout never jumps
let currentLATemp = '--ºF'.padStart(5, '\u00A0');

// Function 1: Fetch the data quietly in the background
async function fetchLAWeather() {
    try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=34.0522&longitude=-118.2437&current=temperature_2m&temperature_unit=fahrenheit';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        // 1. Get the rounded temperature (e.g., 40, 100, or 9)
        const tempNumber = Math.round(data.current.temperature_2m);
        
        // 2. Build the base string (e.g., "40ºF")
        const tempString = `${tempNumber}ºF`;
        
        // 3. Force it to be exactly 5 characters, padding the front with invisible non-breaking spaces
        currentLATemp = tempString.padStart(5, '\u00A0');
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        // Fallback state also perfectly padded to 5 characters
        currentLATemp = '--ºF'.padStart(5, '\u00A0');
    }
}

// Function 2: Constantly try to inject the temperature into the HTML
function updateLAWeatherDOM() {
    const weatherContainer = document.getElementById('la-weather');
    
    // If Typewriter hasn't typed the container yet, quietly return and try again next second
    if (!weatherContainer) return; 
    
    // If it DOES exist, inject the strictly formatted temperature!
    weatherContainer.textContent = currentLATemp;
}

// Kickstart the background fetch, then check again every 30 minutes
fetchLAWeather();
setInterval(fetchLAWeather, 1800000);

// Constantly ping the DOM every 1 second (matching your time function) 
// to inject the text the millisecond Typewriter makes the ID available
setInterval(updateLAWeatherDOM, 1000);