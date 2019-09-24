const moment = require('moment');
// 评论表
module.exports = (sequelize, dataTypes) => {
  const Comment = sequelize.define('comment', {
    id: {
      type: dataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: dataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: dataTypes.DATE,
      defaultValue: dataTypes.NOW,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    updatedAt: {
      type: dataTypes.DATE,
      defaultValue: dataTypes.NOW,
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  }, {
    timestamp: true,
  });


  Comment.associate = models => {
    Comment.belongsTo(models.article, {
      as: 'article',
      foreignKey: 'articleId',
      targetKey: 'id',
      constraints: false,
    });
    Comment.belongsTo(models.user, {
      foreignKey: 'userId',
      targetKey: 'id',
      constraints: false,
    });
    Comment.hasMany(models.reply);
    // Comment.hasMany(models.reply, {
    //   foreignKey: 'commentId',
    //   targetKey: 'id',
    //   constraints: false,
    // });
  };

  return Comment;

}