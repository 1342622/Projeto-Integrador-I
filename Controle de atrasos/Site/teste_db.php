<?php
require_once 'backend/config/db_config.php';

// Se chegou até aqui sem erros, a conexão foi bem-sucedida
echo "Conexão com o banco de dados estabelecida com sucesso!";

// Teste para verificar se os dados podem ser recuperados
$stmt = $pdo->query("SELECT * FROM alunos");
$alunos = $stmt->fetchAll();

echo "<h2>Lista de Alunos</h2>";
echo "<ul>";
foreach ($alunos as $aluno) {
    echo "<li>" . $aluno['nome'] . " - Matrícula: " . $aluno['matricula'] . "</li>";
}
echo "</ul>";
?>