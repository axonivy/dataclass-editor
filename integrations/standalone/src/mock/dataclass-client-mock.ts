import type {
  DataActionArgs,
  DataClassData,
  DataClassEditorFieldContext,
  EditorFileContent,
  ValidationResult
} from '@axonivy/dataclass-editor-protocol/src/editor';
import type {
  Client,
  Event,
  FunctionRequestTypes,
  MappedByFieldsContext,
  MetaRequestTypes
} from '@axonivy/dataclass-editor-protocol/src/types';
import { Emitter } from '@axonivy/jsonrpc';
import { dataClass, validations } from './data';
import { cardinalities, mappedByFields } from './meta';

export class DataClassClientMock implements Client {
  private dataClassData: DataClassData = dataClass;

  data(): Promise<DataClassData> {
    return Promise.resolve(this.dataClassData);
  }

  saveData(saveData: DataClassData): Promise<EditorFileContent> {
    this.dataClassData.data = saveData.data;
    return Promise.resolve({ content: '' });
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
      case 'meta/entity/cardinalities':
        return Promise.resolve(cardinalities(args as DataClassEditorFieldContext));
      case 'meta/entity/mappedByFields':
        return Promise.resolve(mappedByFields(args as MappedByFieldsContext));
      default:
        throw Error('mock meta path not programmed');
    }
  }

  action(action: DataActionArgs): void {
    console.log(`Action: ${JSON.stringify(action)}`);
  }

  onDataChanged: Event<void> = new Emitter<void>().event;
}
