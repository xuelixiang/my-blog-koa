const moment = require('moment');

module.exports = (sequelize, dataTypes) => {
  const Article = sequelize.define('article', {
    id: {
      type: dataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: dataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    content: {
      type: dataTypes.TEXT,
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
    showOrder: {
      type: dataTypes.INTEGER(11),
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  });

  Article.associate = models => {
    Article.hasMany(models.tag);
  };

  return Article;
};