
        // ==================== CONFIGURATION ====================
        const JSONBIN_API_KEY = '$2a$10$zfLo4xQ0.IvfaaQaJbTDle3OU9eW24NU.iN7JbK9Ph9OpF0MiuRRu'; // Replace with your API key
        const JSONBIN_BASE = 'https://api.jsonbin.io/v3';
        
        // Bin IDs - will be created on first run
        let USERS_BIN_ID = localStorage.getItem('zapchat_users_bin') || '';
        let MESSAGES_BIN_ID = localStorage.getItem('zapchat_messages_bin') || '';
        let CHATS_BIN_ID = localStorage.getItem('zapchat_chats_bin') || '';

        // ==================== STATE ====================
        let currentUser = null;
        let allUsers = {};
        let allChats = {};
        let allMessages = {};
        let currentChatId = null;
        let replyingTo = null;
        let contextMessageId = null;
        let selectedGroupMembers = [];
        let refreshInterval = null;
        let isRecording = false;
        let recordingTimer = null;
        let recordingSeconds = 0;

        // ==================== EMOJI DATA ====================
        const emojis = {
            smileys: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🫣','🤐','🫡','🤨','😐','😑','😶','🫥','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐','😕','🫤','😟','🙁','☹️','😮','😯','😲','😳','🥺','🥹','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖'],
            people: ['👋','🤚','🖐️','✋','🖖','🫱','🫲','🫳','🫴','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','👁️','👅','👄','🫦','👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵'],
            animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊'],
            food: ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🫘','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪'],
            activities: ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','🛷','⛸️','🥌','🎿','⛷️','🏂','🪂','🏋️','🤼','🤸','⛹️','🤺','🤾','🏌️','🏇','🧘','🏄','🏊','🤽','🚣','🧗','🚴','🚵','🎖️','🏆','🥇','🥈','🥉','🏅','🎪','🎗️','🎟️','🎫','🎭','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🪘','🎷','🎺','🪗','🎸','🪕','🎻','🎲','♟️','🎯','🎳','🎮','🕹️','🎰'],
            objects: ['💡','🔦','🕯️','🪔','📱','💻','⌨️','🖥️','🖨️','🖱️','🖲️','🕹️','💾','💿','📀','📷','📸','📹','🎥','📽️','📞','☎️','📟','📠','📺','📻','🎙️','🎚️','🎛️','🧭','⏱️','⏲️','⏰','🕰️','⌛','⏳','📡','🔋','🪫','🔌','💰','🪙','💴','💵','💶','💷','💸','💳','🧾','✉️','📧','📨','📩','📤','📥','📦','📫','📪','📬','📭','📮','📝','💼','📁','📂','📅','📆','📇','📈','📉','📊','📋','📌','📍','📎','🖇️','📏','📐','✂️','🗑️','🔒','🔓','🔑','🗝️'],
            symbols: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','❤️‍🔥','❤️‍🩹','💟','☮️','✝️','☪️','🕉️','☸️','🪯','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🅾️','🆑','🆘','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗','❕','❓','❔','‼️','⁉️','🔅','🔆','〽️','⚠️','🚸','🔱','⚜️','🔰','♻️','✅','🈯','💹','❇️','✳️','❎','🌐','💠','Ⓜ️','🌀','💤','🏧','🚾','♿','🅿️','🛗','🈳','🈂️','🛂','🛃','🛄','🛅']
        };

        // ==================== API FUNCTIONS ====================
        async function apiRequest(method, binId, data = null) {
            const url = binId ? `${JSONBIN_BASE}/b/${binId}` : `${JSONBIN_BASE}/b`;
            const headers = {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            };
            
            if (!binId && method === 'POST') {
                headers['X-Bin-Private'] = 'false';
                headers['X-Bin-Name'] = 'zapchat-' + Date.now();
            }
            
            if (binId && method === 'GET') {
                headers['X-Bin-Meta'] = 'false';
            }
            
            if (binId && method === 'PUT') {
                headers['X-Bin-Versioning'] = 'false';
            }

            const options = { method, headers };
            if (data) options.body = JSON.stringify(data);

            try {
                const response = await fetch(url, options);
                const result = await response.json();
                return result;
            } catch (error) {
                console.error('API Error:', error);
                return null;
            }
        }

        async function initializeBins() {
            showLoading('Inicializando...');
            
            if (!USERS_BIN_ID) {
                const result = await apiRequest('POST', null, { users: {} });
                if (result && result.metadata) {
                    USERS_BIN_ID = result.metadata.id;
                    localStorage.setItem('zapchat_users_bin', USERS_BIN_ID);
                }
            }
            
            if (!MESSAGES_BIN_ID) {
                const result = await apiRequest('POST', null, { messages: {} });
                if (result && result.metadata) {
                    MESSAGES_BIN_ID = result.metadata.id;
                    localStorage.setItem('zapchat_messages_bin', MESSAGES_BIN_ID);
                }
            }
            
            if (!CHATS_BIN_ID) {
                const result = await apiRequest('POST', null, { chats: {} });
                if (result && result.metadata) {
                    CHATS_BIN_ID = result.metadata.id;
                    localStorage.setItem('zapchat_chats_bin', CHATS_BIN_ID);
                }
            }
            
            hideLoading();
        }

        async function loadUsers() {
            const data = await apiRequest('GET', USERS_BIN_ID);
            if (data) {
                allUsers = data.users || {};
            }
            return allUsers;
        }

        async function saveUsers() {
            await apiRequest('PUT', USERS_BIN_ID, { users: allUsers });
        }

        async function loadChats() {
            const data = await apiRequest('GET', CHATS_BIN_ID);
            if (data) {
                allChats = data.chats || {};
            }
            return allChats;
        }

        async function saveChats() {
            await apiRequest('PUT', CHATS_BIN_ID, { chats: allChats });
        }

        async function loadMessages() {
            const data = await apiRequest('GET', MESSAGES_BIN_ID);
            if (data) {
                allMessages = data.messages || {};
            }
            return allMessages;
        }

        async function saveMessages() {
            await apiRequest('PUT', MESSAGES_BIN_ID, { messages: allMessages });
        }

        // ==================== AUTH FUNCTIONS ====================
        function showRegister() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'block';
        }

        function showLogin() {
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
        }

        async function handleRegister() {
            const name = document.getElementById('regName').value.trim();
            const phone = document.getElementById('regPhone').value.trim().replace(/\D/g, '');
            const about = document.getElementById('regAbout').value.trim() || 'Disponível';
            const password = document.getElementById('regPassword').value;
            const passwordConfirm = document.getElementById('regPasswordConfirm').value;
            const errorEl = document.getElementById('registerError');

            errorEl.style.display = 'none';

            if (!name || !phone || !password) {
                errorEl.textContent = 'Preencha todos os campos obrigatórios.';
                errorEl.style.display = 'block';
                return;
            }

            if (phone.length < 10) {
                errorEl.textContent = 'Número de telefone inválido.';
                errorEl.style.display = 'block';
                return;
            }

            if (password.length < 6) {
                errorEl.textContent = 'A senha deve ter pelo menos 6 caracteres.';
                errorEl.style.display = 'block';
                return;
            }

            if (password !== passwordConfirm) {
                errorEl.textContent = 'As senhas não coincidem.';
                errorEl.style.display = 'block';
                return;
            }

            showLoading('Criando conta...');
            await loadUsers();

            if (allUsers[phone]) {
                hideLoading();
                errorEl.textContent = 'Este número já está cadastrado.';
                errorEl.style.display = 'block';
                return;
            }

            allUsers[phone] = {
                id: phone,
                name: name,
                phone: phone,
                about: about,
                password: btoa(password),
                avatar: '',
                online: false,
                lastSeen: Date.now(),
                createdAt: Date.now()
            };

            await saveUsers();
            hideLoading();

            showLogin();
            const successEl = document.getElementById('loginSuccess');
            successEl.textContent = 'Conta criada com sucesso! Faça login.';
            successEl.style.display = 'block';
            document.getElementById('loginPhone').value = phone;
        }

        async function handleLogin() {
            const phone = document.getElementById('loginPhone').value.trim().replace(/\D/g, '');
            const password = document.getElementById('loginPassword').value;
            const errorEl = document.getElementById('loginError');
            const successEl = document.getElementById('loginSuccess');

            errorEl.style.display = 'none';
            successEl.style.display = 'none';

            if (!phone || !password) {
                errorEl.textContent = 'Preencha todos os campos.';
                errorEl.style.display = 'block';
                return;
            }

            showLoading('Entrando...');
            await loadUsers();

            const user = allUsers[phone];
            if (!user || atob(user.password) !== password) {
                hideLoading();
                errorEl.textContent = 'Telefone ou senha incorretos.';
                errorEl.style.display = 'block';
                return;
            }

            // Set online
            user.online = true;
            user.lastSeen = Date.now();
            await saveUsers();

            currentUser = user;
            localStorage.setItem('zapchat_session', JSON.stringify({ phone: user.phone, name: user.name }));

            await loadChats();
            await loadMessages();

            hideLoading();
            showApp();
        }

        async function handleLogout() {
            closeAllMenus();
            if (currentUser) {
                allUsers[currentUser.phone].online = false;
                allUsers[currentUser.phone].lastSeen = Date.now();
                await saveUsers();
            }
            
            localStorage.removeItem('zapchat_session');
            currentUser = null;
            currentChatId = null;
            
            if (refreshInterval) clearInterval(refreshInterval);
            
            document.getElementById('appScreen').style.display = 'none';
            document.getElementById('authScreen').style.display = 'flex';
            document.getElementById('loginPassword').value = '';
        }

        async function checkSession() {
            const session = localStorage.getItem('zapchat_session');
            if (session) {
                const { phone } = JSON.parse(session);
                showLoading('Reconectando...');
                
                await initializeBins();
                await loadUsers();
                
                if (allUsers[phone]) {
                    currentUser = allUsers[phone];
                    currentUser.online = true;
                    currentUser.lastSeen = Date.now();
                    await saveUsers();
                    await loadChats();
                    await loadMessages();
                    hideLoading();
                    showApp();
                    return;
                }
                
                localStorage.removeItem('zapchat_session');
                hideLoading();
            }
            
            await initializeBins();
        }

        // ==================== APP FUNCTIONS ====================
        function showApp() {
            document.getElementById('authScreen').style.display = 'none';
            document.getElementById('appScreen').style.display = 'block';
            
            updateSidebarHeader();
            renderChatList();
            loadEmojiGrid('smileys');
            
            // Start auto-refresh
            refreshInterval = setInterval(async () => {
                await loadUsers();
                await loadChats();
                await loadMessages();
                renderChatList();
                if (currentChatId) {
                    renderMessages();
                    updateChatHeader();
                }
            }, 3000);
        }

        function updateSidebarHeader() {
            const avatarEl = document.getElementById('myAvatar');
            if (currentUser.avatar) {
                avatarEl.innerHTML = `<img src="${currentUser.avatar}" alt="">`;
            } else {
                avatarEl.innerHTML = `<i class="fas fa-user"></i>`;
            }
        }

        // ==================== CHAT LIST ====================
        function renderChatList(filter = 'all', searchTerm = '') {
            const chatList = document.getElementById('chatList');
            
            // Get chats for current user
            const userChats = [];
            for (const chatId in allChats) {
                const chat = allChats[chatId];
                if (chat.participants && chat.participants.includes(currentUser.phone)) {
                    // Apply filters
                    if (filter === 'groups' && !chat.isGroup) continue;
                    
                    // Get last message
                    const chatMsgs = allMessages[chatId] || [];
                    const lastMsg = chatMsgs[chatMsgs.length - 1];
                    
                    // Count unread
                    const unread = chatMsgs.filter(m => m.sender !== currentUser.phone && !m.readBy?.includes(currentUser.phone)).length;
                    
                    if (filter === 'unread' && unread === 0) continue;

                    // Search filter
                    if (searchTerm) {
                        const chatName = getChatName(chat);
                        if (!chatName.toLowerCase().includes(searchTerm.toLowerCase())) continue;
                    }
                    
                    userChats.push({
                        ...chat,
                        id: chatId,
                        lastMessage: lastMsg,
                        unreadCount: unread,
                        sortTime: lastMsg ? lastMsg.timestamp : chat.createdAt
                    });
                }
            }
            
            // Sort by last message time
            userChats.sort((a, b) => (b.sortTime || 0) - (a.sortTime || 0));
            
            if (userChats.length === 0) {
                chatList.innerHTML = `
                    <div style="text-align:center;padding:40px 20px;color:var(--text-secondary)">
                        <i class="fas fa-comments" style="font-size:48px;margin-bottom:16px;opacity:0.3"></i>
                        <p>Nenhuma conversa ainda.<br>Inicie uma nova conversa!</p>
                    </div>
                `;
                return;
            }
            
            chatList.innerHTML = userChats.map(chat => {
                const name = getChatName(chat);
                const avatar = getChatAvatar(chat);
                const lastMsgText = getLastMessagePreview(chat);
                const time = chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : '';
                const isOnline = !chat.isGroup && getOtherUser(chat)?.online;
                const isActive = currentChatId === chat.id;
                
                return `
                    <div class="chat-item ${isActive ? 'active' : ''}" onclick="openChat('${chat.id}')" oncontextmenu="showChatContext(event, '${chat.id}')">
                        <div class="chat-item-avatar">
                            ${avatar}
                            ${isOnline ? '<div class="online-dot"></div>' : ''}
                        </div>
                        <div class="chat-item-info">
                            <div class="chat-item-top">
                                <span class="chat-item-name">${escapeHtml(name)}</span>
                                <span class="chat-item-time ${chat.unreadCount > 0 ? 'unread' : ''}">${time}</span>
                            </div>
                            <div class="chat-item-bottom">
                                <span class="chat-item-message">${lastMsgText}</span>
                                ${chat.unreadCount > 0 ? `<span class="unread-count">${chat.unreadCount}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function getChatName(chat) {
            if (chat.isGroup) return chat.groupName || 'Grupo';
            const otherPhone = chat.participants.find(p => p !== currentUser.phone);
            return allUsers[otherPhone]?.name || otherPhone;
        }

        function getChatAvatar(chat) {
            if (chat.isGroup) {
                return `<i class="fas fa-users" style="font-size:22px;color:var(--text-secondary)"></i>`;
            }
            const other = getOtherUser(chat);
            if (other?.avatar) {
                return `<img src="${other.avatar}" alt="">`;
            }
            return `<i class="fas fa-user"></i>`;
        }

        function getOtherUser(chat) {
            const otherPhone = chat.participants.find(p => p !== currentUser.phone);
            return allUsers[otherPhone];
        }

        function getLastMessagePreview(chat) {
            if (!chat.lastMessage) return '<span style="color:var(--text-secondary)">Sem mensagens</span>';
            const msg = chat.lastMessage;
            let text = msg.text || '';
            
            if (msg.deleted) text = '🚫 Mensagem apagada';
            else if (msg.type === 'image') text = '📷 Foto';
            else if (msg.type === 'audio') text = '🎵 Áudio';
            else if (msg.type === 'document') text = '📄 Documento';
            else if (msg.type === 'location') text = '📍 Localização';
            else if (msg.forwarded) text = '⤳ ' + text;
            
            if (text.length > 45) text = text.substring(0, 45) + '...';
            
            const isMine = msg.sender === currentUser.phone;
            const statusIcon = isMine ? getStatusIcon(msg) : '';
            
            return `${statusIcon}${escapeHtml(text)}`;
        }

        function getStatusIcon(msg) {
            if (msg.readBy && msg.readBy.length > 1) {
                return '<span class="msg-status read"><i class="fas fa-check-double"></i></span> ';
            }
            return '<span class="msg-status"><i class="fas fa-check-double"></i></span> ';
        }

        // ==================== CHAT FUNCTIONS ====================
        async function openChat(chatId) {
            currentChatId = chatId;
            const chat = allChats[chatId];
            
            // Mark messages as read
            const msgs = allMessages[chatId] || [];
            let changed = false;
            msgs.forEach(msg => {
                if (msg.sender !== currentUser.phone) {
                    if (!msg.readBy) msg.readBy = [];
                    if (!msg.readBy.includes(currentUser.phone)) {
                        msg.readBy.push(currentUser.phone);
                        changed = true;
                    }
                }
            });
            if (changed) await saveMessages();
            
            // Show chat area
            document.getElementById('emptyChat').style.display = 'none';
            document.getElementById('activeChat').style.display = 'flex';
            
            // Mobile: show chat area
            document.getElementById('chatArea').classList.add('active');
            
            updateChatHeader();
            renderMessages();
            renderChatList();
            scrollToBottom();
            
            document.getElementById('messageInput').focus();
        }

        function closeChat() {
            currentChatId = null;
            document.getElementById('emptyChat').style.display = 'flex';
            document.getElementById('activeChat').style.display = 'none';
            document.getElementById('chatArea').classList.remove('active');
            closeContactInfo();
            renderChatList();
        }

        function updateChatHeader() {
            if (!currentChatId) return;
            const chat = allChats[currentChatId];
            if (!chat) return;
            
            const nameEl = document.getElementById('chatName');
            const statusEl = document.getElementById('chatStatus');
            const avatarEl = document.getElementById('chatAvatar');
            
            nameEl.textContent = getChatName(chat);
            
            if (chat.isGroup) {
                const members = chat.participants.map(p => {
                    if (p === currentUser.phone) return 'Você';
                    return allUsers[p]?.name || p;
                });
                statusEl.textContent = members.join(', ');
                statusEl.className = 'chat-header-status';
                avatarEl.innerHTML = `<i class="fas fa-users" style="font-size:20px;color:var(--text-secondary)"></i>`;
            } else {
                const other = getOtherUser(chat);
                if (other?.online) {
                    statusEl.textContent = 'online';
                    statusEl.className = 'chat-header-status online';
                } else if (other?.lastSeen) {
                    statusEl.textContent = 'visto por último ' + formatLastSeen(other.lastSeen);
                    statusEl.className = 'chat-header-status';
                } else {
                    statusEl.textContent = '';
                    statusEl.className = 'chat-header-status';
                }
                
                if (other?.avatar) {
                    avatarEl.innerHTML = `<img src="${other.avatar}" alt="">`;
                } else {
                    avatarEl.innerHTML = `<i class="fas fa-user"></i>`;
                }
            }
        }

        // ==================== MESSAGES ====================
        function renderMessages() {
            if (!currentChatId) return;
            const container = document.getElementById('chatMessages');
            const msgs = allMessages[currentChatId] || [];
            
            if (msgs.length === 0) {
                container.innerHTML = `
                    <div class="system-message">
                        <span>🔒 As mensagens são armazenadas de forma segura. Envie a primeira mensagem!</span>
                    </div>
                `;
                return;
            }
            
            let html = '';
            let lastDate = '';
            
            msgs.forEach((msg, index) => {
                const msgDate = new Date(msg.timestamp).toLocaleDateString('pt-BR');
                if (msgDate !== lastDate) {
                    lastDate = msgDate;
                    const dateLabel = isToday(msg.timestamp) ? 'Hoje' : 
                                    isYesterday(msg.timestamp) ? 'Ontem' : msgDate;
                    html += `<div class="date-separator"><span>${dateLabel}</span></div>`;
                }
                
                if (msg.system) {
                    html += `<div class="system-message"><span>${escapeHtml(msg.text)}</span></div>`;
                    return;
                }
                
                const isMine = msg.sender === currentUser.phone;
                const senderName = allUsers[msg.sender]?.name || msg.sender;
                const chat = allChats[currentChatId];
                const showSender = chat?.isGroup && !isMine;
                
                html += `
                    <div class="message-group ${isMine ? 'sent' : 'received'}" 
                         id="msg-${msg.id}" 
                         oncontextmenu="showMessageContext(event, '${msg.id}')">
                        <div class="message-bubble">
                            ${showSender ? `<div class="message-sender">${escapeHtml(senderName)}</div>` : ''}
                            ${msg.forwarded ? `<div class="forwarded-label"><i class="fas fa-share"></i> Encaminhada</div>` : ''}
                            ${msg.replyTo ? renderReplyPreview(msg.replyTo) : ''}
                            ${msg.deleted ? `
                                <div class="message-text message-deleted">
                                    <i class="fas fa-ban"></i> Mensagem apagada
                                </div>
                            ` : `
                                ${msg.type === 'image' ? `<img src="${msg.mediaUrl}" class="message-image" onclick="viewImage('${msg.mediaUrl}')" alt="Imagem">` : ''}
                                ${msg.type === 'document' ? `
                                    <div class="message-document">
                                        <i class="fas fa-file-alt"></i>
                                        <div class="message-document-info">
                                            <div class="doc-name">${escapeHtml(msg.fileName || 'Documento')}</div>
                                            <div class="doc-size">${msg.fileSize || ''}</div>
                                        </div>
                                    </div>
                                ` : ''}
                                ${msg.type === 'location' ? `
                                    <div class="message-document" style="background:rgba(0,168,132,0.1)">
                                        <i class="fas fa-location-dot" style="color:var(--primary)"></i>
                                        <div class="message-document-info">
                                            <div class="doc-name">Localização compartilhada</div>
                                            <div class="doc-size">📍 Lat: ${msg.lat?.toFixed(4)}, Lng: ${msg.lng?.toFixed(4)}</div>
                                        </div>
                                    </div>
                                ` : ''}
                                <div class="message-text">${msg.text ? linkify(escapeHtml(msg.text)) : ''}</div>
                            `}
                            <div class="message-meta">
                                ${msg.starred ? '<span class="starred-indicator"><i class="fas fa-star"></i></span>' : ''}
                                <span class="message-time">${formatMessageTime(msg.timestamp)}</span>
                                ${isMine && !msg.deleted ? `
                                    <span class="message-status ${msg.readBy && msg.readBy.length > 1 ? 'read' : ''}">
                                        <i class="fas fa-check-double"></i>
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        }

        function renderReplyPreview(replyId) {
            const msgs = allMessages[currentChatId] || [];
            const original = msgs.find(m => m.id === replyId);
            if (!original) return '';
            
            const name = allUsers[original.sender]?.name || original.sender;
            const text = original.deleted ? 'Mensagem apagada' : (original.text || '📷 Mídia');
            
            return `
                <div class="message-reply-preview" onclick="scrollToMessage('${replyId}')">
                    <div class="reply-name">${escapeHtml(name)}</div>
                    <div class="reply-text">${escapeHtml(text.substring(0, 80))}</div>
                </div>
            `;
        }

        async function handleSend() {
            const input = document.getElementById('messageInput');
            const text = input.value.trim();
            
            if (!text && !isRecording) {
                // Start recording simulation
                toggleRecording();
                return;
            }
            
            if (isRecording) {
                stopRecording();
                return;
            }
            
            if (!text || !currentChatId) return;
            
            const msg = {
                id: generateId(),
                sender: currentUser.phone,
                text: text,
                type: 'text',
                timestamp: Date.now(),
                readBy: [currentUser.phone],
                starred: false,
                deleted: false,
                forwarded: false
            };
            
            if (replyingTo) {
                msg.replyTo = replyingTo;
                cancelReply();
            }
            
            if (!allMessages[currentChatId]) allMessages[currentChatId] = [];
            allMessages[currentChatId].push(msg);
            
            input.value = '';
            autoResize(input);
            updateSendButton();
            
            renderMessages();
            scrollToBottom();
            renderChatList();
            
            await saveMessages();
        }

        function handleInputKeydown(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSend();
            }
            updateSendButton();
        }

        function updateSendButton() {
            const input = document.getElementById('messageInput');
            const icon = document.getElementById('sendIcon');
            const btn = document.getElementById('sendBtn');
            
            if (input.value.trim()) {
                icon.className = 'fas fa-paper-plane';
                btn.classList.add('active');
            } else {
                icon.className = 'fas fa-microphone';
                btn.classList.remove('active');
            }
        }

        function autoResize(el) {
            el.style.height = 'auto';
            el.style.height = Math.min(el.scrollHeight, 120) + 'px';
            updateSendButton();
        }

        // ==================== RECORDING ====================
        function toggleRecording() {
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        }

        function startRecording() {
            isRecording = true;
            recordingSeconds = 0;
            document.getElementById('inputWrapper').style.display = 'none';
            document.getElementById('recordingUI').classList.add('active');
            document.getElementById('sendIcon').className = 'fas fa-paper-plane';
            document.getElementById('sendBtn').classList.add('active');
            
            recordingTimer = setInterval(() => {
                recordingSeconds++;
                const mins = Math.floor(recordingSeconds / 60);
                const secs = recordingSeconds % 60;
                document.getElementById('recordingTime').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            }, 1000);
        }

        async function stopRecording() {
            isRecording = false;
            clearInterval(recordingTimer);
            document.getElementById('inputWrapper').style.display = 'flex';
            document.getElementById('recordingUI').classList.remove('active');
            updateSendButton();
            
            if (recordingSeconds > 0) {
                const msg = {
                    id: generateId(),
                    sender: currentUser.phone,
                    text: `🎵 Áudio (${Math.floor(recordingSeconds / 60)}:${(recordingSeconds % 60).toString().padStart(2, '0')})`,
                    type: 'audio',
                    timestamp: Date.now(),
                    readBy: [currentUser.phone],
                    duration: recordingSeconds,
                    starred: false,
                    deleted: false
                };
                
                if (!allMessages[currentChatId]) allMessages[currentChatId] = [];
                allMessages[currentChatId].push(msg);
                
                renderMessages();
                scrollToBottom();
                renderChatList();
                await saveMessages();
            }
        }

        // ==================== REPLY ====================
        function replyToMessage() {
            closeContextMenu();
            if (!contextMessageId) return;
            
            const msgs = allMessages[currentChatId] || [];
            const msg = msgs.find(m => m.id === contextMessageId);
            if (!msg) return;
            
            replyingTo = msg.id;
            const name = allUsers[msg.sender]?.name || msg.sender;
            
            document.getElementById('replyName').textContent = name;
            document.getElementById('replyText').textContent = msg.text || '📷 Mídia';
            document.getElementById('replyBar').classList.add('active');
            document.getElementById('messageInput').focus();
        }

        function cancelReply() {
            replyingTo = null;
            document.getElementById('replyBar').classList.remove('active');
        }

        // ==================== MESSAGE ACTIONS ====================
        function showMessageContext(event, msgId) {
            event.preventDefault();
            contextMessageId = msgId;
            
            const menu = document.getElementById('contextMenu');
            menu.style.left = event.clientX + 'px';
            menu.style.top = event.clientY + 'px';
            menu.classList.add('active');
        }

        function closeContextMenu() {
            document.getElementById('contextMenu').classList.remove('active');
        }

        async function deleteMessage() {
            closeContextMenu();
            if (!contextMessageId) return;
            
            const msgs = allMessages[currentChatId] || [];
            const msg = msgs.find(m => m.id === contextMessageId);
            if (msg) {
                msg.deleted = true;
                msg.text = '';
                renderMessages();
                renderChatList();
                await saveMessages();
                showToast('Mensagem apagada');
            }
        }

        async function starMessage() {
            closeContextMenu();
            if (!contextMessageId) return;
            
            const msgs = allMessages[currentChatId] || [];
            const msg = msgs.find(m => m.id === contextMessageId);
            if (msg) {
                msg.starred = !msg.starred;
                renderMessages();
                await saveMessages();
                showToast(msg.starred ? 'Mensagem favoritada ⭐' : 'Removida dos favoritos');
            }
        }

        function copyMessage() {
            closeContextMenu();
            if (!contextMessageId) return;
            
            const msgs = allMessages[currentChatId] || [];
            const msg = msgs.find(m => m.id === contextMessageId);
            if (msg && msg.text) {
                navigator.clipboard.writeText(msg.text).then(() => {
                    showToast('Mensagem copiada!');
                });
            }
        }

        async function forwardMessage() {
            closeContextMenu();
            if (!contextMessageId) return;
            
            const msgs = allMessages[currentChatId] || [];
            const msg = msgs.find(m => m.id === contextMessageId);
            if (!msg) return;
            
            // Simple forward: show chat list to select
            const chatId = prompt('Cole o ID do chat para encaminhar (funcionalidade simplificada):');
            if (chatId && allChats[chatId]) {
                const fwdMsg = {
                    ...msg,
                    id: generateId(),
                    sender: currentUser.phone,
                    timestamp: Date.now(),
                    forwarded: true,
                    readBy: [currentUser.phone]
                };
                
                if (!allMessages[chatId]) allMessages[chatId] = [];
                allMessages[chatId].push(fwdMsg);
                await saveMessages();
                showToast('Mensagem encaminhada!');
            }
        }

        function scrollToMessage(msgId) {
            const el = document.getElementById('msg-' + msgId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.style.background = 'rgba(0, 168, 132, 0.15)';
                setTimeout(() => { el.style.background = ''; }, 2000);
            }
        }

        // ==================== NEW CHAT ====================
        function openNewChat() {
            closeAllMenus();
            document.getElementById('newChatModal').classList.add('active');
            document.getElementById('newChatSearch').value = '';
            renderAllContacts();
        }

        function closeNewChat() {
            document.getElementById('newChatModal').classList.remove('active');
        }

        function renderAllContacts() {
            const container = document.getElementById('contactResults');
            const contacts = Object.values(allUsers).filter(u => u.phone !== currentUser.phone);
            
            if (contacts.length === 0) {
                container.innerHTML = `<p style="text-align:center;color:var(--text-secondary);padding:20px;">Nenhum contato encontrado. Convide amigos para usar o ZapChat!</p>`;
                return;
            }
            
            container.innerHTML = contacts.map(user => `
                <div class="contact-list-item" onclick="startChat('${user.phone}')">
                    <div class="contact-avatar">
                        ${user.avatar ? `<img src="${user.avatar}" alt="">` : '<i class="fas fa-user"></i>'}
                    </div>
                    <div class="contact-info">
                        <h4>${escapeHtml(user.name)}</h4>
                        <p>${escapeHtml(user.about || 'Disponível')}</p>
                    </div>
                </div>
            `).join('');
        }

        function searchContacts(term) {
            const container = document.getElementById('contactResults');
            const contacts = Object.values(allUsers).filter(u => 
                u.phone !== currentUser.phone &&
                (u.name.toLowerCase().includes(term.toLowerCase()) || u.phone.includes(term))
            );
            
            container.innerHTML = contacts.map(user => `
                <div class="contact-list-item" onclick="startChat('${user.phone}')">
                    <div class="contact-avatar">
                        ${user.avatar ? `<img src="${user.avatar}" alt="">` : '<i class="fas fa-user"></i>'}
                    </div>
                    <div class="contact-info">
                        <h4>${escapeHtml(user.name)}</h4>
                        <p>${user.phone}</p>
                    </div>
                </div>
            `).join('');
        }

        async function startChat(otherPhone) {
            closeNewChat();
            
            // Check if chat already exists
            let existingChatId = null;
            for (const chatId in allChats) {
                const chat = allChats[chatId];
                if (!chat.isGroup && 
                    chat.participants.includes(currentUser.phone) && 
                    chat.participants.includes(otherPhone)) {
                    existingChatId = chatId;
                    break;
                }
            }
            
            if (existingChatId) {
                openChat(existingChatId);
                return;
            }
            
            // Create new chat
            const chatId = generateId();
            allChats[chatId] = {
                participants: [currentUser.phone, otherPhone],
                isGroup: false,
                createdAt: Date.now(),
                muted: false
            };
            allMessages[chatId] = [];
            
            await saveChats();
            await saveMessages();
            
            renderChatList();
            openChat(chatId);
        }

        // ==================== GROUPS ====================
        function openNewGroup() {
            closeAllMenus();
            selectedGroupMembers = [];
            document.getElementById('newGroupModal').classList.add('active');
            document.getElementById('groupName').value = '';
            document.getElementById('groupDesc').value = '';
            document.getElementById('groupContactSearch').value = '';
            document.getElementById('selectedGroupContacts').innerHTML = '';
            renderGroupContacts();
        }

        function closeNewGroup() {
            document.getElementById('newGroupModal').classList.remove('active');
        }

        function renderGroupContacts() {
            const container = document.getElementById('groupContactResults');
            const contacts = Object.values(allUsers).filter(u => 
                u.phone !== currentUser.phone && !selectedGroupMembers.includes(u.phone)
            );
            
            container.innerHTML = contacts.map(user => `
                <div class="contact-list-item" onclick="addGroupMember('${user.phone}')">
                    <div class="contact-avatar">
                        ${user.avatar ? `<img src="${user.avatar}" alt="">` : '<i class="fas fa-user"></i>'}
                    </div>
                    <div class="contact-info">
                        <h4>${escapeHtml(user.name)}</h4>
                        <p>${user.phone}</p>
                    </div>
                </div>
            `).join('');
        }

        function searchGroupContacts(term) {
            const container = document.getElementById('groupContactResults');
            const contacts = Object.values(allUsers).filter(u => 
                u.phone !== currentUser.phone && 
                !selectedGroupMembers.includes(u.phone) &&
                (u.name.toLowerCase().includes(term.toLowerCase()) || u.phone.includes(term))
            );
            
            container.innerHTML = contacts.map(user => `
                <div class="contact-list-item" onclick="addGroupMember('${user.phone}')">
                    <div class="contact-avatar">
                        ${user.avatar ? `<img src="${user.avatar}" alt="">` : '<i class="fas fa-user"></i>'}
                    </div>
                    <div class="contact-info">
                        <h4>${escapeHtml(user.name)}</h4>
                        <p>${user.phone}</p>
                    </div>
                </div>
            `).join('');
        }

        function addGroupMember(phone) {
            if (!selectedGroupMembers.includes(phone)) {
                selectedGroupMembers.push(phone);
                updateSelectedGroupUI();
                renderGroupContacts();
            }
        }

        function removeGroupMember(phone) {
            selectedGroupMembers = selectedGroupMembers.filter(p => p !== phone);
            updateSelectedGroupUI();
            renderGroupContacts();
        }

        function updateSelectedGroupUI() {
            const container = document.getElementById('selectedGroupContacts');
            container.innerHTML = selectedGroupMembers.map(phone => {
                const user = allUsers[phone];
                return `
                    <div class="selected-contact-chip">
                        ${escapeHtml(user?.name || phone)}
                        <button onclick="removeGroupMember('${phone}')"><i class="fas fa-times"></i></button>
                    </div>
                `;
            }).join('');
        }

        async function createGroup() {
            const name = document.getElementById('groupName').value.trim();
            const desc = document.getElementById('groupDesc').value.trim();
            
            if (!name) {
                showToast('Digite um nome para o grupo', 'error');
                return;
            }
            
            if (selectedGroupMembers.length === 0) {
                showToast('Adicione pelo menos um participante', 'error');
                return;
            }
            
            const chatId = generateId();
            const participants = [currentUser.phone, ...selectedGroupMembers];
            
            allChats[chatId] = {
                participants: participants,
                isGroup: true,
                groupName: name,
                groupDesc: desc,
                groupAdmin: currentUser.phone,
                createdAt: Date.now(),
                muted: false
            };
            
            allMessages[chatId] = [{
                id: generateId(),
                system: true,
                text: `${currentUser.name} criou o grupo "${name}"`,
                timestamp: Date.now()
            }];
            
            await saveChats();
            await saveMessages();
            
            closeNewGroup();
            renderChatList();
            openChat(chatId);
            showToast('Grupo criado com sucesso! 🎉');
        }

        // ==================== ATTACHMENTS ====================
        function attachPhoto() {
            closeAttachMenu();
            document.getElementById('fileInput').click();
        }

        function attachDocument() {
            closeAttachMenu();
            document.getElementById('docInput').click();
        }

        async function handleFileSelect(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = async (e) => {
                const msg = {
                    id: generateId(),
                    sender: currentUser.phone,
                    text: '',
                    type: 'image',
                    mediaUrl: e.target.result,
                    timestamp: Date.now(),
                    readBy: [currentUser.phone],
                    starred: false,
                    deleted: false
                };
                
                if (!allMessages[currentChatId]) allMessages[currentChatId] = [];
                allMessages[currentChatId].push(msg);
                
                renderMessages();
                scrollToBottom();
                renderChatList();
                await saveMessages();
            };
            reader.readAsDataURL(file);
            event.target.value = '';
        }

        async function handleDocSelect(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const msg = {
                id: generateId(),
                sender: currentUser.phone,
                text: '',
                type: 'document',
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                timestamp: Date.now(),
                readBy: [currentUser.phone],
                starred: false,
                deleted: false
            };
            
            if (!allMessages[currentChatId]) allMessages[currentChatId] = [];
            allMessages[currentChatId].push(msg);
            
            renderMessages();
            scrollToBottom();
            renderChatList();
            await saveMessages();
            event.target.value = '';
        }

        function attachCamera() {
            closeAttachMenu();
            showToast('Câmera: Use anexar foto para enviar imagens');
            document.getElementById('fileInput').click();
        }

        function attachContact() {
            closeAttachMenu();
            showToast('Funcionalidade de compartilhar contato');
        }

        async function attachLocation() {
            closeAttachMenu();
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (pos) => {
                    const msg = {
                        id: generateId(),
                        sender: currentUser.phone,
                        text: '',
                        type: 'location',
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        timestamp: Date.now(),
                        readBy: [currentUser.phone],
                        starred: false,
                        deleted: false
                    };
                    
                    if (!allMessages[currentChatId]) allMessages[currentChatId] = [];
                    allMessages[currentChatId].push(msg);
                    
                    renderMessages();
                    scrollToBottom();
                    renderChatList();
                    await saveMessages();
                }, () => {
                    showToast('Não foi possível obter a localização', 'error');
                });
            } else {
                showToast('Geolocalização não suportada', 'error');
            }
        }

        // ==================== EMOJI PICKER ====================
        function toggleEmojiPicker() {
            const picker = document.getElementById('emojiPicker');
            picker.classList.toggle('active');
            closeAttachMenu();
        }

        function loadEmojiGrid(category) {
            const grid = document.getElementById('emojiGrid');
            const emojiList = emojis[category] || [];
            grid.innerHTML = emojiList.map(e => `<span class="emoji-item" onclick="insertEmoji('${e}')">${e}</span>`).join('');
        }

        function showEmojiCategory(cat, btn) {
            document.querySelectorAll('.emoji-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadEmojiGrid(cat);
        }

        function insertEmoji(emoji) {
            const input = document.getElementById('messageInput');
            const pos = input.selectionStart;
            input.value = input.value.substring(0, pos) + emoji + input.value.substring(pos);
            input.focus();
            input.selectionStart = input.selectionEnd = pos + emoji.length;
            updateSendButton();
        }

        function searchEmoji(term) {
            if (!term) {
                loadEmojiGrid('smileys');
                return;
            }
            // Search through all categories
            const grid = document.getElementById('emojiGrid');
            let results = [];
            for (const cat in emojis) {
                results = results.concat(emojis[cat]);
            }
            grid.innerHTML = results.slice(0, 64).map(e => `<span class="emoji-item" onclick="insertEmoji('${e}')">${e}</span>`).join('');
        }

        // ==================== ATTACHMENT MENU ====================
        function toggleAttachMenu() {
            const menu = document.getElementById('attachMenu');
            menu.classList.toggle('active');
            document.getElementById('emojiPicker').classList.remove('active');
        }

        function closeAttachMenu() {
            document.getElementById('attachMenu').classList.remove('active');
        }

        // ==================== MENUS ====================
        function toggleMainMenu() {
            const menu = document.getElementById('mainMenu');
            menu.classList.toggle('active');
            document.getElementById('chatMenu')?.classList.remove('active');
        }

        function toggleChatMenu() {
            const menu = document.getElementById('chatMenu');
            menu.classList.toggle('active');
            document.getElementById('mainMenu')?.classList.remove('active');
        }

        function closeAllMenus() {
            document.querySelectorAll('.dropdown-menu, .context-menu, .emoji-picker, .attach-menu').forEach(m => {
                m.classList.remove('active');
            });
        }

        // ==================== PROFILE ====================
        function openProfile() {
            document.getElementById('profilePanel').classList.add('active');
            document.getElementById('profileNameInput').value = currentUser.name;
            document.getElementById('profileAboutInput').value = currentUser.about || '';
            document.getElementById('profilePhone').textContent = currentUser.phone;
            
            const avatarEl = document.getElementById('profileAvatarLarge');
            if (currentUser.avatar) {
                avatarEl.innerHTML = `<img src="${currentUser.avatar}" alt="">`;
            } else {
                avatarEl.innerHTML = `<i class="fas fa-user"></i>`;
            }
        }

        function closeProfile() {
            document.getElementById('profilePanel').classList.remove('active');
        }

        async function updateProfileName() {
            const name = document.getElementById('profileNameInput').value.trim();
            if (name) {
                currentUser.name = name;
                allUsers[currentUser.phone].name = name;
                await saveUsers();
                updateSidebarHeader();
                showToast('Nome atualizado!');
            }
        }

        async function updateProfileAbout() {
            const about = document.getElementById('profileAboutInput').value.trim();
            currentUser.about = about;
            allUsers[currentUser.phone].about = about;
            await saveUsers();
            showToast('Recado atualizado!');
        }

        // ==================== CONTACT INFO ====================
        function openContactInfo() {
            if (!currentChatId) return;
            const chat = allChats[currentChatId];
            
            const panel = document.getElementById('contactPanel');
            const nameEl = document.getElementById('contactInfoName');
            const phoneEl = document.getElementById('contactInfoPhone');
            const aboutEl = document.getElementById('contactInfoAbout');
            const avatarEl = document.getElementById('contactAvatarLarge');
            
            if (chat.isGroup) {
                nameEl.textContent = chat.groupName;
                phoneEl.textContent = `Grupo • ${chat.participants.length} participantes`;
                aboutEl.textContent = chat.groupDesc || 'Sem descrição';
                avatarEl.innerHTML = `<i class="fas fa-users" style="font-size:80px;color:var(--text-secondary)"></i>`;
            } else {
                const other = getOtherUser(chat);
                nameEl.textContent = other?.name || '';
                phoneEl.textContent = other?.phone || '';
                aboutEl.textContent = other?.about || 'Disponível';
                if (other?.avatar) {
                    avatarEl.innerHTML = `<img src="${other.avatar}" alt="">`;
                } else {
                    avatarEl.innerHTML = `<i class="fas fa-user"></i>`;
                }
            }
            
            panel.classList.add('active');
        }

        function closeContactInfo() {
            document.getElementById('contactPanel').classList.remove('active');
        }

        // ==================== CHAT ACTIONS ====================
        async function clearChat() {
            closeAllMenus();
            if (!currentChatId) return;
            if (confirm('Limpar todas as mensagens desta conversa?')) {
                allMessages[currentChatId] = [];
                await saveMessages();
                renderMessages();
                renderChatList();
                showToast('Conversa limpa');
            }
        }

        async function deleteChat() {
            closeAllMenus();
            closeContactInfo();
            if (!currentChatId) return;
            if (confirm('Apagar esta conversa? Esta ação não pode ser desfeita.')) {
                delete allChats[currentChatId];
                delete allMessages[currentChatId];
                await saveChats();
                await saveMessages();
                closeChat();
                renderChatList();
                showToast('Conversa apagada');
            }
        }

        function muteChat() {
            closeAllMenus();
            if (!currentChatId) return;
            allChats[currentChatId].muted = !allChats[currentChatId].muted;
            saveChats();
            showToast(allChats[currentChatId].muted ? 'Notificações silenciadas 🔇' : 'Notificações ativadas 🔔');
        }

        function blockContact() {
            showToast('Contato bloqueado (simulação)');
        }

        function selectMessages() {
            closeAllMenus();
            showToast('Selecione mensagens tocando nelas');
        }

        function showStarredMessages() {
            closeAllMenus();
            let starred = [];
            for (const chatId in allMessages) {
                const msgs = allMessages[chatId] || [];
                msgs.forEach(m => {
                    if (m.starred) starred.push({...m, chatId});
                });
            }
            
            if (starred.length === 0) {
                showToast('Nenhuma mensagem favoritada');
            } else {
                showToast(`${starred.length} mensagem(ns) favoritada(s) ⭐`);
            }
        }

        function openSettings() {
            closeAllMenus();
            openProfile();
        }

        // ==================== SEARCH ====================
        function handleSearch(term) {
            const activeFilter = document.querySelector('.filter-tab.active');
            const filter = activeFilter?.textContent === 'Não lidas' ? 'unread' : 
                          activeFilter?.textContent === 'Grupos' ? 'groups' : 'all';
            renderChatList(filter, term);
        }

        function filterChats(filter, btn) {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            const searchTerm = document.getElementById('searchInput').value;
            renderChatList(filter, searchTerm);
        }

        function searchInChat() {
            closeAllMenus();
            const term = prompt('Pesquisar na conversa:');
            if (term) {
                const msgs = allMessages[currentChatId] || [];
                const found = msgs.filter(m => m.text?.toLowerCase().includes(term.toLowerCase()));
                if (found.length > 0) {
                    scrollToMessage(found[found.length - 1].id);
                    showToast(`${found.length} resultado(s) encontrado(s)`);
                } else {
                    showToast('Nenhum resultado encontrado');
                }
            }
        }

        // ==================== SCROLL ====================
        function scrollToBottom() {
            const container = document.getElementById('chatMessages');
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 50);
        }

        // Scroll to bottom button
        document.addEventListener('DOMContentLoaded', () => {
            const chatMsgs = document.getElementById('chatMessages');
            if (chatMsgs) {
                chatMsgs.addEventListener('scroll', () => {
                    const btn = document.getElementById('scrollBottomBtn');
                    const isNearBottom = chatMsgs.scrollHeight - chatMsgs.scrollTop - chatMsgs.clientHeight < 200;
                    btn.classList.toggle('visible', !isNearBottom);
                });
            }
        });

        // ==================== IMAGE VIEWER ====================
        function viewImage(url) {
            document.getElementById('viewerImage').src = url;
            document.getElementById('imageViewer').classList.add('active');
        }

        function closeImageViewer() {
            document.getElementById('imageViewer').classList.remove('active');
        }

        // ==================== STATUS ====================
        function toggleStatusView() {
            showToast('Status: Em breve! 🔄');
        }

        // ==================== UTILITY FUNCTIONS ====================
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
        }

        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function linkify(text) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
        }

        function formatTime(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            
            if (isToday(timestamp)) {
                return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            } else if (isYesterday(timestamp)) {
                return 'Ontem';
            } else {
                return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
            }
        }

        function formatMessageTime(timestamp) {
            return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }

        function formatLastSeen(timestamp) {
            if (isToday(timestamp)) {
                return 'hoje às ' + formatMessageTime(timestamp);
            } else if (isYesterday(timestamp)) {
                return 'ontem às ' + formatMessageTime(timestamp);
            }
            return new Date(timestamp).toLocaleDateString('pt-BR');
        }

        function isToday(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            return date.toDateString() === now.toDateString();
        }

        function isYesterday(timestamp) {
            const date = new Date(timestamp);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return date.toDateString() === yesterday.toDateString();
        }

        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / 1048576).toFixed(1) + ' MB';
        }

        // ==================== TOAST ====================
        function showToast(message, type = 'success') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type === 'error' ? 'error' : ''}`;
            toast.innerHTML = `
                <i class="fas ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}" style="color:${type === 'error' ? 'var(--danger)' : 'var(--primary)'}"></i>
                <span>${message}</span>
            `;
            container.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // ==================== LOADING ====================
        function showLoading(text = 'Carregando...') {
            document.getElementById('loadingText').textContent = text;
            document.getElementById('loadingOverlay').classList.add('active');
        }

        function hideLoading() {
            document.getElementById('loadingOverlay').classList.remove('active');
        }

        // ==================== EVENT LISTENERS ====================
        document.addEventListener('click', (e) => {
            // Close menus when clicking outside
            if (!e.target.closest('.dropdown-menu') && !e.target.closest('#menuBtn') && !e.target.closest('.chat-header-actions')) {
                document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
            }
            if (!e.target.closest('.context-menu')) {
                closeContextMenu();
            }
            if (!e.target.closest('.emoji-picker') && !e.target.closest('.emoji-btn')) {
                document.getElementById('emojiPicker')?.classList.remove('active');
            }
            if (!e.target.closest('.attach-menu') && !e.target.closest('.attach-btn')) {
                closeAttachMenu();
            }
        });

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllMenus();
                closeImageViewer();
                closeNewChat();
                closeNewGroup();
                closeContactInfo();
            }
        });

        // Show chat context menu
        function showChatContext(event, chatId) {
            event.preventDefault();
            // Simple long-press menu for chats
        }

        // ==================== INITIALIZATION ====================
        window.addEventListener('load', () => {
            checkSession();
        });

        // Update online status on unload
        window.addEventListener('beforeunload', () => {
            if (currentUser) {
                // Try to set offline (may not always work)
                navigator.sendBeacon && navigator.sendBeacon('about:blank');
            }
        });
    