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
        // Implementação básica - pode ser melhorada com uma biblioteca de notificações
        alert(mensagem);
    }
};