// Create voltage Gauge
function createVoltageGauge() {
    let gauge = new RadialGauge({
        renderTo: 'gauge-voltage',
        width: 300,
        height: 300,
        units: "V",
        minValue: 0,
        maxValue: 250,
        colorValueBoxRect: "#049faa",
        colorValueBoxRectEnd: "#049faa",
        colorValueBoxBackground: "#f1fbfc",
        valueDec: 2,
        valueInt: 2,
        majorTicks: [
            "0",
            "50",
            "100",
            "150",
            "200",
            "250"
        ],
        minorTicks: 5,
        strokeTicks: true,
        highlights: [
            {
                "from": 110,
                "to": 125,
                "color": "rgba(50, 200, 200, .75)"
            }
        ],
        colorPlate: "#fff",
        colorBarProgress: "#FEFD08",
        colorBarProgressEnd: "FEFD08",
        borderShadowWidth: 0,
        borders: false,
        needleType: "arrow",
        needleWidth: 2,
        needleCircleSize: 7,
        needleCircleOuter: true,
        needleCircleInner: false,
        animationDuration: 2000,
        animationRule: "linear",
        barWidth: 10,
    });
    return gauge;
}