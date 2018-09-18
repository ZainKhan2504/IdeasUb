if (process.env.NODE_ENV == "production") {
    module.exports = { mongoURI: "mongodb://zainkhan2504:Zainkhan_2504@ds261072.mlab.com:61072/ideasub"}
} else{
    module.exports = { mongoURI: "mongodb://localhost/ideasub"}
}