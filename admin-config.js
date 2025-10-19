// 管理者配置系統
class AdminConfig {
    constructor() {
        this.storageKey = 'admin_config';
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
        this.loadConfig();
    }

    // 載入配置
    loadConfig() {
        try {
            const savedConfig = localStorage.getItem(this.storageKey);
            if (savedConfig) {
                this.config = { ...this.defaultConfig, ...JSON.parse(savedConfig) };
            } else {
                this.config = { ...this.defaultConfig };
                this.saveConfig();
            }
        } catch (error) {
            console.error('載入管理配置失敗:', error);
            this.config = { ...this.defaultConfig };
        }
    }

    // 儲存配置
    saveConfig() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.config));
            return true;
        } catch (error) {
            console.error('儲存管理配置失敗:', error);
            return false;
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
    updateAdminCredentials(newUsername, newPassword, currentPassword) {
        if (!this.validateAdmin(this.config.adminCredentials.username, currentPassword)) {
            throw new Error('當前密碼錯誤');
        }
        
        this.config.adminCredentials.username = newUsername;
        this.config.adminCredentials.password = newPassword;
        return this.saveConfig();
    }

    // 新增訪客帳號
    addGuestAccount(username, password, allowedGroups = []) {
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
            enabled: true,
            createdAt: new Date().toISOString()
        };

        this.config.guestAccounts.push(newGuest);
        return this.saveConfig() ? newGuest : null;
    }

    // 更新訪客帳號
    updateGuestAccount(guestId, updates) {
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

        return this.saveConfig();
    }

    // 刪除訪客帳號
    deleteGuestAccount(guestId) {
        const initialLength = this.config.guestAccounts.length;
        this.config.guestAccounts = this.config.guestAccounts.filter(g => g.id !== guestId);
        
        if (this.config.guestAccounts.length === initialLength) {
            throw new Error('找不到指定的訪客帳號');
        }

        return this.saveConfig();
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
    resetToDefault() {
        this.config = { ...this.defaultConfig };
        return this.saveConfig();
    }

    // 匯出配置
    exportConfig() {
        return JSON.stringify(this.config, null, 2);
    }

    // 匯入配置
    importConfig(configJson) {
        try {
            const importedConfig = JSON.parse(configJson);
            this.config = { ...this.defaultConfig, ...importedConfig };
            return this.saveConfig();
        } catch (error) {
            throw new Error('配置格式錯誤');
        }
    }
}

// 全域實例
window.adminConfig = new AdminConfig();