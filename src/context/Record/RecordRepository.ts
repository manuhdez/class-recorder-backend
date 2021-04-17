import RecordModel, { RecordDocument } from '../../models/record';
import { Record } from '../../types/record';

export default class RecordRepository {
  private model = RecordModel;

  public createRecord = async (recordData: Record): Promise<RecordDocument> => {
    const newRecord = new this.model(recordData);
    await newRecord.save();
    return newRecord;
  };

  public getRecordsFromUser = async (
    userId: string
  ): Promise<RecordDocument[]> => {
    const records = await this.model.find({ owner: userId });
    return records;
  };
}
