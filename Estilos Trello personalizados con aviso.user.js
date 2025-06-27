// ==UserScript==
// @name         Estilos Trello personalizados con aviso
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Cambia estilos en Trello y muestra un aviso visual en pantalla al aplicar los cambios CSS personalizados.
// @author       Juano
// @match        *://*.trello.com/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://raw.githubusercontent.com/SrGexj/trello-styles-change/main/Estilos%20Trello%20personalizados%20con%20aviso.user.js
// @downloadURL  https://raw.githubusercontent.com/SrGexj/trello-styles-change/main/Estilos%20Trello%20personalizados%20con%20aviso.user.js
// ==/UserScript==

(function() {
    'use strict'

    const settings = {
        commentsBlockWidth: {
            name: 'Ancho del bloque de comentarios',
            propertyToChange: 'width',
            value: '',
            scopeClass: '.q5xxNU7ASO2fsR, .q5xxNU7ASO2fsR .N4ktAjtOpkJvy0'
        }
    }

    const savedSettings = JSON.parse(localStorage.getItem('customTrelloStylesSettings')) || {}
    // Cargar los valores guardados en localStorage
    Object.keys(settings).forEach(key => {
        if (savedSettings[key] && savedSettings[key].value) {
            settings[key].value = savedSettings[key].value
        } else {
            settings[key].value = settings[key].value || ''
        }
    })

    // Guardar los valores en localStorage al cambiar
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('customTrelloStylesSettings', JSON.stringify(settings))
    })

    // Crear un botón para abrir el panel de configuración
    const settingsToggler = document.createElement('button')
    settingsToggler.id = 'custom-settings-toggler'
    settingsToggler.textContent = '⚙️ Personalizar estilos'
    settingsToggler.style.position = 'fixed'
    settingsToggler.style.bottom = '10px'
    settingsToggler.style.right = '10px'
    settingsToggler.style.backgroundColor = '#0079bf'
    settingsToggler.style.color = 'white'
    settingsToggler.style.border = 'none'
    settingsToggler.style.borderRadius = '8px'
    settingsToggler.style.padding = '8px 12px'
    settingsToggler.style.cursor = 'pointer'
    settingsToggler.style.zIndex = '99999'

    settingsToggler.addEventListener('click', () => {
        const panel = document.getElementById('custom-settings-panel')
        if (panel) {
            panel.remove()
        } else {
            createSettingsPanel()
        }
    })
    // Añadir el botón al cuerpo del documento
    document.body.appendChild(settingsToggler)

    // Crear el panel de configuración
    function createSettingsPanel() {
        const panel = document.createElement('div')
        panel.id = 'custom-settings-panel'
        panel.style.position = 'fixed'
        panel.style.bottom = '60px'
        panel.style.right = '10px'
        panel.style.backgroundColor = '#fff'
        panel.style.border = '1px solid #ccc'
        panel.style.borderRadius = '8px'
        panel.style.padding = '16px'
        panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
        panel.style.zIndex = '99999'

        Object.keys(settings).forEach(key => {
            const setting = settings[key]
            const label = document.createElement('label')
            label.textContent = setting.name + ': '
            const input = document.createElement('input')
            input.type = 'text'
            input.value = setting.value
            input.addEventListener('input', () => {
                setting.value = input.value
                // Guardar el valor en localStorage
                localStorage.setItem('customTrelloStylesSettings', JSON.stringify(settings))
                // Aplicar los estilos personalizados
                applyCustomStyles()
                // Mostrar un mensaje de éxito
                successMessage()
            })
            label.appendChild(input)
            panel.appendChild(label)
            panel.appendChild(document.createElement('br'))
        })

        document.body.appendChild(panel)
    }

    // Mensaje para que el usuario sepa que los estilos se aplicaron correctamente
    function successMessage() {
        const message = document.createElement('div')
        message.id = 'tampermonkey-banner'
        message.textContent = '✅ Estilos personalizados aplicados'
        message.animate = 'fadeInOut 5s forwards'

        document.body.appendChild(message)
    }

    // Función para aplicar los estilos personalizados
    function applyCustomStyles() {
        // Eliminar estilos anteriores
        const existingStyle = document.getElementById('custom-styles')
        if (existingStyle) {
            existingStyle.remove()
        } 

        // Validar el ancho del bloque de comentarios
        if (!settings.commentsBlockWidth.value || isNaN(parseFloat(settings.commentsBlockWidth.value))) {
            settings.commentsBlockWidth.value = '700px' // Valor por defecto si no se especifica
        }
        // Asegurarse de que el ancho sea un valor válido
        settings.commentsBlockWidth.value = settings.commentsBlockWidth.value.trim()
        if (!settings.commentsBlockWidth.value.endsWith('px') && !settings.commentsBlockWidth.value.endsWith('%')) {
            settings.commentsBlockWidth.value += 'px' // Añadir 'px' si no se especifica
        }
        // Validar que el ancho sea un valor numérico válido
        const widthValue = parseFloat(settings.commentsBlockWidth.value)
        if (isNaN(widthValue) || widthValue <= 0) {
            settings.commentsBlockWidth.value = '700px' // Valor por defecto si no es válido
        }

        // Crear un nuevo elemento de estilo con los estilos personalizados
        const style = document.createElement('style')
        style.id = 'custom-styles'
        style.textContent = `
            ${settings.commentsBlockWidth.scopeClass} {
                box-sizing: border-box !important;
                width: ${settings.commentsBlockWidth.value} !important;
            }
        `
        document.head.appendChild(style)
    }
    // Aplicar estilos personalizados al cargar la página
    applyCustomStyles()
    // Mostrar un aviso visual al aplicar los estilos
    const existingBanner = document.getElementById('tampermonkey-banner')
    if (existingBanner) {
        existingBanner.remove() // Eliminar el banner anterior si existe
    }


    // Inyectar los estilos personalizados
    const style = document.createElement('style')
    style.textContent = `
        /* Estilos personalizados */
        ._UvaHK6fukmTc4.sfCjcMKVjES0Hl.t_6PqKcL7DA8Qa {
            width: fit-content !important;
        }

          ${settings.commentsBlockWidth.scopeClass} {
            box-sizing: border-box !important;
            width: ${settings.commentsBlockWidth.value} !important;
        }

        /* Banner de notificación */
        #tampermonkey-banner {
            position: fixed;
            top: 16px;
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
            0% { opacity: 0;}
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; }
            100% { opacity: 0; }
        }
    `
    document.head.appendChild(style)

    // Crear y mostrar el aviso visual
    const banner = document.createElement('div')
    banner.id = 'tampermonkey-banner'
    banner.textContent = '✅ Estilos personalizados aplicados'
    document.body.appendChild(banner)
    
})()