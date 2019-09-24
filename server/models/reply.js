const moment = require('moment');
// 回复表
module.exports = (sequelize, dataTypes) => {
  const Reply = sequelize.define('reply', {
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

  Reply.associate = models => {
    Reply.belongsTo(models.user);
    Reply.belongsTo(models.article);
    Reply.belongsTo(models.comment);
  }

  return Reply;
}