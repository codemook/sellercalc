// ==========================================
// ส่วนที่ 1: การตั้งค่าและอัตราค่าธรรมเนียม (Settings & Rates)
// ==========================================
function safeParse(id, defaultVal, isPercent = false) {
    let el = document.getElementById(id);
    let val = el ? parseFloat(el.value.replace(/,/g, '')) : NaN;
    if (isNaN(val)) val = defaultVal;
    return isPercent ? val / 100 : val;
}

function getDynamicSettings() {
    return {
        trans: safeParse('set_trans_fee', 3.21, true),
        shopeeProg: safeParse('set_shopee_prog', 7.49, true),
        lazadaProg: safeParse('set_lazada_prog', 6.42, true),
        tiktokProgElec: safeParse('set_tiktok_prog_elec', 6.96, true),
        tiktokProgNonElec: safeParse('set_tiktok_prog_nonelec', 8.03, true),
        fixedShopee: safeParse('set_fixed_shopee', 1.07, false),
        fixedLazada: safeParse('set_fixed_lazada', 0, false),
        fixedTiktok: safeParse('set_fixed_tiktok', 1.07, false),
        tiktokMax: 199
    };
}

function getRates() {
    const s = getDynamicSettings();
    return {
        remote_battery: {
            shopee: { comm: safeParse('set_comm_rb_shopee', 13.38, true), trans: s.trans, prog: s.shopeeProg, fixed: s.fixedShopee },
            lazada: { comm: safeParse('set_comm_rb_lazada', 12.305, true), trans: s.trans, prog: s.lazadaProg, fixed: s.fixedLazada },
            tiktok: { comm: safeParse('set_comm_rb_tiktok', 8.56, true), trans: s.trans, prog: s.tiktokProgElec, fixed: s.fixedTiktok }
        },
        car_remote: {
            shopee: { comm: safeParse('set_comm_cr_shopee', 12.31, true), trans: s.trans, prog: s.shopeeProg, fixed: s.fixedShopee },
            lazada: { comm: safeParse('set_comm_cr_lazada', 12.305, true), trans: s.trans, prog: s.lazadaProg, fixed: s.fixedLazada },
            tiktok: { comm: safeParse('set_comm_cr_tiktok', 8.56, true), trans: s.trans, prog: s.tiktokProgNonElec, fixed: s.fixedTiktok }
        },
        house_key: {
            shopee: { comm: safeParse('set_comm_hk_shopee', 12.31, true), trans: s.trans, prog: s.shopeeProg, fixed: s.fixedShopee },
            lazada: { comm: safeParse('set_comm_hk_lazada', 12.84, true), trans: s.trans, prog: s.lazadaProg, fixed: s.fixedLazada },
            tiktok: { comm: safeParse('set_comm_hk_tiktok', 8.56, true), trans: s.trans, prog: s.tiktokProgNonElec, fixed: s.fixedTiktok }
        },
        car_key: {
            shopee: { comm: safeParse('set_comm_ck_shopee', 12.31, true), trans: s.trans, prog: s.shopeeProg, fixed: s.fixedShopee },
            lazada: { comm: safeParse('set_comm_ck_lazada', 12.305, true), trans: s.trans, prog: s.lazadaProg, fixed: s.fixedLazada },
            tiktok: { comm: safeParse('set_comm_ck_tiktok', 8.56, true), trans: s.trans, prog: s.tiktokProgNonElec, fixed: s.fixedTiktok }
        },
        lishi: {
            shopee: { comm: safeParse('set_comm_ls_shopee', 11.77, true), trans: s.trans, prog: s.shopeeProg, fixed: s.fixedShopee },
            lazada: { comm: safeParse('set_comm_ls_lazada', 11.77, true), trans: s.trans, prog: s.lazadaProg, fixed: s.fixedLazada },
            tiktok: { comm: safeParse('set_comm_ls_tiktok', 7.49, true), trans: s.trans, prog: s.tiktokProgNonElec, fixed: s.fixedTiktok }
        }
    };
}

// ==========================================
// ส่วนที่ 2: ระบบควบคุมหน้าต่าง UI (UI Controls)
// ==========================================
function showTab(tabId, btnElement) {
    document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    btnElement.classList.add('active');

    const rightPanel = document.getElementById('breakdownPanel');
    const mainWrapper = document.querySelector('.main-wrapper');

    if (tabId === 'breakeven') {
        document.getElementById('rightPanelCalculator').style.display = 'none';
        document.getElementById('rightPanelBreakeven').style.display = 'block';
        rightPanel.style.display = 'block';
        mainWrapper.classList.remove('single-column');
    } else if (tabId === 'settings') {
        document.getElementById('rightPanelCalculator').style.display = 'none';
        document.getElementById('rightPanelBreakeven').style.display = 'none';
        rightPanel.style.display = 'none'; 
        mainWrapper.classList.add('single-column'); 
    } else {
        document.getElementById('rightPanelCalculator').style.display = 'block';
        document.getElementById('rightPanelBreakeven').style.display = 'none';
        rightPanel.style.display = 'block';
        mainWrapper.classList.remove('single-column');
    }
}

function toggleCustomRound() {
    const mode = document.getElementById('roundingMode').value;
    const customGroup = document.getElementById('customRoundGroup');
    customGroup.style.display = (mode === 'custom') ? 'block' : 'none';
}

function toggleCard(headerElement) {
    const card = headerElement.closest('.fee-card') || headerElement.closest('.ui-card');
    if (card) card.classList.toggle('collapsed');
}

function toggleDropdown() {
    const dropdown = document.getElementById('moreDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// ปิด Dropdown อัตโนมัติเมื่อคลิกพื้นที่อื่นบนจอ
window.addEventListener('click', function(event) {
    if (!event.target.closest('.navbar-right')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].style.display === 'block') dropdowns[i].style.display = 'none';
        }
    }
});

