// ==UserScript==
// @name         maibot-bookmarklet
// @version      0.1
// @description  Bookmarklet script loader for MinecraftPEayer/maibot
// @author       MinecraftPEayer
// @match        https://maimaidx-eng.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const s = document.createElement('script');
    const cacheBuster = Math.floor(Date.now() / 60000);
    s.src =
        'https://minecraftpeayer.me/maibot-bookmarklet/main.bundle.js?t=' +
        cacheBuster;
    document.body.append(s);
})();
