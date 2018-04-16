// configuration file for database and server

module.exports = {
    serverPort: 3000,
    dbUrl: 'mongodb://localhost:27017/local',
    dbSchema: [{file: './userSchema', collection: 'userCollection', schemaName: 'userSchema', modelName: 'userModel'},
        {file: './goodsSchema', collection: 'goodsCollection', schemaName: 'goodsSchema', modelName: 'goodsModel'},
    ]
}