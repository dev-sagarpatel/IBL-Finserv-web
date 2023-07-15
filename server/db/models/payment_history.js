'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      payment_history.belongsTo(models.customers, {foreignKey: 'customer_id', as: 'customerPayment',onDelete: "CASCADE", onUpdate: "CASCADE"})
    }
  }
  payment_history.init({
    order_id: DataTypes.STRING,
    razorpay_payment_id: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    customer_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'payment_history',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return payment_history;
};