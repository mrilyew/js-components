window.settings_list = []
window.settings_list_original = [...window.settings_list]
class SettingsManager {
    constructor() {
        this.refresh()
    }

    refresh() {
        window.settings_list = [...window.settings_list_original]
    }

    getItem(name) 
    {
        const item = window.settings_list.find(item => item.name == name)
        if(!item) {
            return
        }

        return new SettingsItem(item)
    }

    resetAllSettings() {
        window.settings_list.forEach(setting => {
            setting = new SettingsItem(setting)
            setting.reset()
    
            this.refresh()
        })
    }
}

class SettingsItem {
    constructor(item) {
        this.info = item
    }

    getName() {
        return this.info.name
    }

    getType() {
        return this.info.type
    }

    getDefault() {
        return this.info.default_value
    }

    getValue() {
        return this.info.value ?? this.getDefault()
    }

    isEqual(val = '0') {
        return this.getValue() == val
    }

    isChecked() {
        if(this.getType() != 'bool') {
            return false
        }

        return this.getValue() == '1'
    }

    setValue(val = '0') {
        window.site_params.set(this.getName(), val)

        window.settings_manager.refresh()
    }

    reset() {
        window.site_params.set(this.getName(), this.getDefault())
    }
}
