

const orb = document.getElementById("orb");
const statusLabel = document.getElementById("status");
const hint = document.getElementById("hint");
const heard = document.getElementById("heard");
const reply = document.getElementById("reply");

const talkButton = document.getElementById("talk");
const stopButton = document.getElementById("stop");

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition = null;

function setListening(active) {
  if (orb) {
    orb.classList.toggle("listening", active);
  }

  if (statusLabel) {
    statusLabel.textContent = active ? "OUVINDO" : "PRONTO";
  }
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    hint.textContent = "Voz indisponível neste navegador.";
    return;
  }

  window.speechSynthesis.cancel();

  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "pt-BR";
  voice.rate = 1;
  voice.pitch = 1;

  window.speechSynthesis.speak(voice);
}

function answerQuestion(question) {
  const text = question.toLocaleLowerCase("pt-BR");

  if (text.includes("seu nome") || text.includes("quem é você")) {
    return "Eu sou o Auron, seu assistente pessoal.";
  }

  if (text.includes("olá") || text.includes("oi")) {
    return "Olá! Estou aqui. Como posso ajudar você?";
  }

  if (text.includes("bom dia")) {
    return "Bom dia! Vamos fazer deste um ótimo dia.";
  }

  if (text.includes("boa noite")) {
    return "Boa noite! Estou aqui com você.";
  }

  if (text.includes("quem me criou")) {
    return "Sou o Auron, um assistente que você está desenvolvendo.";
  }

  if (text.includes("o que você pode fazer")) {
    return "Posso ouvir sua voz e responder a alguns comandos. Ainda estou em desenvolvimento.";
  }

  return "Ouvi sua pergunta: " + question +
    ". Minha inteligência artificial completa ainda precisa ser conectada.";
}

function startAuron() {
  if (!SpeechRecognition) {
    hint.textContent =
      "Reconhecimento de voz indisponível. Tente outro navegador compatível.";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    setListening(true);
    hint.textContent = "Pode falar. Estou ouvindo.";
  };

  recognition.onresult = (event) => {
    const question = event.results[0][0].transcript.trim();

    if (heard) heard.textContent = question;

    const response = answerQuestion(question);

    if (reply) reply.textContent = response;

    hint.textContent = "Resposta pronta.";
    speak(response);
  };

  recognition.onerror = (event) => {
    hint.textContent = event.error === "not-allowed"
      ? "Permita o acesso ao microfone."
      : "Não consegui captar sua fala. Tente novamente.";
  };

  recognition.onend = () => {
    setListening(false);
  };

  try {
    recognition.start();
  } catch (error) {
    setListening(false);
    hint.textContent = "Não consegui iniciar. Tente novamente.";
  }
}

if (talkButton) {
  talkButton.addEventListener("click", startAuron);
}

if (stopButton) {
  stopButton.addEventListener("click", () => {
    if (recognition) recognition.abort();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setListening(false);
    hint.textContent = "Aguardando seu próximo comando.";
  });
}
