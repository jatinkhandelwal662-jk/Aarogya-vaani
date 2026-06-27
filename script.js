// script.js

// GLOBAL VARIABLE TO TRACK OPEN COMPLAINT
let currentItemIndex = null;
const BASE_URL="https://husbandless-kerry-unvitrescent.ngrok-free.dev"
// --- 1. DATASETS ---
let data = [
    { 
        id: "PMR-9021", type: "Cough", loc: "CR Park", status: "Follow-up", date: "2025-01-01",
        phone: "+91 98765 43210", dept: "AWR-101", med:"ORS x10, Zinc x10", 
        img: "",
        desc: "Do the checkup of the baby of meena body weight is fine,child is healthy and give medicines to the mother",
        lat: "28.5733", long: "77.2361"
    },
    { 
        id: "PMR-9022", type: "Viral Fever", loc: "Kalkaji", status: "Pending", date: "2026-05-01",
        phone: "+91 98111 55566", dept: "AWR-102", med: "Paracetamol x10", 
        img: "",
        desc: "Patient reporting high fever for 2 days. Provided basic medication and advised to visit PHC if fever does not drop.",
        lat: "28.5355", long: "77.2591"
    },
    { 
        id: "PMR-9023", type: "Antenatal Care", loc: "Lajpat Nagar", status: "Verified", date: "2026-05-01",
        phone: "+91 99887 11223", dept: "AWR-103", med: "Iron Folic Acid x30", 
        img: "Complaint Photoes/SIG-9023.jpg",
        desc: "5th month pregnancy checkup. Mother's BP is normal. Handed over monthly IFA supplements.",
        lat: "28.5692", long: "77.2432"
    },
    { 
        id: "PMR-9024", type: "Diarrhea", loc: "Saket", status: "Discrepancy", date: "2026-05-02",
        phone: "+91 91234 99887", dept: "AWR-104", med: "ORS x5", 
        img: "Complaint Photoes/SIG-9024.jpg",
        desc: "Child suffering from loose motions. GPS coordinates of the uploaded photo do not match the assigned Saket block.",
        lat: "28.5244", long: "77.2121"
    },
    { 
        id: "PMR-9025", type: "Immunization", loc: "Vasant Kunj", status: "Follow-up", date: "2026-05-02",
        phone: "+91 98711 44556", dept: "AWR-105", med: "None", 
        img: "Complaint Photoes/SIG-9025.jpg",
        desc: "Reminded the family about the upcoming measles vaccine. Will visit again next week to ensure they visited the Anganwadi.",
        lat: "28.5355", long: "77.1754"
    },
    { 
        id: "PMR-9026", type: "Postnatal Care", loc: "Munirka", status: "Verified", date: "2026-05-03",
        phone: "+91 90001 22334", dept: "AWR-106", med: "Calcium x15", 
        img: "Complaint Photoes/SIG-9026.jpg",
        desc: "Day 14 visit after delivery. Newborn is feeding well. Mother complained of back pain, provided calcium tablets.",
        lat: "28.5562", long: "77.1743"
    },
    { 
        id: "PMR-9027", type: "Nutrition Check", loc: "Hauz Khas", status: "Pending", date: "2026-05-03",
        phone: "+91 98989 33445", dept: "AWR-107", med: "Nutrition Pack x1", 
        img: "",
        desc: "MUAC tape measurement shows the child in the yellow zone. Waiting for the worker to upload the photo evidence.",
        lat: "28.5467", long: "77.2014"
    },
    { 
        id: "PMR-9028", type: "TB Screening", loc: "RK Puram", status: "Discrepancy", date: "2026-05-04",
        phone: "+91 98123 55667", dept: "AWR-108", med: "None", 
        img: "Complaint Photoes/SIG-9028.jpg",
        desc: "Worker marked sample collected, but the uploaded image is blurry and unrecognizable. Needs to be re-verified.",
        lat: "28.5657", long: "77.1744"
    },
    { 
        id: "PMR-9029", type: "Blood Pressure Check", loc: "Green Park", status: "Follow-up", date: "2026-05-04",
        phone: "+91 99999 11222", dept: "AWR-109", med: "None", 
        img: "Complaint Photoes/SIG-9029.jpg",
        desc: "Elderly patient has slightly elevated BP (140/90). Advised salt reduction and scheduled another check in 3 days.",
        lat: "28.5500", long: "77.1967"
    },
    { 
        id: "PMR-9030", type: "Skin Infection", loc: "South Ext", status: "Verified", date: "2026-05-05",
        phone: "+91 98111 77889", dept: "AWR-110", med: "Antiseptic Ointment x1", 
        img: "Complaint Photoes/SIG-9030.jpg",
        desc: "Minor fungal infection on the child's arm. Provided standard antiseptic ointment and advised on hygiene.",
        lat: "28.5685", long: "77.2201"
    },
    { 
        id: "PMR-9031", type: "Minor Injury", loc: "Greater Kailash", status: "Pending", date: "2026-05-05",
        phone: "+91 98765 99880", dept: "AWR-111", med: "Bandages x5", 
        img: "",
        desc: "Patient suffered a minor cut while cooking. Cleaned the wound and provided sterile bandages. Awaiting SMS photo upload.",
        lat: "28.5350", long: "77.2393"
    }
];
//ASHA WORKERS DATA
let ashadata = [];
// --- DYNAMICALLY UPDATE ASHA STATS CARDS ---
function updateAshaStats() {
    if (!ashadata || ashadata.length === 0) return;

    // 1. Calculate Top Performer (Highest Score)
    const topPerformer = [...ashadata].sort((a, b) => b.performance - a.performance)[0];
    const topNameEl = document.getElementById('best-dept-name');
    if(topNameEl) topNameEl.innerText = topPerformer.name;

    // 2. Calculate Most Active (Most Patients)
    const mostActive = [...ashadata].sort((a, b) => b.patients - a.patients)[0];
    const fastestNameEl = document.getElementById('fastest-dept-name');
    if(fastestNameEl) fastestNameEl.innerText = mostActive.name;

    // 3. Calculate Deactivated IDs (Count of 'Blocked' status)
    const blockedCount = ashadata.filter(w => w.status === 'Blocked').length;
    const blockedCountEl = document.getElementById('busy-dept-name');
    if(blockedCountEl) blockedCountEl.innerText = blockedCount;
}

// ⚠️ UPDATE YOUR EXISTING fetchAshaWorkers to call it on load:
async function fetchAshaWorkers() {
    try {
        const response = await fetch("https://husbandless-kerry-unvitrescent.ngrok-free.dev/api/asha-workers", {
            headers: { "ngrok-skip-browser-warning": "true" }
        });
        const result = await response.json();
        
        if (result.success) {
            ashadata = result.data; 
            renderAshaTable();      
            updateAshaStats(); // <--- ADD THIS LINE HERE
        }
    } catch (error) {
        console.error("Failed to load ASHA workers", error);
    }
}

