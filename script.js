// ============================================================
// ZAPCHAT - SCRIPT COMPLETO COM 1 ÚNICO BIN
// Compatível com o index.html e style.css enviados antes
// ============================================================

// ⚠️ TROQUE ESTA KEY POR UMA NOVA NO JSONBIN.IO
const API_KEY = '$2a$10$zfLo4xQ0.IvfaaQaJbTDle3OU9eW24NU.iN7JbK9Ph9OpF0MiuRRu';

// ✅ COLE O SEU ÚNICO BIN ID AQUI
const BIN_ID = '6a052e88c0954111d81e446f';

const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const REFRESH_INTERVAL = 3000;

// ===================== ESTADO GLOBAL =====================
let DB = {
    users: {},
    chats: {},
    messages: {}
};

let currentUser = null;
let currentChatId = null;
let currentFilter = 'all';
let currentSearch = '';
let replyingTo = null;
let contextMessageId = null;
let selectedGroupMembers = [];
let refreshTimer = null;

// ===================== EMOJIS =====================
const EMOJIS = {
    smileys:['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','🥹','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','💩','🤡','👻','👽','🤖'],
    people:['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','💪','👂','👃','👀','👁️','👅','👄','👶','👦','👧','🧑','👨','👩','👴','👵'],
    animals:['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🐢','🐍','🦎','🐙','🦑','🐠','🐟','🐬','🐳','🦈','🐊','🦒','🐘','🦏','🐪','🐑','🐐'],
    food:['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🥑','🥦','🌽','🥕','🍞','🧀','🍳','🥞','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🥗','🍝','🍜','🍲','🍛','🍣','🍱','🍤','🍙','🍚','🍧','🍨','🍦','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','☕','🧃','🥤','🍺','🍷','🥂'],
    travel:['🚗','🚕','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🏍️','🛵','🚲','🛴','🚀','✈️','🛩️','🚁','🛶','⛵','🚤','🛳️','🚢','🏠','🏢','🏥','🏫','🏪','🏭','🗼','🏰','🗽','⛪','🕌','🛕','🌍','🌎','🌏','🗺️','🏔️','⛰️','🌋','🏝️','🏖️','🌅','🌄'],
    objects:['💡','🔦','📱','💻','⌨️','🖥️','📷','📹','📞','📺','📻','⏰','💰','💳','✉️','📦','📝','📅','📎','✂️','🔒','🔑','🔧','💊','🎁','🎀','🎈','🎉','🎊','🎵','🎶','🎮','🕹️','🎯','🎳','🏆','🥇','🥈','🥉','⚽','🏀','🏈','⚾','🎾','🏐'],
    symbols:['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','💯','💢','💥','💫','💦','💨','🕊️','✨','⭐','🌟','🔥','💧','🌊','✅','❌','❓','❗','💤','🚩','🏳️','🏴']
};

