const moment = require('moment');
// tag 表
module.exports = (sequelize, dataTypes) => {
  const Tag = sequelize.define('tag', {
    id: {
      type: dataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: dataTypes.STRING(100),
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
  },
  {
    timestamps: true,
  });

  Tag.associate = models => {
    Tag.belongsTo(models.article);
  };

  return Tag;

}

