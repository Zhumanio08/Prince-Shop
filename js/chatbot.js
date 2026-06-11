// ============================================
// PRINCE — AI Chatbot Assistant
// ============================================
// API-ключ вынесен в config.js (не попадает в git)

// Системный промпт — информация о магазине
const SYSTEM_PROMPT = `Ты — ИИ-консультант магазина мужской одежды PRINCE в Алматы. 

ИНФОРМАЦИЯ О МАГАЗИНЕ:
- Название: PRINCE — премиальный магазин мужской одежды
- Адрес: Наурызбай Батыра 68, угол Айтеке Би, Алматы
- Часы работы: Ежедневно 10:00 — 22:00
- WhatsApp: +7 775 478 2111
- Instagram: @prince.almaty1
- Концепция: качественная мужская одежда для современного мужчины
- Ассортимент: рубашки, пиджаки, брюки, и другая мужская одежда премиум-класса

ТВОИ ЗАДАЧИ:
1. Отвечай на вопросы клиентов про магазин, ассортимент, наличие
2. Давай стилистические советы по одежде
3. Помогай с выбором размера и образа
4. Будь вежливым и профессиональным
5. Отвечай на русском языке
6. Если вопрос не касается одежды или магазина, вежливо направляй тему обратно
7. Будь кратким и по делу, но дружелюбным`;

// ========== ELEMENTS ==========
let chatOpen = false;
let messages = [];

document.addEventListener("DOMContentLoaded", () => {
  const chatToggle = document.getElementById("chatToggle");
  const chatWidget = document.getElementById("chatWidget");
  const chatClose = document.getElementById("chatClose");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");
  const chatBody = document.getElementById("chatBody");
  const chatMinimize = document.getElementById("chatMinimize");

  if (!chatToggle || !chatWidget) return;

  // Toggle chat
  chatToggle.addEventListener("click", () => {
    chatOpen = !chatOpen;
    chatWidget.classList.toggle("active", chatOpen);
    if (chatOpen) {
      chatInput.focus();
      if (messages.length === 0) {
        addBotMessage(
          "Здравствуйте! Я — консультант PRINCE. Чем могу помочь? Подскажу по ассортименту, помогу с выбором размера или стиля.",
        );
      }
    }
  });

  chatClose.addEventListener("click", () => {
    chatOpen = false;
    chatWidget.classList.remove("active");
  });

  chatMinimize.addEventListener("click", () => {
    chatOpen = false;
    chatWidget.classList.remove("active");
  });

  // Send message
  const sendMessage = () => {
    const text = chatInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    chatInput.value = "";
    chatInput.style.height = "auto";

    // Show typing indicator
    showTypingIndicator();

    // Call API
    callGroqAPI(text);
  };

  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize input
  chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
  });

  // ========== API CALL ==========
  async function callGroqAPI(userMessage) {
    // Build message history
    const messageHistory = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    try {
      const response = await fetch(CHATBOT_CONFIG.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CHATBOT_CONFIG.apiKey}`,
        },
        body: JSON.stringify({
          model: CHATBOT_CONFIG.model,
          messages: messageHistory,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.choices[0].message.content;

      // Remove typing indicator
      removeTypingIndicator();

      addBotMessage(botReply);
    } catch (error) {
      removeTypingIndicator();
      console.error("Chatbot error:", error);
      addBotMessage(
        "Извините, произошла ошибка соединения. Пожалуйста, попробуйте ещё раз или напишите нам в WhatsApp.",
      );
    }
  }

  // ========== UI HELPERS ==========
  function addUserMessage(text) {
    messages.push({ role: "user", content: text });
    const el = document.createElement("div");
    el.className = "chat-message chat-message--user";
    el.textContent = text;
    chatBody.appendChild(el);
    scrollToBottom();
  }

  function addBotMessage(text) {
    messages.push({ role: "assistant", content: text });
    const el = document.createElement("div");
    el.className = "chat-message chat-message--bot";
    el.innerHTML = formatBotMessage(text);
    chatBody.appendChild(el);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const el = document.createElement("div");
    el.className = "chat-message chat-message--bot chat-typing";
    el.id = "chatTyping";
    el.innerHTML =
      '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    chatBody.appendChild(el);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById("chatTyping");
    if (el) el.remove();
  }

  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function formatBotMessage(text) {
    // Simple formatting: bold, paragraphs
    return text
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  }
});
