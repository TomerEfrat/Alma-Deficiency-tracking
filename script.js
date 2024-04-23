// Example SKUs
const SKUs = [
    "AAUS07081802", "AATE17112102", "AEUN06022301", "AAUS09092001", "AAUL07101501",
    "AARF05042191", "AAOP23082201", "AAUB18102002", "AAOP23082203", "AAOP23082204",
    "AACO10031950", "EGHR11070401", "AASP24052101", "EGGG18030905", "EGGG18030903",
    "AASP21051840", "AAIP12102045", "AASR29101909", "EGSPO8060901"
];

// Function to filter SKUs based on input
function filterSKUs(input) {
    return SKUs.filter(sku => sku.includes(input));
}

// Function to populate SKU list
function populateSKUList(input) {
    const skuList = document.getElementById('skuList');
    skuList.innerHTML = '';

    const filteredSKUs = filterSKUs(input);
    filteredSKUs.forEach(sku => {
        const div = document.createElement('div');
        div.textContent = sku;
        div.addEventListener('click', () => {
            document.getElementById('skuInput').value = sku;
            document.getElementById('addBtn').disabled = false;
            skuList.style.display = 'none';
        });
        skuList.appendChild(div);
    });

    if (filteredSKUs.length > 0) {
        skuList.style.display = 'block';
    } else {
        skuList.style.display = 'none';
    }
}

// Event listener for SKU input
document.getElementById('skuInput').addEventListener('input', function() {
    const input = this.value.trim();
    if (input.length > 0) {
        populateSKUList(input);
    } else {
        document.getElementById('skuList').style.display = 'none';
        document.getElementById('addBtn').disabled = true;
    }
});

// Event listener for "Add SKU to List" button
document.getElementById('addBtn').addEventListener('click', function() {
    const skuInput = document.getElementById('skuInput').value.trim();
    if (skuInput.length > 0) {
        // Implement adding SKU to table (modify as needed)
        console.log('Adding SKU:', skuInput);
        // Clear input field
        document.getElementById('skuInput').value = '';
        // Disable button after adding SKU
        this.disabled = true;
        // Update SKU table (call function to add SKU to table)
        addSKUToTable(skuInput);
    }
});

// Function to add SKU to table
function addSKUToTable(sku) {
    const skuTableBody = document.getElementById('skuTableBody');
    const row = document.createElement('tr');
    const date = new Date().toLocaleDateString();
    row.innerHTML = `
        <td>${sku}</td>
        <td>${date}</td>
        <td><input type="checkbox" class="ordered-checkbox"></td>
        <td></td>
        <td><input type="checkbox" class="arrived-checkbox"></td>
        <td><input type="button" value="מחק" onclick="deleteRow(this)"></td>
    `;
    skuTableBody.appendChild(row);

    // Add event listener to ordered checkbox
    const orderedCheckbox = row.querySelector('.ordered-checkbox');
    orderedCheckbox.addEventListener('change', function() {
        if (this.checked) {
            row.cells[3].textContent = new Date().toLocaleDateString();
        } else {
            row.cells[3].textContent = '';
        }
    });

    // Add event listener to arrived checkbox
    const arrivedCheckbox = row.querySelector('.arrived-checkbox');
    arrivedCheckbox.addEventListener('change', function() {
        if (this.checked) {
            row.cells[4].textContent = new Date().toLocaleDateString();
        } else {
            row.cells[4].textContent = '';
        }
    });
}

// Function to delete row from table
function deleteRow(button) {
    const row = button.parentNode.parentNode;
    if (confirm('האם אתה בטוח שברצונך למחוק את השורה?')) {
        row.remove();
    }
}
// Function to export table data to CSV
function exportToCSV() {
    // Get table headers
    const headers = Array.from(document.querySelectorAll('#skuTable thead th')).map(th => th.textContent.trim());
    // Get table rows
    const rows = document.querySelectorAll('#skuTable tbody tr');
    // Initialize CSV content with headers
    let csvContent = '\uFEFF'; // BOM (Byte Order Mark) for UTF-8 to support Excel
    csvContent += headers.join(',') + '\n';

    // Iterate over each row
    rows.forEach(row => {
        const rowData = [];
        // Iterate over each cell in the row
        row.querySelectorAll('td').forEach(cell => {
            // Add cell content to row data
            rowData.push(cell.textContent.trim());
        });
        // Add row data to CSV content
        csvContent += rowData.join(',') + '\n';
    });

    // Create a Blob object containing the CSV data
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link for the Blob
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(csvBlob);
    link.setAttribute('download', 'sku_data.csv');

    // Append the link to the document body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
}

// Event listener for "Export to Excel" button
document.getElementById('exportBtn').addEventListener('click', exportToCSV);
