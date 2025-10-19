// 管理者配置系統 - Firebase 版本
class AdminConfig {
    constructor() {
        this.collectionName = 'admin_config';
        this.docId = 'system_config';
        this.defaultConfig = {
            adminCredentials: {
                username: 'admin',
                password: 'password'
            },
            guestAccounts: [
                {
                    id: 'guest1',
                    username: 'guest',
                    password: 'guest123',
                    allowedGroups: [], // 空陣列表示無權限訪問任何群組
                    pagePermissions: ['details', 'summary'], // 默認只能檢視基本報表
                    enabled: true,
                    createdAt: new Date().toISOString()
                }
            ],
            settings: {
                allowGuestRegistration: false,
                sessionTimeout: 24 * 60 * 60 * 1000, // 24小時
                maxLoginAttempts: 5
            }
        };
        this.config = { ...this.defaultConfig };
        this.db = null;
        this.isInitialized = false;
    }

    // 初始化 Firebase 連接
    async init(firebaseDb) {
        this.db = firebaseDb;
        await this.loadConfig();
        this.isInitialized = true;
    }

    // 從 Firebase 載入配置
    async loadConfig() {
        try {
            if (!this.db) {
                console.error('Firebase 尚未初始化');
                return false;
            }

            const docRef = this.db.collection(this.collectionName).doc(this.docId);
            const doc = await docRef.get();
            
            if (doc.exists) {
                const savedConfig = doc.data();
                this.config = { ...this.defaultConfig, ...savedConfig };
                console.log('已從 Firebase 載入管理配置');
            } else {
                // 如果沒有配置，創建預設配置
                await this.saveConfig();
                console.log('已創建預設管理配置到 Firebase');
            }
            return true;
        } catch (error) {
            console.error('從 Firebase 載入管理配置失敗:', error);
            // 回退到本地儲存
            this.loadLocalConfig();
            return false;
        }
    }

    // 回退到本地儲存
    loadLocalConfig() {
        try {
            const savedConfig = localStorage.getItem('admin_config_backup');
            if (savedConfig) {
                this.config = { ...this.defaultConfig, ...JSON.parse(savedConfig) };
            } else {
                this.config = { ...this.defaultConfig };
            }
        } catch (error) {
            console.error('載入本地備份配置失敗:', error);
            this.config = { ...this.defaultConfig };
        }
    }

    // 儲存配置到 Firebase
    async saveConfig() {
        try {
            if (!this.db) {
                console.error('Firebase 尚未初始化，使用本地儲存');
                this.saveLocalConfig();
                return false;
            }

            const docRef = this.db.collection(this.collectionName).doc(this.docId);
            await docRef.set({
                ...this.config,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // 同時備份到本地儲存
            this.saveLocalConfig();
            console.log('配置已儲存到 Firebase');
            return true;
        } catch (error) {
            console.error('儲存配置到 Firebase 失敗:', error);
            // 回退到本地儲存
            this.saveLocalConfig();
            return false;
        }
    }

    // 本地儲存備份
    saveLocalConfig() {
        try {
            localStorage.setItem('admin_config_backup', JSON.stringify(this.config));
        } catch (error) {
            console.error('本地備份失敗:', error);
        }
    }

    // 驗證管理員身份
    validateAdmin(username, password) {
        return username === this.config.adminCredentials.username && 
               password === this.config.adminCredentials.password;
    }

    // 驗證訪客身份
    validateGuest(username, password) {
        const guest = this.config.guestAccounts.find(g => 
            g.username === username && g.password === password && g.enabled
        );
        return guest || null;
    }

    // 更新管理員密碼
    async updateAdminCredentials(newUsername, newPassword, currentPassword) {
        if (!this.validateAdmin(this.config.adminCredentials.username, currentPassword)) {
            throw new Error('當前密碼錯誤');
        }
        
        this.config.adminCredentials.username = newUsername;
        this.config.adminCredentials.password = newPassword;
        return await this.saveConfig();
    }

    // 新增訪客帳號
    async addGuestAccount(username, password, allowedGroups = [], pagePermissions = []) {
        // 檢查用戶名是否已存在
        const exists = this.config.guestAccounts.some(g => g.username === username);
        if (exists) {
            throw new Error('用戶名已存在');
        }

        const newGuest = {
            id: 'guest_' + Date.now(),
            username,
            password,
            allowedGroups: [...allowedGroups],
            pagePermissions: [...pagePermissions],
            enabled: true,
            createdAt: new Date().toISOString()
        };

        this.config.guestAccounts.push(newGuest);
        const saved = await this.saveConfig();
        return saved ? newGuest : null;
    }

    // 更新訪客帳號
    async updateGuestAccount(guestId, updates) {
        const guestIndex = this.config.guestAccounts.findIndex(g => g.id === guestId);
        if (guestIndex === -1) {
            throw new Error('找不到指定的訪客帳號');
        }

        // 如果更新用戶名，檢查是否重複
        if (updates.username && updates.username !== this.config.guestAccounts[guestIndex].username) {
            const exists = this.config.guestAccounts.some((g, index) => 
                index !== guestIndex && g.username === updates.username
            );
            if (exists) {
                throw new Error('用戶名已存在');
            }
        }

        this.config.guestAccounts[guestIndex] = {
            ...this.config.guestAccounts[guestIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        return await this.saveConfig();
    }

    // 刪除訪客帳號
    async deleteGuestAccount(guestId) {
        const initialLength = this.config.guestAccounts.length;
        this.config.guestAccounts = this.config.guestAccounts.filter(g => g.id !== guestId);
        
        if (this.config.guestAccounts.length === initialLength) {
            throw new Error('找不到指定的訪客帳號');
        }

        return await this.saveConfig();
    }

    // 獲取所有訪客帳號
    getGuestAccounts() {
        return [...this.config.guestAccounts];
    }

    // 獲取訪客允許的群組
    getGuestAllowedGroups(username) {
        const guest = this.config.guestAccounts.find(g => g.username === username && g.enabled);
        return guest ? [...guest.allowedGroups] : [];
    }

    // 檢查訪客是否有群組權限
    hasGroupAccess(username, groupId) {
        const allowedGroups = this.getGuestAllowedGroups(username);
        return allowedGroups.includes(groupId);
    }

    // 重置為預設配置
    async resetToDefault() {
        this.config = { ...this.defaultConfig };
        return await this.saveConfig();
    }

    // 匯出配置
    exportConfig() {
        return JSON.stringify(this.config, null, 2);
    }

    // 匯入配置
    async importConfig(configJson) {
        try {
            const importedConfig = JSON.parse(configJson);
            this.config = { ...this.defaultConfig, ...importedConfig };
            return await this.saveConfig();
        } catch (error) {
            throw new Error('配置格式錯誤');
        }
    }

    // 等待初始化完成
    async waitForInit() {
        let attempts = 0;
        const maxAttempts = 50; // 5秒超時
        
        while (!this.isInitialized && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!this.isInitialized) {
            console.warn('AdminConfig 初始化超時，使用本地配置');
            this.loadLocalConfig();
            this.isInitialized = true;
        }
        
        return this.isInitialized;
    }
}

// 全域實例 - 不立即初始化
window.adminConfig = new AdminConfig();

// Firebase 初始化完成後調用
window.initAdminConfig = async function(db) {
    try {
        await window.adminConfig.init(db);
        console.log('AdminConfig 已初始化');
    } catch (error) {
        console.error('AdminConfig 初始化失敗:', error);
    }
};