// --- GLOBAL DATA STORE ---
let LA_DATA = {
    time: "",
    weather: ""
};

// --- UPDATED PREFETCH ---
async function prefetchWeather() {
    try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=34.0522&longitude=-118.2437&current=temperature_2m&temperature_unit=fahrenheit';
        const response = await fetch(url);
        const data = await response.json();
        const temp = Math.round(data.current.temperature_2m);
        
        // Pad with middle dots instead of spaces
        LA_DATA.weather = `${temp}ºF`.padStart(5, '·');
    } catch (e) {
        LA_DATA.weather = '--ºF'.padStart(5, '·');
    }
}

// --- UPDATED TIME SNAPSHOT ---
function getStaticLATime() {
    const options = {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit', 
        minute: '2-digit', 
        hourCycle: 'h12', 
        hour12: true
    };
    let timeStr = new Intl.DateTimeFormat('en-US', options).format(new Date());
    
    // Optional: If you want the space before "PM" to also be a dot:
    // return timeStr.replace(' ', '·'); 
    return timeStr;
}

// 3. The Typewriter Engine
function typeLine(element, text, options, isLastLine) {
    return new Promise((resolve) => {
        const typewriter = new Typewriter(element, options);
        typewriter
            .typeString(text)
            .pauseFor(50)
            .callFunction((state) => {
                if (!isLastLine && state?.elements?.cursor) {
                    state.elements.cursor.style.display = 'none';
                    typewriter.stop();
                }
                resolve();
            })
            .start();
    });
}

// 4. The Sequence
async function runSequence() {
    const elements = document.querySelectorAll('.typewriter-line');
    LA_DATA.time = getStaticLATime();

    const extractedData = Array.from(elements).map(el => {
        // Get the raw text (e.g., "Venice ... %%TIME%%")
        let content = el.innerHTML.trim()
            .replace(/&amp;/g, '&')
            .replace(/&nbsp;/g, '\u00A0');

        // Swap the placeholders for the real data strings
        content = content.replace('%%TIME%%', LA_DATA.time);
        content = content.replace('%%TEMP%%', LA_DATA.weather);

        el.innerHTML = ''; 
        el.style.opacity = '1'; 
        return { element: el, text: content };
    });

    for (let i = 0; i < extractedData.length; i++) {
        const item = extractedData[i];
        const isLast = (i === extractedData.length - 1);
        const cursorSymbol = isLast ? "" : "•";
        await typeLine(item.element, item.text, { delay: 25, cursor: cursorSymbol }, isLast);
    }
}

async function init() {
    document.querySelectorAll('.typewriter-line').forEach(el => el.style.opacity = '0');
    await Promise.all([prefetchWeather(), document.fonts.ready]);
    runSequence();
}

init();