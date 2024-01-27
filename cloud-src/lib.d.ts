'use strict';

export namespace Cloud {
  // TODO:To fix unused vars?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  type TriggerTypes = 'beforeSave' | 'afterSave' | 'beforeDelete' | 'afterDelete' | 'beforeFind' | 'afterFind';
  // TODO:To fix unused vars?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  type TriggerClassName = string | string[];

  // TODO:To fix unused vars?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  interface Trigger {
    beforeSave(
      className: string,
      func: (request: Parse.Cloud.BeforeSaveRequest) => Promise<Parse.Object<Parse.Attributes> | boolean> | boolean,
    ): number;

    afterSave(
      className: string,
      func: (request: Parse.Cloud.AfterSaveRequest) => Promise<Parse.Object<Parse.Attributes> | boolean> | boolean,
    ): number;

    beforeDelete(
      className: string,
      func: (request: Parse.Cloud.BeforeDeleteRequest) => Promise<Parse.Object<Parse.Attributes> | boolean> | boolean,
    ): number;

    afterDelete(
      className: string,
      func: (request: Parse.Cloud.AfterDeleteRequest) => Promise<Parse.Object<Parse.Attributes> | boolean> | boolean,
    ): number;

    beforeFind(
      className: string,
      func: (request: Parse.Cloud.BeforeFindRequest) => Promise<Parse.Object<Parse.Attributes> | boolean> | boolean,
    ): number;

    afterFind(
      className: string,
      func: (request: Parse.Cloud.AfterFindRequest) => Promise<Parse.Object<Parse.Attributes> | boolean> | boolean,
    ): number;
  }
}
