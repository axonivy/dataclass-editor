import type {
  DataActionArgs,
  DataClassData,
  DataClassEditorDataContext,
  FieldContext,
  ValidationResult
} from '@axonivy/dataclass-editor-protocol/src/editor';
import type {
  Client,
  Event,
  FunctionRequestTypes,
  MappedByFieldsContext,
  MetaRequestTypes
} from '@axonivy/dataclass-editor-protocol/src/types';
import { dataClass, validations } from './data';
import { cardinalities, mappedByFields } from './meta';

export class DataClassClientMock implements Client {
  private dataClassData: DataClassData = dataClass;

  data(context: DataClassEditorDataContext): Promise<DataClassData> {
    let result = this.dataClassData;
    if (context.file.includes('src_hd')) {
      result = { ...this.dataClassData, isPersistable: false };
    }
    return Promise.resolve(result);
  }

  saveData(saveData: DataClassData): Promise<Array<ValidationResult>> {
    this.dataClassData.data = saveData.data;
    return Promise.resolve(validations(this.dataClassData));
  }

  validate(): Promise<Array<ValidationResult>> {
    return Promise.resolve(validations(this.dataClassData));
  }

  function<TFunct extends keyof FunctionRequestTypes>(
    path: TFunct,
    args: FunctionRequestTypes[TFunct][0]
  ): Promise<FunctionRequestTypes[TFunct][1]> {
    switch (path) {
      case 'function/combineFields':
        console.log(`Function ${path}: ${JSON.stringify(args)}`);
        return Promise.resolve(this.dataClassData.data);
      default:
        throw Error('mock meta path not programmed');
    }
  }

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    switch (path) {
      case 'meta/scripting/ivyTypes':
        return Promise.resolve([]);
      case 'meta/scripting/dataClasses':
        return Promise.resolve([]);
      case 'meta/scripting/cardinalities':
        return Promise.resolve(cardinalities(args as FieldContext));
      case 'meta/scripting/mappedByFields':
        return Promise.resolve(mappedByFields(args as MappedByFieldsContext));
      default:
        throw Error('mock meta path not programmed');
    }
  }

  action(action: DataActionArgs): void {
    console.log(`Action: ${JSON.stringify(action)}`);
  }

  onDataChanged: Event<void>;
}
