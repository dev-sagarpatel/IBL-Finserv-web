'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      customers.hasMany(models.payment_history, {foreignKey: 'customer_id', as: 'customerPayment', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    }
  }
  customers.init({
    aadhar_no: DataTypes.STRING,
    pan_no: DataTypes.STRING,
    cibil: DataTypes.INTEGER,
    dob: DataTypes.DATE,
    name: DataTypes.STRING,
    remark: DataTypes.STRING,
    dsa: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return customers;
};