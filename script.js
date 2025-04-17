// Sample data for tables
const warrantyClaimData = {
    'Shop1': { toBeAssessed: 1, noOpportunity: 0, inProgress: 0 },
    'Shop2': { toBeAssessed: 1, noOpportunity: 0, inProgress: 0 },
    'Shop3': { toBeAssessed: 3, noOpportunity: 0, inProgress: 0 }
};

const opportunityData = {
    'Shop1': [
        { customer: 'WRNTYCUST123', model: 'Model1', esn: '1001', partKeyword: 'SEAL', partNumber: 'JUY1001' },
        { customer: 'WRNTYCUST123', model: 'Model1', esn: '1001', partKeyword: 'VALVE', partNumber: 'VKS801' }
    ],
    'Shop2': [
        { customer: 'WRNTYCUST743', model: 'Model4', esn: '1123', partKeyword: 'SEAL', partNumber: 'JUY1284' },
        { customer: 'WRNTYCUST743', model: 'Model4', esn: '1123', partKeyword: 'BUSHING', partNumber: 'HUG5678' },
        { customer: 'WRNTYCUST743', model: 'Model4', esn: '1123', partKeyword: 'VALVE', partNumber: 'VKS896' },
        { customer: 'WRNTYCUST743', model: 'Model4', esn: '1123', partKeyword: 'BLADE', partNumber: 'QKR776' }
    ],
    'Shop3': [
        { customer: 'WRNTYCUST567', model: 'Model2', esn: '2002', partKeyword: 'GASKET', partNumber: 'GSK445' },
        { customer: 'WRNTYCUST567', model: 'Model2', esn: '2002', partKeyword: 'BEARING', partNumber: 'BRG332' }
    ]
};

const recommendationsData = {
    'Shop1': [
        { customer: 'WRNTYCUST123', model: 'Model1', esn: '1001', businessPlan: 'BP001' },
        { customer: 'WRNTYCUST123', model: 'Model1', esn: '1001', businessPlan: 'BP002' }
    ],
    'Shop2': [
        { customer: 'WRNTYCUST743', model: 'Model4', esn: '1123', businessPlan: 'BP001' },
        { customer: 'WRNTYCUST743', model: 'Model4', esn: '1123', businessPlan: 'BP002' }
    ],
    'Shop3': [
        { customer: 'WRNTYCUST567', model: 'Model2', esn: '2002', businessPlan: 'BP003' }
    ]
};

const prioritizeData = {
    'BP001': [
        { priority: 1, esn: 'ESN11', businessPlan: 'CS12345', parts: 'Part1, Part2', criteria1: 'NR', criteria2: 'NR', criteria3: '<=3', criteria4: '100%', disc: '40%', amount: '$1,432,463' },
        { priority: 2, esn: 'ESN12', businessPlan: 'D678', parts: 'Part3, Part4', criteria1: '72-0857', criteria2: 'NR', criteria3: 'NR', criteria4: 'NR', disc: '50%', amount: '$25,625' }
    ],
    'BP002': [
        { priority: 1, esn: 'ESN13', businessPlan: 'CS12345', parts: 'Part5, Part6', criteria1: 'NR', criteria2: 'NR', criteria3: '<=2', criteria4: 'NR', disc: '30%', amount: '$1,538,789' }
    ],
    'BP003': [
        { priority: 1, esn: 'ESN14', businessPlan: 'D678', parts: 'Part7, Part8', criteria1: '72-0857', criteria2: 'NR', criteria3: 'NR', criteria4: 'NR', disc: '25%', amount: '$25,625' }
    ]
};

// Global variables
let currentTable = 1;
let selectedShop = null;
let selectedCustomer = null;
let selectedESN = null;
let selectedBusinessPlan = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set up initial table
    setupTable1();
    
    // Add event listeners
    setupEventListeners();
});