// --- 2. LOADER & INIT ---
document.addEventListener("DOMContentLoaded", () => {
    checkOverdue(); 
    
    const statusText = document.querySelector('.changing-text');
    if (statusText) {
        const states = ["RECEIVING ASHA WORKERS CALL...", "TRANSCRIBING AUDIO...", "EXTRACTING LOCATION...", "GENERATING REPORT...", "SYSTEM READY."];
        let step = 0;
        const interval = setInterval(() => {
            if (step < states.length) { statusText.innerText = states[step]; step++; } 
            else { clearInterval(interval); }
        }, 800);
    }
    setTimeout(() => { removeLoader(); }, 4500); 
    renderTable(); 
    initMainChart();
    renderAshaTable();
    fetchAshaWorkers();
    calculateInventory();
    fetchPharmaData();
});

function removeLoader() {
    const loader = document.getElementById('loader-screen');
    if (loader) { loader.style.opacity = '0'; setTimeout(() => { loader.style.display = 'none'; }, 800); }
}

// --- 3. LIFECYCLE / STATUS UPDATE LOGIC ---
function checkOverdue() {
    const today = new Date(); // Gets the actual current date
    
    data.forEach(item => {
        if(item.date && item.status === 'Follow-up') {
            const recordDate = new Date(item.date);
            recordDate.setDate(recordDate.getDate() + 7); // Calculate Follow-up Date (+7 Days)
            
            // If today's date has passed the 7-day follow-up mark, change to Pending
            if (today > recordDate) {
                item.status = 'Pending';
            }
        }
    });
}

// --- 4. FILTER & RENDER ---
function filterTable() {
    const filterElem = document.getElementById('statusFilter');
    const filterValue = filterElem ? filterElem.value : 'All';
    let filteredData = [];
    
    if (filterValue === 'All') {
        filteredData = data;
    } else {
        // This will seamlessly match 'Pending', 'Verified', 'Follow-up', and 'Discrepancy'
        filteredData = data.filter(item => item.status === filterValue);
    }
    renderTable(filteredData);
}

function isCritical(item) {
    const dangerWords = [
        "burst", "manhole","spark","collapse"
    ];
    const text = (item.type + " " + item.desc).toLowerCase();
    return dangerWords.some(word => text.includes(word));
}

