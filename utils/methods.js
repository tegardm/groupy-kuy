const fs = require('fs')

const dirPath = './data'
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
} 

const filePath = './data/users.json'
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath,'[]', 'utf-8')
} 


const loadUsers = () => {
    const fileBuffer = fs.readFileSync(filePath, 'utf-8');
    const users = JSON.parse(fileBuffer)
    return users
}

const deleteAll = () => {
    saveUsers([]);
}

const findUser = (nama) => {
    const users = loadUsers();
    const getUser = users.find(user => user.nama.toLowerCase() == nama.toLowerCase())
    if (getUser) {
        return getUser;
    } else {
        return false;
    }
} 

const saveUsers = (users) => {
    const contactsJSON = JSON.stringify(users, null, 3);
    fs.writeFileSync(filePath,contactsJSON,'utf-8')
    console.log("Data Berhasil Disimpan")
}

const addUsers = (user) => {
    if (user) {
        const users = loadUsers();
        users.push(user)
        saveUsers(users)
        return "Data Berhasil Ditambahkan"
    } else {
        return "Data Gagal Ditambahkan"
    }
}

const hapusUser = (nama) => {
    const users = loadUsers();   
    const filteredUser  = users.filter(user => user.nama.toLowerCase() != nama.toLowerCase())
    saveUsers(filteredUser)
    return(`Data Dengan Nama ${nama} Berhasil Di Hapus`)
    
}

const cekDuplikat = (nama) => {
    const data = loadUsers();
    const cekDuplikat = data.find(user => user.nama.toLowerCase() == nama.toLowerCase())
    return cekDuplikat;
}

const groupedData = (amount) => {
    const users = loadUsers();
    const groupedUsers = [];
    const amountEach = Math.floor(users.length / amount);
    for (let i = 0; i < amount; i++) {
        const tempGroup = [];
        for (let x = 0; x < amountEach; x++ ) {
            const randomIn = Math.floor(Math.random() * users.length);
            tempGroup.push(users[randomIn]);
            users.splice(randomIn, 1)
        }
        groupedUsers.push(tempGroup);
    }

   const newGroup =  groupedUsers.map(grouped => grouped.filter(data => data != undefined))
   let y = 0;
   newGroup.forEach((group) => {
    if (users.length > 0) {
        group.push(users[0])
        users.splice(0,1)
    }
    y++;
   })

   return newGroup;
}

const downloadFile = async () => {
    console.log("Lol");
    
}

module.exports = {deleteAll,downloadFile,groupedData,findUser, loadUsers, addUsers, hapusUser, cekDuplikat}