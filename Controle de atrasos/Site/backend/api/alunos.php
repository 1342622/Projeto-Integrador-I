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
        getAllAlunos();
        break;
    default:
        echo json_encode(['message' => 'Método não suportado']);
        break;
}

// Função para obter todos os alunos
function getAllAlunos() {
    $sql = "SELECT a.*, t.nome as turma_nome 
            FROM alunos a 
            LEFT JOIN turmas t ON a.turma_id = t.id 
            WHERE a.status = 'Ativo'
            ORDER BY a.nome";
    $stmt = executeQuery($sql);
    $alunos = $stmt->fetchAll();
    
    echo json_encode($alunos);
}
?>