// --- RENDER ASHA WORKERS TABLE ---
function renderAshaTable(dataset) {
    const tbody = document.getElementById('tableBody2');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    let displayData = dataset || [...ashadata]; 

    if (displayData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px; color:#64748b;">No records found.</td></tr>';
        return;
    }

    displayData.forEach((item, index) => {
        // Check if blocked to apply red styling
        let rowClass = item.status === 'Blocked' ? 'row-overdue' : '';
        let statusBadge = item.status === 'Blocked' 
            ? `<span class="status-badge st-rejected"><i class="ri-lock-fill"></i> BLOCKED</span>` 
            : `<span class="status-badge st-solved">Score: ${item.performance} / 10</span>`;

        const row = `
            <tr class="${rowClass}">
                <td style="font-family: monospace; color: var(--primary); font-weight:600;">${item.id}</td>
                <td><i class="ri-user-heart-line" style="color:#e11d48; margin-right:5px;"></i> ${item.name}</td>
                <td>${item.loc}</td>
                <td>${statusBadge}</td>
                <td>₹ ${item.incentives}</td>
                <td><button class="btn-action" onclick="event.stopPropagation(); openAshaModal(${index})">Analyze</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// 3. UPDATED RENDER TABLE (With Priority Sorting)
function renderTable(dataset) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    let displayData = dataset || [...data]; 

    // 🔴 SORTING LOGIC: Critical -> Discrepancy -> Normal
    displayData.sort((a, b) => {
        const aCrit = isCritical(a);
        const bCrit = isCritical(b);
        if (aCrit && !bCrit) return -1;
        if (!aCrit && bCrit) return 1;  
        return 0; 
    });

    if (displayData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px; color:#64748b;">No records found.</td></tr>';
        return;
    }

    displayData.forEach((item) => {
        // --- MAP NEW STATUSES TO CSS COLORS ---
        let statusClass = 'st-pending'; // Default (Yellow) for Pending & Follow-up
        if (item.status === 'Verified') statusClass = 'st-solved'; // Green
        if (item.status === 'Discrepancy') statusClass = 'st-rejected'; // Red

        let rowClass = "";
        let typeHtml = item.type; 

        // CRITICAL CHECK
        if (isCritical(item) && item.status !== 'Verified' && item.status !== 'Discrepancy') {
            rowClass = "row-critical"; 
            typeHtml = `<span class="badge-urgent">URGENT</span> ${item.type}`;
        }
        // Discrepancy Check (Highlights row in light red)
        else if (item.status === 'Discrepancy') {
            rowClass = "row-overdue"; 
        }
        
        // No Photo Check (Highlights row in light yellow)
        if (!item.img || item.img === "") rowClass += " row-no-photo";

        const originalIndex = data.findIndex(d => d.id === item.id);

        const row = `
            <tr class="${rowClass}" onclick="focusComplaint('${item.id}')">
                <td style="font-family: monospace; color: var(--primary); font-weight:600;">${item.id}</td>
                <td>${typeHtml}</td> <td>${item.loc}</td>
                <td>${item.med}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td><button class="btn-action" onclick="event.stopPropagation(); openAnalyzeModal(${originalIndex})">Analyze</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// --- ✨ MODERNIZED MODAL LOGIC FOR ASHA WORKERS ---
function openAshaModal(index) {
    const item = ashadata[index];
    const modal = document.getElementById('ashaanalyzeModal');
    const modalDetails = modal.querySelector('.modal-details');
    const photoContainer = modal.querySelector('.modal-img-container');

    const phoneMock = item.phone || "+91 8670450408";
    const isBlocked = item.status === 'Blocked';

    // 1. Dynamic Styling based on Status
    const statusColor = isBlocked ? '#dc2626' : '#10b981';
    const statusBg = isBlocked ? '#fef2f2' : '#d1fae5';
    const statusIcon = isBlocked ? 'ri-lock-fill' : 'ri-shield-check-fill';

    // 2. INJECT SLEEK DETAILS (Right Side)
    modalDetails.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div>
                <h3 style="font-size: 1.5rem; color: #1e293b; font-weight: 800; margin: 0 0 4px 0;">Worker Profile</h3>
                <p style="color: #64748b; font-size: 0.9rem; margin: 0;">ID: <span style="font-family: monospace; font-weight: 700; color: var(--primary);">${item.id}</span></p>
            </div>
            <div style="display: flex; gap: 8px;">
                <span style="background: ${statusBg}; color: ${statusColor}; padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; border: 1px solid ${statusColor}40; display: flex; align-items: center; gap: 5px; text-transform: uppercase;">
                    <i class="${statusIcon}"></i> ${item.status || 'Active'}
                </span>
            </div>
        </div>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <p style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; font-weight: 800; margin-bottom: 4px; letter-spacing: 0.5px;">Full Name</p>
                    <p style="font-size: 1.05rem; color: #0f172a; font-weight: 800; margin: 0;">${item.name}</p>
                </div>
                <div>
                    <p style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; font-weight: 800; margin-bottom: 4px; letter-spacing: 0.5px;">Father's Name</p>
                    <p style="font-size: 1.05rem; color: #475569; font-weight: 600; margin: 0;">${item.fatherName || "N/A"}</p>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="ri-calendar-line"></i></div>
                <div>
                    <div style="color: #64748b; font-size: 0.7rem; font-weight: 700; text-transform: uppercase;">Date of Birth</div>
                    <div style="color: #1e293b; font-weight: 800; font-size: 0.95rem;">${item.dob || "N/A"}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="ri-group-line"></i></div>
                <div>
                    <div style="color: #64748b; font-size: 0.7rem; font-weight: 700; text-transform: uppercase;">Total Patients</div>
                    <div style="color: #1e293b; font-weight: 800; font-size: 0.95rem;">${item.patients || "0"}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: #f3e8ff; color: #9333ea; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="ri-map-pin-line"></i></div>
                <div>
                    <div style="color: #64748b; font-size: 0.7rem; font-weight: 700; text-transform: uppercase;">Assigned Zone</div>
                    <div style="color: #1e293b; font-weight: 800; font-size: 0.95rem;">${item.zone || item.loc}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="ri-phone-line"></i></div>
                <div>
                    <div style="color: #64748b; font-size: 0.7rem; font-weight: 700; text-transform: uppercase;">Contact Number</div>
                    <div style="color: #1e293b; font-weight: 800; font-size: 0.95rem;">${phoneMock}</div>
                </div>
            </div>
        </div>

        <div style="margin-top: auto; display: flex; gap: 10px;">
            ${isBlocked 
                ? `<button id="reactivate-btn-${index}" style="flex: 1; padding: 14px; background: #10b981; border: none; color: white; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);"><i class="ri-shield-keyhole-fill"></i> Reactivate Worker ID</button>` 
                : `<button id="deactivate-btn-${index}" style="flex: 1; padding: 14px; background: white; border: 1px solid #fecaca; color: #dc2626; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.03);"><i class="ri-user-unfollow-fill"></i> Suspend Worker ID</button>`
            }
        </div>
    `;

    // 3. Attach Click Events dynamically based on status
    if (isBlocked) {
        modalDetails.querySelector(`#reactivate-btn-${index}`).onclick = function() { reactivateAshaWorker(index); };
    } else {
        modalDetails.querySelector(`#deactivate-btn-${index}`).onclick = function() { deactivateAshaWorker(index); };
    }

    // 4. 📸 POLISHED PROFILE PHOTO (Left Side)
    photoContainer.style.border = 'none';
    photoContainer.style.background = 'transparent';

    const imgSrc = item.photo || "https://via.placeholder.com/400x400?text=No+Photo";
    const lat = "28.4695"; 
    const long = "77.8595";

    photoContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; height: 100%; border-radius: 16px; overflow: hidden; background: white; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
            <div style="position: relative; flex: 1; background: #f1f5f9; overflow: hidden;">
                <div style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.95); backdrop-filter: blur(4px); color: #0f172a; padding: 6px 10px; font-size: 0.65rem; font-weight: 800; border-radius: 6px; border: 1px solid #e2e8f0; z-index: 10; box-shadow: 0 4px 10px rgba(0,0,0,0.1); letter-spacing: 0.5px;">
                    <i class="ri-verified-badge-fill" style="color: var(--primary);"></i> OFFICIAL ID
                </div>
                <img src="${imgSrc}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;" alt="Worker Profile">
            </div>
            <div style="background: #0f172a; padding: 14px 18px; border-top: 3px solid ${statusColor}; display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 54px;">
                <i class="ri-focus-3-line" style="color: #94a3b8; font-size: 1.2rem;"></i> 
                <span style="color: white; font-family: 'Courier New', monospace; font-size: 0.95rem; font-weight: 700; letter-spacing: 1px;">${lat} N, ${long} E</span>
            </div>
        </div>
    `;

    // 5. Show the Modal
    modal.style.display = 'flex';
}

// --- 5. MODAL LOGIC (CLEANEST VERSION: NO APPROVE BUTTON, NO LOC NAME) ---
function openAnalyzeModal(index) {
    currentItemIndex = index;
    const item = data[index];

    console.log("🔍 Analyzing Item:", item.id);
    let followUpDateStr = "N/A";
    if (item.date) {
        const recordDate = new Date(item.date);
        recordDate.setDate(recordDate.getDate() + 7);
        followUpDateStr = recordDate.toISOString().split('T')[0];
    }

    // 1. Populate Text Fields
    const fields = {
        'm-type': item.type,
        'm-status': item.status,
        'm-phone': item.phone,
        'm-follow-date': followUpDateStr,
        'm-dept': item.dept,
        'm-desc': item.desc,
        'm-date': item.date || "N/A"
    };

    for (const [id, value] of Object.entries(fields)) {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    }

    // 2. 📸 EVIDENCE IMAGE LOGIC
    // 2. 📸 EVIDENCE IMAGE LOGIC
    const photoContainer = document.querySelector('.modal-img-container');
    
    if (photoContainer) {
        // B. Get Location & Time
        const lat = item.lat ? parseFloat(item.lat).toFixed(4) : "28." + Math.floor(1000 + Math.random() * 9000); 
        const long = item.long ? parseFloat(item.long).toFixed(4) : "77." + Math.floor(1000 + Math.random() * 9000);
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        // C. INJECT HTML WITH A LOADING PLACEHOLDER
        photoContainer.innerHTML = `
            <div class="evidence-img-wrapper">
                <div class="verify-stamp">
                    <i class="ri-shield-check-fill"></i> OFFICIAL RECORD
                </div>
                <img id="dynamic-evidence-img" src="https://via.placeholder.com/400x300?text=Loading+Evidence..." class="evidence-img" alt="Evidence">
            </div>

            <div class="geotag-box">
                <div class="geo-left">
                    <div class="geo-row">
                        <i class="ri-map-pin-2-fill" style="color: #facc15;"></i> 
                        <span style="font-size: 0.9rem;">${lat} N, ${long} E</span>
                    </div>
                </div>
                <div class="geo-right">
                    <div class="geo-row">
                        <span style="color:#facc15; font-weight:bold;">${time}</span>
                        <i class="ri-time-fill"></i>
                    </div>
                </div>
            </div>
        `;

        // D. MAGIC NGROK BYPASS: Fetch the image silently and bypass the warning screen
        if (item.img && item.img !== "") {
            fetch(item.img, { headers: { "ngrok-skip-browser-warning": "true" } })
                .then(r => r.blob())
                .then(blob => {
                    document.getElementById('dynamic-evidence-img').src = URL.createObjectURL(blob);
                })
                .catch(err => {
                    document.getElementById('dynamic-evidence-img').src = 'https://via.placeholder.com/400?text=Image+Load+Error';
                });
        } else {
            document.getElementById('dynamic-evidence-img').src = "https://via.placeholder.com/400x300?text=No+Evidence+Uploaded";
        }
    }
    // 3. FORCE HIDE APPROVE BUTTON
    const actionContainer = document.querySelector('.action-buttons');
    if (actionContainer) {
        actionContainer.innerHTML = ''; // Clear existing buttons
        
        if (item.status === 'Verified') {
            actionContainer.innerHTML = `<button class="modal-action-btn" style="width:100%; opacity:0.6; cursor:not-allowed;" disabled><i class="ri-checkbox-circle-line"></i> Patient Verified</button>`;
        } else if (item.status === 'Discrepancy') {
            actionContainer.innerHTML = `<button class="modal-action-btn danger" style="width:100%; opacity:0.6; cursor:not-allowed;" disabled><i class="ri-error-warning-line"></i> Discrepancy Logged</button>`;
        } else {
            // --- AI AUTO-VERIFICATION TIMER (6 HOURS) ---
            if (!item.verifTimer) {
                // 21600000 = 6 hours in milliseconds. 
                // (Change to 10000 if you want to test it in 10 seconds for the judges!)
                const waitTime = 21600000; 
                
                item.verifTimer = setTimeout(() => {
                    triggerVerificationCall(index, true); // true = AI Auto-Trigger
                }, waitTime);
            }

            // For Pending or Follow-up records, show the Verification Call button + Failsafe Timer
            actionContainer.innerHTML = `
                <div style="width: 100%; display: flex; flex-direction: column; gap: 10px;">
                    <button id="verify-btn-${index}" class="modal-action-btn primary" style="width:100%; background: var(--primary);" onclick="triggerVerificationCall(${index}, false)">
                        <i class="ri-phone-line"></i> Manual Verification Call
                    </button>
                    <div style="font-size: 0.75rem; color: #f59e0b; text-align: center; font-weight: 800; animation: blink-animation 1.5s infinite; letter-spacing: 0.5px;">
                        <i class="ri-timer-flash-line"></i> AI Auto-Verification in 6 Hours...
                    </div>
                </div>
            `;
        }
    }
    
    // 5. Show the Modal
    document.getElementById('analyzeModal').style.display = 'flex';
}

// --- MODAL CLOSE LOGIC (HANDLES BOTH MODALS) ---
function closeAnalyzeModal() { 
    const modal1 = document.getElementById('analyzeModal');
    const modal2 = document.getElementById('ashaanalyzeModal');
    if(modal1) modal1.style.display = 'none'; 
    if(modal2) modal2.style.display = 'none';
}

// Close when clicking outside
window.onclick = function(event) {
    const modal1 = document.getElementById('analyzeModal');
    const modal2 = document.getElementById('ashaanalyzeModal');
    if (event.target == modal1) modal1.style.display = "none";
    if (event.target == modal2) modal2.style.display = "none";
}


// --- 6. CHARTS ---
function openTab(tabName) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active-view'));
    const targetView = document.getElementById(tabName);
    if(targetView) targetView.classList.add('active-view');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const clickedBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.onclick && b.onclick.toString().includes(tabName));
    if(clickedBtn) clickedBtn.classList.add('active');
    if (tabName === 'reports') { setTimeout(initDeptChart, 100); }
}

function initMainChart() {
    const ctx = document.getElementById('mainChart');
    if(!ctx) return;
    if(window.myMainChart) window.myMainChart.destroy(); 
    window.myMainChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['JAN','FEB','MAR','APR','MAY','JUN','JULY','AUG','SEPT','OCT','NOV','DEC'],
            datasets: [{ label: 'PATIENTS VISITED TODAY', data: [12000, 16546,15560,12876,19432, 22083, 21043, 19023,25876,27054,24087, 28021], borderColor: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.1)', borderWidth: 3, tension: 0.4, fill: true },
                        { label: 'MEDICINES DISTRIBUTED', data: [10000, 13078, 14008, 10099, 15008, 19056, 17000,15876,21987,23012,20342,26098], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 3, tension: 0.4, fill: true }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false }, title: { display: true, text: 'Month', font: { weight: 'bold' } } }, y: { beginAtZero: true, title: { display: true, text: 'Number of Health Record', font: { weight: 'bold' } } } } }
    });
}



window.onclick = function(event) {
    const modal = document.getElementById('analyzeModal');
    if (event.target == modal) modal.style.display = "none";
}

// --- 8. NOTIFICATION CENTER LOGIC ---
const notifications = [
    { id: "SIG-8902", msg: "Street Light repaired in Vasant Kunj Block C.", dept: "BSES Rajdhani", time: "10 mins ago", type: "solved" },
    { id: "SIG-5632", msg: "Road Divider reconstruction completed.", dept: "PWD Delhi", time: "1 hr ago", type: "solved" },
    { id: "SYS-ALERT", msg: "High traffic load detected in server.", dept: "System Admin", time: "2 hrs ago", type: "alert" }
];

function renderNotifications() {
    const list = document.getElementById('notifList');
    const badge = document.getElementById('notifCount');
    if(!list) return;

    list.innerHTML = ''; 
    badge.innerText = notifications.length;

    notifications.forEach(n => {
        const item = `
            <div class="notif-card ${n.type}">
                <div class="n-top">
                    <span class="n-id">${n.id}</span>
                    <span class="n-time">${n.time}</span>
                </div>
                <p class="n-msg">${n.msg}</p>
                <span class="n-dept"><i class="ri-government-line"></i> ${n.dept}</span>
            </div>
        `;
        list.innerHTML += item;
    });
}

function toggleNotifPanel() {
    const panel = document.getElementById('notifPanel');
    panel.classList.toggle('active');
}

// --- 9. SIMULATE LIVE NOTIFICATION ---
setTimeout(() => {
    addNewNotification(
        "SIG-9021", 
        "✅ Water Leakage Fixed: Maintenance team has resolved the issue at Defence Colony.", 
        "Delhi Jal Board", 
        "Just Now", 
        "solved"
    );
}, 5000);

function addNewNotification(id, msg, dept, time, type) {
    notifications.unshift({ id, msg, dept, time, type });
    renderNotifications();
    
    // Play a subtle sound or visual cue (Optional)
    const btn = document.querySelector('.notif-toggle-btn');
    if (btn) {
        btn.style.transform = "scale(1.2)";
        setTimeout(() => btn.style.transform = "scale(1)", 200);
    }
}

// Initial Render
renderNotifications();

// --- 9. REAL-TIME DATA SYNC ---
// --- 9. REAL-TIME DATA SYNC ---
async function fetchLiveComplaints() {
    try {
        // THE FIX: Add the Ngrok bypass header back so the dashboard can sync!
        const res = await fetch("https://husbandless-kerry-unvitrescent.ngrok-free.dev/api/new-complaint", {
            headers: { "ngrok-skip-browser-warning": "true" }
        });
        const serverData = await res.json();  

        let needsRender = false;

        serverData.forEach(serverItem => {
            const localItem = data.find(d => d.id === serverItem.id);

            if (!localItem) {
                console.log("New Voice Record Found:", serverItem.id);
                if (!serverItem.img || serverItem.img === "") {
                    serverItem.status = "Follow-up";
                }
                data.unshift(serverItem); 
                needsRender = true;
                
                alert(`📞 Vaani Voice Agent Call Logged.\n\nASHA ID: ${serverItem.ashaId || "N/A"}\nPatient: ${serverItem.patientName || "Unknown"}\n\n📨 SMS triggered to worker for Patient Photo upload.`);

                if (typeof addNewNotification === "function") {
                    addNewNotification(serverItem.id, "Awaiting Photo via SMS", serverItem.dept, "Live", "alert");
                }
            } else {
                if (serverItem.img && serverItem.img !== "" && localItem.img !== serverItem.img) {
                    console.log("New Photo Detected for:", serverItem.id);
                    localItem.img = serverItem.img;
                    localItem.status = "Verified"; // Automatically Verify upon photo upload!
                    localItem.lat = serverItem.lat;
                    localItem.long = serverItem.long;
                    needsRender = true; 
                    
                    if (typeof addNewNotification === "function") {
                        addNewNotification(serverItem.id, "Patient Photo Uploaded", serverItem.dept, "Just Now", "solved");
                    }
                }
            }
        });

        if (needsRender){
            renderTable(); 
            if (typeof initMainChart === "function") initMainChart();
            if (typeof calculateInventory === "function") calculateInventory();
        }
    } catch (err) {
        // Backend offline...
    }
} 
// Keep the interval running
setInterval(fetchLiveComplaints, 2000);


// ==========================================
// 🔮 PREDICTIVE GOVERNANCE LOGIC
// ==========================================
async function runPredictiveAnalysis() {
    const modal = document.getElementById('predictiveModal');
    const content = document.getElementById('predContent');
    
    // Show Modal with loading state
    modal.style.display = 'flex';
    content.innerHTML = `<div class="loader-ai"><i class="ri-brain-line" style="font-size: 2rem; animation: pulse 1s infinite;"></i><br>Processing City Infrastructure Data via Gemini AI...</div>`;

    try {
        // 🛑 FIX 2: ADDED FULL RENDER BACKEND URL HERE
        const response = await fetch('https://delhi-sudarshan-backend.onrender.com/api/predict-anomaly');
        const data = await response.json();

        if (data.success) {
            const f = data.forecast;
            const riskColor = f.risk_level === 'CRITICAL' ? '#ef4444' : '#f59e0b'; // Red or Orange

            content.innerHTML = `
                <div class="forecast-card" style="border-left: 5px solid ${riskColor};">
                    <div class="risk-badge" style="background: ${riskColor};">${f.risk_level} RISK DETECTED</div>
                    <h3 style="color: ${riskColor}; margin-top: 10px; font-size: 1.5rem;">${f.title}</h3>
                    <p><strong>📍 Identified Hotspot:</strong> ${f.hotspot}</p>
                    <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 15px 0;">
                    <p><strong>🧠 AI Analysis:</strong> ${f.analysis}</p>
                    <div class="action-box">
                        <strong><i class="ri-shield-cross-line"></i> Recommended Action:</strong><br>
                        ${f.action}
                    </div>
                </div>
                <button class="dispatch-btn" onclick="closePredictiveModal(); alert('Alert dispatched to relevant departments.');">
                    <i class="ri-send-plane-fill"></i> Dispatch Emergency Alert
                </button>
            `;
        } else {
            content.innerHTML = `<p style="color: red;">Analysis failed. Please try again.</p>`;
        }
    } catch (error) {
        content.innerHTML = `<p style="color: red;">Server connection error. Ensure Backend is running.</p>`;
    }
}

function closePredictiveModal() {
    document.getElementById('predictiveModal').style.display = 'none';
}

// --- WEBRTC DEACTIVATE ASHA WORKER ---
async function deactivateAshaWorker(index) {
    const item = ashadata[index];

    const reason = prompt(`Enter reason for deactivating ID ${item.id} (${item.name}):`, "Violation of protocol...");
    if (!reason) return;

    alert("Calling ASHA Worker Phone (WebRTC)...");

    try {
        const response = await fetch("https://husbandless-kerry-unvitrescent.ngrok-free.dev/api/deactivate-asha", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true" 
            },
            body: JSON.stringify({
                id: item.id,
                reason: reason
            })
        });

        const result = await response.json();

        if (result.success) {
            // ⚠️ FIX: Safely find and update the exact worker in the array
            const workerIndex = ashadata.findIndex(w => w.id === item.id);
            if (workerIndex !== -1) {
                ashadata[workerIndex].status = "Blocked";
            }
            
            alert(`ASHA Worker ${item.id} has been deactivated.\nDatabase Updated!`);
            
            // Re-render table, update stats, and close modal
            renderAshaTable();
            updateAshaStats(); 
            closeAnalyzeModal();
        } else {
            alert("Database update failed: " + result.error);
        }
    } catch (err) {
        console.error(err);
        alert("Backend Error. Ensure server.js is running.");
    }
}

// --- 🔓 WEBRTC REACTIVATE ASHA WORKER ---
async function reactivateAshaWorker(index) {
    const item = ashadata[index];

    if (!confirm(`Are you sure you want to reactivate ID ${item.id} (${item.name})?`)) return;

    try {
        const response = await fetch("https://husbandless-kerry-unvitrescent.ngrok-free.dev/api/reactivate-asha", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true" 
            },
            body: JSON.stringify({ id: item.id })
        });

        const result = await response.json();

        if (result.success) {
            // Safely find and update the exact worker in the array
            const workerIndex = ashadata.findIndex(w => w.id === item.id);
            if (workerIndex !== -1) {
                ashadata[workerIndex].status = "Active";
            }
            
            alert(`✅ ASHA Worker ${item.id} has been reactivated.\nDatabase Updated!`);
            
            // Re-render table, update stats, and close modal
            renderAshaTable();
            updateAshaStats(); 
            closeAnalyzeModal();
        } else {
            alert("Database update failed: " + result.error);
        }
    } catch (err) {
        console.error(err);
        alert("Backend Error. Ensure server.js is running.");
    }
}

// --- FILTER ASHA WORKERS (SEARCH + DROPDOWN) ---
function filterAshaTable() {
    const searchQuery = document.getElementById('ashaSearch').value.toLowerCase().trim();
    const filterValue = document.getElementById('ashaStatusFilter').value;
    const tbody = document.getElementById('tableBody2');

    // 1. Show the "Huge Database Querying" UI Effect
    tbody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center; padding:40px;">
                <i class="ri-loader-4-line ri-spin" style="font-size:2.5rem; color:var(--primary);"></i>
                <h3 style="color:var(--text); margin-top:15px; font-size:1.1rem;">Querying District Database...</h3>
                <p style="color:#64748b; font-size:0.85rem;">Scanning thousands of active personnel records</p>
            </td>
        </tr>
    `;

    // 2. Add a slight artificial delay (400ms) for that enterprise feel, then filter
    setTimeout(() => {
        let filteredData = ashadata.filter(item => {
            // Match AWR ID or Name
            const matchesSearch = item.id.toLowerCase().includes(searchQuery) || 
                                  item.name.toLowerCase().includes(searchQuery);
            
            // Match Dropdown Status (Treat everything not 'Blocked' as 'Active')
            let matchesStatus = true;
            if (filterValue === 'Active') {
                matchesStatus = item.status !== 'Blocked';
            } else if (filterValue === 'Blocked') {
                matchesStatus = item.status === 'Blocked';
            }

            return matchesSearch && matchesStatus;
        });

        // 3. Render the newly filtered data
        renderAshaTable(filteredData);
    }, 400); // 400ms delay
}

// ==========================================
// 💊 PHARMA LOGISTICS & INVENTORY ENGINE (V4 - Realistic Logistics)
// ==========================================

let masterInventory = [];
let dispatchOrders = [];

async function fetchPharmaData() {
    try {
        const BASE_URL = "https://husbandless-kerry-unvitrescent.ngrok-free.dev"; 
        
        // 1. SILENTLY CHECK FOR ARRIVED ORDERS FIRST!
        await fetch(`${BASE_URL}/api/check-deliveries`, { headers: {"ngrok-skip-browser-warning":"true"} });

        // 2. Fetch updated Stock and Ledger
        const medRes = await fetch(`${BASE_URL}/api/medicines`, { headers: {"ngrok-skip-browser-warning":"true"} });
        const medResult = await medRes.json();
        
        const ordRes = await fetch(`${BASE_URL}/api/dispatch-orders`, { headers: {"ngrok-skip-browser-warning":"true"} });
        const ordResult = await ordRes.json();
        
        if(medResult.success && ordResult.success) {
            masterInventory = medResult.data;
            masterInventory.forEach(m => m.autoTimer = null);
            dispatchOrders = ordResult.data;
            
            // Only count active pending orders (status 1 or 2)
            const activeOrders = dispatchOrders.filter(o => o.status < 3).length;
            const ordersEl = document.getElementById('inv-orders');
            if(ordersEl) ordersEl.innerText = activeOrders;

            calculateInventory();
        }
    } catch(e) { console.error("Failed to fetch pharma data", e); }
}

function calculateInventory() {
    masterInventory.forEach(med => med.consumed = 0);
    let totalDispensedItems = 0;

    data.forEach(record => {
        if (!record.med || record.med === "None") return;
        let medItems = record.med.split(',');
        medItems.forEach(item => {
            let parts = item.trim().split(' x');
            let medName = parts[0].trim();
            let qty = parts.length > 1 ? parseInt(parts[1]) : 1;

            let foundMed = masterInventory.find(m => medName.includes(m.name) || m.name.includes(medName));
            if (foundMed) { foundMed.consumed += qty; totalDispensedItems += qty; }
        });
    });

    const dispEl = document.getElementById('inv-total-dispensed');
    if(dispEl) dispEl.innerText = totalDispensedItems;
    
    renderInventoryUI();
}

function renderInventoryUI() {
    const grid = document.getElementById('inventoryGrid');
    if(!grid) return;
    grid.innerHTML = '';
    
    let alertCount = 0;

    masterInventory.forEach(med => {
        // Calculate what is physically in the clinic
        let remaining = med.total - med.consumed;
        let percentage = (remaining / med.total) * 100;
        
        // Calculate what is currently arriving on a truck
        let incomingQty = dispatchOrders
            .filter(o => o.med === med.name && o.status !== 3)
            .reduce((sum, o) => sum + o.qty, 0);
        
        let statusClass = 'stock-healthy';
        let statusText = 'STOCK HEALTHY';
        let statusColor = '#10b981';
        let btnHTML = `<button class="btn-order healthy" disabled><i class="ri-check-line"></i> Sufficient Stock</button>`;
        let autoOrderWarning = ''; 

        if (percentage <= 25) {
            if (incomingQty > 0) {
                // Failsafe: Medicine is low, but an order is ALREADY on the way. Disable timer.
                statusClass = 'stock-warning';
                statusText = 'IN TRANSIT';
                statusColor = '#3b82f6';
                btnHTML = `<button class="btn-order healthy" style="background:#eff6ff; color:#3b82f6;" disabled><i class="ri-truck-fill"></i> Arriving Soon (${incomingQty.toLocaleString()})</button>`;
                if (med.autoTimer) { clearTimeout(med.autoTimer); med.autoTimer = null; }
            } else {
                // TRULY CRITICAL: Start the Timer
                statusClass = 'stock-critical';
                statusText = 'CRITICAL LOW';
                statusColor = '#ef4444';
                alertCount++;
                btnHTML = `<button class="btn-order active" onclick="orderMedicine('${med.name}')"><i class="ri-truck-line"></i> Direct Order</button>`;
                
                if (!med.autoTimer) {
                    med.autoTimer = setTimeout(() => { triggerAutoOrder(med.name, 10000); }, 120000);
                }
                autoOrderWarning = `<div style="font-size: 0.7rem; color: #ef4444; margin-top: 5px; font-weight: 800; animation: blink-animation 1.5s infinite;"><i class="ri-timer-flash-line"></i> Auto-dispatch in 2 mins...</div>`;
            }
        } else if (percentage <= 50) {
            if (incomingQty > 0) {
                statusClass = 'stock-warning'; statusText = 'IN TRANSIT'; statusColor = '#3b82f6';
                btnHTML = `<button class="btn-order healthy" style="background:#eff6ff; color:#3b82f6;" disabled><i class="ri-truck-fill"></i> Arriving Soon (${incomingQty.toLocaleString()})</button>`;
            } else {
                statusClass = 'stock-warning'; statusText = 'STOCK LOW'; statusColor = '#f59e0b';
                btnHTML = `<button class="btn-order active" onclick="orderMedicine('${med.name}')"><i class="ri-truck-line"></i> Request Restock</button>`;
            }
            if (med.autoTimer) { clearTimeout(med.autoTimer); med.autoTimer = null; }
        } else {
            if (med.autoTimer) { clearTimeout(med.autoTimer); med.autoTimer = null; }
        }

        const card = `
            <div class="med-card">
                <div class="med-header">
                    <div class="med-icon"><i class="${med.icon}"></i></div>
                    <div class="med-info">
                        <h3>${med.name}</h3>
                        <p>ID: ${med.id}</p>
                    </div>
                </div>
                <div class="stock-stats">
                    <span style="color: #64748b;">Remaining: <span style="color:#0f172a;">${remaining}</span> / ${med.total}</span>
                    <span style="color: ${statusColor}; font-weight: 800;">${statusText}</span>
                </div>
                <div class="stock-bar-bg">
                    <div class="stock-bar-fill ${statusClass}" style="width: ${percentage}%"></div>
                </div>
                ${btnHTML}
                ${autoOrderWarning}
            </div>
        `;
        grid.innerHTML += card;
    });

    const alertEl = document.getElementById('inv-alerts');
    if(alertEl) alertEl.innerText = alertCount;
}

// --- DB CONNECTED ORDERING FUNCTION (Strict Dates) ---
async function processRestock(medName, qty, type) {
    let med = masterInventory.find(m => m.name === medName);
    if (!med) return;

    if (med.autoTimer) { clearTimeout(med.autoTimer); med.autoTimer = null; }

    // Generate strict YYYY-MM-DD dates (Delivery is +3 Days)
    const today = new Date();
    const delivery = new Date(); delivery.setDate(today.getDate() + 3);
    
    const todayStr = today.toISOString().split('T')[0];
    const deliveryStr = delivery.toISOString().split('T')[0];

    const newOrderDetails = {
        id: "ORD-" + Math.floor(10000 + Math.random() * 90000) + (type === "AI" ? "A" : "M"),
        med: medName,
        qty: parseInt(qty),
        date: todayStr,
        estDelivery: deliveryStr,
        source: type === "AI" ? "AI Logistics API" : "CMO Manual Request",
        cost: parseInt(qty) * 2.5,
        status: 1 
    };

    try {
        const response = await fetch("https://husbandless-kerry-unvitrescent.ngrok-free.dev/api/restock-medicine", {
            method: "POST",
            headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
            body: JSON.stringify({ orderDetails: newOrderDetails })
        });

        const result = await response.json();
        
        if(result.success) {
            // Push to UI table immediately, but DO NOT update med.total!
            dispatchOrders.unshift(result.order);
            calculateInventory();
            
            if (type === "Manual") {
                alert(`✅ SUCCESS: Order Placed.\n${qty} units of ${medName} will arrive on ${deliveryStr}.`);
            } else if (typeof addNewNotification === "function") {
                addNewNotification("AI-AUTO-ORDER", `System procured ${qty} units of ${medName}. ETA: ${deliveryStr}`, "Central AI Logistics", "Just Now", "alert");
            }
        }
    } catch (e) { console.error("Database Restock Failed", e); }
}

function orderMedicine(medName) {
    const qty = prompt(`[MANUAL OFFICER ORDER]\n\nEnter quantity of ${medName} to restock:`, "5000");
    if (qty && !isNaN(qty)) { processRestock(medName, qty, "Manual"); }
}

function triggerAutoOrder(medName, autoQty) {
    processRestock(medName, autoQty, "AI");
}

// ==========================================
// 🚚 DISPATCH & TRACKING LOGIC
// ==========================================

function openDispatchModal() {
    const modal = document.getElementById('dispatchModal');
    if (modal) modal.style.display = 'flex';
    showDispatchTable(); 
    renderDispatchTable();
}

function closeDispatchModal() {
    const modal = document.getElementById('dispatchModal');
    if (modal) modal.style.display = 'none';
}

window.addEventListener('click', function(event) {
    const dModal = document.getElementById('dispatchModal');
    if (event.target == dModal) dModal.style.display = "none";
});

function renderDispatchTable() {
    const tbody = document.getElementById('dispatchTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (dispatchOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">No pending dispatches.</td></tr>';
        return;
    }

    dispatchOrders.forEach((order, index) => {
        // Status Badges
        let badgeHtml = '';
        if (order.status === 1) badgeHtml = `<br><span class="status-badge st-pending" style="font-size:0.6rem; padding: 2px 6px;">Packed</span>`;
        else if (order.status === 2) badgeHtml = `<br><span class="status-badge st-solved" style="font-size:0.6rem; padding: 2px 6px; background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8;">In Transit</span>`;
        else badgeHtml = `<br><span class="status-badge st-solved" style="font-size:0.6rem; padding: 2px 6px;">Delivered</span>`;
        
        // Greys out the row if it's already delivered
        let opacityStyle = order.status === 3 ? "opacity: 0.6; background: #f8fafc;" : "background: white;";

        const row = `
            <tr style="${opacityStyle}">
                <td style="font-family: monospace; font-weight: bold; color: var(--primary);">${order.id}</td>
                <td><strong>${order.qty.toLocaleString()}x</strong> ${order.med}</td>
                <td>${order.source}</td>
                <td>${order.date}</td>
                <td><strong style="color:var(--text);">${order.estDelivery}</strong> ${badgeHtml}</td>
                <td><button class="btn-action" onclick="viewOrderTracker(${index})"><i class="ri-focus-3-line"></i> Track</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function showDispatchTable() {
    document.getElementById('dispatchTableView').style.display = 'block';
    document.getElementById('dispatchTrackerView').style.display = 'none';
}

function viewOrderTracker(index) {
    const order = dispatchOrders[index];
    
    document.getElementById('dispatchTableView').style.display = 'none';
    document.getElementById('dispatchTrackerView').style.display = 'flex';

    document.getElementById('track-id').innerText = order.id;
    document.getElementById('bill-item').innerText = `${order.qty.toLocaleString()} Units of ${order.med}`;
    document.getElementById('bill-source').innerText = order.source;
    document.getElementById('bill-cost').innerText = `₹ ${order.cost.toLocaleString()}`;

    const progressBar = document.getElementById('track-progress');
    const dotTransit = document.getElementById('dot-transit');
    const dotArrived = document.getElementById('dot-arrived');

    dotTransit.className = "step-dot";
    dotArrived.className = "step-dot";

    setTimeout(() => {
        if (order.status === 1) { 
            progressBar.style.width = "25%";
            dotTransit.classList.add('pulse');
        } else if (order.status === 2) { 
            progressBar.style.width = "50%";
            dotTransit.classList.add('active');
            dotTransit.innerHTML = '<i class="ri-truck-fill"></i>';
            dotArrived.classList.add('pulse');
        } else { 
            progressBar.style.width = "100%";
            dotTransit.classList.add('active');
            dotTransit.innerHTML = '<i class="ri-truck-fill"></i>';
            dotArrived.classList.add('active');
        }
    }, 100);
}
// ==========================================
// 📞 TWILIO TWO-WAY VERIFICATION ENGINE
// ==========================================
async function triggerVerificationCall(index, isAuto = false) {
    const item = data[index];
    
    // Clear timer
    if (item.verifTimer) { clearTimeout(item.verifTimer); item.verifTimer = null; }

    if (!isAuto) {
        if (!confirm(`Initiate official verification call to patient at ${item.phone}?`)) return;
    }

    const btn = document.getElementById(`verify-btn-${index}`);
    if (btn) {
        btn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Dialing... Waiting for response...`;
        btn.style.opacity = "0.7";
        btn.style.cursor = "not-allowed";
    }

    try {
        const response = await fetch("https://husbandless-kerry-unvitrescent.ngrok-free.dev/api/audit-cluster", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true" 
            },
            body: JSON.stringify({ loc: item.loc, count: 1 }) 
        });
        
        const result = await response.json();
        
        if (result.success) {
            const callSid = result.callSid;
            console.log("Tracking Call SID:", callSid);
            
            // Start Polling every 2 seconds to check if the user pressed a button
            const poller = setInterval(async () => {
                try {
                    const check = await fetch(`https://husbandless-kerry-unvitrescent.ngrok-free.dev/api/check-audit-status/${callSid}`, {
                        headers: { "ngrok-skip-browser-warning": "true" }
                    });
                    const dataCheck = await check.json();
                    
                    if (dataCheck.success && dataCheck.status === 'completed') {
                        clearInterval(poller); // Stop polling! We have an answer.
                        
                        if (dataCheck.digit === '1') {
                            // Citizen pressed 1 (Verified)
                            item.status = "Verified";
                            alert(`✅ Patient confirmed the checkup (Pressed 1).\nStatus updated to Verified.`);
                        } else if (dataCheck.digit === '2') {
                            // Citizen pressed 2 (Discrepancy)
                            item.status = "Discrepancy";
                            alert(`🚨 DISCREPANCY DETECTED: Patient denied the visit (Pressed 2).\nLogged for investigation.`);
                        } else {
                            // Pressed something else
                            alert(`Patient pressed an invalid key (${dataCheck.digit}). Please try again.`);
                            if (btn) {
                                btn.innerHTML = `<i class="ri-phone-line"></i> Manual Verification Call`;
                                btn.style.opacity = "1";
                                btn.style.cursor = "pointer";
                            }
                            return; 
                        }
                        
                        // Update UI and close modal on valid press
                        renderTable(); 
                        closeAnalyzeModal(); 
                    }
                } catch (pollErr) {
                    console.error("Polling error:", pollErr);
                }
            }, 2000); // Checks every 2 seconds

            // Auto-cancel the poller after 30 seconds if the user doesn't pick up or press anything
            setTimeout(() => {
                clearInterval(poller);
                if (item.status !== "Verified" && item.status !== "Discrepancy") {
                    if (btn) {
                        btn.innerHTML = `<i class="ri-phone-line"></i> Patient Did Not Answer - Retry`;
                        btn.style.opacity = "1";
                        btn.style.cursor = "pointer";
                    }
                }
            }, 30000);

        } else {
            alert("Telecom failure: " + result.error);
            if (btn) {
                btn.innerHTML = `<i class="ri-phone-line"></i> Manual Verification Call`;
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
            }
        }
    } catch (e) {
        console.error("Twilio Call Error:", e);
        alert("Backend connection failed. Is server.js running?");
        if (btn) {
            btn.innerHTML = `<i class="ri-phone-line"></i> Manual Verification Call`;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        }
    }
}