// ==========================================
// ส่วนที่ 3: ระบบแจ้งเตือน (Toast Notification)
// ==========================================
window.alert = function(message) {
    let type = message.includes('❌') ? 'error' : 'success';
    let cleanMessage = message.replace(/[✅❌🚨]/g, '').trim(); 

    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer'; container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' 
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` 
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    
    toast.innerHTML = `${icon} <span>${cleanMessage}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
};

// ==========================================
// ส่วนที่ 4: ระบบการคำนวณและกราฟ (Calculations & Chart)
// ==========================================
function applyRounding(price) {
    if (price <= 0) return 0;
    const mode = document.getElementById('roundingMode').value;
    if (mode === 'none') return price;
    let rounded = Math.ceil(price);
    if (mode === 'ceil') return rounded;

    if (mode === 'custom') {
        let lastDigit = rounded % 10;
        let targetDigit = parseInt(document.getElementById('customRoundDigit').value);
        if (isNaN(targetDigit) || targetDigit < 0 || targetDigit > 9) targetDigit = 0; 
        if (lastDigit !== targetDigit) {
            if (lastDigit < targetDigit) rounded += (targetDigit - lastDigit);
            else rounded += (10 - lastDigit + targetDigit);
        }
    }
    return rounded;
}

function formatInput(input) {
    let value = input.value.replace(/[^0-9.]/g, '');
    if (!value) { input.value = ''; return; }
    let parts = value.split('.');
    if (parts[0].length > 0) parts[0] = parseInt(parts[0], 10).toLocaleString('en-US');
    if (parts.length > 1) input.value = parts[0] + '.' + parts[1].substring(0, 4);
    else input.value = parts[0];
}

