import sweetstorage from 'sweet-storage'
const saveData = {
    session: {
        getItem (name) {
            let res = ''

            try {
                res = JSON.parse(sweetstorage.session.get(name)) 
            }catch(e){
                res = sweetstorage.session.get(name)
            }
            return res || false
        },
        setItem (name, value) {
            sweetstorage.session.save(name, JSON.stringify(value))
        },
        removeItem (name = '') {
            if (name) { sweetstorage.session.remove(name) } else { sweetstorage.session.clear() }
        }
    },
    storage: {
        getItem (name) {

            let res = ''

            try {
                res = JSON.parse(sweetstorage.get(name)) 
            }catch(e){
                res = sweetstorage.get(name)
            }
            return res || false
        },
        setItem (name, value,time) {
            sweetstorage.save(name, JSON.stringify(value),time)
        },
        removeItem (name = '') {
            if (name) { sweetstorage.remove(name) } else { sweetstorage.clear() }
        }
    }
}

export default saveData
