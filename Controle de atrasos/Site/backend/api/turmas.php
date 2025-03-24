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
        getAllTurmas();
        break;
    default:
        echo json_encode(['message' => 'Método não suportado']);
        break;
}

// Função para obter todas as turmas
function getAllTurmas() {
    $sql = "SELECT * FROM turmas ORDER BY nome";
    $stmt = executeQuery($sql);
    $turmas = $stmt->fetchAll();
    
    echo json_encode($turmas);
}
?>