function setupTable1() {
    const tbody = document.querySelector('.table-section.active tbody');
    tbody.innerHTML = '';
    
    Object.keys(warrantyClaimData).forEach(shop => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${shop}</td>
            <td>${warrantyClaimData[shop].toBeAssessed}</td>
            <td>${warrantyClaimData[shop].noOpportunity}</td>
            <td>${warrantyClaimData[shop].inProgress}</td>
        `;
        tbody.appendChild(row);
    });
}

function setupEventListeners() {
    // Row click handler
    document.addEventListener('click', function(e) {
        const row = e.target.closest('tr');
        if (row && row.parentElement.tagName === 'TBODY') {
            handleRowClick(row);
        }
    });

    // Proceed button handler
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-primary')) {
            handleProceedButton();
        }
    });
}

function handleRowClick(row) {
    const tableSection = row.closest('.table-section');
    const tableNumber = parseInt(tableSection.dataset.tableNumber);
    
    // Remove selected class from all rows in current table
    tableSection.querySelectorAll('tbody tr').forEach(r => r.classList.remove('selected'));
    
    // Add selected class to clicked row
    row.classList.add('selected');
    
    // Update selection based on table number
    if (tableNumber === 1) {
        selectedShop = row.querySelector('td:first-child').textContent;
        const proceedBtn = tableSection.querySelector('.btn-primary');
        if (proceedBtn) proceedBtn.disabled = false;
    } else if (tableNumber === 2) {
        selectedCustomer = row.querySelector('td:nth-child(2)').textContent;
        selectedESN = row.querySelector('td:nth-child(4)').textContent;
        const proceedBtn = tableSection.querySelector('.btn-primary');
        if (proceedBtn) proceedBtn.disabled = false;
    } else if (tableNumber === 4) {
        selectedBusinessPlan = row.querySelector('td:last-child').textContent;
        const proceedBtn = tableSection.querySelector('.btn-primary');
        if (proceedBtn) proceedBtn.disabled = false;
    }
}

function handleProceedButton() {
    const activeTable = document.querySelector('.table-section.active');
    const tableNumber = parseInt(activeTable.dataset.tableNumber);
    
    if (tableNumber === 1 && selectedShop) {
        showTable2(selectedShop);
    } else if (tableNumber === 2 && selectedCustomer && selectedESN) {
        showTable3(selectedShop, selectedCustomer, selectedESN);
    } else if (tableNumber === 3) {
        showTable4(selectedShop, selectedCustomer, selectedESN);
    } else if (tableNumber === 4 && selectedBusinessPlan) {
        showTable5(selectedBusinessPlan);
    }
}

function showTable2(shop) {
    const data = warrantyClaimData[shop];
    const tableSection = createTableSection(2, 'Warranty Claim Status - Issued');
    const tbody = tableSection.querySelector('tbody');
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${shop}</td>
        <td>${data.toBeAssessed}</td>
        <td>${data.noOpportunity}</td>
        <td>${data.inProgress}</td>
    `;
    tbody.appendChild(row);
    
    document.querySelector('.table-section.active').classList.remove('active');
    tableSection.classList.add('active');
    document.querySelector('.table-sections').appendChild(tableSection);
    
    currentTable = 2;
    const proceedBtn = tableSection.querySelector('.btn-primary');
    if (proceedBtn) proceedBtn.disabled = true;
}

function showTable3(shop, customer, esn) {
    const data = opportunityData[shop].filter(item => 
        item.customer === customer && item.esn === esn
    );
    const tableSection = createTableSection(3, 'Opportunity Assessment');
    const tbody = tableSection.querySelector('tbody');
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${shop}</td>
            <td>${item.customer}</td>
            <td>${item.model}</td>
            <td>${item.esn}</td>
            <td>${item.partKeyword}</td>
            <td>${item.partNumber}</td>
        `;
        tbody.appendChild(row);
    });
    
    document.querySelector('.table-section.active').classList.remove('active');
    tableSection.classList.add('active');
    document.querySelector('.table-sections').appendChild(tableSection);
    
    currentTable = 3;
    const proceedBtn = tableSection.querySelector('.btn-primary');
    if (proceedBtn) {
        proceedBtn.disabled = false;
        proceedBtn.textContent = 'Analyze for Warranty Oppty';
    }
}

function showTable4(shop, customer, esn) {
    const data = recommendationsData[shop].filter(item => 
        item.customer === customer && item.esn === esn
    );
    const tableSection = createTableSection(4, 'Recommendations');
    const tbody = tableSection.querySelector('tbody');
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${shop}</td>
            <td>${item.customer}</td>
            <td>${item.model}</td>
            <td>${item.esn}</td>
            <td>${item.businessPlan}</td>
        `;
        tbody.appendChild(row);
    });
    
    document.querySelector('.table-section.active').classList.remove('active');
    tableSection.classList.add('active');
    document.querySelector('.table-sections').appendChild(tableSection);
    
    currentTable = 4;
    const proceedBtn = tableSection.querySelector('.btn-primary');
    if (proceedBtn) {
        proceedBtn.disabled = true;
        proceedBtn.textContent = 'Proceed';
    }
}

