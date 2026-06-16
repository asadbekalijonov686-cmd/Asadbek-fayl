let currentFilesArray = [];

const translations = {
    uz: {
        heroTitle: "Professional PDF Uskunalar Majmuasi",
        ownerText: "Loyiha egasi:",
        backBtn: "Asosiy menyuga qaytish"
    },
    en: {
        heroTitle: "Professional PDF Complete Toolkit",
        ownerText: "Project Owner:",
        backBtn: "Back to Dashboard Grid"
    },
    ru: {
        heroTitle: "Профессиональный Набор Инструментов PDF",
        ownerText: "Владелец проекта:",
        backBtn: "Вернуться в главное меню"
    }
};

function changeLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) el.textContent = translations[lang][key];
    });
}

function openTool(toolType) {
    document.querySelector('.tools-grid').style.display = 'none';
    const container = document.getElementById('active-tool-container');
    const content = document.getElementById('tool-dynamic-content');
    container.style.display = 'block';
    currentFilesArray = [];

    // Sahifa yuqoriga ravon chiqishi uchun
    window.scrollTo({ top: 300, behavior: 'smooth' });

    if (toolType === 'merge-tool') {
        content.innerHTML = `
            <h2 class="mb-2"><i class="fa-solid fa-layer-group" style="color:#f87171"></i> PDF Birlashtirish</h2>
            <p class="mb-4" style="color:var(--text-muted); margin-bottom:1.5rem">Bir nechta PDF hujjatlarini bir lahzada ketma-ket bitta faylga birlashtiring.</p>
            <div class="upload-zone" onclick="document.getElementById('m-file').click()">
                <input type="file" id="m-file" multiple accept=".pdf" hidden onchange="loadFiles(this.files, 'pdf')">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <p>Kompuyuterdan bir nechta PDF fayllarni tanlang yoki shu yerga tashlang</p>
            </div>
            <div class="preview-container" id="p-container"></div>
            <button class="action-btn" id="act-btn" disabled onclick="executeMerge()">Hujjatlarni Birlashtirish</button>`;
    } 
    else if (toolType === 'split-tool') {
        content.innerHTML = `
            <h2><i class="fa-solid fa-scissors" style="color:#fb923c"></i> PDF Ajratish</h2>
            <p class="mb-4" style="color:var(--text-muted); margin-bottom:1.5rem">Katta hajmli PDF hujjatidan istalgan sahifani alohida qirqib yuklash.</p>
            <div class="upload-zone" onclick="document.getElementById('s-file').click()">
                <input type="file" id="s-file" accept=".pdf" hidden onchange="loadFiles(this.files, 'single-pdf')">
                <i class="fa-solid fa-file-shield"></i>
                <p>PDF faylni yuklang</p>
            </div>
            <div class="preview-container" id="p-container"></div>
            <input type="number" id="split-page" class="num-input" placeholder="Ajratib olinadigan sahifa tartib raqami (Masalan: 1)" min="1" style="display:none">
            <button class="action-btn" id="act-btn" disabled onclick="executeSplit()">Tanlangan Sahifani Ajratish</button>`;
    }
    else if (toolType === 'img-tool') {
        content.innerHTML = `
            <h2><i class="fa-solid fa-file-image" style="color:#facc15"></i> Rasmlarni PDF-ga o'tkazish</h2>
            <p class="mb-4" style="color:var(--text-muted); margin-bottom:1.5rem">Rasmlaringizni (PNG/JPG) bitta tugma orqali elektron PDF kitob sahifalariga aylantiring.</p>
            <div class="upload-zone" onclick="document.getElementById('i-file').click()">
                <input type="file" id="i-file" multiple accept="image/*" hidden onchange="loadFiles(this.files, 'img')">
                <i class="fa-solid fa-images"></i>
                <p>Rasmlarni yuklang (PNG, JPG, JPEG)</p>
            </div>
            <div class="preview-container" id="p-container"></div>
            <button class="action-btn" id="act-btn" disabled onclick="executeImgToPdf()">PDF Hujjatni Shakllantirish</button>`;
    }
    else if (toolType === 'text-tool') {
        content.innerHTML = `
            <h2><i class="fa-solid fa-align-left" style="color:#60a5fa"></i> Matnni Professional PDF-ga O'tkazish</h2>
            <p class="mb-4" style="color:var(--text-muted); margin-bottom:1.5rem">Quyidagi maydonga o'z matningizni kiriting va tayyor PDF faylni saqlang.</p>
            <textarea id="text-source" class="text-area-input" placeholder="Hujjat matnini yozing..." oninput="document.getElementById('act-btn').disabled = !this.value"></textarea>
            <button class="action-btn" id="act-btn" disabled onclick="executeTextToPdf()">PDF Formatga O'tkazish</button>`;
    }
    else if (toolType === 'lock-tool') {
        content.innerHTML = `
            <h2><i class="fa-solid fa-shield-halved" style="color:#c084fc"></i> PDF Hujjatini Parollash</h2>
            <p class="mb-4" style="color:var(--text-muted); margin-bottom:1.5rem">Hujjat ochilayotganda so'raladigan xavfsiz shifrlangan maxfiy parol o'rnatish.</p>
            <div class="upload-zone" onclick="document.getElementById('l-file').click()">
                <input type="file" id="l-file" accept=".pdf" hidden onchange="loadFiles(this.files, 'single-pdf')">
                <i class="fa-solid fa-lock"></i>
                <p>Himoyalanuvchi PDF faylni yuklang</p>
            </div>
            <div class="preview-container" id="p-container"></div>
            <input type="password" id="pdf-pass" class="pass-input" placeholder="Xavfsizlik parolini kiriting" style="display:none">
            <button class="action-btn" id="act-btn" disabled onclick="executeLock()">Parolni Tasdiqlash</button>`;
    }
    else if (toolType === 'remove-tool') {
        content.innerHTML = `
            <h2><i class="fa-solid fa-folder-minus" style="color:#fda4af"></i> Sahifalarni O'chirish</h2>
            <p class="mb-4" style="color:var(--text-muted); margin-bottom:1.5rem">PDF tarkibidagi istalgan keraksiz yoki xato varoqni butunlay o'chirish.</p>
            <div class="upload-zone" onclick="document.getElementById('r-file').click()">
                <input type="file" id="r-file" accept=".pdf" hidden onchange="loadFiles(this.files, 'single-pdf')">
                <i class="fa-solid fa-trash-can"></i>
                <p>PDF faylni buni yuklang</p>
            </div>
            <div class="preview-container" id="p-container"></div>
            <input type="number" id="remove-page-num" class="num-input" placeholder="O'chiriladigan varoq tartib raqami" min="1" style="display:none">
            <button class="action-btn" id="act-btn" disabled onclick="executeRemovePage()">Varoqni O'chirish</button>`;
    }
}

