// ==UserScript==
// @name         Estilos Trello personalizados con aviso
// @namespace    http://tampermonkey.net/
// @version      2025-06-27
// @description  Cambia estilos en Trello y muestra un aviso visual en pantalla al aplicar los cambios CSS personalizados.
// @author       Juano
// @match        *://*.trello.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function() {
    'use strict'

    // Inyectar los estilos personalizados
    const style = document.createElement('style')
    style.textContent = `
        /* Estilos personalizados */
        ._UvaHK6fukmTc4.sfCjcMKVjES0Hl.t_6PqKcL7DA8Qa {
            width: fit-content !important;
        }

        .q5xxNU7ASO2fsR,
        .q5xxNU7ASO2fsR .N4ktAjtOpkJvy0 {
            box-sizing: border-box !important;
            width: 700px !important;
        }

        /* Banner de notificación */
        #tampermonkey-banner {
            position: fixed;
            bottom: 16px;
            right: 16px;
            background-color: #0079bf;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-family: sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 99999;
            opacity: 0;
            animation: fadeInOut 5s forwards;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; }
            100% { opacity: 0; transform: translateY(10px); }
        }
    `
    document.head.appendChild(style)

    // Crear y mostrar el aviso visual
    const banner = document.createElement('div')
    banner.id = 'tampermonkey-banner'
    banner.textContent = '✅ Estilos personalizados aplicados'
    document.body.appendChild(banner)

    console.log('[Tampermonkey] Estilos personalizados inyectados en Trello')
})()