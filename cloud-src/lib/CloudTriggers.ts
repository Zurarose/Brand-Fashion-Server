import {Cloud} from '../lib';

class CloudTriggers implements Cloud.Trigger {
  private triggers: {
    [triggerType in 'beforeSave' | 'afterSave' | 'beforeDelete' | 'afterDelete' | 'beforeFind' | 'afterFind']: {
      [className: string]: any;
    };
  };

  constructor() {
    this.triggers = {
      beforeSave: {},
      afterSave: {},
      beforeDelete: {},
      afterDelete: {},
      beforeFind: {},
      afterFind: {},
    };
  }

  private defineTrigger(className: Cloud.TriggerClassName, triggerType: Cloud.TriggerTypes, func: any) {
    if (Array.isArray(className)) {
      className.forEach((name) => {
        this.defineTrigger(name, triggerType, func);
      });
      return className.length;
    }

    if (!Array.isArray(this.triggers[triggerType][className])) {
      this.triggers[triggerType][className] = [];

      Parse.Cloud[triggerType](className, async (request) => {
        const promises = this.triggers[triggerType][className].map((triggerFunction: any) => triggerFunction(request));
        await Promise.all(promises);
      });
    }

    this.triggers[triggerType][className].push(func);
    return this.triggers[triggerType][className].length;
  }

  beforeSave(
    className: Cloud.TriggerClassName,
    func: (
      request: Parse.Cloud.BeforeSaveRequest,
    ) => Promise<Parse.Object<Parse.Attributes> | boolean | any[]> | boolean,
  ) {
    return this.defineTrigger(className, 'beforeSave', func);
  }

  afterSave(
    className: Cloud.TriggerClassName,
    func: (
      request: Parse.Cloud.AfterSaveRequest,
    ) => Promise<Parse.Object<Parse.Attributes> | boolean | any[]> | boolean,
  ) {
    return this.defineTrigger(className, 'afterSave', func);
  }

  beforeDelete(
    className: Cloud.TriggerClassName,
    func: (
      request: Parse.Cloud.BeforeDeleteRequest,
    ) => Promise<Parse.Object<Parse.Attributes> | boolean | any[]> | boolean,
  ) {
    return this.defineTrigger(className, 'beforeDelete', func);
  }

  afterDelete(
    className: Cloud.TriggerClassName,
    func: (
      request: Parse.Cloud.AfterDeleteRequest,
    ) => Promise<Parse.Object<Parse.Attributes> | boolean | any[]> | boolean,
  ) {
    return this.defineTrigger(className, 'afterDelete', func);
  }

  beforeFind(
    className: Cloud.TriggerClassName,
    func: (
      request: Parse.Cloud.BeforeFindRequest,
    ) => Promise<Parse.Object<Parse.Attributes> | boolean | any[]> | boolean,
  ) {
    return this.defineTrigger(className, 'beforeFind', func);
  }

  afterFind(
    className: Cloud.TriggerClassName,
    func: (
      request: Parse.Cloud.AfterFindRequest,
    ) => Promise<Parse.Object<Parse.Attributes> | boolean | any[]> | boolean,
  ) {
    return this.defineTrigger(className, 'afterFind', func);
  }
}

export default new CloudTriggers();
