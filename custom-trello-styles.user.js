// ==UserScript==
// @name         Estilos Trello personalizados con aviso
// @namespace    http://tampermonkey.net/
// @version      0.3.7
// @description  Cambia estilos en Trello y muestra un aviso visual en pantalla al aplicar los cambios CSS personalizados.
// @author       (autor)
// @match        *://*.trello.com/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://github.com/SrGexj/trello-styles-change/raw/refs/heads/main/custom-trello-styles.user.js
// @downloadURL  https://github.com/SrGexj/trello-styles-change/raw/refs/heads/main/custom-trello-styles.user.js
// ==/UserScript==

(function () {
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
    Object.keys(settings).forEach(key => {
      if (savedSettings[key] && savedSettings[key].value) {
        settings[key].value = savedSettings[key].value
      } else {
        settings[key].value = settings[key].value || ''
      }
    })
  
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('customTrelloStylesSettings', JSON.stringify(settings))
    })
  
    function createUI(trelloModal) {
      const settingsToggler = document.createElement('button')
      settingsToggler.id = 'custom-settings-toggler'
      settingsToggler.textContent = '⚙️ Personalizar estilos'
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
        zIndex: 99999
      })
  
      settingsToggler.addEventListener('click', (e) => {
        e.stopPropagation()
        const panel = document.getElementById('custom-settings-panel')
        if (panel) {
          panel.remove()
        } else {
          createSettingsPanel()
        }
      })
  
      trelloModal.appendChild(settingsToggler)
    }
  
    function createSettingsPanel() {
      const panel = document.createElement('div')
      panel.id = 'custom-settings-panel'
      Object.assign(panel.style, {
        position: 'fixed',
        bottom: '60px',
        right: '10px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 99999
      })
  
      panel.addEventListener('click', (e) => {
        e.stopPropagation()
      })
  
      Object.keys(settings).forEach(key => {
        const setting = settings[key]
        const label = document.createElement('label')
        label.textContent = setting.name + ': '
        const input = document.createElement('input')
        input.type = 'text'
        input.value = setting.value
        input.addEventListener('input', () => {
          setting.value = input.value
          localStorage.setItem('customTrelloStylesSettings', JSON.stringify(settings))
          applyCustomStyles()
          successMessage()
        })
        label.appendChild(input)
        panel.appendChild(label)
        panel.appendChild(document.createElement('br'))
      })
  
      document.body.appendChild(panel)
    }
  
    function successMessage() {
      const message = document.createElement('div')
      message.id = 'tampermonkey-banner'
      message.textContent = '✅ Estilos personalizados aplicados'
      document.body.appendChild(message)
    }
  
    function applyCustomStyles() {
      const existingStyle = document.getElementById('custom-styles')
      if (existingStyle) {
        existingStyle.remove()
      }
  
      let styleContent = ''
  
      Object.keys(settings).forEach(key => {
        const setting = settings[key]
        let val = setting.value.trim()
        if (!val || isNaN(parseFloat(val))) val = '700px'
        if (!val.endsWith('px') && !val.endsWith('%')) val += 'px'
        if (isNaN(parseFloat(val)) || parseFloat(val) <= 0) val = '700px'
        styleContent += `
          ${setting.scopeClass} {
            ${setting.propertyToChange}: ${val} !important;
          }
        `
      })
  
      const style = document.createElement('style')
      style.id = 'custom-styles'
      style.textContent = styleContent
      document.head.appendChild(style)
    }
  
    function injectBaseStyle() {
      const style = document.createElement('style')
      style.textContent = `
        ._UvaHK6fukmTc4.sfCjcMKVjES0Hl.t_6PqKcL7DA8Qa {
          width: fit-content !important;
        }
  
        ${settings.commentsBlockWidth.scopeClass} {
          box-sizing: border-box !important;
          width: ${settings.commentsBlockWidth.value} !important;
        }
  
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
    }
  
    // Esperar a que exista el modal para poder inyectar dentro
    const observer = new MutationObserver(() => {
      const trelloModal = document.querySelector('.window-wrapper')
      if (trelloModal && !document.getElementById('custom-settings-toggler')) {
        createUI(trelloModal)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  
    applyCustomStyles()
    injectBaseStyle()
  })()
  