// ===================== HELPERS =====================
const $ = id => document.getElementById(id);

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function esc(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function linkify(text) {
    return text.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}

function phone(value) {
    return (value || '').replace(/\D/g, '');
}

function hashPassword(text) {
    return btoa(unescape(encodeURIComponent(text)));
}

function unhashPassword(text) {
    try {
        return decodeURIComponent(escape(atob(text)));
    } catch {
        return '';
    }
}

function sameDay(a, b) {
    return a.toDateString() === b.toDateString();
}

function formatChatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();

    if (sameDay(d, now)) {
        return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    const y = new Date();
    y.setDate(y.getDate() - 1);
    if (sameDay(d, y)) return 'Ontem';

    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function formatMsgTime(ts) {
    return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatDateDivider(ts) {
    const d = new Date(ts);
    const now = new Date();

    if (sameDay(d, now)) return 'Hoje';

    const y = new Date();
    y.setDate(y.getDate() - 1);
    if (sameDay(d, y)) return 'Ontem';

    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatSeen(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();

    if (sameDay(d, now)) return 'visto hoje às ' + formatMsgTime(ts);

    const y = new Date();
    y.setDate(y.getDate() - 1);
    if (sameDay(d, y)) return 'visto ontem às ' + formatMsgTime(ts);

    return 'visto ' + d.toLocaleDateString('pt-BR');
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

function formatPhone(p) {
    const n = phone(p);
    if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
    if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
    return n;
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function getAvatarColor(seed) {
    const colors = ['#25D366','#128C7E','#075E54','#34B7F1','#00A884','#7C5CFC','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4'];
    let h = 0;
    for (let i = 0; i < (seed || '').length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
}

function userAvatar(user, size = 40) {
    if (user?.avatar) {
        return `<div class="av-circle" style="width:${size}px;height:${size}px"><img src="${user.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover"></div>`;
    }
    const color = getAvatarColor(user?.phone || user?.name || 'x');
    const font = size > 100 ? 64 : size > 45 ? 18 : 14;
    return `<div class="av-circle" style="width:${size}px;height:${size}px;background:${color};font-size:${font}px">${getInitials(user?.name)}</div>`;
}

function groupAvatar(size = 40) {
    const iconSize = size > 100 ? 80 : Math.round(size * 0.45);
    return `<div class="av-circle" style="width:${size}px;height:${size}px;background:#2a6b5a"><i class="fas fa-users" style="color:#fff;font-size:${iconSize}px"></i></div>`;
}

function toast(msg, error = false) {
    const el = document.createElement('div');
    el.className = 'toast' + (error ? ' err' : '');
    el.innerHTML = `<i class="fas ${error ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i> ${esc(msg)}`;
    $('toastArea').appendChild(el);
    setTimeout(() => {
        el.classList.add('bye');
        setTimeout(() => el.remove(), 300);
    }, 3000);
}

function showErr(id, msg) {
    const el = $(id);
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 5000);
}

function showOk(id, msg) {
    const el = $(id);
    el.textContent = msg;
    el.style.display = 'block';
}

// ===================== API =====================
async function loadDB() {
    const res = await fetch(BIN_URL, {
        headers: {
            'X-Master-Key': API_KEY,
            'X-Bin-Meta': 'false'
        }
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Erro ao carregar BIN: ${res.status} ${txt}`);
    }

    const json = await res.json();
    DB = json || { users: {}, chats: {}, messages: {} };

    if (!DB.users) DB.users = {};
    if (!DB.chats) DB.chats = {};
    if (!DB.messages) DB.messages = {};
}

async function saveDB() {
    const res = await fetch(BIN_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY,
            'X-Bin-Versioning': 'false'
        },
        body: JSON.stringify(DB)
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Erro ao salvar BIN: ${res.status} ${txt}`);
    }
}

// ===================== SPLASH =====================
function setSplash(txt) {
    $('splash').classList.remove('bye');
    $('splash').style.display = 'flex';
    $('splashTxt').textContent = txt || 'Carregando...';
}

function hideSplash() {
    $('splash').classList.add('bye');
    setTimeout(() => $('splash').style.display = 'none', 500);
}

// ===================== AUTH =====================
function togglePw(id, btn) {
    const inp = $(id);
    const ico = btn.querySelector('i');
    if (inp.type === 'password') {
        inp.type = 'text';
        ico.className = 'fas fa-eye-slash';
    } else {
        inp.type = 'password';
        ico.className = 'fas fa-eye';
    }
}

function showReg() {
    $('loginWrap').style.display = 'none';
    $('regWrap').style.display = '';
}

function showLogin() {
    $('regWrap').style.display = 'none';
    $('loginWrap').style.display = '';
}

async function loginSubmit(e) {
    e.preventDefault();

    const p = phone($('lPhone').value);
    const s = $('lPass').value;

    if (!p || !s) {
        showErr('loginErr', 'Preencha telefone e senha.');
        return;
    }

    setSplash('Entrando...');
    try {
        await loadDB();

        const user = DB.users[p];
        if (!user) {
            hideSplash();
            showErr('loginErr', 'Número não cadastrado.');
            return;
        }

        if (unhashPassword(user.password) !== s) {
            hideSplash();
            showErr('loginErr', 'Senha incorreta.');
            return;
        }

        user.online = true;
        user.lastSeen = Date.now();
        await saveDB();

        currentUser = user;
        localStorage.setItem('zapchat_session', JSON.stringify({ phone: p }));

        hideSplash();
        startApp();
    } catch (err) {
        console.error(err);
        hideSplash();
        showErr('loginErr', 'Erro de conexão.');
    }
}

async function regSubmit(e) {
    e.preventDefault();

    const name = $('rName').value.trim();
    const p = phone($('rPhone').value);
    const about = $('rAbout').value.trim() || 'Disponível';
    const s1 = $('rPass').value;
    const s2 = $('rPass2').value;

    if (!name || !p || !s1 || !s2) {
        showErr('regErr', 'Preencha todos os campos.');
        return;
    }

    if (p.length < 10) {
        showErr('regErr', 'Telefone inválido.');
        return;
    }

    if (s1.length < 6) {
        showErr('regErr', 'Senha mínima de 6 caracteres.');
        return;
    }

    if (s1 !== s2) {
        showErr('regErr', 'As senhas não coincidem.');
        return;
    }

    setSplash('Criando conta...');
    try {
        await loadDB();

        if (DB.users[p]) {
            hideSplash();
            showErr('regErr', 'Este telefone já está cadastrado.');
            return;
        }

        DB.users[p] = {
            phone: p,
            name,
            about,
            password: hashPassword(s1),
            avatar: '',
            online: false,
            lastSeen: Date.now(),
            createdAt: Date.now()
        };

        await saveDB();
        hideSplash();

        showLogin();
        showOk('loginOk', 'Conta criada! Faça login.');
        $('lPhone').value = p;
    } catch (err) {
        console.error(err);
        hideSplash();
        showErr('regErr', 'Erro ao criar conta.');
    }
}

async function doLogout() {
    closeAllDrops();
    if (currentUser && DB.users[currentUser.phone]) {
        try {
            DB.users[currentUser.phone].online = false;
            DB.users[currentUser.phone].lastSeen = Date.now();
            await saveDB();
        } catch {}
    }

    if (refreshTimer) clearInterval(refreshTimer);

    currentUser = null;
    currentChatId = null;
    localStorage.removeItem('zapchat_session');

    $('appScreen').style.display = 'none';
    $('authScreen').style.display = 'flex';
    $('lPass').value = '';
}

// ===================== APP START =====================
function startApp() {
    $('authScreen').style.display = 'none';
    $('appScreen').style.display = 'block';

    renderMyAvatar();
    renderChatList();
    showEmojiCat('smileys', $('epTabs').children[0]);

    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(refreshData, REFRESH_INTERVAL);
}

async function refreshData() {
    try {
        await loadDB();

        if (currentUser) {
            currentUser = DB.users[currentUser.phone] || currentUser;
        }

        renderChatList();

        if (currentChatId) {
            renderMessages();
            updateChatHeader();
        }
    } catch (e) {
        console.warn('refresh:', e.message);
    }
}

// ===================== AVATARS / PROFILE =====================
function renderMyAvatar() {
    $('myAv').innerHTML = userAvatar(currentUser, 40);
}

function renderBigAvatar(elId, user) {
    $(elId).innerHTML = userAvatar(user, 200);
}

function openProfile() {
    $('pfName').value = currentUser.name;
    $('pfAbout').value = currentUser.about || '';
    $('pfPhone').textContent = formatPhone(currentUser.phone);
    renderBigAvatar('pfAvatar', currentUser);
    $('pfPanel').classList.add('aberto');
}

function closePanel(id) {
    $(id).classList.remove('aberto');
}

async function saveProfile(field) {
    if (field === 'name') {
        const v = $('pfName').value.trim();
        if (!v) return;
        currentUser.name = v;
        DB.users[currentUser.phone].name = v;
    }

    if (field === 'about') {
        const v = $('pfAbout').value.trim();
        currentUser.about = v;
        DB.users[currentUser.phone].about = v;
    }

    try {
        await saveDB();
        renderMyAvatar();
        renderChatList();
        if (currentChatId) {
            updateChatHeader();
            renderMessages();
        }
        toast('Perfil atualizado!');
    } catch (e) {
        toast('Erro ao salvar perfil', true);
    }
}

async function handleAvFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 250000) {
        toast('Imagem muito grande. Máx 250KB.', true);
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = async ev => {
        currentUser.avatar = ev.target.result;
        DB.users[currentUser.phone].avatar = ev.target.result;
        try {
            await saveDB();
            renderMyAvatar();
            renderBigAvatar('pfAvatar', currentUser);
            renderChatList();
            if (currentChatId) updateChatHeader();
            toast('Foto atualizada!');
        } catch {
            toast('Erro ao salvar foto', true);
        }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

// ===================== SEARCH / FILTER =====================
function setFilter(type, btn) {
    currentFilter = type;
    document.querySelectorAll('.stab').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    renderChatList();
}

function doSearch(v) {
    currentSearch = v;
    $('srchClear').style.display = v ? '' : 'none';
    renderChatList();
}

function clearSearch() {
    $('srchInput').value = '';
    doSearch('');
}

// ===================== CHAT LIST =====================
function getChatName(chat) {
    if (chat.isGroup) return chat.groupName || 'Grupo';
    const otherPhone = chat.participants.find(p => p !== currentUser.phone);
    return DB.users[otherPhone]?.name || formatPhone(otherPhone);
}

function getChatOtherUser(chat) {
    if (chat.isGroup) return null;
    const otherPhone = chat.participants.find(p => p !== currentUser.phone);
    return DB.users[otherPhone] || null;
}

function renderChatList() {
    const box = $('chatList');
    const items = [];

    for (const chatId in DB.chats) {
        const chat = DB.chats[chatId];
        if (!chat.participants?.includes(currentUser.phone)) continue;

        if (currentFilter === 'groups' && !chat.isGroup) continue;

        const arr = DB.messages[chatId] || [];
        const last = arr[arr.length - 1];
        const unread = arr.filter(m => m.sender && m.sender !== currentUser.phone && !m.readBy?.includes(currentUser.phone)).length;

        if (currentFilter === 'unread' && unread === 0) continue;

        const name = getChatName(chat);
        if (currentSearch && !name.toLowerCase().includes(currentSearch.toLowerCase())) continue;

        items.push({
            id: chatId,
            chat,
            last,
            unread,
            name,
            sort: last?.timestamp || chat.createdAt || 0
        });
    }

    items.sort((a, b) => b.sort - a.sort);

    if (!items.length) {
        box.innerHTML = `<div class="no-chat"><i class="fas fa-comments"></i><p>${currentSearch ? 'Nenhum resultado.' : 'Nenhuma conversa.<br>Toque em nova conversa para começar.'}</p></div>`;
        return;
    }

    box.innerHTML = items.map(item => {
        const { id, chat, last, unread, name } = item;
        const active = currentChatId === id;
        const other = getChatOtherUser(chat);
        const isOnline = !chat.isGroup && other?.online;
        const avatar = chat.isGroup ? groupAvatar(50) : userAvatar(other, 50);
        const time = last ? formatChatTime(last.timestamp) : '';

        let preview = '';
        if (last) {
            if (last.system) {
                preview = esc(last.text);
            } else {
                let tick = '';
                if (last.sender === currentUser.phone && !last.deleted) {
                    tick = `<span class="tk ${last.readBy?.length > 1 ? 'lido' : ''}"><i class="fas fa-check-double"></i></span> `;
                }

                let text = last.deleted ? '🚫 Apagada'
                    : last.type === 'image' ? '📷 Foto'
                    : last.type === 'audio' ? '🎵 Áudio'
                    : last.type === 'document' ? '📄 ' + (last.fileName || 'Documento')
                    : last.type === 'location' ? '📍 Localização'
                    : last.text || '';

                if (last.forwarded && !last.deleted) text = '⤳ ' + text;
                if (text.length > 40) text = text.slice(0, 40) + '...';

                preview = tick + esc(text);
            }
        } else {
            preview = '<i style="opacity:.4">Sem mensagens</i>';
        }

        return `
            <div class="ci ${active ? 'ativo' : ''}" onclick="openChat('${id}')">
                <div class="ci-av">
                    ${avatar}
                    ${isOnline ? '<div class="ci-online"></div>' : ''}
                </div>
                <div class="ci-body">
                    <div class="ci-r1">
                        <span class="ci-nm">${esc(name)}</span>
                        <span class="ci-tm ${unread ? 'unr' : ''}">${time}</span>
                    </div>
                    <div class="ci-r2">
                        <span class="ci-prev">${preview}</span>
                        ${chat.muted ? '<i class="fas fa-volume-xmark muted-ic"></i>' : ''}
                        ${unread ? `<span class="badge">${unread}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ===================== OPEN CHAT =====================
async function openChat(chatId) {
    currentChatId = chatId;

    const arr = DB.messages[chatId] || [];
    let changed = false;

    arr.forEach(m => {
        if (m.sender && m.sender !== currentUser.phone) {
            if (!m.readBy) m.readBy = [];
            if (!m.readBy.includes(currentUser.phone)) {
                m.readBy.push(currentUser.phone);
                changed = true;
            }
        }
    });

    if (changed) {
        try { await saveDB(); } catch {}
    }

    $('emptyState').style.display = 'none';
    $('chatScreen').style.display = 'flex';
    $('mainArea').classList.add('mob-open');

    updateChatHeader();
    renderMessages();
    renderChatList();
    scrollToBottom(false);

    setTimeout(() => $('msgTxt').focus(), 100);
}

function closeChat() {
    currentChatId = null;
    $('chatScreen').style.display = 'none';
    $('emptyState').style.display = '';
    $('mainArea').classList.remove('mob-open');
    closeInfo();
    renderChatList();
}

// ===================== CHAT HEADER =====================
function updateChatHeader() {
    const chat = DB.chats[currentChatId];
    if (!chat) return;

    if (chat.isGroup) {
        $('chatHdName').textContent = chat.groupName || 'Grupo';
        $('chatHdSt').textContent = chat.participants.map(p => p === currentUser.phone ? 'Você' : (DB.users[p]?.name || formatPhone(p))).join(', ');
        $('chatHdSt').className = 'chat-hd-st';
        $('chatHdAv').innerHTML = groupAvatar(40);
    } else {
        const other = getChatOtherUser(chat);
        $('chatHdName').textContent = other?.name || '';
        if (other?.online) {
            $('chatHdSt').textContent = 'online';
            $('chatHdSt').className = 'chat-hd-st on';
        } else {
            $('chatHdSt').textContent = formatSeen(other?.lastSeen);
            $('chatHdSt').className = 'chat-hd-st';
        }
        $('chatHdAv').innerHTML = userAvatar(other, 40);
    }
}

// ===================== MESSAGES =====================
function renderMessages() {
    const box = $('msgsBox');
    const arr = DB.messages[currentChatId] || [];

    if (!arr.length) {
        box.innerHTML = '<div class="sys-m" style="margin-top:auto"><span>🔒 Nenhuma mensagem ainda. Envie a primeira!</span></div>';
        return;
    }

    let html = '';
    let lastDate = '';

    arr.forEach(m => {
        const date = new Date(m.timestamp).toDateString();
        if (date !== lastDate) {
            lastDate = date;
            html += `<div class="date-div"><span>${formatDateDivider(m.timestamp)}</span></div>`;
        }

        if (m.system) {
            html += `<div class="sys-m"><span>${esc(m.text)}</span></div>`;
            return;
        }

        const mine = m.sender === currentUser.phone;
        const chat = DB.chats[currentChatId];
        const showWho = chat?.isGroup && !mine;
        const senderName = DB.users[m.sender]?.name || m.sender;

        let content = '';

        if (m.deleted) {
            content = `<div class="msg-del"><i class="fas fa-ban"></i> Mensagem apagada</div>`;
        } else {
            if (m.forwarded) {
                content += `<div class="msg-fwd"><i class="fas fa-share"></i> Encaminhada</div>`;
            }

            if (m.replyTo) {
                const original = (DB.messages[currentChatId] || []).find(x => x.id === m.replyTo);
                if (original) {
                    const who = original.sender === currentUser.phone ? 'Você' : (DB.users[original.sender]?.name || original.sender);
                    const txt = original.deleted ? 'Mensagem apagada' : (original.text || '📷 Mídia');
                    content += `
                        <div class="msg-rp" onclick="scrollToMsg('${m.replyTo}')">
                            <b>${esc(who)}</b>
                            <s>${esc(txt.substring(0, 80))}</s>
                        </div>
                    `;
                }
            }

            if (m.type === 'image' && m.mediaUrl) {
                content += `<img class="msg-img" src="${m.mediaUrl}" onclick="openViewer('${m.mediaUrl}')">`;
            }

            if (m.type === 'document') {
                content += `
                    <div class="msg-doc">
                        <i class="fas fa-file-alt"></i>
                        <div>
                            <div class="doc-nm">${esc(m.fileName || 'Documento')}</div>
                            <div class="doc-sz">${m.fileSize || ''}</div>
                        </div>
                    </div>
                `;
            }

            if (m.type === 'location') {
                const map = `https://www.google.com/maps?q=${m.lat},${m.lng}`;
                content += `
                    <a href="${map}" target="_blank" rel="noopener" style="text-decoration:none">
                        <div class="msg-loc">
                            <i class="fas fa-location-dot"></i>
                            <div>
                                <div>Localização compartilhada</div>
                                <div class="doc-sz">${(m.lat || 0).toFixed(4)}, ${(m.lng || 0).toFixed(4)}</div>
                            </div>
                        </div>
                    </a>
                `;
            }

            if (m.type === 'audio') {
                content += `
                    <div class="msg-audio">
                        <i class="fas fa-microphone"></i>
                        <div class="aud-dur">${m.duration || '0:05'}</div>
                    </div>
                `;
            }

            if (m.text) {
                content += `<div class="msg-txt">${linkify(esc(m.text))}</div>`;
            }
        }

        html += `
            <div class="mw ${mine ? 'out' : 'in'}" id="msg-${m.id}">
                <div class="bbl" oncontextmenu="showCtx(event,'${m.id}')">
                    ${showWho ? `<div class="msg-who">${esc(senderName)}</div>` : ''}
                    ${content}
                    <div class="msg-ft">
                        ${m.starred ? '<span class="msg-star"><i class="fas fa-star"></i></span>' : ''}
                        <span class="msg-time">${formatMsgTime(m.timestamp)}</span>
                        ${mine && !m.deleted ? `<span class="ticks ${m.readBy?.length > 1 ? 'lido' : ''}"><i class="fas fa-check-double"></i></span>` : ''}
                    </div>
                </div>
            </div>
        `;
    });

    box.innerHTML = html;
}

function scrollToBottom(smooth = true) {
    const box = $('msgsBox');
    setTimeout(() => {
        box.scrollTo({ top: box.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    }, 50);
}

function scrollToMsg(id) {
    const el = document.getElementById('msg-' + id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.style.transition = 'background .3s';
    el.style.background = 'rgba(0,168,132,.15)';
    setTimeout(() => el.style.background = '', 1800);
}

// ===================== SEND =====================
function onMsgInput(ta) {
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    updateSendButton();
}

function onMsgKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMsg();
    }
}

function updateSendButton() {
    const has = $('msgTxt').value.trim().length > 0;
    $('sendIco').className = has ? 'fas fa-paper-plane' : 'fas fa-microphone';
    $('sendBtn').classList.toggle('ativo', has);
}

async function sendMsg() {
    const txt = $('msgTxt').value.trim();
    if (!txt) {
        sendAudio();
        return;
    }
    if (!currentChatId) return;

    const m = {
        id: uid(),
        sender: currentUser.phone,
        text: txt,
        type: 'text',
        timestamp: Date.now(),
        readBy: [currentUser.phone],
        starred: false,
        deleted: false,
        forwarded: false
    };

    if (replyingTo) {
        m.replyTo = replyingTo;
        cancelReply();
    }

    if (!DB.messages[currentChatId]) DB.messages[currentChatId] = [];
    DB.messages[currentChatId].push(m);

    $('msgTxt').value = '';
    $('msgTxt').style.height = 'auto';
    updateSendButton();

    renderMessages();
    scrollToBottom(true);
    renderChatList();

    try { await saveDB(); } catch (e) { console.error(e); }
}

async function sendAudio() {
    if (!currentChatId) return;

    const s = Math.floor(Math.random() * 25) + 5;
    const dur = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    const m = {
        id: uid(),
        sender: currentUser.phone,
        text: '',
        type: 'audio',
        duration: dur,
        timestamp: Date.now(),
        readBy: [currentUser.phone],
        starred: false,
        deleted: false
    };

    if (!DB.messages[currentChatId]) DB.messages[currentChatId] = [];
    DB.messages[currentChatId].push(m);

    renderMessages();
    scrollToBottom(true);
    renderChatList();

    try { await saveDB(); } catch {}
    toast('🎵 Áudio enviado');
}

// ===================== EMOJI =====================
function toggleEmoji() {
    const ep = $('emojiPicker');
    const open = ep.style.display !== 'none';
    $('attachMenu').style.display = 'none';
    ep.style.display = open ? 'none' : 'flex';
    if (!open) showEmojiCat('smileys', $('epTabs').children[0]);
}

function showEmojiCat(cat, btn) {
    document.querySelectorAll('.ep-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    $('epGrid').innerHTML = (EMOJIS[cat] || []).map(e =>
        `<button class="emo" onclick="insEmoji('${e}')">${e}</button>`
    ).join('');
}

function searchEmojis(v) {
    if (!v) {
        showEmojiCat('smileys', $('epTabs').children[0]);
        return;
    }
    let all = [];
    Object.values(EMOJIS).forEach(arr => all = all.concat(arr));
    $('epGrid').innerHTML = all.slice(0, 120).map(e =>
        `<button class="emo" onclick="insEmoji('${e}')">${e}</button>`
    ).join('');
}

function insEmoji(e) {
    const inp = $('msgTxt');
    const start = inp.selectionStart || 0;
    inp.value = inp.value.substring(0, start) + e + inp.value.substring(start);
    inp.focus();
    inp.selectionStart = inp.selectionEnd = start + e.length;
    updateSendButton();
}

// ===================== ATTACH =====================
function toggleAttach() {
    const box = $('attachMenu');
    const open = box.style.display !== 'none';
    $('emojiPicker').style.display = 'none';
    box.style.display = open ? 'none' : 'grid';
}

function pickPhoto() {
    $('attachMenu').style.display = 'none';
    $('imgFile').click();
}

function pickDoc() {
    $('attachMenu').style.display = 'none';
    $('docFile').click();
}

async function handleImgFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500000) {
        toast('Imagem muito grande. Máx 500KB.', true);
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = async ev => {
        const m = {
            id: uid(),
            sender: currentUser.phone,
            text: '',
            type: 'image',
            mediaUrl: ev.target.result,
            timestamp: Date.now(),
            readBy: [currentUser.phone],
            starred: false,
            deleted: false
        };

        if (!DB.messages[currentChatId]) DB.messages[currentChatId] = [];
        DB.messages[currentChatId].push(m);

        renderMessages();
        scrollToBottom(true);
        renderChatList();

        try { await saveDB(); } catch {}
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

async function handleDocFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const m = {
        id: uid(),
        sender: currentUser.phone,
        text: '',
        type: 'document',
        fileName: file.name,
        fileSize: formatSize(file.size),
        timestamp: Date.now(),
        readBy: [currentUser.phone],
        starred: false,
        deleted: false
    };

    if (!DB.messages[currentChatId]) DB.messages[currentChatId] = [];
    DB.messages[currentChatId].push(m);

    renderMessages();
    scrollToBottom(true);
    renderChatList();

    try { await saveDB(); } catch {}
    e.target.value = '';
}

async function sendLocation() {
    $('attachMenu').style.display = 'none';

    if (!navigator.geolocation) {
        toast('Geolocalização não suportada', true);
        return;
    }

    toast('Obtendo localização...');

    navigator.geolocation.getCurrentPosition(async pos => {
        const m = {
            id: uid(),
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

        if (!DB.messages[currentChatId]) DB.messages[currentChatId] = [];
        DB.messages[currentChatId].push(m);

        renderMessages();
        scrollToBottom(true);
        renderChatList();

        try { await saveDB(); } catch {}
    }, () => {
        toast('Não foi possível obter a localização', true);
    });
}

// ===================== REPLY =====================
function setReply(msg) {
    replyingTo = msg.id;
    $('replyWho').textContent = msg.sender === currentUser.phone ? 'Você' : (DB.users[msg.sender]?.name || msg.sender);
    $('replyWhat').textContent = msg.deleted ? 'Mensagem apagada' : (msg.text || '📷 Mídia');
    $('replyStrip').style.display = 'flex';
    $('msgTxt').focus();
}

function cancelReply() {
    replyingTo = null;
    $('replyStrip').style.display = 'none';
}

// ===================== CONTEXT MENU =====================
function showCtx(e, id) {
    e.preventDefault();
    e.stopPropagation();
    contextMessageId = id;
    const m = $('ctxMenu');
    m.style.left = Math.min(e.clientX, window.innerWidth - 210) + 'px';
    m.style.top = Math.min(e.clientY, window.innerHeight - 220) + 'px';
    m.style.display = 'block';
}

function hideCtx() {
    $('ctxMenu').style.display = 'none';
}

function getContextMsg() {
    return (DB.messages[currentChatId] || []).find(m => m.id === contextMessageId) || null;
}

function replyMsg() {
    hideCtx();
    const m = getContextMsg();
    if (m) setReply(m);
}

function copyMsg() {
    hideCtx();
    const m = getContextMsg();
    if (m?.text) navigator.clipboard.writeText(m.text).then(() => toast('Copiado!'));
}

async function starMsg() {
    hideCtx();
    const m = getContextMsg();
    if (!m) return;
    m.starred = !m.starred;
    renderMessages();
    try { await saveDB(); } catch {}
    toast(m.starred ? 'Favoritada ⭐' : 'Removida dos favoritos');
}

async function deleteMsg() {
    hideCtx();
    const m = getContextMsg();
    if (!m) return;
    if (!confirm('Apagar esta mensagem?')) return;

    m.deleted = true;
    m.text = '';
    m.mediaUrl = '';
    m.type = 'text';

    renderMessages();
    renderChatList();

    try { await saveDB(); } catch {}
    toast('Mensagem apagada');
}

function fwdMsg() {
    hideCtx();
    const m = getContextMsg();
    if (!m) return;

    const box = $('fwdList');
    const entries = Object.entries(DB.chats).filter(([id, chat]) =>
        chat.participants?.includes(currentUser.phone) && id !== currentChatId
    );

    if (!entries.length) {
        box.innerHTML = '<p style="text-align:center;color:var(--t2);padding:20px">Nenhuma conversa disponível.</p>';
    } else {
        box.innerHTML = entries.map(([id, chat]) => {
            const other = getChatOtherUser(chat);
            const name = chat.isGroup ? chat.groupName : (other?.name || '');
            const avatar = chat.isGroup ? groupAvatar(42) : userAvatar(other, 42);

            return `
                <div class="clist-item" onclick="doFwd('${id}')">
                    ${avatar}
                    <div class="clist-item-info"><h4>${esc(name)}</h4></div>
                </div>
            `;
        }).join('');
    }

    $('fwdMod').style.display = 'flex';
}

async function doFwd(targetId) {
    const m = getContextMsg();
    if (!m) return;

    closeModal('fwdMod');

    const cloned = {
        ...m,
        id: uid(),
        sender: currentUser.phone,
        timestamp: Date.now(),
        forwarded: true,
        readBy: [currentUser.phone],
        starred: false
    };
    delete cloned.replyTo;

    if (!DB.messages[targetId]) DB.messages[targetId] = [];
    DB.messages[targetId].push(cloned);

    try { await saveDB(); } catch {}
    toast('Encaminhada ✓');
}

// ===================== CHAT ACTIONS =====================
async function muteChat() {
    closeAllDrops();
    if (!currentChatId) return;

    DB.chats[currentChatId].muted = !DB.chats[currentChatId].muted;

    try { await saveDB(); } catch {}
    renderChatList();
    toast(DB.chats[currentChatId].muted ? 'Conversa silenciada 🔇' : 'Notificações ativadas 🔔');
}

async function clearChatMsgs() {
    closeAllDrops();
    if (!currentChatId) return;
    if (!confirm('Limpar todas as mensagens desta conversa?')) return;

    DB.messages[currentChatId] = [];

    try { await saveDB(); } catch {}
    renderMessages();
    renderChatList();
    toast('Conversa limpa');
}

async function deleteCurrentChat() {
    closeAllDrops();
    closeInfo();
    if (!currentChatId) return;
    if (!confirm('Apagar esta conversa?')) return;

    delete DB.chats[currentChatId];
    delete DB.messages[currentChatId];

    try { await saveDB(); } catch {}
    closeChat();
    renderChatList();
    toast('Conversa apagada');
}

// ===================== SEARCH IN CHAT =====================
function openSearchInChat() {
    closeAllDrops();
    $('inChatSearch').style.display = 'flex';
    $('chatSrchIn').value = '';
    $('chatSrchInfo').textContent = '';
    $('chatSrchIn').focus();
}

function closeSearchInChat() {
    $('inChatSearch').style.display = 'none';
}

function searchInsideChat(v) {
    if (!v) {
        $('chatSrchInfo').textContent = '';
        return;
    }

    const found = (DB.messages[currentChatId] || []).filter(m => m.text?.toLowerCase().includes(v.toLowerCase()));
    $('chatSrchInfo').textContent = `${found.length} resultado(s)`;

    if (found.length) {
        scrollToMsg(found[found.length - 1].id);
    }
}

// ===================== INFO PANEL =====================
function openInfo() {
    closeAllDrops();
    const chat = DB.chats[currentChatId];
    if (!chat) return;

    if (chat.isGroup) {
        $('infoTitle').textContent = 'Info do grupo';
        $('infoNm').textContent = chat.groupName || 'Grupo';
        $('infoPh').textContent = `${chat.participants.length} participantes`;
        $('infoAb').textContent = chat.groupDesc || 'Sem descrição';
        $('infoAv').innerHTML = groupAvatar(200);
    } else {
        const other = getChatOtherUser(chat);
        $('infoTitle').textContent = 'Info do contato';
        $('infoNm').textContent = other?.name || '';
        $('infoPh').textContent = formatPhone(other?.phone || '');
        $('infoAb').textContent = other?.about || 'Disponível';
        $('infoAv').innerHTML = userAvatar(other, 200);
    }

    $('infoPanel').style.display = 'flex';
}

function closeInfo() {
    $('infoPanel').style.display = 'none';
}

// ===================== CONTACTS =====================
function openNewChat() {
    closeAllDrops();
    $('contactSrch').value = '';
    renderContacts('');
    $('newChatMod').style.display = 'flex';
}

function filterContacts(v) {
    renderContacts(v);
}

function renderContacts(query = '') {
    const box = $('contactList');

    const list = Object.values(DB.users).filter(u => {
        if (u.phone === currentUser.phone) return false;
        if (!query) return true;
        return u.name.toLowerCase().includes(query.toLowerCase()) || u.phone.includes(query);
    });

    if (!list.length) {
        box.innerHTML = '<p style="text-align:center;color:var(--t2);padding:20px">Nenhum contato encontrado.</p>';
        return;
    }

    box.innerHTML = list.map(u => `
        <div class="clist-item" onclick="startChat('${u.phone}')">
            ${userAvatar(u, 42)}
            <div class="clist-item-info">
                <h4>${esc(u.name)}</h4>
                <p>${esc(u.about || 'Disponível')}</p>
            </div>
        </div>
    `).join('');
}

async function startChat(otherPhone) {
    closeModal('newChatMod');

    for (const id in DB.chats) {
        const c = DB.chats[id];
        if (!c.isGroup && c.participants?.includes(currentUser.phone) && c.participants?.includes(otherPhone)) {
            openChat(id);
            return;
        }
    }

    const id = uid();
    DB.chats[id] = {
        participants: [currentUser.phone, otherPhone],
        isGroup: false,
        createdAt: Date.now(),
        muted: false
    };
    DB.messages[id] = [];

    try { await saveDB(); } catch {}
    renderChatList();
    openChat(id);
}

// ===================== GROUPS =====================
function openNewGroup() {
    closeAllDrops();
    selectedGroupMembers = [];
    $('grpNm').value = '';
    $('grpDesc').value = '';
    $('grpChips').innerHTML = '';
    renderGrpContacts('');
    $('newGroupMod').style.display = 'flex';
}

function filterGrpContacts(v) {
    renderGrpContacts(v);
}

function renderGrpContacts(query = '') {
    const box = $('grpContactList');

    const list = Object.values(DB.users).filter(u => {
        if (u.phone === currentUser.phone) return false;
        if (selectedGroupMembers.includes(u.phone)) return false;
        if (!query) return true;
        return u.name.toLowerCase().includes(query.toLowerCase()) || u.phone.includes(query);
    });

    box.innerHTML = list.map(u => `
        <div class="clist-item" onclick="addGrpMember('${u.phone}')">
            ${userAvatar(u, 42)}
            <div class="clist-item-info">
                <h4>${esc(u.name)}</h4>
                <p>${formatPhone(u.phone)}</p>
            </div>
        </div>
    `).join('');
}

function addGrpMember(phone) {
    if (!selectedGroupMembers.includes(phone)) {
        selectedGroupMembers.push(phone);
        updateGrpChips();
        renderGrpContacts('');
    }
}

function removeGrpMember(phone) {
    selectedGroupMembers = selectedGroupMembers.filter(p => p !== phone);
    updateGrpChips();
    renderGrpContacts('');
}

function updateGrpChips() {
    $('grpChips').innerHTML = selectedGroupMembers.map(p => `
        <div class="chip">
            ${esc(DB.users[p]?.name || p)}
            <button onclick="removeGrpMember('${p}')"><i class="fas fa-xmark"></i></button>
        </div>
    `).join('');
}

async function createGroup() {
    const name = $('grpNm').value.trim();
    const desc = $('grpDesc').value.trim();

    if (!name) {
        toast('Digite um nome para o grupo', true);
        return;
    }

    if (!selectedGroupMembers.length) {
        toast('Adicione participantes', true);
        return;
    }

    const id = uid();
    DB.chats[id] = {
        participants: [currentUser.phone, ...selectedGroupMembers],
        isGroup: true,
        groupName: name,
        groupDesc: desc,
        groupAdmin: currentUser.phone,
        createdAt: Date.now(),
        muted: false
    };

    DB.messages[id] = [{
        id: uid(),
        system: true,
        text: `${currentUser.name} criou o grupo "${name}"`,
        timestamp: Date.now()
    }];

    try { await saveDB(); } catch {}
    closeModal('newGroupMod');
    renderChatList();
    openChat(id);
    toast('Grupo criado! 🎉');
}

// ===================== MODALS / MENUS =====================
function closeModal(id) {
    $(id).style.display = 'none';
}

function toggleDrop(id, e) {
    if (e) e.stopPropagation();
    const el = $(id);
    const isOpen = el.style.display !== 'none';
    closeAllDrops();
    el.style.display = isOpen ? 'none' : 'block';
}

function closeAllDrops() {
    document.querySelectorAll('.drop').forEach(d => d.style.display = 'none');
    hideCtx();
}

// ===================== IMAGE VIEWER =====================
function openViewer(src) {
    $('viewerImg').src = src;
    $('imgViewer').style.display = 'flex';
}

function closeViewer() {
    $('imgViewer').style.display = 'none';
}

// ===================== EVENTOS GLOBAIS =====================
document.addEventListener('click', e => {
    if (!e.target.closest('.drop') && !e.target.closest('[onclick*="toggleDrop"]')) {
        document.querySelectorAll('.drop').forEach(d => d.style.display = 'none');
    }

    if (!e.target.closest('.ctx-menu') && !e.target.closest('.bbl')) {
        hideCtx();
    }

    if (!e.target.closest('.emoji-picker') && !e.target.closest('[onclick="toggleEmoji()"]')) {
        $('emojiPicker').style.display = 'none';
    }

    if (!e.target.closest('.attach-menu') && !e.target.closest('[onclick="toggleAttach()"]')) {
        $('attachMenu').style.display = 'none';
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeAllDrops();
        $('emojiPicker').style.display = 'none';
        $('attachMenu').style.display = 'none';
        $('imgViewer').style.display = 'none';
        document.querySelectorAll('.modal-bg').forEach(m => m.style.display = 'none');
    }
});

window.addEventListener('beforeunload', async () => {
    if (currentUser && DB.users[currentUser.phone]) {
        DB.users[currentUser.phone].online = false;
        DB.users[currentUser.phone].lastSeen = Date.now();
    }
});

// scroll btn
setInterval(() => {
    const box = $('msgsBox');
    if (!box) return;
    const near = box.scrollHeight - box.scrollTop - box.clientHeight < 120;
    $('scrollDn').style.display = near || !currentChatId ? 'none' : 'flex';
}, 500);

// ===================== INIT =====================
window.addEventListener('load', async () => {
    if (!API_KEY || API_KEY.includes('COLE_SUA_NOVA')) {
        alert('Defina sua API_KEY no app.js');
        return;
    }

    if (!BIN_ID || BIN_ID.includes('SEU_BIN_ID')) {
        alert('Defina seu BIN_ID no app.js');
        return;
    }

    setSplash('Conectando...');
    try {
        await loadDB();

        const session = localStorage.getItem('zapchat_session');
        if (session) {
            const { phone } = JSON.parse(session);
            const user = DB.users[phone];
            if (user) {
                currentUser = user;
                currentUser.online = true;
                currentUser.lastSeen = Date.now();
                await saveDB();
                hideSplash();
                startApp();
                return;
            }
        }

        hideSplash();
        $('authScreen').style.display = 'flex';
    } catch (e) {
        console.error(e);
        hideSplash();
        $('authScreen').style.display = 'flex';
        alert('Erro ao conectar com o JSONBin. Verifique API_KEY e BIN_ID.');
    }
});

// ===================== BIND FORMS =====================
window.addEventListener('DOMContentLoaded', () => {
    if ($('loginForm')) $('loginForm').addEventListener('submit', loginSubmit);
    if ($('regForm')) $('regForm').addEventListener('submit', regSubmit);
});