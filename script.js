document.addEventListener('DOMContentLoaded', () => {
  const cepInput = document.getElementById('cep');
  const loadingSpan = document.getElementById('cep-loading');

  const logradouroInput = document.getElementById('logradouro');
  const bairroInput = document.getElementById('bairro');
  const localidadeInput = document.getElementById('localidade');
  const ufInput = document.getElementById('uf');

  const form = document.getElementById('subscription-form');

  console.log('JavaScript carregado com sucesso!');

  
  cepInput.addEventListener('input', (event) => {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }

    event.target.value = value;
  });

  
  cepInput.addEventListener('blur', async () => {
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length !== 8) {
      console.log('CEP incompleto ou inválido');
      return;
    }

    loadingSpan.textContent = 'Buscando endereço...';

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      if (!response.ok) {
        throw new Error('Erro na requisição da API');
      }

      const data = await response.json();

      if (data.erro) {
        alert('CEP não encontrado. Por favor, verifique o número.');
        loadingSpan.textContent = '';
        return;
      }

      
      logradouroInput.value = data.logradouro || '';
      bairroInput.value = data.bairro || '';
      localidadeInput.value = data.localidade || '';
      ufInput.value = data.uf || '';

      loadingSpan.textContent = 'Endereço encontrado!';
      
      
      document.getElementById('number').focus();

    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      loadingSpan.textContent = 'Não foi possível buscar o endereço.';
    } finally {
      
      setTimeout(() => {
        loadingSpan.textContent = '';
      }, 3000);
    }
  });

  
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const userName = document.getElementById('name').value;
    const userMessage = document.getElementById('message') ? document.getElementById('message').value : '';

    
    const userAddress = [
      logradouroInput.value,
      document.getElementById('number').value,
      bairroInput.value,
      localidadeInput.value,
      ufInput.value
    ]
      .filter(Boolean)
      .join(', ');

    const selectedTicket = document.getElementById('ticket-select');
    const selectedTicketText = selectedTicket.options[selectedTicket.selectedIndex].text;

    const localEvento = 'Instituto Caldeira, Travessa São José, 455, Navegantes, Porto Alegre, RS';

    
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userAddress)}&destination=${encodeURIComponent(localEvento)}&travelmode=driving`;

    console.log('Endereço de origem gerado:', userAddress);
    console.log('Mensagem do formulário:', userMessage);
    console.log('URL de rota do Maps:', googleMapsUrl);

    
    alert(
      `Inscrição Confirmada, ${userName}!\n\n` +
      ` Ingresso: ${selectedTicketText}\n\n` +
      `Obrigado pelo seu contato! Estamos gerando sua rota para o evento...`
    );

    
    window.open(googleMapsUrl, '_blank');

    
    form.reset();
    logradouroInput.value = '';
    bairroInput.value = '';
    localidadeInput.value = '';
    ufInput.value = '';
  });
});