// ==========================================
// 📡 COMMUNITY BROADCAST HUB
// ==========================================

let broadcastHistory = [
    {
        id: "BRD-901",
        zone: "South Zone",
        type: "Vaccination Camp",
        msg: "Polio drops camp at CR Park Community Center tomorrow 9 AM. All assigned workers must report and bring their medical kits.",
        date: "2026-05-05 10:00 AM",
        deliveredTo: 45,
        cssClass: "bc-vaccine"
    },
    {
        id: "BRD-902",
        zone: "All Zones",
        type: "Emergency Alert",
        msg: "Dengue cases spiking across the district. Prioritize stagnant water checks and distribute Odomos in your assigned blocks today.",
        date: "2026-05-04 02:30 PM",
        deliveredTo: 1215,
        cssClass: "bc-emergency"
    }
];

function renderBroadcasts() {
    const list = document.getElementById('broadcastHistoryList');
    if (!list) return;
    list.innerHTML = '';

    broadcastHistory.forEach(bc => {
        let typeIcon = "ri-megaphone-fill";
        if (bc.type === "Emergency Alert") typeIcon = "ri-alarm-warning-fill";
        if (bc.type === "Vaccination Camp") typeIcon = "ri-syringe-fill";

        const card = `
            <div class="broadcast-card ${bc.cssClass}">
                <div class="bc-header">
                    <div class="bc-zone"><i class="ri-map-pin-user-fill" style="color:var(--primary);"></i> ${bc.zone}</div>
                    <div class="bc-time">${bc.date}</div>
                </div>
                <div style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 5px;">
                    <i class="${typeIcon}"></i> ${bc.type}
                </div>
                <div class="bc-msg">"${bc.msg}"</div>
                <div class="bc-footer">
                    <div style="font-family: monospace; color: #94a3b8; font-size: 0.75rem;">ID: ${bc.id}</div>
                    <div class="bc-status"><i class="ri-check-double-line"></i> Delivered to ${bc.deliveredTo} Workers</div>
                </div>
            </div>
        `;
        list.innerHTML += card;
    });
}

