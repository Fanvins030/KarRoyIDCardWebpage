var user = {
    getInfo: (homepage) => {
        return `SELECT * FROM tb_user WHERE homepage Like '%"${homepage}"%'`
    },
    addComment: (content) => {
        return `INSERT INTO tb_comment(content) VALUES("${content}")`
    },
}

module.exports = {
    user
}