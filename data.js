// --- MOCK DATA (Simulating Scanned PDFs) ---
        // In a real scenario, 'pages' would be an array of paths to .jpg/.webp scans of the PDF pages.
        const placeholderScan = (text) => `https://placehold.co/600x800/e5e5e5/44403c?text=${encodeURIComponent(text)}&font=playfair-display`;

        // Helper to generate mock pages
        const generatePages = (title, count) => {
            return Array.from({length: count}, (_, i) => placeholderScan(`${title}\n\nFolio ${i+1}`));
        };

        const books = [
            {
                id: 1,
                title: "Veda Bhashyam",
                subtitle: "Rig Veda Commentary",
                thumbnail: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
                description: "Original handwritten manuscript commenting on the esoteric meanings of the Rig Veda. Scanned from the 1892 edition.",
                pages: generatePages("Veda Bhashyam", 12)
            },
            {
                id: 2,
                title: "Dharma Sastra",
                subtitle: "Ethical Codes",
                thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop",
                description: "A digest of law and conduct for the Kali Yuga. Contains margin notes by the author's students.",
                pages: generatePages("Dharma Sastra", 8)
            },
            {
                id: 3,
                title: "Kavya Mimamsa",
                subtitle: "Poetics Treatise",
                thumbnail: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop",
                description: "An analysis of Sanskrit poetics. The pages show significant weathering due to age.",
                pages: generatePages("Kavya Mimamsa", 15)
            },
            {
                id: 4,
                title: "Tarka Sangraha",
                subtitle: "System of Logic",
                thumbnail: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop",
                description: "Foundational text on Nyaya. Clear script with diagrams explaining logical categories.",
                pages: generatePages("Tarka Sangraha", 10)
            },
            {
                id: 5,
                title: "Bhakti Sudha",
                subtitle: "Devotional Hymns",
                thumbnail: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=800&auto=format&fit=crop",
                description: "Collection of Stotras. Some pages contain decorative floral borders drawn by the scribe.",
                pages: generatePages("Bhakti Sudha", 20)
            },
            {
                id: 6,
                title: "Jyotisha Ratna",
                subtitle: "Astronomy Calculations",
                thumbnail: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
                description: "Mathematical calculations of planetary positions. Includes charts and numeric tables.",
                pages: generatePages("Jyotisha Ratna", 14)
            }
        ];