function showTable5(businessPlan) {
    const data = prioritizeData[businessPlan];
    const tableSection = createTableSection(5, 'Prioritize the Engines');
    const tbody = tableSection.querySelector('tbody');
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.priority}</td>
            <td>${item.esn}</td>
            <td>${item.businessPlan}</td>
            <td>${item.parts}</td>
            <td>${item.criteria1}</td>
            <td>${item.criteria2}</td>
            <td>${item.criteria3}</td>
            <td>${item.criteria4}</td>
            <td>${item.disc}</td>
            <td>${item.amount}</td>
        `;
        tbody.appendChild(row);
    });
    
    document.querySelector('.table-section.active').classList.remove('active');
    tableSection.classList.add('active');
    document.querySelector('.table-sections').appendChild(tableSection);
    
    currentTable = 5;
    const proceedBtn = tableSection.querySelector('.btn-primary');
    if (proceedBtn) proceedBtn.disabled = true;
}

function createTableSection(tableNumber, title) {
    const tableSection = document.createElement('div');
    tableSection.className = 'table-section';
    tableSection.dataset.tableNumber = tableNumber;
    
    let tableContent = '';
    if (tableNumber === 2) {
        tableContent = `
            <div class="table-header">
                <div class="header-left">
                    <h2>${title}</h2>
                    <span class="record-count">1 Shop</span>
                </div>
                <div class="table-actions">
                    <div class="search-filter">
                        <input type="text" placeholder="Filter table...">
                    </div>
                    <div class="action-buttons">
                        <button class="btn-icon advanced-filter-btn" title="Advanced Filters">
                            <i class="fas fa-filter"></i>
                        </button>
                        <button class="btn-icon" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Shop</th>
                            <th>To be assessed</th>
                            <th>No Opportunity</th>
                            <th>In Progress</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="table-footer">
                <div class="pagination">
                    <div class="pagination-controls">
                        <button class="btn-icon" disabled>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span class="page-info">Page 1 of 1</span>
                        <button class="btn-icon" disabled>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="rows-info">Showing 0 of 0 records</div>
                </div>
                <div class="footer-buttons">
                    <button class="btn btn-secondary back-btn">
                        <i class="fas fa-arrow-left"></i>
                        Back
                    </button>
                    <button class="btn btn-primary proceed-btn" disabled>
                        <i class="fas fa-arrow-right"></i>
                        Proceed
                    </button>
                </div>
            </div>
        `;
    } else if (tableNumber === 3) {
        tableContent = `
            <div class="table-header">
                <div class="header-left">
                    <h2>${title}</h2>
                    <span class="record-count">0 Records</span>
                </div>
                <div class="table-actions">
                    <div class="search-filter">
                        <input type="text" placeholder="Filter table...">
                    </div>
                    <div class="action-buttons">
                        <button class="btn-icon advanced-filter-btn" title="Advanced Filters">
                            <i class="fas fa-filter"></i>
                        </button>
                        <button class="btn-icon" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Shop</th>
                            <th>Customer</th>
                            <th>Model</th>
                            <th>ESN</th>
                            <th>Part Keyword</th>
                            <th>Part Number</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="table-footer">
                <div class="pagination">
                    <div class="pagination-controls">
                        <button class="btn-icon" disabled>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span class="page-info">Page 1 of 1</span>
                        <button class="btn-icon" disabled>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="rows-info">Showing 0 of 0 records</div>
                </div>
                <div class="footer-buttons">
                    <button class="btn btn-secondary back-btn">
                        <i class="fas fa-arrow-left"></i>
                        Back
                    </button>
                    <button class="btn btn-primary proceed-btn">
                        <i class="fas fa-arrow-right"></i>
                        Analyze for Warranty Oppty
                    </button>
                </div>
            </div>
        `;
    } else if (tableNumber === 4) {
        tableContent = `
            <div class="table-header">
                <div class="header-left">
                    <h2>${title}</h2>
                    <span class="record-count">0 Records</span>
                </div>
                <div class="table-actions">
                    <div class="search-filter">
                        <input type="text" placeholder="Filter table...">
                    </div>
                    <div class="action-buttons">
                        <button class="btn-icon advanced-filter-btn" title="Advanced Filters">
                            <i class="fas fa-filter"></i>
                        </button>
                        <button class="btn-icon" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Shop</th>
                            <th>Customer</th>
                            <th>Model</th>
                            <th>ESN</th>
                            <th>Potential Business Plans</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="table-footer">
                <div class="pagination">
                    <div class="pagination-controls">
                        <button class="btn-icon" disabled>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span class="page-info">Page 1 of 1</span>
                        <button class="btn-icon" disabled>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="rows-info">Showing 0 of 0 records</div>
                </div>
                <div class="footer-buttons">
                    <button class="btn btn-secondary back-btn">
                        <i class="fas fa-arrow-left"></i>
                        Back
                    </button>
                    <button class="btn btn-primary proceed-btn" disabled>
                        <i class="fas fa-arrow-right"></i>
                        Proceed
                    </button>
                </div>
            </div>
        `;
    } else if (tableNumber === 5) {
        tableContent = `
            <div class="table-header">
                <div class="header-left">
                    <h2>${title}</h2>
                    <span class="record-count">0 Records</span>
                </div>
                <div class="table-actions">
                    <div class="search-filter">
                        <input type="text" placeholder="Filter table...">
                    </div>
                    <div class="action-buttons">
                        <button class="btn-icon advanced-filter-btn" title="Advanced Filters">
                            <i class="fas fa-filter"></i>
                        </button>
                        <button class="btn-icon" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Priority</th>
                            <th>ESN</th>
                            <th>Potential Business Plan</th>
                            <th>Affected Parts</th>
                            <th>Criteria type 1</th>
                            <th>Criteria type 2</th>
                            <th>Criteria type 3</th>
                            <th>Criteria type 4</th>
                            <th>Applicable Disc%</th>
                            <th>Est Warranty Amount</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="table-footer">
                <div class="pagination">
                    <div class="pagination-controls">
                        <button class="btn-icon" disabled>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span class="page-info">Page 1 of 1</span>
                        <button class="btn-icon" disabled>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="rows-info">Showing 0 of 0 records</div>
                </div>
                <div class="footer-buttons">
                    <button class="btn btn-secondary back-btn">
                        <i class="fas fa-arrow-left"></i>
                        Back
                    </button>
                    <button class="btn btn-primary proceed-btn" disabled>
                        <i class="fas fa-arrow-right"></i>
                        Proceed
                    </button>
                </div>
            </div>
        `;
    }
    
    tableSection.innerHTML = tableContent;
    return tableSection;
}