function calculateFixCost() {
    let totalMonthly = 0;
    let totalAnnual = 0;
    document.querySelectorAll('.fix-cost-monthly').forEach(input => {
        totalMonthly += parseFloat(input.value.replace(/,/g, '')) || 0;
    });
    document.querySelectorAll('.fix-cost-annual').forEach(input => {
        totalAnnual += parseFloat(input.value.replace(/,/g, '')) || 0;
    });

    let grandTotalMonthly = totalMonthly + (totalAnnual / 12);
    let grandTotalDaily = grandTotalMonthly / 30; 

    const monthEl = document.getElementById('totalFixCost');
    if (monthEl) monthEl.innerText = grandTotalMonthly.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    const dailyEl = document.getElementById('totalFixCostDaily');
    if (dailyEl) dailyEl.innerText = grandTotalDaily.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function calculatePrice() {
    const category = document.getElementById('category').value;
    const baseCost = parseFloat((document.getElementById('baseProductCost').value || "").replace(/,/g, '')) || 0;
    const buyerShipping = parseFloat((document.getElementById('buyerShipping').value || "").replace(/,/g, '')) || 0;

    let totalCost = 0;
    document.querySelectorAll('.var-cost-input').forEach(input => {
        totalCost += parseFloat(input.value.replace(/,/g, '')) || 0;
    });

    document.getElementById('totalCostDisplay').innerText = totalCost.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const profitValue = parseFloat((document.getElementById('profitValue').value || "").replace(/,/g, '')) || 0;
    const profitType = document.getElementById('profitType').value;
    const RATES = getRates();
    const currentRate = RATES[category];

    let targetProfit = (profitType === 'baht') ? profitValue : baseCost * (profitValue / 100); 
    const breakdownBox = document.getElementById('calcBreakdownContent');

    if (baseCost === 0 && totalCost === 0) {
        document.getElementById('priceWeb').innerText = "0";
        document.getElementById('priceShopee').innerText = "0";
        document.getElementById('priceLazada').innerText = "0";
        document.getElementById('priceTikTok').innerText = "0";
        
        if (document.getElementById('diffShopee')) document.getElementById('diffShopee').innerText = "";
        if (document.getElementById('diffLazada')) document.getElementById('diffLazada').innerText = "";
        if (document.getElementById('diffTikTok')) document.getElementById('diffTikTok').innerText = "";
        
        breakdownBox.innerHTML = `<p class="placeholder-text">กรอกตัวเลขฝั่งซ้าย เพื่อดูวิธีคำนวณ</p>`;
        
        const chartsContainer = document.getElementById('chartsContainer');
        if (chartsContainer) chartsContainer.style.display = 'none';
        
        return;
    }

    let otherCosts = totalCost - baseCost;

    let shopeeFeeRate = currentRate.shopee.comm + currentRate.shopee.trans + currentRate.shopee.prog;
    let shopeePriceRaw = (totalCost + targetProfit + currentRate.shopee.fixed + (buyerShipping * currentRate.shopee.trans)) / (1 - shopeeFeeRate);
    let shopeePrice = applyRounding(shopeePriceRaw);

    let lazadaFeeRate = currentRate.lazada.comm + currentRate.lazada.trans + currentRate.lazada.prog;
    let lazadaPriceRaw = (totalCost + targetProfit + currentRate.lazada.fixed + (buyerShipping * currentRate.lazada.trans)) / (1 - lazadaFeeRate);
    let lazadaPrice = applyRounding(lazadaPriceRaw);

    let s = getDynamicSettings();
    let tiktokCommTrans = currentRate.tiktok.comm + currentRate.tiktok.trans;
    let tiktokPriceRaw = (totalCost + targetProfit + currentRate.tiktok.fixed + (buyerShipping * currentRate.tiktok.trans)) / (1 - tiktokCommTrans - currentRate.tiktok.prog);
    if (tiktokPriceRaw * currentRate.tiktok.prog > s.tiktokMax) {
        tiktokPriceRaw = (totalCost + targetProfit + currentRate.tiktok.fixed + s.tiktokMax + (buyerShipping * currentRate.tiktok.trans)) / (1 - tiktokCommTrans);
    }
    let tiktokPrice = applyRounding(tiktokPriceRaw);

    let webPriceRaw = baseCost + targetProfit + otherCosts;
    let webPrice = applyRounding(webPriceRaw);

    document.getElementById('priceWeb').innerText = webPrice.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('priceShopee').innerText = shopeePrice.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('priceLazada').innerText = lazadaPrice.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('priceTikTok').innerText = tiktokPrice.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const calcDiff = (mpPrice, wPrice) => {
        if (wPrice <= 0 || mpPrice <= wPrice) return ""; 
        let percent = ((mpPrice - wPrice) / wPrice) * 100;
        return `(เพิ่มขึ้น ${percent.toFixed(1)}%)`;
    };
    
    if (document.getElementById('diffShopee')) document.getElementById('diffShopee').innerText = calcDiff(shopeePrice, webPrice);
    if (document.getElementById('diffLazada')) document.getElementById('diffLazada').innerText = calcDiff(lazadaPrice, webPrice);
    if (document.getElementById('diffTikTok')) document.getElementById('diffTikTok').innerText = calcDiff(tiktokPrice, webPrice);
    
    let collapsedStates = {};
    document.querySelectorAll('.fee-card').forEach(card => {
        let name = card.getAttribute('data-name');
        if (name) collapsedStates[name] = card.classList.contains('collapsed');
    });

    let breakdownHTML = ``;
    let webTargetNet = baseCost + targetProfit;
    let profitText = profitType === 'percent' ? `กำไร ${profitValue}%` : `กำไร ${profitValue.toLocaleString('th-TH', {minimumFractionDigits: 0, maximumFractionDigits: 2})} บาท`;
    let targetDetailText = `ต้นทุน ${baseCost.toLocaleString('th-TH', {minimumFractionDigits: 0, maximumFractionDigits: 2})} บาท + ${profitText}`;
    let webActualNet = webPrice - otherCosts;
    let webCollapsed = collapsedStates['Website'] ? 'collapsed' : '';
    
    breakdownHTML += `
        <div class="fee-card ${webCollapsed}" data-name="Website" style="border-color: #cce5ff;">
            <div class="fee-card-header" style="color: #004085; background: #d6ebff;" onclick="toggleCard(this)">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span>📋 รายละเอียดค่าธรรมเนียม Website</span>
                    <img src="./images/website.png" style="height: 16px; width: auto;" alt="Web">
                </div>
                <span class="toggle-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
            </div>
            <div class="fee-card-body">
                <div class="fee-row fee-main-price"><span style="white-space: nowrap;">ราคาขายที่ควรตั้ง</span><span style="white-space: nowrap;">฿${webPrice.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                <div class="fee-item" style="background-color: #fffdf5;">
                    <div class="fee-item-main"><span class="fee-name">🎯 ${targetDetailText}</span><span>฿${webTargetNet.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                    <div class="fee-item-main"><span class="fee-name">📦 ค่าจัดส่งและแพ็คเกจ</span><span>฿${otherCosts.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                </div>
                <div class="fee-row fee-net">
                    <div>เงินที่จะได้รับจริง</div>
                    <strong>฿${webActualNet.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                </div>
            </div>
        </div>`;

    const createMarketplaceCard = (name, price, cost, targetProfit, targetDetailStr, other, commRate, transRate, progRate, fixed, color, bgColor, logoUrl, logoHeight, progMax, bShipping) => {
        let targetNet = cost + targetProfit;
        let saleFee = price * commRate;
        let transFee = (price + bShipping) * transRate; 
        let progFee = progRate > 0 ? price * progRate : 0;
        if (progMax && progFee > progMax) progFee = progMax;
        
        let totalFee = saleFee + transFee + progFee + fixed;
        let actualNet = price - totalFee - other;
        let pStr = price.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        let isCollapsed = collapsedStates[name] ? 'collapsed' : '';
        
        return `
        <div class="fee-card ${isCollapsed}" data-name="${name}" style="border-color: ${color}40;">
            <div class="fee-card-header" style="color: ${color}; background: ${bgColor};" onclick="toggleCard(this)">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span>📋 รายละเอียดค่าธรรมเนียม</span>
                    <img src="${logoUrl}" style="height: ${logoHeight}; width: auto;" alt="${name}">
                </div>
                <span class="toggle-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
            </div>
            <div class="fee-card-body">
                <div class="fee-row fee-main-price"><span>ราคาขายที่ควรตั้ง</span><span>฿${pStr}</span></div>
                <div class="fee-item" style="background-color: #fffdf5;">
                    <div class="fee-item-main"><span class="fee-name">🎯 ${targetDetailStr}</span><span>฿${targetNet.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                    <div class="fee-item-main"><span class="fee-name">📦 ค่าจัดส่งและแพ็คเกจ</span><span>฿${other.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                </div>
                ${commRate > 0 ? `<div class="fee-item"><div class="fee-item-main"><span class="fee-name" style="color: #666;">ค่าธรรมเนียมขาย (${(commRate * 100).toFixed(2)}%)</span><span class="fee-amount">-฿${saleFee.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div><div class="fee-calc">฿${pStr} × ${(commRate * 100).toFixed(2)}%</div></div>` : ''}
                ${transRate > 0 ? `<div class="fee-item"><div class="fee-item-main"><span class="fee-name" style="color: #666;">ธุรกรรม (${(transRate * 100).toFixed(2)}%)</span><span class="fee-amount">-฿${transFee.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div><div class="fee-calc">(฿${pStr} + ค่าส่งที่ลูกค้าจ่าย) × ${(transRate * 100).toFixed(2)}%</div></div>` : ''}
                ${progRate > 0 ? `<div class="fee-item"><div class="fee-item-main"><span class="fee-name" style="color: #666;">โปรแกรมพิเศษ (${(progRate * 100).toFixed(2)}%)</span><span class="fee-amount">-฿${progFee.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div></div>` : ''}
                ${fixed > 0 ? `<div class="fee-item"><div class="fee-item-main"><span class="fee-name" style="color: #666;">โครงสร้างพื้นฐาน</span><span class="fee-amount">-฿${fixed.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div></div>` : ''}
                <div class="fee-row fee-total"><span style="color: #333;">รวมค่าธรรมเนียม</span><span class="fee-amount-total">-฿${totalFee.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                <div class="fee-row fee-net">
                    <div>เงินที่จะได้รับจริง <span style="font-size: 13px; font-weight: normal; color: #555;"><br>(หักค่าส่ง ฿${other.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})})</span></div>
                    <strong>฿${actualNet.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                </div>
            </div>
        </div>`;
    };

    breakdownHTML += createMarketplaceCard('Shopee', shopeePrice, baseCost, targetProfit, targetDetailText, otherCosts, currentRate.shopee.comm, currentRate.shopee.trans, currentRate.shopee.prog, currentRate.shopee.fixed, '#ee4d2d', '#fff1ee', './images/shopee.png', '20px', null, buyerShipping);
    breakdownHTML += createMarketplaceCard('Lazada', lazadaPrice, baseCost, targetProfit, targetDetailText, otherCosts, currentRate.lazada.comm, currentRate.lazada.trans, currentRate.lazada.prog, currentRate.lazada.fixed, '#0f146d', '#f2f3ff', './images/lazada.png', '16px', null, buyerShipping);
    breakdownHTML += createMarketplaceCard('TikTok', tiktokPrice, baseCost, targetProfit, targetDetailText, otherCosts, currentRate.tiktok.comm, currentRate.tiktok.trans, currentRate.tiktok.prog, currentRate.tiktok.fixed, '#000000', '#f5f5f5', './images/tiktok.png', '16px', s.tiktokMax, buyerShipping);

    breakdownBox.innerHTML = breakdownHTML;

    // ระบบสร้างกราฟวงกลม
    const chartsContainer = document.getElementById('chartsContainer');
    if (chartsContainer) {
        chartsContainer.style.display = 'grid'; 
        
        const customTooltip = {
            titleFont: { family: 'Sarabun', size: 14 },
            bodyFont: { family: 'Sarabun', size: 14 },
            callbacks: {
                label: function(context) {
                    let label = context.label || '';
                    let value = context.raw || 0;
                    let dataset = context.chart.data.datasets[context.datasetIndex];
                    let total = dataset.data.reduce((acc, current) => acc + current, 0);
                    let percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
                    return ` ${label}: ฿${value.toLocaleString('th-TH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${percentage})`;
                }
            }
        };

        const customLegend = {
            position: 'bottom',
            labels: {
                font: { family: 'Sarabun', size: 13 },
                padding: 12, boxWidth: 12,
                generateLabels: function(chart) {
                    const data = chart.data;
                    if (data.labels.length && data.datasets.length) {
                        const dataset = data.datasets[0];
                        const total = dataset.data.reduce((acc, current) => acc + current, 0);
                        return data.labels.map((label, i) => {
                            const value = dataset.data[i];
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
                            const meta = chart.getDatasetMeta(0);
                            const style = meta.controller.getStyle(i);
                            return { text: `${label} (${percentage})`, fillStyle: style.backgroundColor, strokeStyle: style.borderColor, lineWidth: style.borderWidth, hidden: !chart.getDataVisibility(i), index: i };
                        });
                    }
                    return [];
                }
            }
        };

        let webChartData = [baseCost, targetProfit, otherCosts];
        
        if (window.webPieChart) window.webPieChart.destroy(); // เคลียร์กราฟเก่าทิ้งก่อนวาดใหม่
        const ctxWeb = document.getElementById('webChart').getContext('2d');
        window.webPieChart = new Chart(ctxWeb, {
            type: 'doughnut',
            data: { labels: ['ต้นทุน', 'กำไร', 'จัดส่ง+แพ็ค'], datasets: [{ data: webChartData, backgroundColor: ['#007bff', '#28a745', '#ffc107'], borderWidth: 2, hoverOffset: 5 }] },
            options: { 
                responsive: true, 
                layout: { padding: { bottom: 25 } },
                plugins: { legend: customLegend, title: { display: true, text: '🌐 สัดส่วนเงิน (Website)', font: { family: 'Sarabun', size: 14 } }, tooltip: customTooltip } 
            }
        });

        let saleFee = shopeePrice * currentRate.shopee.comm;
        let transFee = (shopeePrice + buyerShipping) * currentRate.shopee.trans;
        let progFee = currentRate.shopee.prog > 0 ? shopeePrice * currentRate.shopee.prog : 0;
        let totalFee = saleFee + transFee + progFee + currentRate.shopee.fixed;
        let mpChartData = [baseCost, targetProfit, otherCosts, totalFee];
        
        if (window.marketplacePieChart) window.marketplacePieChart.destroy(); // เคลียร์กราฟเก่าทิ้งก่อนวาดใหม่
        const ctxMp = document.getElementById('marketplaceChart').getContext('2d');
        window.marketplacePieChart = new Chart(ctxMp, {
            type: 'doughnut',
            data: { labels: ['ต้นทุน', 'กำไร', 'จัดส่ง+แพ็ค', 'ค่าธรรมเนียม'], datasets: [{ data: mpChartData, backgroundColor: ['#007bff', '#28a745', '#ffc107', '#ee4d2d'], borderWidth: 2, hoverOffset: 5 }] },
            options: { responsive: true, plugins: { legend: customLegend, title: { display: true, text: '🛒 สัดส่วนเงิน (Marketplace)', font: { family: 'Sarabun', size: 14 } }, tooltip: customTooltip } }
        });
    }
}

// ==========================================
// ส่วนที่ 5: ระบบจัดการข้อมูลในเครื่อง (Data Management)
// ==========================================
function initInputIDs() {
    document.querySelectorAll('input:not([id]), select:not([id])').forEach((el, index) => {
        if(!el.closest('.dynamic-row')) el.id = 'auto_static_' + index;
    });
}

function clearData() {
    if (confirm('🚨 ต้องการล้างข้อมูลที่กรอกไว้ทั้งหมดเพื่อเริ่มใหม่ใช่หรือไม่?')) {
        localStorage.removeItem('sellerCalcDraft');
        location.reload();
    }
}

function addExpenseRow() {
    const list = document.getElementById('dynamicExpenseList');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `<input type="text" placeholder="ระบุชื่อค่าใช้จ่าย..." class="expense-name"><div class="input-unit-wrapper" style="flex: 1;"><input type="text" inputmode="numeric" class="fix-cost-monthly" placeholder="ราคา" oninput="formatInput(this); calculateFixCost()"><span class="unit-text">บาท/เดือน</span></div><button type="button" class="btn-remove" onclick="removeExpenseRow(this)">ลบ</button>`;
    list.appendChild(row);
    updateRemoveButtons();
}

function removeExpenseRow(btn) { 
    btn.parentElement.remove(); 
    calculateFixCost(); 
    updateRemoveButtons(); 
    saveToMemory(); 
}

function updateRemoveButtons() {
    const rows = document.getElementById('dynamicExpenseList').querySelectorAll('.dynamic-row');
    rows.forEach(row => { row.querySelector('.btn-remove').disabled = rows.length <= 1; });
}

function addVarExpenseRow() {
    const list = document.getElementById('dynamicVarExpenseList');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `<input type="text" placeholder="ระบุชื่อค่าใช้จ่าย..." class="expense-name"><div class="input-unit-wrapper" style="flex: 1;"><input type="text" inputmode="numeric" class="var-cost-input" placeholder="ราคา" oninput="formatInput(this); calculatePrice()"><span class="unit-text">บาท/ชิ้น</span></div><button type="button" class="btn-remove" onclick="removeVarExpenseRow(this)">ลบ</button>`;
    list.appendChild(row);
    updateVarRemoveButtons();
}

function removeVarExpenseRow(btn) { 
    btn.parentElement.remove(); 
    calculatePrice(); 
    updateVarRemoveButtons(); 
    saveToMemory(); 
}

function updateVarRemoveButtons() {
    const rows = document.getElementById('dynamicVarExpenseList').querySelectorAll('.dynamic-row');
    rows.forEach(row => { row.querySelector('.btn-remove').disabled = rows.length <= 1; });
}

function getDynamicData(containerId) {
    let arr = [];
    document.querySelectorAll(`#${containerId} .dynamic-row`).forEach(row => {
        let name = row.querySelector('.expense-name').value;
        let valInput = row.querySelector('input[inputmode="numeric"]');
        arr.push({ name: name, val: valInput ? valInput.value : '' });
    });
    return arr;
}

function setDynamicData(containerId, arr, isVarCost) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    if (!arr || arr.length === 0) {
        if(isVarCost) addVarExpenseRow(); else addExpenseRow();
        return;
    }
    arr.forEach(item => {
        const row = document.createElement('div');
        row.className = 'dynamic-row';
        row.innerHTML = `<input type="text" placeholder="ระบุชื่อค่าใช้จ่าย..." class="expense-name"><div class="input-unit-wrapper" style="flex: 1;"><input type="text" inputmode="numeric" class="${isVarCost ? 'var-cost-input' : 'fix-cost-monthly'}" placeholder="ราคา" oninput="formatInput(this); ${isVarCost ? 'calculatePrice()' : 'calculateFixCost()'}"><span class="unit-text">${isVarCost ? 'บาท/ชิ้น' : 'บาท/เดือน'}</span></div><button type="button" class="btn-remove" onclick="${isVarCost ? 'removeVarExpenseRow(this)' : 'removeExpenseRow(this)'}">ลบ</button>`;
        row.querySelector('.expense-name').value = item.name;
        row.querySelector('input[inputmode="numeric"]').value = item.val;
        container.appendChild(row);
    });
    if(isVarCost) updateVarRemoveButtons(); else updateRemoveButtons();
}

function saveToMemory() {
    let data = { inputs: {}, dynamicVar: getDynamicData('dynamicVarExpenseList'), dynamicFix: getDynamicData('dynamicExpenseList') };
    document.querySelectorAll('input, select').forEach(el => {
        if(el.id && el.id !== 'profileName' && el.id !== 'profileSelect') data.inputs[el.id] = el.value;
    });
    localStorage.setItem('sellerCalcDraft', JSON.stringify(data));
}

function loadFromMemory() {
    let data = JSON.parse(localStorage.getItem('sellerCalcDraft'));
    if(!data) return;
    for(let id in data.inputs) {
        let el = document.getElementById(id);
        if(el) el.value = data.inputs[id];
    }
    if(data.dynamicVar) setDynamicData('dynamicVarExpenseList', data.dynamicVar, true);
    if(data.dynamicFix) setDynamicData('dynamicExpenseList', data.dynamicFix, false);
}

function updateProfileDropdown() {
    const select = document.getElementById('profileSelect');
    let profiles = JSON.parse(localStorage.getItem('sellerProfiles') || '{}');
    select.innerHTML = '<option value="">-- เลือกสินค้าที่บันทึกไว้ --</option>';
    for(let name in profiles) {
        let opt = document.createElement('option');
        opt.value = name; opt.innerText = name;
        select.appendChild(opt);
    }
}

function saveProfile() {
    const name = document.getElementById('profileName').value.trim();
    if(!name) return alert('❌ กรุณาตั้งชื่อสินค้าก่อนบันทึก');
    
    let data = { inputs: {}, dynamicVar: getDynamicData('dynamicVarExpenseList'), dynamicFix: getDynamicData('dynamicExpenseList') };
    document.querySelectorAll('input, select').forEach(el => { 
        if(el.id && el.id !== 'profileName' && el.id !== 'profileSelect') data.inputs[el.id] = el.value; 
    });
    
    let profiles = JSON.parse(localStorage.getItem('sellerProfiles') || '{}');
    profiles[name] = data;
    localStorage.setItem('sellerProfiles', JSON.stringify(profiles));
    alert('✅ บันทึกโปรไฟล์ "' + name + '" สำเร็จ!');
    updateProfileDropdown();
    document.getElementById('profileSelect').value = name;
}

function loadProfile() {
    const name = document.getElementById('profileSelect').value;
    if(!name) return;
    let profiles = JSON.parse(localStorage.getItem('sellerProfiles') || '{}');
    if(profiles[name]) {
        for(let id in profiles[name].inputs) {
            let el = document.getElementById(id);
            if(el) el.value = profiles[name].inputs[id];
        }
        if(profiles[name].dynamicVar) setDynamicData('dynamicVarExpenseList', profiles[name].dynamicVar, true);
        if(profiles[name].dynamicFix) setDynamicData('dynamicExpenseList', profiles[name].dynamicFix, false);
        
        document.getElementById('profileName').value = name;
        calculatePrice(); calculateFixCost(); toggleCustomRound();
        saveToMemory(); 
    }
}

function deleteProfile() {
    const name = document.getElementById('profileSelect').value;
    if(!name) return alert('❌ กรุณาเลือกสินค้าที่ต้องการลบจาก Dropdown ก่อน');
    if(confirm(`🚨 ยืนยันการลบโปรไฟล์สินค้า "${name}" ใช่หรือไม่?`)) {
        let profiles = JSON.parse(localStorage.getItem('sellerProfiles') || '{}');
        delete profiles[name];
        localStorage.setItem('sellerProfiles', JSON.stringify(profiles));
        updateProfileDropdown();
        document.getElementById('profileName').value = '';
    }
}

function renameProfile() {
    const select = document.getElementById('profileSelect');
    const oldName = select.value;
    if(!oldName) return alert('❌ กรุณาเลือกสินค้าจาก Dropdown ก่อน');
    const newName = prompt('✏️ ระบุชื่อใหม่สำหรับสินค้านี้:', oldName);
    if(newName && newName.trim() !== '' && newName !== oldName) {
        let profiles = JSON.parse(localStorage.getItem('sellerProfiles') || '{}');
        profiles[newName.trim()] = profiles[oldName];
        delete profiles[oldName];
        localStorage.setItem('sellerProfiles', JSON.stringify(profiles));
        updateProfileDropdown();
        select.value = newName.trim();
        document.getElementById('profileName').value = newName.trim();
    }
}

function exportData() {
    const includeProfiles = document.getElementById('ex_profiles').checked;
    const includeExpenses = document.getElementById('ex_expenses').checked;
    const includeSettings = document.getElementById('ex_settings').checked;

    if (!includeProfiles && !includeExpenses && !includeSettings) return alert('❌ กรุณาเลือกอย่างน้อย 1 รายการเพื่อส่งออก');

    let backupData = { version: "1.1", timestamp: new Date().toISOString(), data: {} };
    if (includeProfiles) backupData.data.sellerProfiles = JSON.parse(localStorage.getItem('sellerProfiles') || '{}');

    if (includeExpenses || includeSettings) {
        let draft = JSON.parse(localStorage.getItem('sellerCalcDraft') || '{"inputs":{}}');
        let exportDraft = { inputs: {} };
        
        if (includeExpenses) {
            exportDraft.dynamicVar = draft.dynamicVar || [];
            exportDraft.dynamicFix = draft.dynamicFix || [];
            for (let k in draft.inputs) {
                if (!k.startsWith('set_') && k !== 'roundingMode' && k !== 'customRoundDigit') exportDraft.inputs[k] = draft.inputs[k];
            }
        }
        
        if (includeSettings) {
            for (let k in draft.inputs) {
                if (k.startsWith('set_') || k === 'roundingMode' || k === 'customRoundDigit') exportDraft.inputs[k] = draft.inputs[k];
            }
        }
        backupData.data.sellerCalcDraft = exportDraft;
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SellerCalc_Backup_${new Date().toLocaleDateString('th-TH').replace(/\//g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function importData(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            if (!backupData.data) throw new Error("ไฟล์ไม่ถูกต้อง");

            let message = "ยืนยันการนำเข้าข้อมูล:\n";
            if (backupData.data.sellerProfiles && Object.keys(backupData.data.sellerProfiles).length > 0) message += "- 📦 รายการสินค้าที่บันทึกไว้\n";
            if (backupData.data.sellerCalcDraft) {
                let hasExpenses = backupData.data.sellerCalcDraft.dynamicVar || Object.keys(backupData.data.sellerCalcDraft.inputs || {}).some(k => !k.startsWith('set_') && k !== 'roundingMode' && k !== 'customRoundDigit');
                let hasSettings = Object.keys(backupData.data.sellerCalcDraft.inputs || {}).some(k => k.startsWith('set_') || k === 'roundingMode');
                if (hasExpenses) message += "- 💸 ค่าใช้จ่ายต่าง ๆ\n";
                if (hasSettings) message += "- ⚙️ ตั้งค่าค่าธรรมเนียม\n";
            }
            message += "\n⚠️ ข้อมูลที่นำเข้าจะไปอัปเดตแทนที่ข้อมูลเดิมในเครื่อง!";

            if (confirm(message)) {
                if (backupData.data.sellerProfiles) localStorage.setItem('sellerProfiles', JSON.stringify(backupData.data.sellerProfiles));
                if (backupData.data.sellerCalcDraft) {
                    let currentDraft = JSON.parse(localStorage.getItem('sellerCalcDraft') || '{"inputs":{}}');
                    let importedDraft = backupData.data.sellerCalcDraft;
                    if (importedDraft.inputs) {
                        for (let k in importedDraft.inputs) currentDraft.inputs[k] = importedDraft.inputs[k];
                    }
                    if (importedDraft.dynamicVar) currentDraft.dynamicVar = importedDraft.dynamicVar;
                    if (importedDraft.dynamicFix) currentDraft.dynamicFix = importedDraft.dynamicFix;
                    localStorage.setItem('sellerCalcDraft', JSON.stringify(currentDraft));
                }
                alert('✅ นำเข้าข้อมูลสำเร็จ! ระบบจะทำการรีโหลดหน้าเว็บ');
                setTimeout(() => location.reload(), 1500);
            }
        } catch (err) {
            alert('❌ เกิดข้อผิดพลาด: ไฟล์ที่เลือกไม่ใช่รูปแบบที่ถูกต้อง');
        }
    };
    reader.readAsText(file);
    input.value = ''; 
}

// ==========================================
// ส่วนที่ 6: ระบบบันทึกรูปภาพและคัดลอกข้อความ (Export Image & Text)
// ==========================================
function copySummaryText() {
    const name = document.getElementById('profileName').value || 'ไม่มีชื่อ';
    const web = document.getElementById('priceWeb').innerText;
    const sh = document.getElementById('priceShopee').innerText;
    const lz = document.getElementById('priceLazada').innerText;
    const tt = document.getElementById('priceTikTok').innerText;
    
    const diffSh = document.getElementById('diffShopee') ? document.getElementById('diffShopee').innerText : '';
    const diffLz = document.getElementById('diffLazada') ? document.getElementById('diffLazada').innerText : '';
    const diffTt = document.getElementById('diffTikTok') ? document.getElementById('diffTikTok').innerText : '';
    
    const text = `📦 สรุปราคาขาย: ${name}\n🌐 Website: ฿${web}\n🧡 Shopee: ฿${sh} ${diffSh}\n💙 Lazada: ฿${lz} ${diffLz}\n🖤 TikTok: ฿${tt} ${diffTt}`.replace(/ \n/g, '\n');
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => alert('✅ คัดลอกข้อความเรียบร้อยแล้ว!')).catch(() => fallbackCopyTextToClipboard(text));
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus(); textArea.select();
    try {
        if (document.execCommand('copy')) alert('✅ คัดลอกข้อความเรียบร้อยแล้ว!');
        else alert('❌ ไม่สามารถคัดลอกได้ กรุณาแคปหน้าจอแทน');
    } catch (err) { alert('❌ เบราว์เซอร์ของคุณปิดกั้นการคัดลอกอัตโนมัติ'); }
    document.body.removeChild(textArea);
}

async function downloadSlip() {
    const btn = document.querySelector('button[onclick="downloadSlip()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ กำลังประมวลผล...';
    btn.disabled = true;

    const exportWidth = 1350; 
    const exportDiv = document.createElement('div');
    exportDiv.style.cssText = `width: ${exportWidth}px !important; padding: 30px !important; background: #f0f2f5 !important; position: absolute !important; left: -9999px !important; top: 0 !important; box-sizing: border-box !important;`;

    const summaryCard = document.querySelector('.result-grid').parentElement.cloneNode(true);
    const methodCard = document.getElementById('calcBreakdownContent').parentElement.cloneNode(true);
    
    const sGrid = summaryCard.querySelector('.result-grid');
    sGrid.style.cssText = "display: flex !important; flex-direction: row !important; gap: 15px !important; margin-bottom: 20px !important;";
    sGrid.querySelectorAll('.result-box').forEach(box => {
        box.style.cssText = "flex: 1 !important; background: white !important; border: 2px solid #e1e4e8 !important; border-radius: 8px !important; padding: 15px !important; text-align: center !important; display: flex !important; flex-direction: column !important; justify-content: center !important;";
    });

    const originalSelect = document.getElementById('roundingMode');
    const clonedSelect = summaryCard.querySelector('#roundingMode');
    if (originalSelect && clonedSelect) {
        const textDiv = document.createElement('div');
        textDiv.style.cssText = "padding: 10px 12px; background: #ffffff; border: 1px solid #ccd0d5; border-radius: 6px; font-size: 15px; color: #333; text-align: left;";
        let roundText = originalSelect.options[originalSelect.selectedIndex].text;
        if (originalSelect.value === 'custom') roundText += ` (ลงท้ายด้วยเลข ${document.getElementById('customRoundDigit').value})`;
        textDiv.innerText = roundText;
        clonedSelect.parentNode.replaceChild(textDiv, clonedSelect);
    }
    const clonedCustomGroup = summaryCard.querySelector('#customRoundGroup');
    if (clonedCustomGroup) clonedCustomGroup.remove();

    const mContent = methodCard.querySelector('#calcBreakdownContent');
    mContent.style.cssText = "display: flex !important; flex-direction: row !important; gap: 15px !important; align-items: flex-start !important;";
    
    const origWebChart = document.getElementById('webChart');
    const cloneWebChart = methodCard.querySelector('#webChart');
    if (origWebChart && cloneWebChart) cloneWebChart.getContext('2d').drawImage(origWebChart, 0, 0);

    const origMpChart = document.getElementById('marketplaceChart');
    const cloneMpChart = methodCard.querySelector('#marketplaceChart');
    if (origMpChart && cloneMpChart) cloneMpChart.getContext('2d').drawImage(origMpChart, 0, 0);
    
    methodCard.querySelectorAll('.fee-card').forEach(card => {
        card.classList.remove('collapsed');
        card.querySelector('.fee-card-body').style.display = 'block';
    });

    [summaryCard, methodCard].forEach(c => c.querySelectorAll('button, select').forEach(b => b.remove()));

    exportDiv.appendChild(summaryCard);
    exportDiv.appendChild(methodCard);
    document.body.appendChild(exportDiv);

    setTimeout(() => {
        html2canvas(exportDiv, { scale: 2, backgroundColor: "#f0f2f5", width: exportWidth, windowWidth: exportWidth, useCORS: true }).then(canvas => {
            const pName = document.getElementById('profileName').value.trim() || 'ไม่มีชื่อ';
            const link = document.createElement('a');
            link.download = `สรุปราคาขาย_${pName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            document.body.removeChild(exportDiv);
            btn.innerHTML = originalText; btn.disabled = false;
        }).catch(err => {
            btn.disabled = false; btn.innerHTML = originalText;
            alert('❌ บันทึกรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
        });
    }, 500); 
}

function copyBreakevenText() {
    let details = [];
    details.push('📅 ค่าใช้จ่ายต่าง ๆ (รายเดือน)');
    document.querySelectorAll('#breakeven .ui-card')[0].querySelectorAll('.input-group').forEach(group => {
        details.push(`- ${group.querySelector('label').innerText}: ฿${group.querySelector('input').value || '0'}`);
    });

    details.push('\n💻 ค่าโปรแกรมขาย (รายปี)');
    document.querySelectorAll('#breakeven .ui-card')[1].querySelectorAll('.input-group').forEach(group => {
        details.push(`- ${group.querySelector('label').innerText}: ฿${group.querySelector('input').value || '0'}`);
    });

    let otherRows = document.getElementById('dynamicExpenseList').querySelectorAll('.dynamic-row');
    let otherTexts = [];
    otherRows.forEach(row => {
        let expName = row.querySelector('.expense-name').value;
        let val = row.querySelector('.fix-cost-monthly').value;
        if(expName || val) otherTexts.push(`- ${expName || 'ไม่มีชื่อ'}: ฿${val || '0'}`);
    });
    
    if(otherTexts.length > 0) {
        details.push('\n➕ ค่าใช้จ่ายอื่น ๆ (รายเดือน)');
        details = details.concat(otherTexts);
    }

    const monthly = document.getElementById('totalFixCost').innerText;
    const daily = document.getElementById('totalFixCostDaily').innerText;
    const text = `${details.join('\n')}\n\n====================\n💰 สรุปรายเดือน: ฿${monthly}\n📅 เฉลี่ยรายวัน: ฿${daily}`;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => alert('✅ คัดลอกข้อความจุดคุ้มทุนเรียบร้อยแล้ว!')).catch(() => fallbackCopyTextToClipboard(text));
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

async function downloadBreakevenSlip() {
    const btn = document.querySelector('button[onclick="downloadBreakevenSlip()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ กำลังประมวลผล...';
    btn.disabled = true;

    const exportWidth = 1200; 
    const exportDiv = document.createElement('div');
    exportDiv.style.cssText = `width: ${exportWidth}px !important; padding: 30px !important; background: #f0f2f5 !important; position: absolute !important; left: -9999px !important; top: 0 !important; display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; box-sizing: border-box !important; align-items: flex-start !important;`;

    const leftCol = document.getElementById('breakeven').cloneNode(true);
    leftCol.className = ''; 
    leftCol.style.cssText = "display: block !important; opacity: 1 !important; animation: none !important; transform: none !important;";
    
    const origInputs = document.getElementById('breakeven').querySelectorAll('input');
    const cloneInputs = leftCol.querySelectorAll('input');
    origInputs.forEach((origInput, index) => {
        const textDiv = document.createElement('div');
        textDiv.className = origInput.className; 
        textDiv.style.cssText = "width: 100%; padding: 10px 12px; background-color: #ffffff; border: 1px solid #ccd0d5; border-radius: 6px; font-size: 15px; color: #333; height: 44px; display: flex; align-items: center; box-sizing: border-box; overflow: hidden; white-space: nowrap;";
        textDiv.innerText = origInput.value || '';
        cloneInputs[index].parentNode.replaceChild(textDiv, cloneInputs[index]);
    });

    leftCol.querySelectorAll('button, .toggle-icon').forEach(el => el.remove());
    leftCol.querySelectorAll('.ui-card').forEach(card => {
        card.classList.remove('collapsed');
        card.querySelector('.ui-card-body').style.display = 'block';
    });

    const rightCol = document.getElementById('breakevenExportArea').cloneNode(true);
    rightCol.style.margin = '0';

    exportDiv.appendChild(leftCol);
    exportDiv.appendChild(rightCol);
    document.body.appendChild(exportDiv);

    setTimeout(() => {
        html2canvas(exportDiv, { scale: 2, backgroundColor: "#f0f2f5", width: exportWidth, windowWidth: exportWidth, useCORS: true }).then(canvas => {
            const link = document.createElement('a');
            link.download = `สรุปค่าใช้จ่ายทั้งหมด.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            document.body.removeChild(exportDiv);
            btn.innerHTML = originalText; btn.disabled = false;
        }).catch(err => {
            btn.disabled = false; btn.innerHTML = originalText;
            alert('❌ บันทึกรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
        });
    }, 500); 
}

// ==========================================
// ส่วนที่ 7: เริ่มต้นการทำงาน (Initialization)
// ==========================================
window.onload = function() {
    initInputIDs(); 
    updateProfileDropdown();
    loadFromMemory();
    
    toggleCustomRound();
    calculateFixCost();
    updateRemoveButtons();
    calculatePrice();
    updateVarRemoveButtons();

    document.addEventListener('input', saveToMemory);
    document.addEventListener('change', saveToMemory);

    document.querySelectorAll('input[inputmode="numeric"]').forEach(input => {
        input.addEventListener('focus', function() { this.select(); });
    });
};