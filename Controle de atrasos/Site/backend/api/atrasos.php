<?php
// Incluir a configuração do banco de dados
require_once '../config/db_config.php';

// Configurar cabeçalhos para API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Obter o método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Processar a requisição de acordo com o método
switch ($method) {
    case 'GET':
        // Verificar se há filtro por aluno
        if (isset($_GET['aluno_id'])) {
            $aluno_id = filter_input(INPUT_GET, 'aluno_id', FILTER_SANITIZE_NUMBER_INT);
            getAtrasosByAluno($aluno_id);
        }
        // Verificar se há filtro por turma
        else if (isset($_GET['turma_id'])) {
            $turma_id = filter_input(INPUT_GET, 'turma_id', FILTER_SANITIZE_NUMBER_INT);
            getAtrasosByTurma($turma_id);
        }
        // Verificar se há filtro por data
        else if (isset($_GET['data_inicio']) && isset($_GET['data_fim'])) {
            $data_inicio = filter_input(INPUT_GET, 'data_inicio', FILTER_SANITIZE_STRING);
            $data_fim = filter_input(INPUT_GET, 'data_fim', FILTER_SANITIZE_STRING);
            getAtrasosByPeriodo($data_inicio, $data_fim);
        }
        else {
            getAllAtrasos();
        }
        break;
        
    case 'POST':
        // Obter os dados enviados
        $data = json_decode(file_get_contents("php://input"));
        
        // Verificar se os dados obrigatórios foram enviados
        if (
            !empty($data->aluno_id) && 
            !empty($data->data_atraso) && 
            !empty($data->hora_atraso) &&
            isset($data->minutos_atraso)
        ) {
            createAtraso($data);
        } else {
            echo json_encode(['message' => 'Dados incompletos']);
        }
        break;
        
    default:
        echo json_encode(['message' => 'Método não suportado']);
        break;
}

// Função para obter todos os atrasos
function getAllAtrasos() {
    $sql = "SELECT a.*, 
                   al.nome as aluno_nome, 
                   t.nome as turma_nome
            FROM atrasos a
            JOIN alunos al ON a.aluno_id = al.id
            LEFT JOIN turmas t ON al.turma_id = t.id
            ORDER BY a.data_atraso DESC, a.hora_atraso DESC";
    
    $stmt = executeQuery($sql);
    $atrasos = $stmt->fetchAll();
    
    echo json_encode($atrasos);
}

// Função para obter atrasos por aluno
function getAtrasosByAluno($aluno_id) {
    $sql = "SELECT a.*, 
                   al.nome as aluno_nome, 
                   t.nome as turma_nome
            FROM atrasos a
            JOIN alunos al ON a.aluno_id = al.id
            LEFT JOIN turmas t ON al.turma_id = t.id
            WHERE a.aluno_id = ?
            ORDER BY a.data_atraso DESC, a.hora_atraso DESC";
    
    $stmt = executeQuery($sql, [$aluno_id]);
    $atrasos = $stmt->fetchAll();
    
    echo json_encode($atrasos);
}

// Função para obter atrasos por turma
function getAtrasosByTurma($turma_id) {
    $sql = "SELECT a.*, 
                   al.nome as aluno_nome, 
                   t.nome as turma_nome
            FROM atrasos a
            JOIN alunos al ON a.aluno_id = al.id
            JOIN turmas t ON al.turma_id = t.id
            WHERE t.id = ?
            ORDER BY a.data_atraso DESC, a.hora_atraso DESC";
    
    $stmt = executeQuery($sql, [$turma_id]);
    $atrasos = $stmt->fetchAll();
    
    echo json_encode($atrasos);
}

// Função para obter atrasos por período
function getAtrasosByPeriodo($data_inicio, $data_fim) {
    $sql = "SELECT a.*, 
                   al.nome as aluno_nome, 
                   t.nome as turma_nome
            FROM atrasos a
            JOIN alunos al ON a.aluno_id = al.id
            LEFT JOIN turmas t ON al.turma_id = t.id
            WHERE a.data_atraso BETWEEN ? AND ?
            ORDER BY a.data_atraso DESC, a.hora_atraso DESC";
    
    $stmt = executeQuery($sql, [$data_inicio, $data_fim]);
    $atrasos = $stmt->fetchAll();
    
    echo json_encode($atrasos);
}

// Função para criar um novo atraso
function createAtraso($data) {
    // Verificar se o aluno existe
    $sql = "SELECT id FROM alunos WHERE id = ? AND status = 'Ativo'";
    $stmt = executeQuery($sql, [$data->aluno_id]);
    
    if ($stmt->rowCount() == 0) {
        echo json_encode(['message' => 'Aluno não encontrado ou inativo']);
        return;
    }
    
    // Inserir o atraso
    $sql = "INSERT INTO atrasos (aluno_id, data_atraso, hora_atraso, minutos_atraso, justificativa, status) 
            VALUES (?, ?, ?, ?, ?, ?)";
    
    $params = [
        $data->aluno_id,
        $data->data_atraso,
        $data->hora_atraso,
        $data->minutos_atraso,
        $data->justificativa ?? null,
        $data->status ?? 'Pendente'
    ];
    
    $stmt = executeQuery($sql, $params);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'message' => 'Atraso registrado com sucesso',
            'id' => $GLOBALS['pdo']->lastInsertId()
        ]);
    } else {
        echo json_encode(['message' => 'Erro ao registrar atraso']);
    }
}
?>