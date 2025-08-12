document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Navigation link click events
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to current clicked link
            this.classList.add('active');
            
            // If on mobile device, close menu after clicking a link
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });
    
    // Navigation bar style change on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)';
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        } else {
            header.style.padding = '20px 0';
            header.style.boxShadow = 'none';
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        }
        
        // Update active state of navigation links
        updateActiveNavLink();
        
        // Video parallax effect on scroll
        handleVideoParallax();
    });
    
    // Update active state of navigation links based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Handle video items parallax effect on scroll
    function handleVideoParallax() {
        const videoItems = document.querySelectorAll('.video-item');
        
        videoItems.forEach((item, index) => {
            // Calculate the scroll position relative to the video item
            const rect = item.getBoundingClientRect();
            const scrollPosition = window.scrollY;
            
            // Apply different transform based on scroll position
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Item is visible in the viewport
                const scrollFactor = 0.05; // Adjust this value to control the parallax intensity
                const translateY = (scrollPosition * scrollFactor) * (index + 1) % 30;
                
                // Apply the transform
                item.style.transform = `translateY(${-translateY}px)`;
                item.style.zIndex = videoItems.length - index;
            }
        });
    }
    
    // 添加滚动动画效果
    window.addEventListener('scroll', function() {
        const videoItems = document.querySelectorAll('.video-item:not(.playing)');
        
        videoItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // 计算元素在视口中的位置百分比
            const visiblePercent = Math.min(
                Math.max(0, (windowHeight - rect.top) / windowHeight),
                1
            );
            
            // 根据滚动位置应用变换
            if (visiblePercent > 0 && visiblePercent < 1) {
                const translateY = -20 * visiblePercent;
                const scale = 1 + (0.05 * visiblePercent);
                item.style.transform = `translateY(${translateY}px) scale(${scale})`;
                item.style.opacity = 0.5 + (0.5 * visiblePercent);
            } else {
                item.style.transform = '';
                item.style.opacity = '';
            }
        });
    });
    
    // Load video data with scroll-based playback
    const videoGrid = document.querySelector('.video-grid');
    
    // Clear existing content
    videoGrid.innerHTML = '';
    
    // Create category headers and videos
    const categories = ['AIGC Works', 'Filming Works'];
    let allVideos = [];
    
    // Collect all videos with category info
    categories.forEach(category => {
        const categoryVideos = videosData.filter(video => video.category === category);
        allVideos = allVideos.concat(categoryVideos.map(video => ({...video, categoryName: category})));
    });
    
    // Create video items
    allVideos.forEach((video, index) => {
        // Add category header before first video of each category
        if (index === 0 || video.categoryName !== allVideos[index - 1].categoryName) {
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.innerHTML = `<h2>${video.categoryName}</h2>`;
            videoGrid.appendChild(categoryHeader);
        }
        
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.setAttribute('data-id', video.id);
        videoItem.setAttribute('data-category', video.category);
        
        videoItem.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="play-button">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="video-container">
                <!-- Video will be loaded here -->
            </div>
            <div class="video-info-overlay">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
                <div class="video-meta">
                    <span><i class="far fa-calendar-alt"></i> ${video.date}</span>
                    <span><i class="far fa-clock"></i> ${video.duration}</span>
                    <span><i class="far fa-eye"></i> ${video.views}</span>
                </div>
            </div>
            <div class="video-controls">
                <button class="control-button mute-btn" title="静音/取消静音">
                    <i class="fas fa-volume-up"></i>
                </button>
                <button class="control-button fullscreen-btn" title="全屏">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        `;
        
        videoGrid.appendChild(videoItem);
        
        // Add click event for play button
        const playButton = videoItem.querySelector('.play-button');
        playButton.addEventListener('click', function(e) {
            e.stopPropagation();
            playVideo(video, videoItem);
        });
        
        // Add click event for thumbnail
        const thumbnail = videoItem.querySelector('.video-thumbnail');
        thumbnail.addEventListener('click', function() {
            playVideo(video, videoItem);
        });
        
        // Add control button events
        setupVideoControls(videoItem);
    });
    
    // Setup scroll-based video playback
    setupScrollPlayback();
    
    // Load photo data with categories
    const photoGrid = document.querySelector('.photo-grid');
    
    // Clear existing content
    photoGrid.innerHTML = '';
    
    // Get unique categories
    const photoCategories = [...new Set(photosData.map(photo => photo.category))];
    
    // Process each category
    photoCategories.forEach(category => {
        // Create category header with bilingual display
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        
        // Add bilingual display for main categories
        let categoryDisplayName = category;
        if (category === 'AIGC海报') {
            categoryDisplayName = 'AIGC海报 / AIGC Posters';
        } else if (category === '风景摄影') {
            categoryDisplayName = '风景摄影 / Landscape Photography';
        } else if (category === 'AI换脸') {
            categoryDisplayName = 'AI换脸 / AI Face Swap';
        } else if (category === 'LoRA训练') {
            categoryDisplayName = 'LoRA训练 / LoRA Training';
        }
        
        categoryHeader.innerHTML = `<h2>${categoryDisplayName}</h2>`;
        photoGrid.appendChild(categoryHeader);
        
        // Filter photos by category
        const filteredPhotos = photosData.filter(photo => photo.category === category);
        
        // Group photos by folder path
        const photosByFolder = {};
        filteredPhotos.forEach(photo => {
            // Extract folder path from image path
            const pathParts = photo.image.split('/');
            const folderPath = pathParts.slice(0, -1).join('/');
            
            if (!photosByFolder[folderPath]) {
                photosByFolder[folderPath] = [];
            }
            photosByFolder[folderPath].push(photo);
        });
        
        // Create photo containers for each folder
        Object.keys(photosByFolder).forEach(folderPath => {
            // Extract folder name from path
            const pathParts = folderPath.split('/');
            const folderName = pathParts[pathParts.length - 1];
            
            // Create subfolder header if it's not the main category folder
            // Skip subfolder names for landscape photography and LoRA training categories
            if (folderName && folderName !== category && category !== '风景摄影' && category !== 'LoRA训练') {
                const subfolderHeader = document.createElement('div');
                subfolderHeader.className = 'subfolder-header';
                
                // Add bilingual display for subfolder names
                let displayName = folderName;
                if (folderName === '清华') {
                    displayName = '清华 / Tsinghua';
                } else if (folderName === '小倩') {
                    displayName = '小倩 / Xiaoqian';
                }
                
                subfolderHeader.innerHTML = `<h3>${displayName}</h3>`;
                photoGrid.appendChild(subfolderHeader);
            }
            
            const categoryPhotos = document.createElement('div');
            categoryPhotos.className = 'category-photos';
            photoGrid.appendChild(categoryPhotos);
            
            // Create photo items for this folder
            photosByFolder[folderPath].forEach(photo => {
                const photoItem = document.createElement('div');
                photoItem.className = 'photo-item animate-ready';
                photoItem.setAttribute('data-id', photo.id);
                photoItem.setAttribute('data-category', photo.category);
                
                const img = document.createElement('img');
                img.src = photo.image;
                img.alt = photo.title;
                
                // Add load event to detect image orientation and category
                img.onload = function() {
                    // Add category class
                    if (photo.category === 'AIGC海报') {
                        photoItem.classList.add('aigc-poster');
                    } else if (photo.category === '风景摄影') {
                        photoItem.classList.add('landscape-photo');
                        // Special handling for "竖" folder
                        if (photo.image.includes('/竖/')) {
                            photoItem.classList.add('vertical-landscape');
                        }
                    } else if (photo.category === 'LoRA训练') {
                        photoItem.classList.add('lora-training');
                    }
                    
                    // Add orientation class
                    if (this.naturalWidth > this.naturalHeight) {
                        photoItem.classList.add('landscape');
                    } else {
                        photoItem.classList.add('portrait');
                    }
                };
                
                photoItem.appendChild(img);
                categoryPhotos.appendChild(photoItem);
                
                // Add click event
                photoItem.addEventListener('click', function() {
                    openPhotoModal(photo);
                });
            });
        });
    });
    
    // Setup photo animations after all photos are loaded
    setupPhotoAnimations();
    
    // Function to play video in scroll mode
    function playVideo(video, videoItem) {
        // Check if video is already loaded
        const existingVideo = videoItem.querySelector('video');
        if (existingVideo) {
            // Just play the existing video
            existingVideo.play();
            showVideoControls(videoItem);
            return;
        }
        
        // Hide thumbnail and show video container
        const thumbnail = videoItem.querySelector('.video-thumbnail');
        const videoContainer = videoItem.querySelector('.video-container');
        const infoOverlay = videoItem.querySelector('.video-info-overlay');
        const controls = videoItem.querySelector('.video-controls');
        
        // Create video element or iframe for YouTube
        if (video.videoUrl.includes('youtu.be') || video.videoUrl.includes('youtube.com')) {
            // Handle YouTube links
            let videoId = '';
            if (video.videoUrl.includes('youtu.be/')) {
                videoId = video.videoUrl.split('youtu.be/')[1].split('?')[0];
            } else if (video.videoUrl.includes('youtube.com/watch?v=')) {
                videoId = video.videoUrl.split('v=')[1].split('&')[0];
            }
            
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&loop=1&playlist=${videoId}&controls=1`;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.allow = 'autoplay; encrypted-media';
            
            videoContainer.appendChild(iframe);
        } else {
            // Handle local video files
            const videoElement = document.createElement('video');
            videoElement.src = video.videoUrl;
            videoElement.autoplay = true;
            videoElement.muted = true;
            videoElement.loop = true;
            videoElement.playsInline = true;
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'contain';
            
            videoContainer.appendChild(videoElement);
        }
        
        // Show video and controls
        showVideoControls(videoItem);
        
        // Mark as playing
        videoItem.classList.add('playing');
    }
    
    // Function to show video controls
    function showVideoControls(videoItem) {
        const thumbnail = videoItem.querySelector('.video-thumbnail');
        const videoContainer = videoItem.querySelector('.video-container');
        const infoOverlay = videoItem.querySelector('.video-info-overlay');
        const controls = videoItem.querySelector('.video-controls');
        
        // Hide thumbnail and show video
        if (thumbnail) thumbnail.style.display = 'none';
        if (videoContainer) videoContainer.style.display = 'block';
        if (infoOverlay) infoOverlay.style.display = 'block';
        if (controls) controls.style.display = 'flex';
        
        // Add body class for fullscreen video mode
        document.body.classList.add('video-playing');
    }
    
    // Function to hide video controls
    function hideVideoControls(videoItem) {
        const thumbnail = videoItem.querySelector('.video-thumbnail');
        const videoContainer = videoItem.querySelector('.video-container');
        const infoOverlay = videoItem.querySelector('.video-info-overlay');
        const controls = videoItem.querySelector('.video-controls');
        
        // Show thumbnail and hide video
        if (thumbnail) thumbnail.style.display = 'flex';
        if (videoContainer) videoContainer.style.display = 'none';
        if (infoOverlay) infoOverlay.style.display = 'none';
        if (controls) controls.style.display = 'none';
        
        videoItem.classList.remove('playing');
        
        // Remove body class for fullscreen video mode
        document.body.classList.remove('video-playing');
    }
    
    // Function to setup video controls
    function setupVideoControls(videoItem) {
        const muteBtn = videoItem.querySelector('.mute-btn');
        const fullscreenBtn = videoItem.querySelector('.fullscreen-btn');
        
        muteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const video = videoItem.querySelector('video');
            const iframe = videoItem.querySelector('iframe');
            if (video) {
                video.muted = !video.muted;
                const icon = muteBtn.querySelector('i');
                icon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            } else if (iframe) {
                // For YouTube videos, we can't control mute directly
                // Just toggle the icon for visual feedback
                const icon = muteBtn.querySelector('i');
                const isMuted = icon.className.includes('volume-mute');
                icon.className = isMuted ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            }
        });
        
        fullscreenBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const video = videoItem.querySelector('video');
            const iframe = videoItem.querySelector('iframe');
            if (video) {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();
                }
            } else if (iframe) {
                // For YouTube videos, request fullscreen on the iframe
                if (iframe.requestFullscreen) {
                    iframe.requestFullscreen();
                } else if (iframe.webkitRequestFullscreen) {
                    iframe.webkitRequestFullscreen();
                } else if (iframe.msRequestFullscreen) {
                    iframe.msRequestFullscreen();
                }
            }
        });
    }
    
    // Function to setup scroll-based playback
    function setupScrollPlayback() {
        const videosSection = document.getElementById('videos');
        let currentPlayingItem = null;
        
        // Intersection Observer for auto-play on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                
                // Skip category headers
                if (element.classList.contains('category-header')) {
                    return;
                }
                
                const videoItem = element;
                
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    // Video is prominently in view
                    if (currentPlayingItem && currentPlayingItem !== videoItem) {
                        // Pause and hide previous video
                        const prevVideo = currentPlayingItem.querySelector('video');
                        const prevIframe = currentPlayingItem.querySelector('iframe');
                        if (prevVideo) {
                            prevVideo.pause();
                            prevVideo.muted = true; // Mute previous video
                        }
                        // For YouTube iframes, we can't directly pause, so just hide controls
                        hideVideoControls(currentPlayingItem);
                    }
                    
                    // Play current video with delay for smooth transition
                    setTimeout(() => {
                        const videoId = videoItem.getAttribute('data-id');
                        const videoData = videosData.find(v => v.id === parseInt(videoId));
                        if (videoData && entry.isIntersecting) {
                            playVideo(videoData, videoItem);
                            const currentVideo = videoItem.querySelector('video');
                            const currentIframe = videoItem.querySelector('iframe');
                            if (currentVideo) {
                                currentVideo.muted = false; // Unmute current video
                                // Update mute button icon
                                const muteBtn = videoItem.querySelector('.mute-btn i');
                                if (muteBtn) {
                                    muteBtn.className = 'fas fa-volume-up';
                                }
                            }
                            currentPlayingItem = videoItem;
                        }
                    }, 200);
                    
                } else if (entry.intersectionRatio < 0.2) {
                    // Video is mostly out of view
                    const video = videoItem.querySelector('video');
                    if (video) {
                        video.pause();
                        video.muted = true; // Mute when out of view
                    }
                    if (currentPlayingItem === videoItem) {
                        hideVideoControls(videoItem);
                        currentPlayingItem = null;
                    }
                }
            });
        }, {
            threshold: [0.2, 0.5, 0.8],
            rootMargin: '-20% 0px -20% 0px'
        });
        
        // Observe all video items
        const videoItems = document.querySelectorAll('.video-item');
        videoItems.forEach(item => {
            observer.observe(item);
        });
        
        // Keyboard controls
        document.addEventListener('keydown', function(e) {
            if (currentPlayingItem) {
                const video = currentPlayingItem.querySelector('video');
                switch(e.key) {
                    case ' ':
                        e.preventDefault();
                        if (video) {
                            if (video.paused) {
                                video.play();
                            } else {
                                video.pause();
                            }
                        }
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        scrollToVideo('prev');
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        scrollToVideo('next');
                        break;
                    case 'm':
                    case 'M':
                        e.preventDefault();
                        if (video) {
                            video.muted = !video.muted;
                            const muteBtn = currentPlayingItem.querySelector('.mute-btn i');
                            if (muteBtn) {
                                muteBtn.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
                            }
                        }
                        break;
                }
            }
        });
        
        // Touch/swipe controls for mobile
        let startY = 0;
        let startTime = 0;
        
        videosSection.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            startTime = Date.now();
        });
        
        videosSection.addEventListener('touchend', function(e) {
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            const deltaY = startY - endY;
            const deltaTime = endTime - startTime;
            
            // Check for swipe gesture (fast movement)
            if (Math.abs(deltaY) > 50 && deltaTime < 300) {
                if (deltaY > 0) {
                    // Swipe up - next video
                    scrollToVideo('next');
                } else {
                    // Swipe down - previous video
                    scrollToVideo('prev');
                }
            }
        });
    }
    
    // Function to scroll to next/previous video
    function scrollToVideo(direction) {
        const allElements = Array.from(document.querySelectorAll('.video-item, .category-header'));
        
        // Find currently visible element
        let currentIndex = -1;
        const windowCenter = window.innerHeight / 2;
        
        allElements.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.top + itemRect.height / 2;
            
            if (Math.abs(itemCenter - windowCenter) < window.innerHeight / 3) {
                currentIndex = index;
            }
        });
        
        let targetIndex;
        if (direction === 'next') {
            targetIndex = currentIndex + 1;
            if (targetIndex >= allElements.length) {
                targetIndex = 0; // Loop to first
            }
        } else {
            targetIndex = currentIndex - 1;
            if (targetIndex < 0) {
                targetIndex = allElements.length - 1; // Loop to last
            }
        }
        
        const targetItem = allElements[targetIndex];
        if (targetItem) {
            // Use smooth scrolling to the target element
            const targetPosition = targetItem.offsetTop - 100; // Offset for header
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Keep the modal code for backward compatibility
    const videoModal = document.getElementById('video-modal');
    const videoModalClose = videoModal.querySelector('.close-modal');
    const modalVideoContainer = document.getElementById('modal-video-container');
    const modalVideoTitle = document.getElementById('modal-video-title');
    const modalVideoDescription = document.getElementById('modal-video-description');
    
    function openVideoModal(video) {
        // This function is kept for backward compatibility but won't be used
        console.log('Using direct video playback instead of modal');
    }
    
    videoModalClose.addEventListener('click', function() {
        closeVideoModal();
    });
    
    function closeVideoModal() {
        videoModal.style.display = 'none';
        modalVideoContainer.innerHTML = '';
        document.body.style.overflow = 'auto';
    }
    
    // Photo modal
    const photoModal = document.getElementById('photo-modal');
    const photoModalClose = photoModal.querySelector('.close-modal');
    const modalPhoto = document.getElementById('modal-photo');
    const modalPhotoTitle = document.getElementById('modal-photo-title');
    const modalPhotoDescription = document.getElementById('modal-photo-description');
    
    function openPhotoModal(photo) {
        modalPhoto.src = photo.image;
        modalPhoto.alt = photo.title;
        modalPhotoTitle.textContent = photo.title;
        modalPhotoDescription.textContent = photo.description;
        photoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    photoModalClose.addEventListener('click', function() {
        closePhotoModal();
    });
    
    function closePhotoModal() {
        photoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
        if (e.target === photoModal) {
            closePhotoModal();
        }
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Form validation and submission logic can be added here
            // Example: Simple form validation
            if (name && email && subject && message) {
                // Simulate form submission success
                alert('Message sent! We will reply to you as soon as possible.');
                contactForm.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
    
    // Update active state of navigation links on page initialization
    updateActiveNavLink();
    
    // Setup photo scroll animations function
    function setupPhotoAnimations() {
        // Add animate-ready class to all photo items initially
        const photoItems = document.querySelectorAll('.photo-item');
        photoItems.forEach(item => {
            item.classList.add('animate-ready');
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('animate-ready');
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe all photo items
        photoItems.forEach(item => {
            observer.observe(item);
        });
    }
});