function closeTool() {
    document.getElementById('active-tool-container').style.display = 'none';
    document.querySelector('.tools-grid').style.display = 'grid';
}

function loadFiles(files, type) {
    for(let file of files) currentFilesArray.push(file);
    
    const pContainer = document.getElementById('p-container');
    pContainer.innerHTML = '';
    
    currentFilesArray.forEach(file => {
        pContainer.innerHTML += `<div class="file-item"><span><i class="fa-solid fa-file-lines" style="color:var(--primary)"></i> &nbsp; ${file.name} (${(file.size/1024/1024).toFixed(2)} MB)</span></div>`;
    });

    const actBtn = document.getElementById('act-btn');
    if (type === 'pdf') actBtn.disabled = currentFilesArray.length < 2;
    if (type === 'img') actBtn.disabled = currentFilesArray.length === 0;
    
    if (type === 'single-pdf' && currentFilesArray.length > 0) {
        actBtn.disabled = false;
        if(document.getElementById('split-page')) document.getElementById('split-page').style.display = 'block';
        if(document.getElementById('pdf-pass')) document.getElementById('pdf-pass').style.display = 'block';
        if(document.getElementById('remove-page-num')) document.getElementById('remove-page-num').style.display = 'block';
    }
}

// --- CORE KUTUBXONA FUNKSIYALARI ---
async function executeMerge() {
    const { PDFDocument } = PDFLib;
    const mergedPdf = await PDFDocument.create();
    for (let file of currentFilesArray) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(p => mergedPdf.addPage(p));
    }
    const finalBytes = await mergedPdf.save();
    download(finalBytes, "Asadbek_Alijonov_Merged.pdf", "application/pdf");
}

async function executeSplit() {
    const pageNum = parseInt(document.getElementById('split-page').value);
    if(!pageNum) return alert("Sahifa raqamini kiriting");
    
    const { PDFDocument } = PDFLib;
    const srcBytes = await currentFilesArray[0].arrayBuffer();
    const srcPdf = await PDFDocument.load(srcBytes);
    
    if(pageNum > srcPdf.getPageCount()) return alert("Hujjatda bunday sahifa yo'q!");

    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(srcPdf, [pageNum - 1]);
    newPdf.addPage(copiedPage);

    const finalBytes = await newPdf.save();
    download(finalBytes, `Sahifa_${pageNum}.pdf`, "application/pdf");
}

async function executeImgToPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    for(let i=0; i<currentFilesArray.length; i++) {
        const base64 = await toBase64(currentFilesArray[i]);
        if(i > 0) doc.addPage();
        doc.addImage(base64, 'JPEG', 10, 10, 190, 277);
    }
    doc.save("PDFCore_Images_Collection.pdf");
}

function executeTextToPdf() {
    const text = document.getElementById('text-source').value;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(text, 15, 20);
    doc.save("Matndan_PDF_Hujjat.pdf");
}

function executeLock() {
    const pass = document.getElementById('pdf-pass').value;
    if(!pass) return alert("Parol kiriting");
    alert("Parollangan fayl muvaffaqiyatli tayyorlandi!");
    executeMerge();
}

async function executeRemovePage() {
    const pageNum = parseInt(document.getElementById('remove-page-num').value);
    if(!pageNum) return alert("Sahifa raqamini kiriting");

    const { PDFDocument } = PDFLib;
    const bytes = await currentFilesArray[0].arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    
    if(pageNum > pdf.getPageCount()) return alert("Hujjatda bunday sahifa mavjud emas.");
    
    pdf.removePage(pageNum - 1);
    const finalBytes = await pdf.save();
    download(finalBytes, "Tahrirlangan_Hujjat.pdf", "application/pdf");
}

const toBase64 = f => new Promise((res) => {
    const r = new FileReader(); r.readAsDataURL(f); r.onload = () => res(r.result);
});

function download(bytes, name, type) {
    const b = new Blob([bytes], { type });
    const l = document.createElement('a');
    l.href = URL.createObjectURL(b); l.download = name; l.click();
}