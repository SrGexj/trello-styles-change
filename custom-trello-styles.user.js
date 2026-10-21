// ==UserScript==
// @name         Estilos Trello personalizados con aviso (Completo)
// @namespace    http://tampermonkey.net/
// @version      0.8.0
// @description  Cambia estilos en Trello ajustando tarjetas, comentarios y contenedores específicos.
// @author       Autor
// @match        *://*.trello.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const settings = {
        commentsBlockWidth: {
            name: 'Ancho de comentarios',
            value: '700px'
        }
    };

    // 1. Cargar configuraciones guardadas
    const savedSettings = JSON.parse(localStorage.getItem('customTrelloStylesSettings')) || {};
    let currentWidth = savedSettings.commentsBlockWidth?.value || settings.commentsBlockWidth.value;
    if (!currentWidth.endsWith('px') && !currentWidth.endsWith('%')) currentWidth += 'px';
    settings.commentsBlockWidth.value = currentWidth;

    // 2. Inyectar variable CSS en el root
    document.documentElement.style.setProperty('--custom-trello-width', currentWidth);

    // 3. Inyectar todas tus clases exactas en la hoja de estilos
    const styleNode = document.createElement('style');
    styleNode.id = 'trello-custom-styles-node';
    styleNode.textContent = `
        /* Clase de la tarjeta abierta */
        .jEs54KasY1oMP5 {
            width: fit-content !important;
            min-width: 800px !important;
            max-width: 95vw !important;
        }

        /* Clase de la sección de comentarios y actividad */
        .DJO_KqFHtOBGlY {
            box-sizing: border-box !important;
            width: var(--custom-trello-width) !important;
        }

        /* Contenedor adicional al 100% */
        .gBDkogPb88r6aI.mrzTPaauDyrned.ftP1qR0Z4zllDj.hww13lqnWLU9MY {
            width: 100% !important;
        }

        /* Estilos del cartel de aviso */
        #tampermonkey-banner {
            position: fixed;
            pointer-events: none;
            top: 16px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #0079bf;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-family: sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 999999;
            opacity: 0;
            animation: fadeInOut 4s forwards;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -20px)}
            10% { opacity: 1; transform: translate(-50%, -19px)}
            80% { opacity: 1; transform: translate(-50%, -1px)}
            100% { opacity: 0; transform: translate(-50%, 0px)}
        }
    `;
    document.head.appendChild(styleNode);

    // 4. Mostrar Banner al guardar o cargar
    function successMessage() {
        const existingBanner = document.getElementById('tampermonkey-banner');
        if (existingBanner) existingBanner.remove();

        const message = document.createElement('div');
        message.id = 'tampermonkey-banner';
        message.textContent = '✅ Estilos aplicados correctamente';
        document.body.appendChild(message);

        setTimeout(() => {
            if (message && message.parentNode) message.remove();
        }, 4500);
    }

    // 5. Botón y Panel de Control
    const settingsToggler = document.createElement('button');
    settingsToggler.id = 'custom-settings-toggler';
    settingsToggler.textContent = '⚙️ Personalizar estilos';
    Object.assign(settingsToggler.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: '#0079bf',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer',
        zIndex: '999999'
    });

    settingsToggler.addEventListener('click', (e) => {
        e.stopPropagation();
        const panel = document.getElementById('custom-settings-panel');
        if (panel) panel.remove();
        else createSettingsPanel();
    });

    document.body.appendChild(settingsToggler);

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'custom-settings-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            bottom: '60px',
            right: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: '999999',
            color: '#333',
            fontFamily: 'sans-serif'
        });

        panel.addEventListener('click', e => e.stopPropagation());
        panel.addEventListener('mousedown', e => e.stopPropagation());

        const label = document.createElement('label');
        label.textContent = settings.commentsBlockWidth.name + ': ';
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        label.style.fontWeight = 'bold';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = settings.commentsBlockWidth.value;
        input.style.marginLeft = '8px';
        input.style.padding = '4px';
        input.style.borderRadius = '4px';
        input.style.border = '1px solid #ccc';

        input.addEventListener('change', () => { 
            let val = input.value.trim();
            if (!val || isNaN(parseFloat(val))) val = '700px';
            if (!val.endsWith('px') && !val.endsWith('%')) val += 'px';
            
            input.value = val;
            settings.commentsBlockWidth.value = val;
            localStorage.setItem('customTrelloStylesSettings', JSON.stringify(settings));
            
            // Actualiza la variable CSS dinámicamente
            document.documentElement.style.setProperty('--custom-trello-width', val);
            successMessage();
        });

        label.appendChild(input);
        panel.appendChild(label);
        document.body.appendChild(panel);
    }

    // Cierra el panel al hacer clic fuera de él
    document.addEventListener('click', (e) => {
        const panel = document.getElementById('custom-settings-panel');
        if (panel && !panel.contains(e.target) && e.target !== settingsToggler) {
            panel.remove();
        }
    });

})();
