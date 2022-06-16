const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class Invoice_details extends Model {}


Invoice_details.init(
    {
        invoice_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
			primaryKey: true,
			autoIncrement: true
        },
        item_id: {
            type: DataTypes.INTEGER,
			allowNull: false
        },
		customer_name:{
			type: DataTypes.STRING,
			allowNull: false
		},
        quantity: {
            type: DataTypes.DECIMAL(10,2),
			allowNull: false,
			defaultValue: 0
        },
		unit_price: {
			type: DataTypes.DECIMAL(10,2),
			allowNull: false,
			defaultValue: 0
		},
        address: {
            type: DataTypes.TEXT,
			allowNull: true
        },
		phone1:{
			type: DataTypes.STRING(15),
			allowNull: true
		},
		phone2: {
			type: DataTypes.STRING(15),
			allowNull: true
		},
        due_date: {
        	type: DataTypes.DATE,
			allowNull: true
        },
        tax_rate: {
            type: DataTypes.DECIMAL(10,2),
			allowNull: true
        },
		discount:{
			type: DataTypes.DECIMAL(10,2),
			allowNull: true
		},
        note: {
            type: Datatypes.TEXT,
			allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'Invoice_details',
      }
);

module.exports = Invoice_details