// 簡單前端登入邏輯 (僅示範用途)
// Contract:
// - Inputs: 帳號 + 密碼
// - Outputs: localStorage 中的 isLoggedIn 與 username
// - Error modes: 顯示錯誤訊息

(function(){
    const DEFAULT_USER = { username: 'admin', password: 'password', displayName: '管理者' };
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginFeedback = document.getElementById('login-feedback');
    const userBar = document.getElementById('user-bar');
    const userNameEl = document.getElementById('user-name');
    const userGreeting = document.getElementById('user-greeting');
    const logoutBtn = document.getElementById('logout-btn');

    function setLoggedIn(username, userType = 'admin'){
        localStorage.setItem('isLoggedIn', '1');
        localStorage.setItem('username', username);
        localStorage.setItem('userType', userType);
    }
    function setLoggedOut(){
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userType');
        localStorage.removeItem('allowedGroups');
        localStorage.removeItem('userPagePermissions');
        localStorage.removeItem('currentUser');
    }
    function isLoggedIn(){
        return localStorage.getItem('isLoggedIn') === '1';
    }

    // 驗證使用者憑證
    async function validateCredentials(username, password) {
        // 等待 AdminConfig 初始化
        if (window.adminConfig) {
            await window.adminConfig.waitForInit();
        }
        
        // 檢查管理員身份
        if (window.adminConfig && window.adminConfig.validateAdmin(username, password)) {
            return { type: 'admin', username };
        }
        
        // 檢查訪客身份
        if (window.adminConfig) {
            const guest = window.adminConfig.validateGuest(username, password);
            if (guest) {
                return { type: 'guest', username, guestInfo: guest };
            }
        }
        
        // 回退到原始硬編碼驗證
        if (username === DEFAULT_USER.username && password === DEFAULT_USER.password) {
            return { type: 'admin', username };
        }
        
        return null;
    }

    function showProtectedUI(){
        loginModal.classList.add('hidden');
        userBar.classList.remove('hidden');
        const uname = localStorage.getItem('username') || DEFAULT_USER.username;
        const userType = localStorage.getItem('userType') || 'admin';
        userNameEl.textContent = uname;
        
        // 根據用戶類型顯示/隱藏管理按鈕
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) {
            if (userType === 'admin') {
                adminBtn.classList.remove('hidden');
            } else {
                adminBtn.classList.add('hidden');
            }
        }
        
        // 標記需要載入群組頁面
        window.shouldLoadGroups = true;
        
        // 如果主應用程式已載入，立即載入群組頁面
        if (window.appLoaded && typeof showGroupSelectionPage === 'function') {
            console.log('App loaded, calling showGroupSelectionPage immediately'); // Debug
            showGroupSelectionPage();
        } else {
            console.log('App not loaded yet, will load groups when ready'); // Debug
            // 手動顯示群組選擇頁面以防萬一
            const groupPage = document.getElementById('group-selection-page');
            if (groupPage) {
                groupPage.classList.remove('hidden');
            }
        }
    }
    function showLoginUI(){
        loginModal.classList.remove('hidden');
        userBar.classList.add('hidden');
        
        // 隱藏所有主要內容頁面
        const groupPage = document.getElementById('group-selection-page');
        const storePage = document.getElementById('store-selection-page');
        const reportPage = document.getElementById('report-page');
        
        if (groupPage) groupPage.classList.add('hidden');
        if (storePage) storePage.classList.add('hidden');
        if (reportPage) reportPage.classList.add('hidden');
    }

    // on load
    document.addEventListener('DOMContentLoaded', function(){
        console.log('Login script loaded'); // Debug
        console.log('Elements found:', {
            loginModal: !!loginModal,
            loginForm: !!loginForm,
            loginFeedback: !!loginFeedback,
            userBar: !!userBar,
            userNameEl: !!userNameEl,
            logoutBtn: !!logoutBtn
        });
        
        if(isLoggedIn()){
            console.log('User already logged in');
            showProtectedUI();
        } else {
            console.log('User not logged in, showing login UI');
            showLoginUI();
        }
    });

    loginForm.addEventListener('submit', async function(e){
        e.preventDefault();
        console.log('Login form submitted'); // Debug
        
        const u = document.getElementById('username').value.trim();
        const p = document.getElementById('password').value;
        console.log('Login attempt:', { username: u, passwordLength: p.length }); // Debug
        
        loginFeedback.classList.add('hidden');

        // basic validation
        if(!u || !p){
            loginFeedback.textContent = '請輸入帳號與密碼。';
            loginFeedback.classList.remove('hidden');
            return;
        }

        // 顯示載入狀態
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '驗證中...';
        submitBtn.disabled = true;

        try {
            // 驗證憑證（非同步）
            const authResult = await validateCredentials(u, p);
            if(authResult){
                console.log('Login successful:', authResult); // Debug
                setLoggedIn(authResult.username, authResult.type);
                
                // 如果是訪客，儲存允許的群組資訊和頁面權限
                if(authResult.type === 'guest' && authResult.guestInfo){
                    localStorage.setItem('allowedGroups', JSON.stringify(authResult.guestInfo.allowedGroups));
                    localStorage.setItem('userPagePermissions', JSON.stringify(authResult.guestInfo.pagePermissions || []));
                    localStorage.setItem('userType', 'guest');
                    localStorage.setItem('currentUser', authResult.username);
                } else {
                    localStorage.setItem('userType', 'admin');
                    localStorage.removeItem('allowedGroups');
                    localStorage.removeItem('userPagePermissions');
                    localStorage.setItem('currentUser', authResult.username);
                }
                
                showProtectedUI();
                console.log('Protected UI shown, groups should be loaded'); // Debug
            } else {
                console.log('Login failed'); // Debug
                loginFeedback.textContent = '帳號或密碼錯誤。';
                loginFeedback.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Login error:', error);
            loginFeedback.textContent = '登入過程發生錯誤，請稍後再試。';
            loginFeedback.classList.remove('hidden');
        } finally {
            // 恢復按鈕狀態
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    logoutBtn.addEventListener('click', function(){
        setLoggedOut();
        // show login modal again
        showLoginUI();
    });

    // 監聽主應用程式載入完成事件
    window.addEventListener('appLoaded', function() {
        console.log('Main app loaded event received'); // Debug
        window.appLoaded = true;
        
        // 如果使用者已登入且需要載入群組頁面
        if (window.shouldLoadGroups && typeof showGroupSelectionPage === 'function') {
            console.log('Loading groups after app loaded'); // Debug
            showGroupSelectionPage();
        }
    });

})();
