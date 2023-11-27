<?php
$host = "localhost";
$user = "seu_usuario_mysql";
$password = "sua_senha_mysql";
$database = "cacheSimulation";

// Conecta ao banco de dados
$conn = new mysqli($host, $user, $password, $database);

// Verifica a conexão
if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

// Função para converter número para binário com zeros à esquerda
function toBinary($number, $bits) {
    return str_pad(decbin($number), $bits, '0', STR_PAD_LEFT);
}

// Rota para realizar a simulação de Política de Mapeamento Direto
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['enderecoBinario']) && isset($_POST['operacao'])) {
    $enderecoBinario = $_POST['enderecoBinario'];
    $operacao = $_POST['operacao'];

    $sql = "SELECT * FROM principal WHERE enderecoBinario = '$enderecoBinario'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Hit
        $acertos++;
    } else {
        // Miss
        $faltas++;
        // Substituir o bloco na cache com base no índice calculado
        $sqlInsert = "INSERT INTO principal (enderecoBinario, rotuloBinario, conteudo) VALUES ('$enderecoBinario', '" . substr($enderecoBinario, 0, 5) . "', '" . chr(rand(65, 90)) . "')";
        $conn->query($sqlInsert);
    }

    // Atualizar as estatísticas
    $acessos += 2; // Considerando que ir para a cache envolve 2 acessos
    if ($operacao === 'leitura') $leituras++;
    elseif ($operacao === 'escrita') $escritas++;

    // Responde com as estatísticas
    echo json_encode(['success' => true, 'estatisticas' => compact('acessos', 'acertos', 'faltas', 'leituras', 'escritas')]);
    exit();
}

// Rota para alterar a memória (aumentar ou diminuir)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['acao'])) {
    $acao = $_POST['acao'];

    if ($acao === 'aumentar') {
        $sqlInsert = "INSERT INTO principal (enderecoBinario, rotuloBinario, conteudo) VALUES ('" . toBinary($result->num_rows, 11) . "', '" . toBinary($result->num_rows, 5) . "', '" . chr(rand(65, 90)) . "')";
        $conn->query($sqlInsert);
    } elseif ($acao === 'diminuir') {
        $sqlDelete = "DELETE FROM principal ORDER BY id DESC LIMIT 1";
        $conn->query($sqlDelete);
    } else {
        echo json_encode(['success' => false, 'message' => 'Ação inválida.']);
        exit();
    }

    echo json_encode(['success' => true, 'memSize' => $result->num_rows, 'message' => "Memória $acao com sucesso."]);
    exit();
}
// ... (restante do código)
?>