import Sequelize from 'sequelize';
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';
import { SplitInstance, SplitModel } from './Split';

export interface TransactionAttributes {
  id?: string;
  groupId: string;
  date: string;
  description: string;
  note?: string;
  categoryId: number;
  amount: number;
  originalAmount: number;
  disabled?: boolean;
  serviceId?: string;
  serviceMeta?: object;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionInstance
  extends Sequelize.Instance<TransactionAttributes>,
    TransactionAttributes {
  getSplits: Sequelize.HasManyGetAssociationsMixin<SplitInstance>;
  Splits?: SplitInstance[];
}

export interface TransactionModel
  extends Sequelize.Model<TransactionInstance, TransactionAttributes> {}

export const TransactionFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): TransactionModel => {
  const attributes: SequelizeAttributes<TransactionAttributes> = {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    groupId: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    date: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    note: {
      type: DataTypes.TEXT,
    },
    categoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    amount: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
    originalAmount: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
    disabled: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    serviceId: {
      type: DataTypes.STRING,
    },
    serviceMeta: {
      type: DataTypes.JSON,
    },
  };

  const Transaction = sequelize.define<
    TransactionInstance,
    TransactionAttributes
  >('Transaction', attributes);

  Transaction.associate = ({ Split }: { Split: SplitModel }) => {
    Transaction.hasMany(Split);
  };

  return Transaction;
};
