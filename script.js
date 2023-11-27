// Função para aumentar ou diminuir a memória
function alterarMemoria(acao) {
    $.ajax({
      url: `/alterar-memoria/${acao}`,
      method: 'POST',
      success: function (data) {
        if (data.success) {
          $('#memSize').text(data.memSize);
          $('#resultado').html(`<p>${data.message}</p>`);
        } else {
          $('#resultado').html(`<p class="text-danger">${data.message}</p>`);
        }
      },
      error: function () {
        $('#resultado').html('<p class="text-danger">Erro ao realizar a operação.</p>');
      }
    });
  }
  
  // Função para realizar operações de leitura ou escrita
  function operacaoMemoria(operacao) {
    const enderecoBinario = $('#enderecoBinario').val();
  
    $.ajax({
      url: '/operacao-memoria',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ enderecoBinario, operacao }),
      success: function (data) {
        if (data.success) {
          $('#resultado').html(`
            <p>Operação realizada com sucesso!</p>
            <p>Estatísticas:</p>
            <ul>
              <li>Número de Acessos: ${data.estatisticas.acessos}</li>
              <li>Número de Acertos: ${data.estatisticas.acertos}</li>
              <li>Número de Faltas: ${data.estatisticas.faltas}</li>
              <li>Número de Leituras: ${data.estatisticas.leituras}</li>
              <li>Número de Escritas: ${data.estatisticas.escritas}</li>
            </ul>
          `);
        } else {
          $('#resultado').html('<p class="text-danger">Erro ao realizar a operação.</p>');
        }
      },
      error: function () {
        $('#resultado').html('<p class="text-danger">Erro ao realizar a operação.</p>');
      }
    });
  }
  
  // Associar funções aos botões
  $(document).ready(function () {
    $('#btnAumentarMemoria').click(function () {
      alterarMemoria('aumentar');
    });
  
    $('#btnDiminuirMemoria').click(function () {
      alterarMemoria('diminuir');
    });
  
    $('#btnRealizarLeitura').click(function () {
      operacaoMemoria('leitura');
    });
  
    $('#btnRealizarEscrita').click(function () {
      operacaoMemoria('escrita');
    });
  });