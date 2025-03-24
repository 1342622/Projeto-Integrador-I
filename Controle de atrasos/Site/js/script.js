/**
 * Script principal para o sistema de controle de atrasos
 */

// Definir o URL base da API
const API_BASE_URL = 'backend/api';

// Funções utilitárias
const utils = {
    // Formatar data para exibição (DD/MM/AAAA)
    formatarData: function(dataString) {
        if (!dataString) return '';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    },
    
    // Formatar hora para exibição (HH:MM)
    formatarHora: function(horaString) {
        if (!horaString) return '';
        return horaString.substr(0, 5);
    },
    
    // Formatar data para envio à API (AAAA-MM-DD)
    formatarDataParaAPI: function(dataString) {
        if (!dataString) return '';
        const partes = dataString.split('/');
        if (partes.length === 3) {
            return `${partes[2]}-${partes[1]}-${partes[0]}`;
        }
        return dataString;
    },
    
    // Mostrar mensagem de notificação
    mostrarNotificacao: function(mensagem, tipo = 'success') {
        const div = document.createElement('div');
        div.textContent = mensagem;
        div.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            border-radius: 4px;
            color: white;
            background-color: ${tipo === 'success' ? '#4CAF50' : '#f44336'};
            z-index: 1000;
        `;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }
};