/**
 * Script para a página de consulta de atrasos
 */

// Quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Carregar as listas de alunos e turmas
    carregarAlunos();
    carregarTurmas();
    
    // Configurar o formulário de consulta
    document.getElementById('formConsulta').addEventListener('submit', consultarAtrasos);
    
    // Configurar a mudança de filtro
    document.getElementById('filtro').addEventListener('change', mudarFiltro);
    
    // Mostrar todos os atrasos inicialmente
    consultarAtrasos({ preventDefault: () => {} });
});

// Função para mudar o filtro de consulta
function mudarFiltro() {
    const filtro = document.getElementById('filtro').value;
    
    // Esconder todos os filtros específicos
    document.querySelectorAll('.filtro-aluno, .filtro-turma, .filtro-data').forEach(el => {
        el.style.display = 'none';
    });
    
    // Mostrar apenas o filtro selecionado
    if (filtro === 'aluno') {
        document.querySelectorAll('.filtro-aluno').forEach(el => {
            el.style.display = 'block';
        });
    } else if (filtro === 'turma') {
        document.querySelectorAll('.filtro-turma').forEach(el => {
            el.style.display = 'block';
        });
    } else if (filtro === 'data') {
        document.querySelectorAll('.filtro-data').forEach(el => {
            el.style.display = 'block';
        });
    }
}

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

// Função para carregar a lista de turmas
function carregarTurmas() {
    fetch(`${API_BASE_URL}/turmas.php`)
        .then(response => response.json())
        .then(data => {
            const selectTurma = document.getElementById('turma');
            
            // Limpar opções existentes
            selectTurma.innerHTML = '<option value="">Selecione a turma</option>';
            
            // Adicionar as turmas ao select
            data.forEach(turma => {
                const option = document.createElement('option');
                option.value = turma.id;
                option.textContent = turma.nome;
                selectTurma.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar turmas:', error);
            utils.mostrarNotificacao('Erro ao carregar a lista de turmas.', 'error');
        });
}

// Função para consultar atrasos
function consultarAtrasos(event) {
    event.preventDefault();
    
    const filtro = document.getElementById('filtro').value;
    let url = `${API_BASE_URL}/atrasos.php`;
    
    // Adicionar parâmetros conforme o filtro selecionado
    if (filtro === 'aluno') {
        const aluno_id = document.getElementById('aluno').value;
        if (!aluno_id) {
            utils.mostrarNotificacao('Selecione um aluno para filtrar.', 'error');
            return;
        }
        url += `?aluno_id=${aluno_id}`;
    } else if (filtro === 'turma') {
        const turma_id = document.getElementById('turma').value;
        if (!turma_id) {
            utils.mostrarNotificacao('Selecione uma turma para filtrar.', 'error');
            return;
        }
        url += `?turma_id=${turma_id}`;
    } else if (filtro === 'data') {
        const data_inicio = document.getElementById('data_inicio').value;
        const data_fim = document.getElementById('data_fim').value;
        if (!data_inicio || !data_fim) {
            utils.mostrarNotificacao('Selecione as datas de início e fim para filtrar.', 'error');
            return;
        }
        url += `?data_inicio=${data_inicio}&data_fim=${data_fim}`;
    }
    
    // Fazer a requisição para a API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            exibirResultados(data);
        })
        .catch(error => {
            console.error('Erro ao consultar atrasos:', error);
            utils.mostrarNotificacao('Erro ao consultar atrasos. Tente novamente.', 'error');
        });
}

// Função para exibir os resultados na tabela
function exibirResultados(atrasos) {
    const tbody = document.querySelector('#tabelaAtrasos tbody');
    
    // Limpar a tabela
    tbody.innerHTML = '';
    
    // Verificar se há resultados
    if (atrasos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" style="text-align: center;">Nenhum atraso encontrado</td>';
        tbody.appendChild(tr);
        return;
    }
    
    // Adicionar cada atraso à tabela
    atrasos.forEach(atraso => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${atraso.aluno_nome}</td>
            <td>${atraso.turma_nome || '-'}</td>
            <td>${utils.formatarData(atraso.data_atraso)}</td>
            <td>${utils.formatarHora(atraso.hora_atraso)}</td>
            <td>${atraso.minutos_atraso} min</td>
            <td>${atraso.status}</td>
            <td>
                <button class="btn btn-sm" onclick="verDetalhes(${atraso.id})">Detalhes</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Função para ver detalhes de um atraso (a ser implementada)
function verDetalhes(id) {
    alert(`Ver detalhes do atraso ${id}`);
    // Implementação real: abrir um modal com detalhes ou redirecionar para uma página de detalhes
}