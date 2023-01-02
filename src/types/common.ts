import {
  Includeable,
  Order,
  FindAttributeOptions,
  Transaction,
  GroupOption,
} from "sequelize";

interface Search {
  [property: string]: string | number | boolean | number[] | string[] | null;
}

interface defaultDateType {
  createdTime?: Date;
  updatedTime?: Date;
  deletedTime?: Date;
}

interface AuthTokenType {
  accessToken: string;
  refreshToken: string;
}

interface OptionType {
  where?: any;
  order?: Order;
  limit?: number;
  offset?: number;
  include?: Includeable[];
  nest?: boolean;
  raw?: boolean;
  attributes?: FindAttributeOptions;
  distinct?: boolean;
  subQuery?: boolean;
  transaction?: Transaction;
  group?: GroupOption;
  col?: string;
}

interface DeleteOptionType {
  where: any;
  transaction?: Transaction;
}

interface UpdateOptionType extends DeleteOptionType {}

interface Range {
  [property: string]: {
    from: string;
    to: string;
  };
}

interface CustomOpType {
  [property: string]: Symbol;
}


export {
  defaultDateType,
  AuthTokenType,
  OptionType,
  CustomOpType,
  DeleteOptionType,
  UpdateOptionType,
  Range,
  Search,
  Order,
};
