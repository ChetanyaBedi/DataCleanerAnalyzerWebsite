let csvData = [];
let chartInstance = null; 


document.getElementById("toggleTheme").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    document.querySelector(".container").classList.toggle("dark-mode");


    document.querySelectorAll(".visualization-section, .analysis-section, .upload-section, .data-preview")
        .forEach(section => section.classList.toggle("dark-mode"));


    document.querySelector("table").classList.toggle("dark-mode");


    document.querySelectorAll("button").forEach(button => {
        button.classList.toggle("dark-mode-button");
    });
});

function loadCSV() {
    const fileInput = document.getElementById("csvFileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a CSV file!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const lines = event.target.result.split("\n");
        csvData = lines.map(line => line.split(","));
        displayTable();
    };

    reader.readAsText(file);
}


function displayTable() {
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.getElementById("tableBody");

    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";

    csvData.forEach((row, index) => {
        let tr = document.createElement("tr");

        row.forEach(cell => {
            let td = document.createElement(index === 0 ? "th" : "td");
            td.textContent = cell;
            tr.appendChild(td);
        });

        if (index === 0) {
            tableHeader.appendChild(tr);
        } else {
            tableBody.appendChild(tr);
        }
    });
}

function cleanData() {
    if (csvData.length === 0) {
        alert("No data loaded!");
        return;
    }

    csvData = csvData.filter((row, index, self) =>
        index === 0 || self.findIndex(r => JSON.stringify(r) === JSON.stringify(row)) === index
    );

    alert("Data cleaned successfully!");
    displayTable();
}


function generateStats() {
    if (csvData.length < 2) {
        alert("Not enough data for analysis!");
        return;
    }

    const values = csvData.slice(1).map(row => parseFloat(row[1])).filter(v => !isNaN(v));
    
    if (values.length === 0) {
        alert("Invalid data in numeric column!");
        return;
    }

    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    alert(`📊 Statistics:\nMean: ${mean.toFixed(2)}\nMin: ${min}\nMax: ${max}`);
}

function detectOutliers() {
    if (csvData.length < 2) {
        alert("Not enough data to detect outliers!");
        return;
    }

    const values = csvData.slice(1).map(row => parseFloat(row[1])).filter(v => !isNaN(v));

    if (values.length === 0) {
        alert("Invalid data in numeric column!");
        return;
    }

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(variance);

    const outliers = csvData.slice(1).filter(row => {
        const value = parseFloat(row[1]);
        return value < mean - 2 * stdDev || value > mean + 2 * stdDev;
    });

    if (outliers.length === 0) {
        alert("No outliers detected!");
    } else {
        alert(`🚨 Outliers Detected:\n${outliers.map(row => row.join(", ")).join("\n")}`);
    }
}

function normalizeData() {
    if (csvData.length < 2) {
        alert("No data to normalize!");
        return;
    }

    const values = csvData.slice(1).map(row => parseFloat(row[1])).filter(v => !isNaN(v));

    if (values.length === 0) {
        alert("Invalid data in numeric column!");
        return;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);

    csvData = csvData.map((row, index) => {
        if (index === 0) return row;
        row[1] = ((parseFloat(row[1]) - min) / (max - min)).toFixed(2);
        return row;
    });

    alert("Data normalized successfully!");
    displayTable();
}


function plotChart(type) {
    const ctx = document.getElementById("dataChart").getContext("2d");

    if (csvData.length < 2) {
        alert("Not enough data for visualization!");
        return;
    }

    const labels = csvData.slice(1).map(row => row[0]);
    const values = csvData.slice(1).map(row => parseFloat(row[1])).filter(v => !isNaN(v));

    if (values.length === 0) {
        alert("Invalid data in numeric column!");
        return;
    }

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: "Data Visualization",
                data: values,
                backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
                borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                borderWidth: 2
            }]
        }
    });
}

function plotLineChart() { plotChart('line'); }
function plotBarChart() { plotChart('bar'); }
function plotPieChart() { plotChart('pie'); }
