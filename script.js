// --- STATE ---
        let currentBook = null;
        let currentPageIdx = 0;

        // Reader State
        let zoomLevel = 1;
        let panX = 0;
        let panY = 0;
        let isDragging = false;
        let startX, startY;

        // --- DOM ELEMENTS ---
        const elements = {
            entrance: document.getElementById('entrance'),
            library: document.getElementById('library'),
            navbar: document.getElementById('navbar'),
            grid: document.getElementById('books-grid'),
            reader: {
                modal: document.getElementById('reader-modal'),
                sidebar: document.getElementById('reader-sidebar'),
                container: document.getElementById('reader-canvas-container'),
                title: document.getElementById('reader-title'),
                titleMobile: document.getElementById('reader-title-mobile'),
                subtitle: document.getElementById('reader-subtitle'),
                desc: document.getElementById('reader-desc'),
                totalPages: document.getElementById('reader-total-pages'),
                content: document.getElementById('reader-content'),
                loading: document.getElementById('loading-indicator'),
                counter: document.getElementById('page-counter'),
                btnPrev: document.getElementById('btn-prev'),
                btnNext: document.getElementById('btn-next'),
                expandBtn: document.getElementById('sidebar-expand-btn')
            }
        };

        // --- INITIALIZATION ---
        function init() {
            renderLibrary();
            setupReaderInteractions();
        }

        function setupReaderInteractions() {
            const container = elements.reader.container;

            // Mouse Down
            container.addEventListener('mousedown', (e) => {
                e.preventDefault(); // Prevent default browser drag behavior
                isDragging = true;
                // Calculate the offset relative to the current pan position
                startX = e.clientX - panX;
                startY = e.clientY - panY;
                container.style.cursor = 'grabbing';
            });

            // Mouse Move
            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                // Update pan position based on mouse movement
                panX = e.clientX - startX;
                panY = e.clientY - startY;
                updateTransform();
            });

            // Mouse Up
            window.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    container.style.cursor = 'grab';
                }
            });

            // Mouse Leave (stop dragging if mouse leaves window)
            window.addEventListener('mouseleave', () => {
                if (isDragging) {
                    isDragging = false;
                    container.style.cursor = 'grab';
                }
            });

            // Wheel Zoom
            container.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY * -0.001;
                const newZoom = Math.min(Math.max(0.5, zoomLevel + delta), 4); // Clamp zoom
                zoomLevel = newZoom;
                updateTransform();
            });
        }

        function updateTransform() {
            elements.reader.content.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
        }

        function adjustZoom(delta) {
            zoomLevel = Math.min(Math.max(0.5, zoomLevel + delta), 4);
            updateTransform();
        }

        function resetZoom() {
            zoomLevel = 1;
            panX = 0;
            panY = 0;
            updateTransform();
        }

        function toggleSidebar() {
            const sidebar = elements.reader.sidebar;
            const collapseBtn = document.getElementById('toggle-sidebar-btn');
            const expandBtn = document.getElementById('sidebar-expand-btn');

            if (sidebar.classList.contains('w-80')) {
                // Collapse sidebar
                sidebar.classList.remove('w-80', 'p-8', 'border-r', 'opacity-100');
                sidebar.classList.add('w-0', 'p-0', 'border-none', 'opacity-0');

                // Show expand button, hide collapse button
                collapseBtn.classList.add('hidden');
                expandBtn.classList.remove('hidden');
            } else {
                // Expand sidebar
                sidebar.classList.remove('w-0', 'p-0', 'border-none', 'opacity-0');
                sidebar.classList.add('w-80', 'p-8', 'border-r', 'opacity-100');

                // Show collapse button, hide expand button
                expandBtn.classList.add('hidden');
                collapseBtn.classList.remove('hidden');
            }
        }

        // --- SCROLL HANDLING ---
        // Simple scroll effect for navbar transparency/shadow
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            if (window.scrollY > 50) {
                nav.classList.add('shadow-lg');
                nav.classList.remove('bg-transparent');
            } else {
                // Optional: make it more transparent at top
            }
        });

        // --- LIBRARY RENDERER ---
        function renderLibrary() {
            elements.grid.innerHTML = books.map(book => `
                <div onclick="openBook(${book.id})" class="sanctum-card group cursor-pointer relative flex flex-col items-center p-4">

                    <!-- Ornate Arch/Frame around the niche -->
                    <div class="absolute top-0 w-full h-full border border-stone-800/50 rounded-t-full opacity-50 pointer-events-none"></div>

                    <!-- The Niche Background -->
                    <div class="relative w-full aspect-[3/4] bg-[#0f0e0d] border-x-8 border-t-8 border-[#1c1917] shadow-inner flex items-end justify-center overflow-hidden mb-6">

                        <!-- Inner Shadow -->
                        <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/40 z-10 pointer-events-none"></div>

                        <!-- Decorative Hanging Lamp inside Niche -->
                        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-amber-700/50 z-10"></div>
                        <div class="absolute top-16 left-1/2 -translate-x-1/2 w-3 h-3 border border-amber-600 rotate-45 z-10 group-hover:bg-amber-500/20 transition-colors"></div>

                        <!-- The Book Preview (With Thumbnail) -->
                        <div class="relative z-0 w-3/5 h-3/5 transform group-hover:scale-105 transition-transform duration-700 ease-out">
                             <!-- Stack effect -->
                             <div class="absolute bottom-2 right-2 w-full h-full bg-amber-900/20 border border-amber-800/30 rounded-sm"></div>
                             <div class="absolute bottom-1 right-1 w-full h-full bg-amber-900/40 border border-amber-800/50 rounded-sm"></div>

                             <!-- Cover Image -->
                             <div class="absolute w-full h-full border border-amber-700/40 rounded-sm shadow-2xl overflow-hidden">
                                <img src="${book.thumbnail}" alt="${book.title}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700">
                                <!-- Gold Overlay -->
                                <div class="absolute inset-0 bg-amber-500/10 mix-blend-overlay"></div>
                             </div>
                        </div>

                        <!-- Golden Glow on Hover -->
                        <div class="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"></div>
                    </div>

                    <!-- Text Info -->
                    <div class="text-center relative w-full">
                        <!-- Ornate Corners for text area -->
                        <div class="ornate-corner top-left"></div>
                        <div class="ornate-corner top-right"></div>
                        <div class="ornate-corner bottom-left"></div>
                        <div class="ornate-corner bottom-right"></div>

                        <div class="py-4 px-2">
                            <h3 class="text-xl text-amber-100 mb-1 font-serif group-hover:text-amber-400 transition-colors">${book.title}</h3>
                            <div class="h-[1px] w-12 bg-stone-700 mx-auto mb-2"></div>
                            <p class="text-[10px] text-stone-500 uppercase tracking-[0.2em]">${book.subtitle}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // --- READER LOGIC ---
        function openBook(id) {
            currentBook = books.find(b => b.id === id);
            if(!currentBook) return;

            currentPageIdx = 0; // Always start at cover

            // Populate Info
            elements.reader.title.innerText = currentBook.title;
            elements.reader.titleMobile.innerText = currentBook.title;
            elements.reader.subtitle.innerText = currentBook.subtitle;
            elements.reader.desc.innerText = currentBook.description;
            elements.reader.totalPages.innerText = currentBook.pages.length;

            renderReaderPage();

            // Show Modal
            elements.reader.modal.classList.remove('hidden');
            setTimeout(() => {
                elements.reader.modal.classList.remove('opacity-0');
            }, 50);
        }

        function closeBook() {
            elements.reader.modal.classList.add('opacity-0');
            setTimeout(() => {
                elements.reader.modal.classList.add('hidden');
                elements.reader.content.innerHTML = ''; // Clear content
                currentBook = null;
                // Reset sidebar state if needed, or keep preference
                // elements.reader.sidebar.classList.add('md:flex');
                // elements.reader.sidebar.classList.remove('hidden');
            }, 500);
        }

        function renderReaderPage() {
            if(!currentBook) return;

            // Reset Zoom on page turn
            resetZoom();

            // Loading State
            elements.reader.content.style.opacity = '0';
            elements.reader.loading.classList.remove('hidden');

            const isCover = currentPageIdx === 0;
            // Check if back cover: last page, and total pages is even (so 0-index is odd), meaning it falls on a spread?
            // Or just simple logic: if only 1 page remains to be shown, it's single.
            const isBackCover = (currentPageIdx === currentBook.pages.length - 1);
            const isSingleView = isCover || isBackCover;

            let html = '';

            if (isSingleView) {
                const imgUrl = currentBook.pages[currentPageIdx];
                html = `
                    <div class="reader-single">
                        <img src="${imgUrl}" class="scan-page" onload="imageLoaded()">
                    </div>
                `;
            } else {
                // Spread view (2 pages)
                // currentPageIdx points to Left Page
                const leftImg = currentBook.pages[currentPageIdx];
                const rightImg = currentBook.pages[currentPageIdx + 1]; // Might be undefined if at end but logic handles isBackCover

                html = `
                    <div class="reader-spread relative">
                        <div class="spine-shadow"></div>
                        <img src="${leftImg}" class="scan-page" onload="imageLoaded()">
                        ${rightImg ? `<img src="${rightImg}" class="scan-page" onload="imageLoaded()">` : ''}
                    </div>
                `;
            }

            // Delay slightly to allow DOM update
            setTimeout(() => {
                elements.reader.content.innerHTML = html;

                // Update text counters
                if(isSingleView) {
                    elements.reader.counter.innerText = `Folio ${currentPageIdx + 1} / ${currentBook.pages.length}`;
                } else {
                    elements.reader.counter.innerText = `Folio ${currentPageIdx + 1}-${currentPageIdx + 2} / ${currentBook.pages.length}`;
                }

                // Update buttons
                elements.reader.btnPrev.disabled = currentPageIdx === 0;

                // Disable Next if we are at the last page OR if we are at the second to last page (spread covers the end)
                // e.g. Total 10. Indices 0..9.
                // View: 0 (Cover). Next -> 1 (1-2). Next -> 3 (3-4)...
                // If at 7 (7-8). Next -> 9 (9-Back Cover).
                // If at 9. Next disabled.
                const nextIndex = isSingleView ? currentPageIdx + 1 : currentPageIdx + 2;
                elements.reader.btnNext.disabled = nextIndex >= currentBook.pages.length;

            }, 50);
        }

        // Helper to handle fade in once image is loaded
        window.imageLoaded = function() {
            // We might have 2 images, we wait for both?
            // Simple hack: just fade in immediately for now, or wait for all images in container
            // For this demo, just fading in the container after a short timeout is smoother than tracking 2 load events individually
            setTimeout(() => {
                elements.reader.loading.classList.add('hidden');
                elements.reader.content.style.opacity = '1';
            }, 200);
        }

        function changePage(delta) {
            if(!currentBook) return;

            let newIdx = currentPageIdx;

            if (delta > 0) {
                // Going Next
                if (currentPageIdx === 0) {
                    // Cover -> Page 1 (Start of first spread)
                    newIdx = 1;
                } else {
                    // Spread -> Next Spread (Jump 2)
                    newIdx = currentPageIdx + 2;
                    // If we jump past the end, clamp to last page (Back Cover)
                    if(newIdx >= currentBook.pages.length) {
                         // If we are at second to last (e.g. 8,9 of 10), and click next, we go to nothing?
                         // Logic check:
                         // T=10. Cover(0). 1(1-2). 3(3-4). 5(5-6). 7(7-8). 9(9-Back).
                         // If at 7. +2 = 9. Valid.
                         // If at 9. +2 = 11. Invalid.
                         // If T=11. Cover(0). 1(1-2)... 9(9-10).
                         // If at 9. +2 = 11. (Back cover logic? No, 10 is last index).
                         // Wait, if T=11. Last index is 10.
                         // At 9 (showing 9 and 10). 10 is the last page. So 9-10 IS the last spread.
                         // So at 9, next should be disabled.
                    }
                }
            } else {
                // Going Prev
                if (currentPageIdx === 1) {
                    // From first spread -> Cover
                    newIdx = 0;
                } else if (currentPageIdx > 1) {
                    // Spread -> Prev Spread
                    newIdx = currentPageIdx - 2;
                } else {
                    // Should not happen if button disabled
                    newIdx = 0;
                }
            }

            // Bounds check
            if(newIdx < currentBook.pages.length && newIdx >= 0) {
                currentPageIdx = newIdx;
                renderReaderPage();
            }
        }

        // Init
        init();