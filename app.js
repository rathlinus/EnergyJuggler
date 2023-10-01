let Speichergröße = 10000
let fossileSpeed = 3
let netzAbweichung = 0 //-0.4 (Schwer), 0 (Normal), 1 (Leicht)

// nicht anfassen
let isBlackout = false;
let blackoutProtection = false;
let Fossile = 0
let Speicher = 0
let Steps = 656
let erneuerbare;
let speicherVoll;
let speicherLeer;
let netzFrequenz;
let speicherValue;
let speicherPlus;
let speicherMinus;

const sensorValues = {
    Sensor1: 0,
    Sensor2: 0,
    Sensor3: 0,
    Sensor4: 0,
    Sensor5: 0
};



function checkBlackout() {
    if (netzFrequenz < 49.1 - netzAbweichung || netzFrequenz > 51.5 + netzAbweichung ) {
        if (blackoutProtection) return;
        isBlackout = true;
        document.getElementById('blackoutScreen').style.display = 'block';

        document.getElementById('blackoutImage').src = "img/blackout.png";

        document.body.style.backgroundColor = "#000000";
        document.getElementById('bar-container').style.opacity = '0.2';
        document.getElementById('chart').style.opacity = '0.2';

    }
}

function restartSystem() {
    isBlackout = false;
    document.getElementById('blackoutScreen').style.display = 'none';

    document.getElementById('bar-container').style.opacity = '1';
    document.getElementById('chart').style.opacity = '1';
    document.getElementById('blackoutImage').src = "img/blackout2.png";

    Fossile = sensorValues.Sensor2
    Speicher = 0
    netzFrequenz = 50;
    

    blackoutProtection = true;

    setTimeout(() => {
        blackoutProtection = false;
    }, 5000);
}


