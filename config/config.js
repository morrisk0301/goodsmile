// configuration file for database and server

module.exports = {
    serverPort: 80,
    dbUrl: 'mongodb://localhost:27017/local',
    db_schemas: [
        {file:'./user_schema', collection:'users', schemaName:'UserSchema', modelName:'UserModel'},
        {file:'./goods_schema', collection:'goods', schemaName:'GoodsSchema', modelName:'GoodsModel'},
        {file:'./shippingfee_schema', collection:'shippingfee', schemaName:'ShippingfeeSchema', modelName:'ShippingfeeModel'}
    ],
    route_info: [
    ],
    facebook: {	// passport facebook
        clientID: '1719432235023572',
        clientSecret: '53b56b96fa42068ee419a4fa0e7323dd',
        callbackURL: '/auth/facebook/callback'
    },
    twitter: {	// passport twitter
        clientID: '8JszS3UIrq1B2CB697y1kjvGa',
        clientSecret: '93VdaIWz92lPusyZMBhZTXjxOn4qNOwrJrb9Sjy21PbpGlOT4Z',
        callbackURL: '/auth/twitter/callback'
    },
    google: {	// passport google
        clientID: 'id',
        clientSecret: 'secret',
        callbackURL: '/auth/google/callback'
    }
};