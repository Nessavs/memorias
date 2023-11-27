const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/script.js');
  });

let cache = [];
let memoriaPrincipal = [];
let estatisticas = {
  acessos: 0,
  acertos: 0,
  faltas: 0,
  leituras: 0,
  escritas: 0,
};

// Função para converter número para binário com zeros à esquerda
function toBinary(number, bits) {
    const binaryString = number.toString(2);
    return binaryString.length >= bits
      ? binaryString
      : '0'.repeat(bits - binaryString.length) + binaryString;
  }

// Função para inicializar a memória principal
function inicializarMemoriaPrincipal() {
  for (let i = 0; i < 2048; i++) {
    memoriaPrincipal.push({
      enderecoBinario: toBinary(i, 11),
      rotuloBinario: toBinary(i, 5),
      conteudo: String.fromCharCode(Math.floor(Math.random() * 26) + 65),
    });
  }
}

// Função para realizar a simulação de Política de Mapeamento Direto
function mapeamentoDireto(enderecoBinario, operacao) {
  const indiceCache = parseInt(enderecoBinario, 2) % cache.length;
  const conteudoCache = cache[indiceCache];

  if (conteudoCache && conteudoCache.enderecoBinario === enderecoBinario) {
    // Hit
    estatisticas.acertos++;
  } else {
    // Miss
    estatisticas.faltas++;
    // Substituir o bloco na cache com base no índice calculado
    cache[indiceCache] = { ...memoriaPrincipal[parseInt(enderecoBinario, 2)] };
  }

  // Atualizar as estatísticas
  estatisticas.acessos += 2; // Considerando que ir para a cache envolve 2 acessos
  if (operacao === 'leitura') estatisticas.leituras++;
  else if (operacao === 'escrita') estatisticas.escritas++;
}

// Inicializar a memória principal
inicializarMemoriaPrincipal();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/alterar-memoria/:acao', (req, res) => {
  const acao = req.params.acao;

  if (acao === 'aumentar') {
    cache.push(null); // Adapte a lógica conforme necessário
  } else if (acao === 'diminuir') {
    cache.pop(); // Adapte a lógica conforme necessário
  } else {
    res.json({ success: false, message: 'Ação inválida.' });
    return;
  }

  res.json({ success: true, memSize: cache.length, message: `Memória ${acao} com sucesso.` });
});

app.post('/operacao-memoria', (req, res) => {
  const { enderecoBinario, operacao } = req.body;

  mapeamentoDireto(enderecoBinario, operacao);

  res.json({ success: true, estatisticas });
});

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});