function mapNumber(value, fromLow, fromHigh, toLow, toHigh) {
    if (value < fromLow || value > fromHigh) {
        return 0;
    }
    return (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow;
}

function mapNumber2 (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}



document.addEventListener('DOMContentLoaded', (event) => {


    

    const output = document.getElementById('output');
    const bars = {
        Sensor1: document.getElementById('bar1'),
        Sensor1b: document.getElementById('bar1b'),
        Sensor2: document.getElementById('bar2'),
        Sensor2b: document.getElementById('bar2b'),
        Sensor3: document.getElementById('bar3a'),
        Sensor3c: document.getElementById('bar3'),
        Sensor3b: document.getElementById('bar3b'),
        Sensor3b1: document.getElementById('bar3b1'),
        Sensor3b2: document.getElementById('bar3b2'),
        Sensor4: document.getElementById('bar4'),
        Sensor5: document.getElementById('bar5'),
    };

    function updateBackgroundColor() {
        let bgColor = ''; // default background color
        if (netzFrequenz < (49.3 - netzAbweichung) || netzFrequenz > ((51.1 + netzAbweichung) + netzAbweichung)) {
            bgColor = '#612727';
        } else if (netzFrequenz < (49.6 - netzAbweichung) || netzFrequenz > (50.6 + netzAbweichung)) {
            bgColor = '#615927';
        }
        document.body.style.backgroundColor = bgColor;
    }

    const ctx = document.getElementById('chart').getContext('2d');
    const chartData = {
        labels: Array(50).fill(""),
        datasets: [{
            label: 'Netzfrequenz',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            data: Array(50).fill(0),
        }]
    };

    const myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            maintainAspectRatio: false,
            animation: false, // disable animations
            bezierCurve: true,
            scales: {
                y: {ticks: {
                    color: 'white' // x-axis labels color
                },
                    min: (48.6 - netzAbweichung), // set min value for y-axis
                    max: (52 + netzAbweichung), // set max value for y-axis
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Legend labels color
                    }
                },
                annotation: {
                    annotations: [{
                            type: 'box',
                            yMin: (48 - netzAbweichung),
                            yMax: (49.1 - netzAbweichung),
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // rot
                        },
                        {
                            type: 'box',
                            yMin: (49.1 - netzAbweichung),
                            yMax: (49.3 - netzAbweichung),
                            backgroundColor: 'rgba(255, 0, 0, 0.5)', // rot
                        },
                        {
                            type: 'box',
                            yMin: (51.1 + netzAbweichung),
                            yMax: (51.5 + netzAbweichung),
                            backgroundColor: 'rgba(255, 0, 0, 0.5)', // rot
                        },
                        {
                            type: 'box',
                            yMin: (49.3 - netzAbweichung),
                            yMax: (49.6 - netzAbweichung),
                            backgroundColor: 'rgba(255, 255, 0, 0.5)', // gelb
                        },
                        {
                            type: 'box',
                            yMin: (50.6 + netzAbweichung),
                            yMax: (51.1 + netzAbweichung),
                            backgroundColor: 'rgba(255, 255, 0, 0.5)', // gelb
                        },
                        {
                            type: 'box',
                            yMin: (49.6 - netzAbweichung),
                            yMax: (50.6 + netzAbweichung),
                            backgroundColor: 'rgba(0, 255, 0, 0.5)', // grün
                        },
                        {
                            type: 'box',
                            yMin: (51.5 + netzAbweichung),
                            yMax: (52 + netzAbweichung),
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // rot
                        },
                    ],
                },
            },
        }
    });

    function updateChart() {
        netzFrequenz = ((speicherValue * speicherLeer * speicherVoll) / 60 + erneuerbare / 550 + Fossile / 400 + 48.36);
        chartData.datasets[0].data.shift();
        chartData.datasets[0].data.push(netzFrequenz);
        myChart.update();
        updateBackgroundColor()
    }

    // Function to set bar for Sensor5
    function setBar5(value) {
        if (isBlackout) return;
        checkBlackout();

        speicherPlus = Math.min(Math.max(mapNumber2(value, (Steps / 2), Steps, 0, 100), 0), 100);
        speicherMinus = mapNumber(value, 0, (Steps / 2), 100, 0)

        if (speicherMinus != 0) {
            Speicher = Math.max(Speicher - speicherMinus, -Speichergröße);
            speicherValue = speicherMinus / 2;
        } else {
            // Calculate the addition value
            const addition = (speicherPlus * ((erneuerbare / Steps) + (Fossile / Steps)) / 2);
            console.log(Speicher);
            Speicher = Math.min(Speicher + addition, Speichergröße);
            speicherValue = (-speicherPlus * ((erneuerbare / Steps) + (Fossile / Steps)) / 2);
        }

        speicherLeer = (Speicher <= -Speichergröße ? 0 : 1);
        speicherVoll = (Speicher >= Speichergröße ? 0 : 1);

        bars.Sensor5.style.height = (((Speicher / Speichergröße) + 1) * 50) + "%";

        Speicher = Math.max(-Speichergröße, Math.min(Speicher, Speichergröße));

    }

    // Function to set bar for Sensor1
    function setBar1(value) {
        if (isBlackout) return;
        sensorValues.Sensor1 = value;
        erneuerbare = (sensorValues.Sensor1 * (sensorValues.Sensor4 / Steps))

        bars.Sensor1.style.height = Math.min(Math.max((erneuerbare / Steps) * 100, 0), 100) + "%";
        bars.Sensor1b.style.height = Math.min(Math.max((sensorValues.Sensor1 / Steps) * 100, 0), 100) + "%";
        updateChart()
    }

    // Function to set bar for Sensor2
    function setBar2(value) {
        if (isBlackout) return;
        sensorValues.Sensor2 = value;
        let diff = sensorValues.Sensor2 - Fossile;

        if (diff > fossileSpeed) {
            Fossile += fossileSpeed;
        } else if (diff < -fossileSpeed) {
            Fossile -= fossileSpeed;
        } else {
            Fossile += diff;
        }
        bars.Sensor2b.style.height = Math.min(Math.max((sensorValues.Sensor2 / Steps) * 100, 0), 100) + "%";
        bars.Sensor2.style.height = Math.min(Math.max((Fossile / Steps) * 100, 0), 100) + "%";
    }

    // Function to set bar for Sensor2
    function setBar3(value) {
        if (isBlackout) return;
        sensorValues.Sensor3 = value;
        bars.Sensor3c.style.height = speicherMinus + "%";
        bars.Sensor3.style.height = (speicherMinus * speicherLeer) + "%";
        bars.Sensor3b.style.height = (speicherPlus * speicherVoll * ((erneuerbare / Steps) + (Fossile / Steps)) / 2) + "%";
        bars.Sensor3b1.style.height = speicherMinus * speicherLeer + "%";
        bars.Sensor3b2.style.height = speicherPlus + "%";
    }



    // Function to set bar for Sensor4
    function setBar4(value) {
        if (isBlackout) return;
        sensorValues.Sensor4 = value;
        bars.Sensor4.style.height = (value / Steps) * 100 + "%";
    }



    document.getElementById('connect').addEventListener('click', () => {
        (async () => {
            const port = await navigator.serial.requestPort();
            await port.open({
                baudRate: 9600
            });

            while (port.readable) {
                const reader = port.readable.getReader();
                let textBuffer = "";
                try {
                    while (true) {
                        const {
                            value,
                            done
                        } = await reader.read();
                        if (done) break;

                        let textFragment = new TextDecoder().decode(value);

                        let newlineIndex = textFragment.indexOf('\n');
                        if (newlineIndex >= 0) {
                            textBuffer += textFragment.substring(0, newlineIndex);
                            const [sensor, value] = textBuffer.trim().split(':');
                            const sensorValue = parseInt(value, 10);
                            switch (sensor) {
                                case 'Sensor1':
                                    setBar1(sensorValue);
                                    break;
                                case 'Sensor2':
                                    setBar2(sensorValue);
                                    break;
                                case 'Sensor3':
                                    setBar3(sensorValue);
                                    break;
                                case 'Sensor4':
                                    setBar4(sensorValue);
                                    break;
                                case 'Sensor5':
                                    setBar5(sensorValue);
                                    break;
                            }
                            textBuffer = textFragment.substring(newlineIndex + 1);
                        } else {
                            textBuffer += textFragment;
                        }
                    }
                } catch (error) {
                    output.textContent = 'Error: ' + error;
                } finally {
                    reader.releaseLock();
                }
            }
        })();
    });

});