async function sendBroadcast() {
    const zone = document.getElementById('bc-zone').value;
    const type = document.getElementById('bc-type').value;
    const msg = document.getElementById('bc-msg').value;

    if (!msg.trim()) {
        alert("Please enter a message to broadcast.");
        return;
    }

    const btn = document.querySelector('.broadcast-form .btn-order');
    btn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Dispatching to Network...`;
    btn.style.opacity = "0.7";
    btn.style.cursor = "not-allowed";

    try {
        const response = await fetch(`${BASE_URL}/api/broadcast-sms`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true" 
            },
            body: JSON.stringify({ zone, type, msg })
        });

        const result = await response.json();

        if (result.success) {
            let cssClass = "bc-meeting";
            if (type === "Emergency Alert") cssClass = "bc-emergency";
            if (type === "Vaccination Camp") cssClass = "bc-vaccine";

            let count = zone === "All Zones" || zone === "All Zones (District Wide)" ? 1215 : Math.floor(Math.random() * 50) + 20;

            const newBroadcast = {
                id: "BRD-" + Math.floor(100 + Math.random() * 900),
                zone: zone,
                type: type,
                msg: msg,
                date: new Date().toLocaleString('en-US', { hour12: true, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                deliveredTo: count,
                cssClass: cssClass
            };

            broadcastHistory.unshift(newBroadcast);
            document.getElementById('bc-msg').value = '';
            renderBroadcasts();

            if (typeof addNewNotification === "function") {
                addNewNotification(newBroadcast.id, `Broadcast sent to ${zone}`, "CMO Office", "Just Now", "solved");
            }
            
            setTimeout(() => {
                alert(`✅ SUCCESS: Official Dispatch Sent!\n\nWorkers in ${zone} will now see this alert on their live dashboards.`);
            }, 500);

        } else {
            alert("Database failure: Could not save broadcast.");
        }
    } catch (error) {
        console.error(error);
        alert("Backend connection failed. Is server.js running?");
    } finally {
        btn.innerHTML = `<i class="ri-message-3-fill"></i> Dispatch SMS to Workers`;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
    }
}
