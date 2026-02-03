function initButtons(){
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const choices = document.querySelector('.choices');
    const title = document.querySelector('.title');
    const gifUrl = 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmF6aXYyZGR0b3B5bmV6NjA0emxkcW9xaWJkaTE0ODFxaW5qdjNqbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TpsuCxwsNH8gatbpR5/giphy.gif';
    const externalHideSrc = 'https://media.tenor.com/EzNm2E_924wAAAAj/cat-sticker-line-sticker.gif';
    const randomMessages = [
        'Are you sure?',
        'Hindi nga?',
        'Sure na yan?',
        'Ayaw mo ako kadate?',
        'Ayaw mo talaga?',
        'Ayaw mo na saakin?',
        'Why?',
        '??????',
        'Hindi mo na ako love?',
        'Kadate mona kabit mo?'
    ];

    // message pool to avoid repeats until all messages shown
    let messagePool = [];
    let lastMessage = null;

    function shuffleArray(a){
        for(let i = a.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }

    // hide or restore external images with a specific src
    function setExternalImageHidden(hide){
        const imgs = document.querySelectorAll('img[src="' + externalHideSrc + '"]');
        imgs.forEach(img => {
            if(hide){
                if(img.dataset._prevVis === undefined) img.dataset._prevVis = img.style.visibility || '';
                img.style.visibility = 'hidden';
            } else {
                if(img.dataset._prevVis !== undefined){
                    img.style.visibility = img.dataset._prevVis;
                    delete img.dataset._prevVis;
                } else {
                    img.style.visibility = '';
                }
            }
        });
    }

    function refillPool(){
        messagePool = randomMessages.slice();
        shuffleArray(messagePool);
        // if the last shown message would be first, rotate one position to avoid immediate repeat
        if(messagePool.length > 1 && messagePool[messagePool.length - 1] === lastMessage){
            const first = messagePool.pop();
            messagePool.unshift(first);
        }
    }

    function getNextMessage(){
        if(messagePool.length === 0) refillPool();
        let msg = messagePool.pop();
        if(msg === lastMessage && messagePool.length > 0){
            // try another
            const alt = messagePool.pop();
            messagePool.push(msg);
            msg = alt;
        }
        lastMessage = msg;
        return msg;
    }

    if(!yesBtn || !noBtn || !choices) return;

    ['click', 'mousedown', 'touchstart', 'pointerdown'].forEach(evt => {
        noBtn.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }, true); // capture phase = blocks everything else
    });

    function createHeartParticles(){
        for(let i = 0; i < 60; i++){
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart-particle';
                heart.textContent = '❤';
                document.body.appendChild(heart);

                // random start position across top of screen
                const startX = Math.random() * window.innerWidth;
                const startY = -30;
                heart.style.left = startX + 'px';
                heart.style.top = startY + 'px';

                // random animation duration
                const duration = 3000 + Math.random() * 2000;
                heart.style.setProperty('--duration', duration + 'ms');

                // random horizontal drift
                const drift = (Math.random() - 0.5) * 200;
                heart.style.setProperty('--drift', drift + 'px');

                // trigger animation
                heart.classList.add('fall');

                // remove after animation
                setTimeout(() => {
                    if(heart.parentElement) heart.parentElement.removeChild(heart);
                }, duration);
            }, i * 30);
        }
    }

    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    
    yesBtn.addEventListener('click', () => {
        // create heart particles
        createHeartParticles();

        // hide buttons
        yesBtn.style.visibility = 'hidden';
        noBtn.style.visibility = 'hidden';

        // hide h1 and show message in h2
        const titleEl = document.querySelector('.title');
        const msgEl = document.getElementById('message');
        if(titleEl) titleEl.style.display = 'none';
        if(msgEl){
            msgEl.innerHTML = 'Oki see you on Feb 14 then!<br>I love you baby&lt;3';
            msgEl.style.display = 'block';
        }

        // hide all floating messages
        document.querySelectorAll('.floating-msg').forEach(el => {
            if(el.parentElement) el.parentElement.removeChild(el);
        });

        // hide other GIF images on the page
        const target = 'https://i.pinimg.com/originals/ba/ec/82/baec8277777de78c91789db4a7684cbe.gif';
        document.querySelectorAll('img').forEach(img => {
            try{
                const src = img.getAttribute('src') || img.src || '';
                if(!src) return;
                if(src.includes('.gif') && src !== target){
                    if(img.dataset._prevVis === undefined) img.dataset._prevVis = img.style.visibility || '';
                    img.style.visibility = 'hidden';
                }
            }catch(e){}
        });

        // create or show the target GIF above h2 (same position as hover GIF)
        let yesGif = document.getElementById('yesGifOverlay');
        if(!yesGif){
            yesGif = document.createElement('img');
            yesGif.id = 'yesGifOverlay';
            yesGif.className = 'hover-gif';
            yesGif.src = target;
            document.body.appendChild(yesGif);
        }

        // position it above the h2 message
        if(msgEl){
            const desiredWidth = 200; // fixed size, matching hover GIF size
            yesGif.style.position = 'fixed';
            yesGif.style.width = desiredWidth + 'px';
            yesGif.style.zIndex = 12001;

            function placeYesGif(){
                let gHeight = 0;
                if(yesGif.naturalWidth && yesGif.naturalHeight){
                    gHeight = Math.round(yesGif.naturalHeight * (desiredWidth / yesGif.naturalWidth));
                    yesGif.style.height = gHeight + 'px';
                } else {
                    const r = yesGif.getBoundingClientRect();
                    gHeight = r.height;
                }
                // center horizontally and position above center vertically
                yesGif.style.left = (window.innerWidth - desiredWidth) / 2 + 'px';
                yesGif.style.top = (window.innerHeight - gHeight) / 2 - 60 + 'px';
                // show
                yesGif.offsetHeight;
                yesGif.classList.add('show');
            }

            if(yesGif.complete && yesGif.naturalWidth) placeYesGif(); else yesGif.onload = placeYesGif;
        }
    });

    // --- Move `noBtn` around the whole page without overlapping other elements ---
    let placeholder = null;
    let scale = 1, targetScale = 1, rafId = null;
    const maxScale = 2.5;
    const scaleIncrement = 0.15;

    function animateScale(){
        if(Math.abs(scale - targetScale) < 0.001){
            scale = targetScale;
            yesBtn.style.transform = scale > 1 ? 'scale(' + scale + ')' : '';
            rafId = null;
            return;
        }
        scale += (targetScale - scale) * 0.18;
        yesBtn.style.transform = 'scale(' + scale + ')';
        rafId = requestAnimationFrame(animateScale);
    }

    function startScaling(to){
        targetScale = to;
        if(!rafId) rafId = requestAnimationFrame(animateScale);
    }

    function increaseYesScale(){
        const newScale = Math.min(scale + scaleIncrement, maxScale);
        startScaling(newScale);
    }

    function visibleRectsForBlocking(){
        const all = Array.from(document.querySelectorAll('body *'));
        const rects = [];
        for(const el of all){
            // include all elements (including `noBtn`) so messages avoid overlapping them
            const s = window.getComputedStyle(el);
            if(s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) continue;
            const r = el.getBoundingClientRect();
            if(r.width === 0 && r.height === 0) continue;
            rects.push(r);
        }
        return rects;
    }

    function intersects(r1, r2){
        return !(r1.right <= r2.left || r1.left >= r2.right || r1.bottom <= r2.top || r1.top >= r2.bottom);
    }

    function getFloatingRects(){
        return Array.from(document.querySelectorAll('.floating-msg')).map(el => el.getBoundingClientRect());
    }

    function createFloatingMessage(text){
        // ensure only one floating message exists at a time
        document.querySelectorAll('.floating-msg').forEach(el => {
            el.parentElement && el.parentElement.removeChild(el);
        });

        const msg = document.createElement('div');
        msg.className = 'floating-msg';
        msg.textContent = text;
        msg.style.position = 'absolute';
        msg.style.visibility = 'hidden';
        document.body.appendChild(msg);

        // measure while hidden so it doesn't affect layout
        const mRect = msg.getBoundingClientRect();
        const mW = mRect.width;
        const mH = mRect.height;

        const vpW = window.innerWidth;
        const vpH = window.innerHeight;
        const padding = 8;

        // blockers include visible page elements and current floating messages
        const blockers = visibleRectsForBlocking().concat(getFloatingRects());

        let found = false;
        let x = 0, y = 0;
        const attempts = 300;
        for(let i = 0; i < attempts; i++){
            x = Math.floor(padding + Math.random() * Math.max(0, vpW - mW - padding * 2));
            y = Math.floor(padding + Math.random() * Math.max(0, vpH - mH - padding * 2));
            const cand = { left: x, top: y, right: x + mW, bottom: y + mH };
            let ok = true;
            for(const b of blockers){ if(intersects(cand, b)){ ok = false; break; } }
            if(ok){ found = true; break; }
        }

        if(!found){
            // grid fallback
            const stepX = Math.max(40, Math.floor(mW / 2));
            const stepY = Math.max(28, Math.floor(mH / 2));
            outer: for(y = padding; y <= vpH - mH - padding; y += stepY){
                for(x = padding; x <= vpW - mW - padding; x += stepX){
                    const cand = { left: x, top: y, right: x + mW, bottom: y + mH };
                    let ok = true;
                    for(const b of blockers){ if(intersects(cand, b)){ ok = false; break; } }
                    if(ok){ found = true; break outer; }
                }
            }
        }

        const vx = Math.max(padding, Math.min(x, vpW - mW - padding));
        const vy = Math.max(padding, Math.min(y, vpH - mH - padding));
        // set using page coordinates so absolute positioning doesn't affect layout
        msg.style.left = (window.scrollX + vx) + 'px';
        msg.style.top = (window.scrollY + vy) + 'px';
        msg.style.visibility = 'visible';
        // show and auto-remove
        // force reflow
        // eslint-disable-next-line no-unused-expressions
        msg.offsetHeight;
        msg.classList.add('show');
        setTimeout(() => {
            msg.classList.remove('show');
            setTimeout(() => { if(msg && msg.parentElement) msg.parentElement.removeChild(msg); }, 220);
        }, 3000 + Math.floor(Math.random() * 2000));
    }

    function placeNoAcrossPage(){
        const vpW = window.innerWidth;
        const vpH = window.innerHeight;
        const noRect = noBtn.getBoundingClientRect();
        const noW = noRect.width;
        const noH = noRect.height;
        const padding = 8;

        const blockers = visibleRectsForBlocking();

        const attempts = 600;
        let found = false;
        let x = 0, y = 0;

        for(let i = 0; i < attempts; i++){
            x = Math.floor(padding + Math.random() * Math.max(0, vpW - noW - padding * 2));
            y = Math.floor(padding + Math.random() * Math.max(0, vpH - noH - padding * 2));
            const cand = { left: x, top: y, right: x + noW, bottom: y + noH };
            let ok = true;
            for(const b of blockers){
                if(intersects(cand, b)) { ok = false; break; }
            }
            if(ok){ found = true; break; }
        }

        if(!found){
            // deterministic grid scan fallback
            const stepX = Math.max(32, Math.floor(noW / 2));
            const stepY = Math.max(32, Math.floor(noH / 2));
            outer: for(y = padding; y <= vpH - noH - padding; y += stepY){
                for(x = padding; x <= vpW - noW - padding; x += stepX){
                    const cand = { left: x, top: y, right: x + noW, bottom: y + noH };
                    let ok = true;
                    for(const b of blockers){ if(intersects(cand, b)) { ok = false; break; } }
                    if(ok){ found = true; break outer; }
                }
            }
        }

        // place at found coordinates (fixed positioning)
        noBtn.style.left = (Math.max(padding, Math.min(x, vpW - noW - padding))) + 'px';
        noBtn.style.top = (Math.max(padding, Math.min(y, vpH - noH - padding))) + 'px';
    }

    

    noBtn.addEventListener('mouseenter', () => {
        // hide external image(s) when No is hovered
        setExternalImageHidden(true);

        // increase yes button scale progressively
        increaseYesScale();

        // create placeholder in choices so layout doesn't shift
        const rect = noBtn.getBoundingClientRect();
        if(!placeholder){
            placeholder = document.createElement('div');
            placeholder.className = 'no-placeholder';
            placeholder.style.width = rect.width + 'px';
            placeholder.style.height = rect.height + 'px';
            placeholder.style.display = 'inline-block';
            placeholder.style.visibility = 'hidden';
            choices.replaceChild(placeholder, noBtn);
        }

        // move the button to body and make it fixed-position so it can roam the viewport
        document.body.appendChild(noBtn);
        noBtn.style.position = 'fixed';
        noBtn.style.zIndex = 9999;

        // compute and place (on next frame for sizing stability)
        requestAnimationFrame(placeNoAcrossPage);

        // show GIF overlay on top of the title (if present)
        if(title){
            let gif = document.getElementById('hoverGifOverlay');
            if(!gif){
                gif = document.createElement('img');
                gif.id = 'hoverGifOverlay';
                gif.className = 'hover-gif';
                gif.src = gifUrl;
                document.body.appendChild(gif);
            }
            const tRect = title.getBoundingClientRect();
            // scale GIF down relative to title width (60% of title width, clamped)
            const desiredWidth = Math.min(300, Math.max(80, Math.floor(tRect.width * 0.6)));
            // use absolute positioning and page coordinates to reliably place above the title
            gif.style.position = 'absolute';
            gif.style.width = desiredWidth + 'px';

            function setPositionUsingNatural(){
                const margin = 8;
                let gHeight = 0;
                if(gif.naturalWidth && gif.naturalHeight){
                    gHeight = Math.round(gif.naturalHeight * (desiredWidth / gif.naturalWidth));
                    gif.style.height = gHeight + 'px';
                } else {
                    const gRect = gif.getBoundingClientRect();
                    gHeight = gRect.height;
                }
                const pageLeft = window.scrollX + tRect.left + (tRect.width - desiredWidth) / 2;
                const pageTop = window.scrollY + tRect.top - gHeight - margin;
                gif.style.left = pageLeft + 'px';
                gif.style.top = (Math.max(6 + window.scrollY, pageTop)) + 'px';
                // force reflow then add show class for fade-in
                // eslint-disable-next-line no-unused-expressions
                gif.offsetHeight;
                gif.classList.add('show');
            }

            if(gif.complete && gif.naturalWidth){
                setPositionUsingNatural();
            } else {
                gif.onload = setPositionUsingNatural;
            }
        }

        // show a single non-repeating floating message
        createFloatingMessage(getNextMessage());
    });

    noBtn.addEventListener('mouseleave', () => {
        // move noBtn back into placeholder spot
        if(placeholder && placeholder.parentElement === choices){
            choices.replaceChild(noBtn, placeholder);
            placeholder = null;
            noBtn.style.position = '';
            noBtn.style.left = '';
            noBtn.style.top = '';
            noBtn.style.zIndex = '';
        } else if(placeholder && !placeholder.parentElement){
            // if placeholder lost (rare), append to choices
            choices.appendChild(noBtn);
            placeholder = null;
            noBtn.style.position = '';
            noBtn.style.left = '';
            noBtn.style.top = '';
            noBtn.style.zIndex = '';
        }

        // remove GIF overlay
        const gif = document.getElementById('hoverGifOverlay');
        if(gif){
            gif.classList.remove('show');
            // remove after transition
            setTimeout(() => { if(gif && gif.parentElement) gif.parentElement.removeChild(gif); }, 220);
        }

        // restore any external image(s) hidden earlier
        setExternalImageHidden(false);
    });

    // startup GIF removed

}
if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initButtons);
} else {
    initButtons();
}


