/**
 * Script para a página de registro de atrasos
 */

// Quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Carregar a lista de alunos
    carregarAlunos();
    
    // Configurar o formulário de registro
    document.getElementById('formAtraso').addEventListener('submit', registrarAtraso);
});

// Função para carregar a lista de alunos
function carregarAlunos() {
    fetch(`${API_BASE_URL}/alunos.php`)
        .then(response => response.json())
        .then(data => {
            const selectAluno = document.getElementById('aluno');
            
            // Limpar opções existentes
            selectAluno.innerHTML = '<option value="">Selecione o aluno</option>';
            
            // Adicionar os alunos ao select
            data.forEach(aluno => {
                const option = document.createElement('option');
                option.value = aluno.id;
                option.textContent = `${aluno.nome} (${aluno.turma_nome})`;
                selectAluno.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar alunos:', error);
            utils.mostrarNotificacao('Erro ao carregar a lista de alunos.', 'error');
        });
}

// Função para registrar um atraso
function registrarAtraso(event) {
    event.preventDefault();
    
    // Obter os valores do formulário
    const aluno_id = document.getElementById('aluno').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('horario').value;
    const minutos = document.getElementById('minutos').value;
    const justificativa = document.getElementById('justificativa').value;
    
    // Validar os campos obrigatórios
    if (!aluno_id || !data || !hora || !minutos) {
        utils.mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    // Preparar os dados para envio
    const dados = {
        aluno_id: aluno_id,
        data_atraso: data,
        hora_atraso: hora,
        minutos_atraso: minutos,
        justificativa: justificativa
    };
    
    // Enviar para a API
    fetch(`${API_BASE_URL}/atrasos.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            utils.mostrarNotificacao(data.message);
            
            // Se foi registrado com sucesso, limpar o formulário
            if (data.id) {
                document.getElementById('formAtraso').reset();
            }
        }
    })
    .catch(error => {
        console.error('Erro ao registrar atraso:', error);
        utils.mostrarNotificacao('Erro ao registrar o atraso. Tente novamente.', 'error');
    });
}