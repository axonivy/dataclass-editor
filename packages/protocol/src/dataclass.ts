import type { DataClass } from '.';
import type { DataClassEditorDataContext, DataClassModel, Field } from './editor';

export type { DataClassModel as DataClass };
export type EntityDataClass = Required<DataClass> & { fields: Array<EntityClassField> };
export type EntityClassField = Required<Field>;

export const DATA_CLASS_FIELD_ID_TYPES = ['String', 'Integer', 'Long'] as const;
type DataClassFieldIDType = (typeof DATA_CLASS_FIELD_ID_TYPES)[number];
export const isIDType = (type: string): type is DataClassFieldIDType => {
  return DATA_CLASS_FIELD_ID_TYPES.includes(type as DataClassFieldIDType);
};

export const DATA_CLASS_FIELD_VERSION_TYPES = ['Short', 'Integer', 'Long', 'java.sql.Timestamp'] as const;
type DataClassFieldVersionType = (typeof DATA_CLASS_FIELD_VERSION_TYPES)[number];
export const isVersionType = (type: string): type is DataClassFieldVersionType => {
  return DATA_CLASS_FIELD_VERSION_TYPES.includes(type as DataClassFieldVersionType);
};

export type DataClassType = 'DATA' | 'BUSINESS_DATA' | 'ENTITY';

export const DATA_CLASS_FIELD_ENTITY_CASCADE_TYPES = ['ALL', 'PERSIST', 'MERGE', 'REMOVE', 'REFRESH'] as const;

export interface DataActionArgs {
  context: DataClassEditorDataContext;
  actionId: 'openForm' | 'openProcess' | 'openUrl';
  payload: string;
}
