// Function to convert array data to CSV format
function convertToCSV(data) {
    const csvRows = data.map(row => row.join(","));
    return csvRows.join("\n");
}

// Function to trigger CSV file download
function downloadCSV() {
    if (csvData.length === 0) {
        alert("No data available to download!");
        return;
    }
    const csvContent = convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "cleaned_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Attach download function after data is cleaned or normalized
document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "⬇ Download Processed Data";
    downloadBtn.onclick = downloadCSV;
    downloadBtn.style.display = "none"; // Initially hidden
    downloadBtn.style.margin = "10px auto";
    downloadBtn.style.padding = "10px";
    downloadBtn.style.backgroundColor = "#28a745";
    downloadBtn.style.color = "white";
    downloadBtn.style.border = "none";
    downloadBtn.style.borderRadius = "5px";
    downloadBtn.style.cursor = "pointer";

    document.querySelector(".main-content").appendChild(downloadBtn);

    // Modify existing functions to trigger button visibility
    const originalCleanData = window.cleanData;
    window.cleanData = function() {
        originalCleanData();
        downloadBtn.style.display = "block"; // Show button after cleaning
    };

    const originalNormalizeData = window.normalizeData;
    window.normalizeData = function() {
        originalNormalizeData();
        downloadBtn.style.display = "block"; // Show button after normalization
    };
});
